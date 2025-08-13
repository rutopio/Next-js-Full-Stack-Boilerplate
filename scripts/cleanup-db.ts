#!/usr/bin/env tsx
import { config } from "dotenv";
import { and, eq, lt, sql } from "drizzle-orm";

import { db } from "@/lib/db/db";
import { usersTable } from "@/lib/db/schema";

config({
  path: ".env.local",
});

export async function cleanupDeletedUsers() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    console.log("✦ Cleaning up soft-deleted users older than 30 days...");

    const result = await db
      .delete(usersTable)
      .where(
        and(
          eq(usersTable.isDeleted, true),
          lt(usersTable.updatedAt, thirtyDaysAgo)
        )
      );

    console.log(`✔ Cleaned up ${result.rowCount || 0} deleted users`);
  } catch (error) {
    console.error("✘ Error cleaning up deleted users:", error);
    throw error;
  }
}

export async function getDbStats() {
  try {
    console.log("✦ Gathering database statistics...");

    const totalUsers = await db.$count(usersTable);
    const activeUsers = await db.$count(
      usersTable,
      eq(usersTable.isDeleted, false)
    );
    const deletedUsers = await db.$count(
      usersTable,
      eq(usersTable.isDeleted, true)
    );
    const adminUsers = await db.$count(
      usersTable,
      eq(usersTable.isAdmin, true)
    );

    console.log("✦ Database Statistics:");
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Active users: ${activeUsers}`);
    console.log(`   Deleted users: ${deletedUsers}`);
    console.log(`   Admin users: ${adminUsers}`);

    return {
      totalUsers,
      activeUsers,
      deletedUsers,
      adminUsers,
    };
  } catch (error) {
    console.error("✘ Error getting database stats:", error);
    throw error;
  }
}

export async function validateDataIntegrity() {
  try {
    console.log("✦ Validating data integrity...");

    const duplicateEmails = await db
      .select()
      .from(usersTable)
      .groupBy(usersTable.email)
      .having(sql`count(*) > 1`);

    if (duplicateEmails.length > 0) {
      console.warn(
        `✦ Found ${duplicateEmails.length} duplicate email addresses`
      );
    } else {
      console.log("✔ No duplicate emails found");
    }

    const usersWithoutEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, ""));

    if (usersWithoutEmail.length > 0) {
      console.warn(`✦ Found ${usersWithoutEmail.length} users without email`);
    } else {
      console.log("✔ All users have email addresses");
    }

    return {
      duplicateEmails: duplicateEmails.length,
      usersWithoutEmail: usersWithoutEmail.length,
    };
  } catch (error) {
    console.error("✘ Error validating data integrity:", error);
    throw error;
  }
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "cleanup":
      await cleanupDeletedUsers();
      break;
    case "stats":
      await getDbStats();
      break;
    case "validate":
      await validateDataIntegrity();
      break;
    case "all":
      await getDbStats();
      await validateDataIntegrity();
      await cleanupDeletedUsers();
      break;
    default:
      console.log("Available commands:");
      console.log("  cleanup  - Remove soft-deleted users older than 30 days");
      console.log("  stats    - Show database statistics");
      console.log("  validate - Validate data integrity");
      console.log("  all      - Run all maintenance tasks");
      console.log("");
      console.log("Usage: npm run db:maintain <command>");
      process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Database maintenance script failed:", error);
  process.exit(1);
});
