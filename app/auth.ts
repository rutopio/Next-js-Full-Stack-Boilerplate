import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

import { getUserByEmail } from "@/lib/db/queries";
import { serializeId } from "@/lib/id";

export const runtime = "nodejs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // third-party config
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    newUser: "/",
  },
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

      authorize: async (credentials) => {
        const user = await getUserByEmail(credentials.email as string);

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        const passwordsMatch = await compare(
          credentials.password as string,
          user.password
        );

        if (!passwordsMatch) {
          throw new Error("Invalid credentials.");
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
