import { signIn } from "@/app/auth";
import { authRateLimit, createRateLimitedHandler } from "@/lib/api/rate-limit";
import { SignupRequest, signupSchema } from "@/lib/api/schemas";
import {
  ApiResponseBuilder,
  createValidatedHandler,
} from "@/lib/api/validation";
import { createUser, getUserByEmail } from "@/lib/db/queries";

const signupHandler = createValidatedHandler<SignupRequest>({
  bodySchema: signupSchema,
  handler: async (_, { body }) => {
    try {
      const { email, password } = body!;

      // Check if email already exists
      const userByEmail = await getUserByEmail(email);
      if (userByEmail) {
        return ApiResponseBuilder.conflict("Email already exists");
      }

      // Create user
      const newUserId = await createUser({ email, password });

      // Auto login
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      return ApiResponseBuilder.created(
        { userId: newUserId },
        "User created successfully"
      );
    } catch (error) {
      console.error("Signup error:", error);
      return ApiResponseBuilder.internalError("Failed to create user");
    }
  },
});

export const POST = createRateLimitedHandler(authRateLimit, signupHandler);
