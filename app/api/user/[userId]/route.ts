import { NextRequest } from "next/server";

import { auth } from "@/app/auth";
import { ApiResponseBuilder } from "@/lib/api/validation";
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
      return ApiResponseBuilder.unauthorized("Authentication required");
    }

    const { userId } = await params;
    const user = await getUserByUserId(userId);

    if (!user) {
      return ApiResponseBuilder.notFound("User not found");
    }

    return ApiResponseBuilder.success(user, "User retrieved successfully");
  } catch (error) {
    console.error("GET /api/user/[userId] error:", error);
    return ApiResponseBuilder.internalError("Failed to retrieve user");
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session) {
      return ApiResponseBuilder.unauthorized("Authentication required");
    }

    const { userId } = await params;

    let userData;
    try {
      userData = await request.json();
    } catch {
      return ApiResponseBuilder.badRequest("Invalid JSON in request body");
    }

    if (!userData || typeof userData !== "object") {
      return ApiResponseBuilder.badRequest(
        "Request body must be a valid object"
      );
    }

    const updatedUser = await updateUserByUserId(userId, userData);

    if (!updatedUser) {
      return ApiResponseBuilder.notFound("User not found or update failed");
    }

    return ApiResponseBuilder.success(updatedUser, "User updated successfully");
  } catch (error) {
    console.error("PUT /api/user/[userId] error:", error);
    return ApiResponseBuilder.internalError("Failed to update user");
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const session = await auth();
    if (!session) {
      return ApiResponseBuilder.unauthorized("Authentication required");
    }

    const { userId } = await params;

    if (!userId) {
      return ApiResponseBuilder.badRequest("User ID is required");
    }

    const deletedUser = await deleteUserByUserId(userId);

    return ApiResponseBuilder.success(
      deletedUser || { userId, deleted: true },
      "User deleted successfully"
    );
  } catch (error) {
    console.error("DELETE /api/user/[userId] error:", error);
    return ApiResponseBuilder.internalError("Failed to delete user");
  }
}
