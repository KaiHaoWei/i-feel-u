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
