import { buildDeviceContext } from "@/lib/auth/device";
import {
  authorizePasswordLoginRef,
  revokeSessionRef,
} from "@/shared/convex/auth";
import type { Id } from "@/shared/types/convex";
import { fetchMutation } from "convex/nextjs";
import NextAuth, {
  CredentialsSignin,
  type DefaultSession,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      deviceId?: string;
      id: string;
      policyVersion?: number;
      roles: string[];
      sessionId?: string;
      sessionVersion?: number;
    };
  }

  interface User {
    deviceId?: string;
    roles?: string[];
    sessionId?: string;
    sessionVersion?: number;
  }
}

class DeviceApprovalRequiredError extends CredentialsSignin {
  code = "device_approval_required";
}

class DeviceRevokedError extends CredentialsSignin {
  code = "device_revoked";
}

class UserBlockedError extends CredentialsSignin {
  code = "user_blocked";
}

class EmailDomainNotAllowedError extends CredentialsSignin {
  code = "email_domain_not_allowed";
}

type AppToken = {
  deviceId?: string;
  id?: string;
  policyVersion?: number;
  roles?: string[];
  sessionId?: string;
  sessionVersion?: number;
};

type AuthorizedUser = {
  deviceId?: string;
  email: string;
  id: string;
  name: string;
  policyVersion?: number;
  roles: string[];
  sessionId?: string;
  sessionVersion?: number;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        const device = buildDeviceContext(request.headers);

        const runMutation = fetchMutation as (
          ref: unknown,
          args: Record<string, unknown>
        ) => Promise<unknown>;
        const result = (await runMutation(authorizePasswordLoginRef, {
          createSession: true,
          deviceHash: device.deviceHash,
          email,
          ip: device.ip,
          label: device.label,
          password,
          userAgent: device.userAgent,
        })) as {
          code:
            | "APPROVED"
            | "DEVICE_APPROVAL_REQUIRED"
            | "DEVICE_REVOKED"
            | "BLOCKED"
            | "INVALID_CREDENTIALS"
            | "EMAIL_DOMAIN_NOT_ALLOWED";
          deviceId?: string;
          policyVersion?: number;
          roles?: string[];
          sessionId?: string;
          sessionVersion?: number;
          userId?: string;
          userName?: string;
        };

        switch (result.code) {
          case "APPROVED":
            return {
              deviceId: result.deviceId,
              email,
              id: result.userId,
              name: result.userName ?? email.split("@")[0],
              policyVersion: result.policyVersion ?? 1,
              roles: result.roles ?? [],
              sessionId: result.sessionId,
              sessionVersion: result.sessionVersion ?? 1,
            };
          case "DEVICE_APPROVAL_REQUIRED":
            throw new DeviceApprovalRequiredError();
          case "DEVICE_REVOKED":
            throw new DeviceRevokedError();
          case "BLOCKED":
            throw new UserBlockedError();
          case "EMAIL_DOMAIN_NOT_ALLOWED":
            throw new EmailDomainNotAllowedError();
          default:
            return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id !== undefined) {
        const appToken = token as typeof token & AppToken;
        const authorizedUser = user as typeof user & AuthorizedUser;
        appToken.deviceId = authorizedUser.deviceId;
        appToken.id = authorizedUser.id;
        appToken.policyVersion = authorizedUser.policyVersion;
        appToken.roles = authorizedUser.roles ?? [];
        appToken.sessionId = authorizedUser.sessionId;
        appToken.sessionVersion = authorizedUser.sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user !== undefined) {
        const appToken = token as typeof token & AppToken;
        session.user.deviceId = appToken.deviceId;
        session.user.id = appToken.id ?? session.user.email ?? "";
        session.user.policyVersion = appToken.policyVersion;
        session.user.roles = appToken.roles ?? [];
        session.user.sessionId = appToken.sessionId;
        session.user.sessionVersion = appToken.sessionVersion;
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      const sessionId =
        "token" in message
          ? ((message.token as AppToken | undefined)?.sessionId ?? undefined)
          : undefined;
      if (!sessionId) {
        return;
      }

      const runMutation = fetchMutation as (
        ref: unknown,
        args: Record<string, unknown>
      ) => Promise<unknown>;
      await runMutation(revokeSessionRef, {
        revokedBy: "nextauth-signout",
        sessionId: sessionId as Id<"authSessions">,
      });
    },
  },
  secret: process.env.AUTH_SECRET,
});
