import "server-only";

import { sql } from "drizzle-orm";

import { db } from "./db";

// Database query security middleware
export class DatabaseSecurity {
  private static instance: DatabaseSecurity;
  private queryStats = new Map<string, { count: number; lastUsed: Date }>();

  private constructor() {}

  static getInstance(): DatabaseSecurity {
    if (!DatabaseSecurity.instance) {
      DatabaseSecurity.instance = new DatabaseSecurity();
    }
    return DatabaseSecurity.instance;
  }

  // Monitor query execution
  async executeSecureQuery<T>(
    operation: string,
    queryFn: () => Promise<T>,
    maxExecutionTime = 10000
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Update query statistics
      this.updateQueryStats(operation);

      // Execute with timeout
      const result = await Promise.race([
        queryFn(),
        this.createTimeoutPromise(maxExecutionTime),
      ]);

      const executionTime = Date.now() - startTime;

      // Log slow queries
      if (executionTime > 1000) {
        console.warn(
          `Slow query detected: ${operation} took ${executionTime}ms`
        );
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(
        `Query failed: ${operation} after ${executionTime}ms`,
        error
      );
      throw error;
    }
  }

  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Query timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  private updateQueryStats(operation: string) {
    const current = this.queryStats.get(operation) || {
      count: 0,
      lastUsed: new Date(),
    };
    this.queryStats.set(operation, {
      count: current.count + 1,
      lastUsed: new Date(),
    });
  }

  // Get query statistics
  getQueryStats() {
    const stats = Array.from(this.queryStats.entries()).map(
      ([operation, data]) => ({
        operation,
        count: data.count,
        lastUsed: data.lastUsed,
      })
    );

    return stats.sort((a, b) => b.count - a.count);
  }

  // Database health check
  async healthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    responseTime: number;
    activeConnections?: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      // Simple ping query
      await db.execute(sql`SELECT 1 as ping`);

      const responseTime = Date.now() - startTime;

      // Check active connections (if available)
      let activeConnections: number | undefined;
      try {
        const result = await db.execute(sql`
          SELECT count(*) as active_connections 
          FROM pg_stat_activity 
          WHERE state = 'active'
        `);
        activeConnections = Number(result.rows[0]?.active_connections) || 0;
      } catch {
        // Connection count check failed, but basic ping succeeded
      }

      return {
        status: responseTime < 1000 ? "healthy" : "unhealthy",
        responseTime,
        activeConnections,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Validate input to prevent common injection patterns
  static validateInput(input: string): boolean {
    if (typeof input !== "string") return false;

    // Check for common SQL injection patterns
    const suspiciousPatterns = [
      /'\s*OR\s*'?1'?\s*='?1/i,
      /'\s*OR\s*'?1'?\s*='?0/i,
      /'\s*UNION\s*SELECT/i,
      /'\s*DROP\s*TABLE/i,
      /'\s*DELETE\s*FROM/i,
      /'\s*INSERT\s*INTO/i,
      /'\s*UPDATE\s*SET/i,
      /'\s*CREATE\s*TABLE/i,
      /'\s*ALTER\s*TABLE/i,
      /--/,
      /\/\*/,
      /\*\//,
      /xp_cmdshell/i,
      /sp_executesql/i,
    ];

    return !suspiciousPatterns.some((pattern) => pattern.test(input));
  }

  // Sanitize string input
  static sanitizeInput(input: string): string {
    if (typeof input !== "string") return "";

    return input
      .replace(/[<>]/g, "") // Remove potential XSS characters
      .replace(/['"]/g, "") // Remove quotes
      .trim();
  }

  // Clear old statistics (run periodically)
  clearOldStats(daysOld = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    for (const [operation, data] of this.queryStats.entries()) {
      if (data.lastUsed < cutoffDate) {
        this.queryStats.delete(operation);
      }
    }
  }
}

export const dbSecurity = DatabaseSecurity.getInstance();

// Helper function for secure query execution
export async function executeSecureQuery<T>(
  operation: string,
  queryFn: () => Promise<T>,
  maxExecutionTime?: number
): Promise<T> {
  return dbSecurity.executeSecureQuery(operation, queryFn, maxExecutionTime);
}
