import { NextResponse } from "next/server";

import { signIn } from "@/app/auth";
import { documentApi } from "@/lib/api/docs";
import { authRateLimit, createRateLimitedHandler } from "@/lib/api/rate-limit";
import { LoginRequest, loginSchema } from "@/lib/api/schemas";
import {
  createApiResponse,
  createValidatedHandler,
} from "@/lib/api/validation";

// Register API Documentation
documentApi({
  method: "POST",
  path: "/api/auth/login",
  summary: "User Login",
  description: "Login with email and password",
  bodySchema: loginSchema,
  rateLimit: { limit: 5, windowMs: 15 * 60 * 1000 },
  responses: {
    "200": {
      description: "Login successful",
      example: { success: true, message: "Login successful" },
    },
    "400": {
      description: "Input validation failed",
      example: { success: false, error: "Invalid input data" },
    },
    "401": {
      description: "Authentication failed",
      example: { success: false, error: "Invalid credentials" },
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

const loginHandler = createValidatedHandler<LoginRequest>({
  bodySchema: loginSchema,
  handler: async (_, { body }) => {
    try {
      const { email, password } = body!;

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      return NextResponse.json(
        createApiResponse(true, null, "Login successful"),
        { status: 200 }
      );
    } catch (error) {
      console.error("Login error:", error);
      return NextResponse.json(
        createApiResponse(false, null, "Invalid credentials"),
        { status: 401 }
      );
    }
  },
});

export const POST = createRateLimitedHandler(authRateLimit, loginHandler);
