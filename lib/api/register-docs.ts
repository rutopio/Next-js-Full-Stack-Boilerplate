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
      "201": {
        description: "Registration successful",
        example: {
          success: true,
          data: { userId: "user_123" },
          message: "User created successfully",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "400": {
        description: "Input validation failed",
        example: {
          success: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "Invalid input data",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "409": {
        description: "Email already exists",
        example: {
          success: false,
          error: {
            type: "CONFLICT_ERROR",
            message: "Email already exists",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "429": {
        description: "Too many requests",
        example: {
          success: false,
          error: {
            type: "RATE_LIMIT_ERROR",
            message: "Rate limit exceeded",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Server error",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Internal server error",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
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
        example: {
          success: true,
          message: "Login successful",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "400": {
        description: "Input validation failed",
        example: {
          success: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "Invalid input data",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "401": {
        description: "Authentication failed",
        example: {
          success: false,
          error: {
            type: "AUTHENTICATION_ERROR",
            message: "Invalid credentials",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "429": {
        description: "Too many requests",
        example: {
          success: false,
          error: {
            type: "RATE_LIMIT_ERROR",
            message: "Rate limit exceeded",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Server error",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Internal server error",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });

  // Register health check endpoint
  apiDocs.addEndpoint({
    method: "GET",
    path: "/api/health",
    summary: "System Health Check",
    description: "Check the health status of the application and database",
    responses: {
      "200": {
        description: "System is healthy",
        example: {
          success: true,
          data: {
            status: "healthy",
            database: {
              responseTime: 45,
              activeConnections: 3,
              error: null,
            },
            queries: {
              totalOperations: 12,
              topQueries: [
                {
                  operation: "getUserByEmail",
                  count: 5,
                  lastUsed: "2024-01-01T00:00:00.000Z",
                },
              ],
            },
          },
          message: "System is healthy",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "503": {
        description: "System is unhealthy",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "System health check failed",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });

  // Register API documentation endpoint
  apiDocs.addEndpoint({
    method: "GET",
    path: "/api/docs",
    summary: "API Documentation",
    description: "Get API documentation in JSON or Markdown format",
    responses: {
      "200": {
        description: "API documentation retrieved successfully",
        example: {
          success: true,
          data: {
            title: "Next.js Boilerplate API",
            version: "1.0.0",
            description:
              "API documentation for the Next.js PostgreSQL boilerplate",
            baseUrl: "/api",
            endpoints: [
              {
                method: "POST",
                path: "/api/auth/signup",
                summary: "User Registration",
                description: "Create a new user account",
              },
            ],
          },
          message: "API documentation retrieved successfully",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Documentation generation failed",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Failed to generate API documentation",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });

  // Register user CRUD endpoints
  apiDocs.addEndpoint({
    method: "GET",
    path: "/api/user/[userId]",
    summary: "Get User by ID",
    description: "Retrieve a specific user by their ID",
    auth: true,
    responses: {
      "200": {
        description: "User retrieved successfully",
        example: {
          success: true,
          data: {
            userId: "user_123",
            email: "user@example.com",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
          message: "User retrieved successfully",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "401": {
        description: "Authentication required",
        example: {
          success: false,
          error: {
            type: "AUTHENTICATION_ERROR",
            message: "Authentication required",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "404": {
        description: "User not found",
        example: {
          success: false,
          error: {
            type: "NOT_FOUND_ERROR",
            message: "User not found",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Server error",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Failed to retrieve user",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });

  apiDocs.addEndpoint({
    method: "PUT",
    path: "/api/user/[userId]",
    summary: "Update User",
    description: "Update a user's information",
    auth: true,
    responses: {
      "200": {
        description: "User updated successfully",
        example: {
          success: true,
          data: {
            userId: "user_123",
            email: "updated@example.com",
            updatedAt: "2024-01-01T00:00:00.000Z",
          },
          message: "User updated successfully",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "400": {
        description: "Invalid request data",
        example: {
          success: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "Request body must be a valid object",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "401": {
        description: "Authentication required",
        example: {
          success: false,
          error: {
            type: "AUTHENTICATION_ERROR",
            message: "Authentication required",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "404": {
        description: "User not found",
        example: {
          success: false,
          error: {
            type: "NOT_FOUND_ERROR",
            message: "User not found or update failed",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Server error",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Failed to update user",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });

  apiDocs.addEndpoint({
    method: "DELETE",
    path: "/api/user/[userId]",
    summary: "Delete User",
    description: "Delete a user by their ID",
    auth: true,
    responses: {
      "200": {
        description: "User deleted successfully",
        example: {
          success: true,
          data: {
            userId: "user_123",
            email: "deleted@example.com",
            deletedAt: "2024-01-01T00:00:00.000Z",
          },
          message: "User deleted successfully",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "400": {
        description: "Invalid request",
        example: {
          success: false,
          error: {
            type: "VALIDATION_ERROR",
            message: "User ID is required",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "401": {
        description: "Authentication required",
        example: {
          success: false,
          error: {
            type: "AUTHENTICATION_ERROR",
            message: "Authentication required",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "404": {
        description: "User not found",
        example: {
          success: false,
          error: {
            type: "NOT_FOUND_ERROR",
            message: "User not found or already deleted",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Server error",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Failed to delete user",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });

  // Register dog image API endpoint
  apiDocs.addEndpoint({
    method: "GET",
    path: "/api/dog",
    summary: "Get Random Dog Image",
    description: "Fetch a random dog image from the dog.ceo API",
    responses: {
      "200": {
        description: "Random dog image retrieved successfully",
        example: {
          success: true,
          data: {
            imageUrl: "https://images.dog.ceo/breeds/labradoodle/Cali.jpg",
            source: "dog.ceo API",
          },
          message: "Random dog image retrieved successfully",
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
      "500": {
        description: "Failed to retrieve dog image",
        example: {
          success: false,
          error: {
            type: "INTERNAL_ERROR",
            message: "Failed to retrieve dog image",
          },
          meta: { timestamp: "2024-01-01T00:00:00.000Z" },
        },
      },
    },
  });
}
