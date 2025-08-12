import { NextRequest, NextResponse } from "next/server";

import { signIn } from "@/app/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    return NextResponse.json({ success: true, message: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `POST/[api-auth-login]: ${error}` },
      { status: 401 }
    );
  }
}
