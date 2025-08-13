import { NextRequest } from "next/server";

import { apiDocs } from "@/lib/api/docs";
import { registerApiDocs } from "@/lib/api/register-docs";
import { ApiResponseBuilder } from "@/lib/api/validation";

export async function GET(request: NextRequest) {
  try {
    // Register all API docs
    registerApiDocs();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    // For debugging - log endpoint count
    console.log(
      `API Docs: Currently ${apiDocs.getEndpointCount()} endpoints registered`
    );

    if (format === "markdown") {
      const markdown = apiDocs.generateMarkdown();
      return new Response(markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": 'inline; filename="api-docs.md"',
        },
      });
    }

    const documentation = apiDocs.generateJSON();
    return ApiResponseBuilder.success(
      documentation,
      `API documentation retrieved successfully (${documentation.endpoints.length} endpoints)`
    );
  } catch (error) {
    console.error("Failed to generate API documentation:", error);
    return ApiResponseBuilder.internalError(
      "Failed to generate API documentation"
    );
  }
}
