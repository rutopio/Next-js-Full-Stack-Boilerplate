import { NextRequest } from "next/server";

import { ApiResponseBuilder } from "@/lib/api/validation";

export async function GET(_request: NextRequest) {
  try {
    // Fetch random dog image from external API
    const response = await fetch("https://dog.ceo/api/breeds/image/random");

    if (!response.ok) {
      return ApiResponseBuilder.internalError(
        "Failed to fetch dog image from external API"
      );
    }

    const dogData = await response.json();

    // Validate the external API response format
    if (!dogData.message || !dogData.status || dogData.status !== "success") {
      return ApiResponseBuilder.internalError("Invalid response from dog API");
    }

    // Return the dog image URL in our standard format
    return ApiResponseBuilder.success(
      {
        imageUrl: dogData.message,
        source: "dog.ceo API",
      },
      "Random dog image retrieved successfully"
    );
  } catch (error) {
    console.error("GET /api/dog error:", error);

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return ApiResponseBuilder.internalError(
        "Network error: Unable to connect to dog API"
      );
    }

    return ApiResponseBuilder.internalError("Failed to retrieve dog image");
  }
}
