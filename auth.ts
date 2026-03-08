import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & Session["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

const adminEmail = process.env.AUTH_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.AUTH_ADMIN_PASSWORD ?? "admin123456";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");

        if (email !== adminEmail || password !== adminPassword) {
          return null;
        }

        return {
          id: email,
          email,
          name: email.split("@")[0],
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id?: string } | null }) {
      if (user?.id !== undefined) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user !== undefined) {
        session.user.id = (token.id as string | undefined) ?? session.user.email ?? "";
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
