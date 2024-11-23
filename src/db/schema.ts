import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
  primaryKey,
  integer,
  boolean,
  jsonb,
  text,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("Users", {
  displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
  userEmail: varchar("user_email").notNull(),
  userPassword: varchar("user_password", { length: 255 }).notNull(),
});

export const chatMessagesTable = pgTable("ChatMessages", {
  displayId: uuid("display_id").defaultRandom().notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  chat: jsonb("content").notNull(),
  title: varchar("title", { length: 20 }).default("新對話"),
});
