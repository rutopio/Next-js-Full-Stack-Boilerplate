import { eq } from "drizzle-orm";

import { db } from "@/lib/db/db";

import { usersTable } from "./schema";

export async function getActiveUserByUserId(userId: string) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.userId, userId),
  });
  return user;
}
