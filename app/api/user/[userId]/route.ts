import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  deleteUserByUserId,
  getUserByUserId,
  updateUserByUserId,
} from "@/lib/db/queries";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "GET/[api-user-userId]: Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const { userId } = await params;
    const user = await getUserByUserId(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "GET/[api-user-userId]: User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: null, data: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `GET/[api-user-userId]: ${error}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "PUT/[api-user-userId]: Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const { userId } = await params;
    const user = await request.json();
    const updatedUser = await updateUserByUserId(userId, user);
    return NextResponse.json(
      {
        success: true,
        message: null,
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `PUT/[api-user-userId]: ${error}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "DELETE/[api-user-userId]: Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }
    const { userId } = await params;
    const deletedUser = await deleteUserByUserId(userId);
    return NextResponse.json(
      {
        success: true,
        message: null,
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `DELETE/[api-user-userId]: ${error}`,
        data: null,
      },
      { status: 500 }
    );
  }
}
