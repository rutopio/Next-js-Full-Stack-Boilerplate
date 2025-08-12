import { genSaltSync, hashSync } from "bcrypt-ts";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db/db";
import { deserializeId, generateSnowflakeId, serializeId } from "@/lib/id";

import { usersTable } from "./schema";

export async function createUser(user: { email: string; password: string }) {
  const salt = genSaltSync(10);
  const hash = hashSync(user.password, salt);
  const userId = generateSnowflakeId();

  try {
    await db.insert(usersTable).values({
      ...user,
      userId,
      password: hash,
    });
    return {
      email: user.email,
      userId: serializeId(userId),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserByUserId(userId: string) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.userId, deserializeId(userId)),
          eq(usersTable.isDeleted, false)
        )
      );
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserByUserId(userId: string, data: any) {
  try {
    await db
      .update(usersTable)
      .set(data)
      .where(
        and(
          eq(usersTable.userId, deserializeId(userId)),
          eq(usersTable.isDeleted, false)
        )
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUserByUserId(userId: string) {
  try {
    await db
      .update(usersTable)
      // set Soft Delete
      .set({ isDeleted: true })
      .where(
        and(
          eq(usersTable.userId, deserializeId(userId)),
          eq(usersTable.isDeleted, false)
        )
      );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
