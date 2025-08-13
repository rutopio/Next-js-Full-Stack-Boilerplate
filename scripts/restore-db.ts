#!/usr/bin/env tsx
import { existsSync, readFileSync } from "fs";
import { config } from "dotenv";

import { db } from "@/lib/db/db";
import { usersTable } from "@/lib/db/schema";

config({
  path: ".env.local",
});

async function restoreDatabase(backupFile: string) {
  if (!existsSync(backupFile)) {
    console.error(`✘ Backup file not found: ${backupFile}`);
    process.exit(1);
  }

  try {
    console.log(`✦ Restoring database from: ${backupFile}`);

    const backupData = JSON.parse(readFileSync(backupFile, "utf8"));

    if (!backupData.tables?.users_table) {
      console.error("✘ Invalid backup file format");
      process.exit(1);
    }

    // 清空現有資料
    await db.delete(usersTable);
    console.log("✦ Cleared existing data");

    // 恢復用戶資料
    const users = backupData.tables.users_table;
    if (users.length > 0) {
      // 轉換資料格式以符合 schema
      const formattedUsers = users.map((user: any) => ({
        id: user.id,
        userId: BigInt(user.user_id),
        email: user.email,
        password: user.password,
        isDeleted: user.is_deleted,
        isAdmin: user.is_admin,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      }));

      await db.insert(usersTable).values(formattedUsers);
      console.log(`✔ Restored ${users.length} users`);
    }

    console.log("✔ Database restored successfully!");
  } catch (error) {
    console.error("✘ Restore failed:", error);
    process.exit(1);
  }
}

async function main() {
  const backupFile = process.argv[2];

  if (!backupFile) {
    console.error("✘ Please provide backup file path");
    console.log("Usage: npm run db:restore path/to/backup.json");
    process.exit(1);
  }

  const confirmed = process.argv.includes("--confirm");

  if (!confirmed) {
    console.log("✦ This will overwrite all existing data in the database!");
    console.log(
      "Use --confirm flag to proceed: npm run db:restore file.json -- --confirm"
    );
    process.exit(1);
  }

  await restoreDatabase(backupFile);
  process.exit(0);
}

main().catch((error) => {
  console.error("Restore script failed:", error);
  process.exit(1);
});
