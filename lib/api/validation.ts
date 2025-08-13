import { NextRequest, NextResponse } from "next/server";
import { z, ZodType } from "zod";

// Standard HTTP status codes for API responses
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error types for consistent error handling
export const ERROR_TYPES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_ERROR: "SERVICE_ERROR",
} as const;

export type ErrorType = keyof typeof ERROR_TYPES;

// Enhanced API response interface with metadata
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    type: ErrorType;
    message: string;
    details?: string[];
    code?: string;
  };
  message?: string;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Success response factory
export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  meta?: ApiResponse<T>["meta"]
): ApiResponse<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

// Error response factory
export function createErrorResponse(
  type: ErrorType,
  message: string,
  details?: string[],
  code?: string,
  meta?: ApiResponse["meta"]
): ApiResponse {
  return {
    success: false,
    error: {
      type,
      message,
      ...(details && { details }),
      ...(code && { code }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

// Legacy function for backwards compatibility
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  if (success) {
    return createSuccessResponse(data, message);
  } else {
    return createErrorResponse(
      ERROR_TYPES.INTERNAL_ERROR,
      error || "Unknown error occurred"
    );
  }
}

// Standard API response helpers
export class ApiResponseBuilder {
  static success<T>(data?: T, message?: string) {
    return NextResponse.json(createSuccessResponse(data, message), {
      status: HTTP_STATUS.OK,
    });
  }

  static created<T>(data?: T, message?: string) {
    return NextResponse.json(createSuccessResponse(data, message), {
      status: HTTP_STATUS.CREATED,
    });
  }

  static noContent() {
    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
  }

  static badRequest(message: string, details?: string[]) {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.VALIDATION_ERROR, message, details),
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  static unauthorized(message: string = "Authentication required") {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.AUTHENTICATION_ERROR, message),
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }

  static forbidden(message: string = "Access denied") {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.AUTHORIZATION_ERROR, message),
      { status: HTTP_STATUS.FORBIDDEN }
    );
  }

  static notFound(message: string = "Resource not found") {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.NOT_FOUND_ERROR, message),
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }

  static conflict(message: string) {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.CONFLICT_ERROR, message),
      { status: HTTP_STATUS.CONFLICT }
    );
  }

  static tooManyRequests(message: string = "Too many requests") {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.RATE_LIMIT_ERROR, message),
      { status: HTTP_STATUS.TOO_MANY_REQUESTS }
    );
  }

  static internalError(message: string = "Internal server error") {
    return NextResponse.json(
      createErrorResponse(ERROR_TYPES.INTERNAL_ERROR, message),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export function validateRequestBody<T>(schema: ZodType<T>) {
  return async (
    request: NextRequest
  ): Promise<{ isValid: boolean; data?: T; error?: string }> => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return { isValid: false, error: errorMessage };
      }
      return { isValid: false, error: "Invalid JSON format" };
    }
  };
}

export function validateQueryParams<T>(schema: ZodType<T>) {
  return (
    request: NextRequest
  ): { isValid: boolean; data?: T; error?: string } => {
    try {
      const searchParams = request.nextUrl.searchParams;
      const params: any = {};

      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      const validatedData = schema.parse(params);
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues
          .map((err: any) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return { isValid: false, error: errorMessage };
      }
      return { isValid: false, error: "Invalid query parameters" };
    }
  };
}

export function createValidatedHandler<TBody = any, TQuery = any>(options: {
  bodySchema?: ZodType<TBody>;
  querySchema?: ZodType<TQuery>;
  handler: (
    request: NextRequest,
    validatedData: {
      body?: TBody;
      query?: TQuery;
    }
  ) => Promise<NextResponse>;
}) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const validatedData: { body?: TBody; query?: TQuery } = {};

      // Validate request body
      if (
        options.bodySchema &&
        (request.method === "POST" ||
          request.method === "PUT" ||
          request.method === "PATCH")
      ) {
        const bodyValidation = await validateRequestBody(options.bodySchema)(
          request
        );
        if (!bodyValidation.isValid) {
          return ApiResponseBuilder.badRequest(
            bodyValidation.error || "Invalid request body"
          );
        }
        validatedData.body = bodyValidation.data;
      }

      // Validate query parameters
      if (options.querySchema) {
        const queryValidation = validateQueryParams(options.querySchema)(
          request
        );
        if (!queryValidation.isValid) {
          return ApiResponseBuilder.badRequest(
            queryValidation.error || "Invalid query parameters"
          );
        }
        validatedData.query = queryValidation.data;
      }

      return await options.handler(request, validatedData);
    } catch (error) {
      console.error("API handler error:", error);
      return ApiResponseBuilder.internalError();
    }
  };
}
