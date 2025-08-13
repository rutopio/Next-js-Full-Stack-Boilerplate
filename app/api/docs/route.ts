import { NextRequest, NextResponse } from "next/server";

import { apiDocs } from "@/lib/api/docs";
import { registerApiDocs } from "@/lib/api/register-docs";

export async function GET(request: NextRequest) {
  registerApiDocs();
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  try {
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
    return NextResponse.json(documentation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate API documentation" },
      { status: 500 }
    );
  }
}
