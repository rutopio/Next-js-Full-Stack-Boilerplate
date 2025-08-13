import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnRegister = nextUrl.pathname.startsWith("/signup");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnForgotPassword =
        nextUrl.pathname.startsWith("/forgot-password");

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && (isOnLogin || isOnRegister || isOnForgotPassword)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      // Allow access to auth pages
      if (isOnRegister || isOnLogin || isOnForgotPassword) {
        return true;
      }

      // Add logic for other protected routes here
      const isProtectedRoute = ["/setting", "/upload"].some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      // Require authentication for protected routes
      if (isProtectedRoute) {
        return isLoggedIn;
      }

      // Allow access to non-protected pages
      return true;
    },
  },
} satisfies NextAuthConfig;
