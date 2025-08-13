import { z } from "zod";

// Authentication related Schema
export const signupSchema = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty"),
});

// User related Schema
export const updateUserSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters")
    .optional(),
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1, "User ID cannot be empty"),
});

// Query parameters Schema
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page number must be numeric")
    .default("1")
    .transform(Number),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be numeric")
    .default("10")
    .transform(Number),
});

// Common response Schema
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any().optional(),
  message: z.string().optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
});

// Type inference
export type SignupRequest = z.infer<typeof signupSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
