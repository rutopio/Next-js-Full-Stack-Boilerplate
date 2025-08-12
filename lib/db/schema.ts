import {
  bigint,
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "bigint" }).notNull().unique(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
