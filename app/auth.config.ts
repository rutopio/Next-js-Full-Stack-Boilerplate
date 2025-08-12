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

      // 已登入用戶嘗試訪問登入/註冊頁面時重定向到首頁
      if (isLoggedIn && (isOnLogin || isOnRegister || isOnForgotPassword)) {
        return Response.redirect(new URL("/", nextUrl as unknown as URL));
      }

      // 允許訪問登入、註冊和忘記密碼頁面
      if (isOnRegister || isOnLogin || isOnForgotPassword) {
        return true;
      }

      // 這裡可以添加其他受保護頁面的邏輯
      const isProtectedRoute = ["/setting", "/upload"].some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      // 如果是受保護頁面，則要求用戶已登入
      if (isProtectedRoute) {
        return isLoggedIn;
      }

      // 非受保護頁面，允許訪問
      return true;
    },
  },
} satisfies NextAuthConfig;
