#!/usr/bin/env tsx

import { config } from "dotenv";

import { seedDatabase } from "@/lib/db/seeds";

config({
  path: ".env.local",
});

async function main() {
  await seedDatabase();
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});