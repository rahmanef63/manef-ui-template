import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

const adminEmail = process.env.AUTH_ADMIN_EMAIL ?? "admin@example.com";
const adminPassword = process.env.AUTH_ADMIN_PASSWORD ?? "changeme";

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
    async jwt({ token, user }) {
      if (user?.id !== undefined) {
        (token as { id?: string }).id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user !== undefined) {
        session.user.id =
          (token as { id?: string }).id ?? session.user.email ?? "";
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
