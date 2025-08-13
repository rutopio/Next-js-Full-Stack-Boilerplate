import { signIn } from "@/app/auth";
import { authRateLimit, createRateLimitedHandler } from "@/lib/api/rate-limit";
import { LoginRequest, loginSchema } from "@/lib/api/schemas";
import {
  ApiResponseBuilder,
  createValidatedHandler,
} from "@/lib/api/validation";

const loginHandler = createValidatedHandler<LoginRequest>({
  bodySchema: loginSchema,
  handler: async (_, { body }) => {
    try {
      const { email, password } = body!;

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        return ApiResponseBuilder.unauthorized("Invalid credentials");
      }

      return ApiResponseBuilder.success(null, "Login successful");
    } catch (error) {
      console.error("Login error:", error);
      return ApiResponseBuilder.unauthorized("Invalid credentials");
    }
  },
});

export const POST = createRateLimitedHandler(authRateLimit, loginHandler);
