import "server-only";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set in production.");
}

const DEV_ONLY_DUMMY_HASH =
  "$2b$10$1wTruT2t6kxbjMNFjv3R3ujnJmQKk6tE5o5Y4q0S7R1CV2wAPOa9a";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (
          !username ||
          !password ||
          username.length > 100 ||
          password.length > 128
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username },
        });

        const isValidPassword = await bcrypt.compare(
          password,
          user?.password ?? DEV_ONLY_DUMMY_HASH,
        );

        if (!user || !isValidPassword) return null;

        return {
          id: user.id,
          name: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 60,
  },
  useSecureCookies: isProduction,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: { user: { name?: string } };
      token: {
        sub?: string;
        name?: string;
      };
    }) {
      if (session?.user && token.sub) {
        session.user.name = token.name;
      }
      return session;
    },
  },
  ...(process.env.NEXTAUTH_SECRET
    ? { secret: process.env.NEXTAUTH_SECRET }
    : {}),
};
