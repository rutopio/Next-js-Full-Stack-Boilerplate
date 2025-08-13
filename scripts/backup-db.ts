#!/usr/bin/env tsx
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { sql } from "drizzle-orm";

import { db } from "@/lib/db/db";

config({
  path: ".env.local",
});

async function backupDatabase() {
  const backupDir = join(process.cwd(), "backups");

  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = join(backupDir, `backup-${timestamp}.json`);

  try {
    console.log("✦ Creating database backup...");

    // 導出所有用戶資料
    const users = await db.execute(sql`SELECT * FROM users_table`);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      tables: {
        users_table: users.rows
      }
    };

    // BigInt 序列化處理
    const jsonString = JSON.stringify(backupData, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2);

    writeFileSync(backupFile, jsonString);

    console.log(`✔ Database backup created: ${backupFile}`);
    console.log(`📄 Exported ${users.rows.length} users`);
  } catch (error) {
    console.error("✘ Backup failed:", error);
    process.exit(1);
  }
}

async function main() {
  await backupDatabase();
  process.exit(0);
}

main().catch((error) => {
  console.error("Backup script failed:", error);
  process.exit(1);
});
