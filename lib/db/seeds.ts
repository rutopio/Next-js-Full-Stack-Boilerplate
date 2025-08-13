import { genSaltSync, hashSync } from "bcrypt-ts";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db/db";
import { generateSnowflakeId } from "@/lib/id";

import { usersTable } from "./schema";

export async function seedUsers() {
  const salt = genSaltSync(10);

  const seedUsers = [
    {
      userId: generateSnowflakeId(),
      email: "admin@example.com",
      password: hashSync("Admin123456", salt),
      isAdmin: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: generateSnowflakeId(),
      email: "user1@example.com",
      password: hashSync("User123456", salt),
      isAdmin: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: generateSnowflakeId(),
      email: "user2@example.com",
      password: hashSync("User123456", salt),
      isAdmin: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  try {
    console.log("✦ Seeding users...");

    for (const user of seedUsers) {
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, user.email))
        .limit(1);

      if (existingUser.length === 0) {
        await db.insert(usersTable).values(user);
        console.log(`✔ Created user: ${user.email}`);
      } else {
        console.log(`✦ User already exists: ${user.email}`);
      }
    }

    console.log("✦ Users seeding completed!");
  } catch (error) {
    console.error("✘ Error seeding users:", error);
    throw error;
  }
}

export async function seedDatabase() {
  try {
    console.log("✦ Starting database seeding...");

    await seedUsers();

    console.log("✦ Database seeding completed successfully!");
  } catch (error) {
    console.error("✦ Database seeding failed:", error);
    process.exit(1);
  }
}

export async function clearDatabase() {
  try {
    console.log("✦ Clearing database...");

    await db.delete(usersTable);

    console.log("✔ Database cleared successfully!");
  } catch (error) {
    console.error("✘ Error clearing database:", error);
    throw error;
  }
}
