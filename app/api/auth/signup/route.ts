import { NextResponse } from "next/server";

import { signIn } from "@/app/auth";
import { documentApi } from "@/lib/api/docs";
import { authRateLimit, createRateLimitedHandler } from "@/lib/api/rate-limit";
import { SignupRequest, signupSchema } from "@/lib/api/schemas";
import {
  createApiResponse,
  createValidatedHandler,
} from "@/lib/api/validation";
import { createUser, getUserByEmail } from "@/lib/db/queries";

// Register API Documentation
documentApi({
  method: "POST",
  path: "/api/auth/signup",
  summary: "User Registration",
  description: "Create a new user account",
  bodySchema: signupSchema,
  rateLimit: { limit: 5, windowMs: 15 * 60 * 1000 },
  responses: {
    "200": {
      description: "Registration successful",
      example: { success: true, message: "User created successfully" },
    },
    "400": {
      description: "Input validation failed",
      example: { success: false, error: "Invalid input data" },
    },
    "409": {
      description: "Email already exists",
      example: { success: false, error: "Email already exists" },
    },
    "429": {
      description: "Too many requests",
      example: { success: false, error: "Too Many Requests" },
    },
    "500": {
      description: "Server error",
      example: { success: false, error: "Internal server error" },
    },
  },
});

const signupHandler = createValidatedHandler<SignupRequest>({
  bodySchema: signupSchema,
  handler: async (request, { body }) => {
    try {
      const { email, password } = body!;

      // Check if email already exists
      const userByEmail = await getUserByEmail(email);
      if (userByEmail) {
        return NextResponse.json(
          createApiResponse(false, null, "Email already exists"),
          { status: 409 }
        );
      }

      // Create user
      await createUser({ email, password });

      // Auto login
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      return NextResponse.json(
        createApiResponse(true, null, "User created successfully"),
        { status: 200 }
      );
    } catch (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        createApiResponse(false, null, "Internal server error"),
        { status: 500 }
      );
    }
  },
});

export const POST = createRateLimitedHandler(authRateLimit, signupHandler);
