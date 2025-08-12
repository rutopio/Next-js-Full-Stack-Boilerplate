import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";

config({
  path: ".env.local",
});

// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
});
