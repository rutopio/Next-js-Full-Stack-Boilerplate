import { NextRequest, NextResponse } from "next/server";
import { z, ZodType } from "zod";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  return {
    success,
    ...(data && { data }),
    ...(error && { error }),
    ...(message && { message }),
  };
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
          return NextResponse.json(
            createApiResponse(false, null, bodyValidation.error),
            { status: 400 }
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
          return NextResponse.json(
            createApiResponse(false, null, queryValidation.error),
            { status: 400 }
          );
        }
        validatedData.query = queryValidation.data;
      }

      return await options.handler(request, validatedData);
    } catch (error) {
      console.error("API handler error:", error);
      return NextResponse.json(
        createApiResponse(false, null, "Internal server error"),
        { status: 500 }
      );
    }
  };
}
