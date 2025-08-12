import { NextRequest, NextResponse } from "next/server";

import { signIn } from "@/app/auth";
import { createUser, getUserByEmail } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if the email already exists
    const userByEmail = await getUserByEmail(email);
    if (userByEmail) {
      return NextResponse.json(
        { success: false, message: "email_already_exists" },
        { status: 401 }
      );
    }

    // Create user
    await createUser({
      email: email,
      password: password,
    });

    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    return NextResponse.json({ success: true, message: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `POST/[api-auth-signup]: ${error}` },
      { status: 401 }
    );
  }
}
