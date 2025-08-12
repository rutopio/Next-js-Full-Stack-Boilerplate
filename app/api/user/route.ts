import { NextRequest, NextResponse } from "next/server";

import { createUser } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const userId = await createUser({
      email,
      password,
    });

    return NextResponse.json(
      { success: true, message: null, data: userId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `POST/[api-user]: ${error}`,
        data: null,
      },
      { status: 500 }
    );
  }
}
