import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired records every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): {
    allowed: boolean;
    count: number;
    resetTime: number;
    remaining: number;
  } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New time window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store.set(identifier, newEntry);

      return {
        allowed: true,
        count: 1,
        resetTime: newEntry.resetTime,
        remaining: limit - 1,
      };
    }

    // Within existing time window
    entry.count++;
    this.store.set(identifier, entry);

    return {
      allowed: entry.count <= limit,
      count: entry.count,
      resetTime: entry.resetTime,
      remaining: Math.max(0, limit - entry.count),
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

const rateLimiter = new InMemoryRateLimiter();

export interface RateLimitOptions {
  limit: number; // Number of requests allowed
  windowMs: number; // Time window in milliseconds
  keyGenerator?: (request: NextRequest) => string; // Custom identifier generator
  skipSuccessfulRequests?: boolean; // Whether to skip successful requests
  skipFailedRequests?: boolean; // Whether to skip failed requests
}

export function rateLimit(options: RateLimitOptions) {
  const { limit, windowMs, keyGenerator = getDefaultKey } = options;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const identifier = keyGenerator(request);
    const result = rateLimiter.check(identifier, limit, windowMs);

    // Set response headers
    const headers = {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
    };

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too Many Requests",
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
        },
        {
          status: 429,
          headers,
        }
      );
    }

    return null; // Allow request to proceed
  };
}

function getDefaultKey(request: NextRequest): string {
  // Prioritize IP address, fallback to User-Agent if not available
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";

  return `rate_limit:${ip}`;
}

// Default configurations
export const defaultRateLimit = rateLimit({
  limit: 100, // 100 requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const strictRateLimit = rateLimit({
  limit: 5, // 5 requests per window
  windowMs: 60 * 1000, // 1 minute
});

export const authRateLimit = rateLimit({
  limit: 5, // Login/Registration limit
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Create handler with rate limiting
export function createRateLimitedHandler(
  rateLimitFn: (request: NextRequest) => Promise<NextResponse | null>,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = await rateLimitFn(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    return handler(request);
  };
}
