// See more providers here: https://authjs.dev/getting-started

import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
});
