import { NextResponse } from "next/server";

import { ApiResponseBuilder } from "@/lib/api/validation";
import { dbSecurity } from "@/lib/db/security";

export async function GET() {
  try {
    const dbHealth = await dbSecurity.healthCheck();
    const queryStats = dbSecurity.getQueryStats();

    const healthData = {
      status: dbHealth.status,
      database: {
        responseTime: dbHealth.responseTime,
        activeConnections: dbHealth.activeConnections,
        error: dbHealth.error,
      },
      queries: {
        totalOperations: queryStats.length,
        topQueries: queryStats.slice(0, 5), // Top 5 most used queries
      },
    };

    if (dbHealth.status === "healthy") {
      return ApiResponseBuilder.success(healthData, "System is healthy");
    } else {
      // Create error response with 503 status
      const errorResponse = ApiResponseBuilder.internalError(
        "System health check failed"
      );
      return new NextResponse(errorResponse.body, {
        status: 503,
        headers: errorResponse.headers,
      });
    }
  } catch (error) {
    console.error("Health check failed:", error);
    const errorResponse = ApiResponseBuilder.internalError(
      "Health check failed"
    );
    return new NextResponse(errorResponse.body, {
      status: 503,
      headers: errorResponse.headers,
    });
  }
}
