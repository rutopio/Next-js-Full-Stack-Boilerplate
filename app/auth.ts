import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

import { authConfig } from "@/app/auth.config";
import { getUserByEmail } from "@/lib/db/queries";
import { serializeId } from "@/lib/id";

export const runtime = "nodejs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      // not using Built-in Pages
      credentials: {
        email: {},
        password: {},
      },

      async authorize({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) {
        const user = await getUserByEmail(email as string);
        if (!user) {
          throw new Error("email_not_found.");
        }

        const passwordsMatch = await compare(password as string, user.password);

        if (!passwordsMatch) {
          throw new Error("incorrect_password.");
        }

        return { ...user, maxAge: 30 * 24 * 60 * 60 };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.userId = serializeId(user.userId);
        token.email = user.email;
        token.maxAge = user.maxAge;

        const now = Math.floor(Date.now() / 1000);
        token.exp = now + user.maxAge;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.userId = token.userId as string;
        session.user.email = token.email as string;
        session.maxAge = token.maxAge as number;
        session.expires = new Date(
          Date.now() + token.maxAge * 1000
        ).toISOString();
      }

      return session;
    },
  },
});
