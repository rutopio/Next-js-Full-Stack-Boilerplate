import { apiDocs } from "@/lib/api/docs";
import { loginSchema, signupSchema } from "@/lib/api/schemas";

// Manually register all API endpoints
export function registerApiDocs() {
  // Register signup endpoint
  apiDocs.addEndpoint({
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

  // Register login endpoint
  apiDocs.addEndpoint({
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
}
