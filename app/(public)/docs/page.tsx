"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ApiEndpoint {
  method: string;
  path: string;
  summary: string;
  description?: string;
  auth?: boolean;
  rateLimit?: {
    limit: number;
    windowMs: number;
  };
  responses?: {
    [statusCode: string]: {
      description: string;
      example?: any;
    };
  };
}

interface ApiDocumentation {
  title: string;
  version: string;
  description?: string;
  baseUrl?: string;
  endpoints: ApiEndpoint[];
}

export default function ApiDocsPage() {
  const [docs, setDocs] = useState<ApiDocumentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add slight delay to ensure documentation is registered
    const timer = setTimeout(() => {
      fetch("/api/docs")
        .then((res) => res.json())
        .then((response) => {
          // Handle the new ApiResponseBuilder format
          if (response.success && response.data) {
            setDocs(response.data);
            setError(null);
          } else {
            console.error("API documentation format error:", response);
            setError(response.error?.message || "Invalid API response format");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load API docs:", error);
          setError("Failed to load API documentation");
          setLoading(false);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const downloadMarkdown = () => {
    window.open("/api/docs?format=markdown", "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="mb-8 h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !docs) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Failed to Load Documentation
          </h1>
          <p className="mt-2 text-gray-600">
            {error || "Unable to load API documentation"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{docs.title}</h1>
            <p className="mt-2 text-gray-600">Version: {docs.version}</p>
            {docs.description && (
              <p className="mt-2 text-gray-700">{docs.description}</p>
            )}
            {docs.baseUrl && (
              <p className="mt-2 text-sm text-gray-500">
                Base URL:{" "}
                <code className="rounded bg-gray-100 px-2 py-1">
                  {docs.baseUrl}
                </code>
              </p>
            )}
          </div>
          <Button onClick={downloadMarkdown} variant="outline">
            Download Markdown
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {docs.endpoints?.map((endpoint, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant={
                    endpoint.method === "GET"
                      ? "default"
                      : endpoint.method === "POST"
                        ? "destructive"
                        : endpoint.method === "PUT"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {endpoint.method.toUpperCase()}
                </Badge>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                  {endpoint.path}
                </code>
                {endpoint.auth && (
                  <Badge variant="outline">Auth Required</Badge>
                )}
              </div>
              <CardTitle className="text-lg">{endpoint.summary}</CardTitle>
              {endpoint.description && (
                <CardDescription>{endpoint.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {endpoint.rateLimit && (
                <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Rate Limit:</strong> {endpoint.rateLimit.limit}{" "}
                    requests per {endpoint.rateLimit.windowMs / 1000} seconds
                  </p>
                </div>
              )}

              {endpoint.responses && (
                <div>
                  <h4 className="mb-2 font-semibold">Responses:</h4>
                  <div className="space-y-2">
                    {Object.entries(endpoint.responses).map(
                      ([statusCode, response]) => (
                        <div
                          key={statusCode}
                          className="border-l-4 border-blue-500 pl-4"
                        >
                          <p className="font-medium">
                            <Badge variant="outline">{statusCode}</Badge>
                            <span className="ml-2">{response.description}</span>
                          </p>
                          {response.example && (
                            <pre className="mt-2 overflow-x-auto rounded bg-gray-50 p-2 text-xs">
                              {JSON.stringify(response.example, null, 2)}
                            </pre>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!docs.endpoints || docs.endpoints.length === 0) && (
        <div className="py-8 text-center">
          <p className="text-gray-500">No API endpoints currently registered</p>
        </div>
      )}
    </div>
  );
}
