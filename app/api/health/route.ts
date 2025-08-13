import { NextResponse } from "next/server";

import { dbSecurity } from "@/lib/db/security";

export async function GET() {
  try {
    const dbHealth = await dbSecurity.healthCheck();
    const queryStats = dbSecurity.getQueryStats();

    const healthStatus = {
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
      timestamp: new Date().toISOString(),
    };

    const httpStatus = dbHealth.status === 'healthy' ? 200 : 503;

    return NextResponse.json(healthStatus, { status: httpStatus });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}