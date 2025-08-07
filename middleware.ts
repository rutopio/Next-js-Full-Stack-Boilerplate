// AWS Amplify or Netlify might not work with middleware demo of auth.js due to multiple set-cookie headers
// Reference: https://github.com/nextauthjs/next-auth/issues/12909#issuecomment-2831679350

import { NextRequest } from "next/server";

import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  // @ts-expect-error the type that auth returns is NOT a NextResponse but a plain Response
  const resp: Response = await auth(req);

  if (req.nextUrl.pathname.startsWith("/api/auth/signout")) {
    // remove all session cookies, then re-add one explicitly
    const nonSessionCookies = resp.headers.getSetCookie().filter((cookie) => {
      return !cookie.startsWith("authjs.session-token");
    });
    resp.headers.delete("Set-Cookie");
    for (const cookie of nonSessionCookies) {
      resp.headers.append("Set-Cookie", cookie);
    }
    resp.headers.set(
      "Set-Cookie",
      "authjs.session-token=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=lax"
    );
  }

  return resp;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
