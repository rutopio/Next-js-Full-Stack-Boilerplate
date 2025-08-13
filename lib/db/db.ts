import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config({
  path: ".env.local",
});

// Database connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  
  // Connection pool settings
  max: 20,                    // Maximum number of connections
  min: 2,                     // Minimum number of connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000, // Timeout when connecting to database
  
  // Security settings
  statement_timeout: 30000,   // Cancel queries after 30 seconds
  query_timeout: 30000,       // Query timeout
  
  // Additional security
  application_name: "nextjs-boilerplate",
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

export const db = drizzle(pool);
