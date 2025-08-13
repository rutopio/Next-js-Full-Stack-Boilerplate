import { config } from "dotenv";

import { clearDatabase } from "@/lib/db/seeds";

config({
  path: ".env.local",
});

async function main() {
  const confirmed = process.argv.includes("--confirm");

  if (!confirmed) {
    console.log("\n✦ This command will delete all data from the database!\n");
    console.log(
      "Use --confirm flag to proceed: `npm run db:clear -- --confirm`"
    );
    process.exit(1);
  }

  await clearDatabase();
  process.exit(0);
}

main().catch((error) => {
  console.error("Clear database script failed:", error);
  process.exit(1);
});
