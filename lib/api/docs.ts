import { ZodType } from "zod";

export interface ApiEndpoint {
  method: string;
  path: string;
  summary: string;
  description?: string;
  bodySchema?: ZodType<any>;
  querySchema?: ZodType<any>;
  responses?: {
    [statusCode: string]: {
      description: string;
      example?: any;
    };
  };
  rateLimit?: {
    limit: number;
    windowMs: number;
  };
  auth?: boolean;
}

export interface ApiDocumentation {
  title: string;
  version: string;
  description?: string;
  baseUrl?: string;
  endpoints: ApiEndpoint[];
}

class ApiDocs {
  private documentation: ApiDocumentation = {
    title: "Next.js Boilerplate API",
    version: "1.0.0",
    description: "API documentation for the Next.js PostgreSQL boilerplate",
    baseUrl: "/api",
    endpoints: [],
  };

  addEndpoint(endpoint: ApiEndpoint) {
    this.documentation.endpoints.push(endpoint);
  }

  generateMarkdown(): string {
    const { title, version, description, baseUrl, endpoints } =
      this.documentation;

    let markdown = `# ${title}\n\n`;
    markdown += `**Version:** ${version}\n\n`;
    if (description) {
      markdown += `${description}\n\n`;
    }
    if (baseUrl) {
      markdown += `**Base URL:** \`${baseUrl}\`\n\n`;
    }

    markdown += `## Endpoint List\n\n`;

    for (const endpoint of endpoints) {
      markdown += `### ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`;
      markdown += `${endpoint.summary}\n\n`;

      if (endpoint.description) {
        markdown += `${endpoint.description}\n\n`;
      }

      if (endpoint.auth) {
        markdown += `**Authentication Required**\n\n`;
      }

      if (endpoint.rateLimit) {
        markdown += `**Rate Limit:** ${endpoint.rateLimit.limit} requests per ${endpoint.rateLimit.windowMs / 1000} seconds\n\n`;
      }

      if (endpoint.bodySchema) {
        markdown += `**Request Body Schema:**\n\n`;
        markdown += `\`\`\`json\n${this.schemaToExample(endpoint.bodySchema)}\n\`\`\`\n\n`;
      }

      if (endpoint.querySchema) {
        markdown += `**Query Parameters Schema:**\n\n`;
        markdown += `\`\`\`json\n${this.schemaToExample(endpoint.querySchema)}\n\`\`\`\n\n`;
      }

      if (endpoint.responses) {
        markdown += `**Responses:**\n\n`;
        for (const [statusCode, response] of Object.entries(
          endpoint.responses
        )) {
          markdown += `- **${statusCode}:** ${response.description}\n`;
          if (response.example) {
            markdown += `  \`\`\`json\n  ${JSON.stringify(response.example, null, 2)}\n  \`\`\`\n`;
          }
        }
        markdown += `\n`;
      }

      markdown += `---\n\n`;
    }

    return markdown;
  }

  generateJSON(): ApiDocumentation {
    return this.documentation;
  }

  private schemaToExample(schema: ZodType<any>): string {
    try {
      // Simplified schema to example conversion
      // In actual application, more complex logic might be needed
      return JSON.stringify(
        {
          "// Fill in values according to schema definition": "...",
        },
        null,
        2
      );
    } catch {
      return "{}";
    }
  }
}

export const apiDocs = new ApiDocs();

// Decorator function for registering API endpoints
export function documentApi(endpoint: ApiEndpoint) {
  // Register endpoint immediately, don't wait for decorator to be called
  apiDocs.addEndpoint(endpoint);

  return function <T extends (...args: any[]) => any>(target: T): T {
    return target;
  };
}
