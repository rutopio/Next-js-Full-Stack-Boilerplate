import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db/db";
import { DatabaseSecurity, executeSecureQuery } from "@/lib/db/security";
import { deserializeId, generateSnowflakeId, serializeId } from "@/lib/id";

import { usersTable } from "./schema";

export async function createUser(user: { email: string; password: string }) {
  // Validate input
  if (!DatabaseSecurity.validateInput(user.email)) {
    throw new Error("Invalid email format detected");
  }

  const salt = genSaltSync(10);
  const hash = hashSync(user.password, salt);
  const userId = generateSnowflakeId();

  return executeSecureQuery("createUser", async () => {
    await db.insert(usersTable).values({
      userId,
      email: user.email,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return serializeId(userId);
  });
}

export async function getUserByUserId(userId: string) {
  return executeSecureQuery("getUserByUserId", async () => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.userId, deserializeId(userId)),
          eq(usersTable.isDeleted, false)
        )
      );

    if (!user) {
      return null;
    }

    return {
      ...user,
      userId: serializeId(user.userId),
    };
  });
}

export async function getUserByEmail(email: string) {
  // Validate input
  if (!DatabaseSecurity.validateInput(email)) {
    throw new Error("Invalid email format detected");
  }

  return executeSecureQuery("getUserByEmail", async () => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return null;
    }

    return {
      ...user,
      userId: serializeId(user.userId),
    };
  });
}

export async function updateUserByUserId(
  userId: string,
  data: {
    password?: string;
  }
) {
  return executeSecureQuery("updateUserByUserId", async () => {
    await db
      .update(usersTable)
      .set(data)
      .where(
        and(
          eq(usersTable.userId, deserializeId(userId)),
          eq(usersTable.isDeleted, false)
        )
      );
    return userId;
  });
}

export async function deleteUserByUserId(userId: string) {
  return executeSecureQuery("deleteUserByUserId", async () => {
    await db
      .update(usersTable)
      .set({ isDeleted: true })
      .where(
        and(
          eq(usersTable.userId, deserializeId(userId)),
          eq(usersTable.isDeleted, false)
        )
      );
    return userId;
  });
}
