import dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import "dotenv/config";

// this file is for drizzle-kit, which is used to do our database migrations
dotenv.config({ path: "./.env.local" });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL must be defined in .env.local");
}

export default {
  dialect: "postgresql", //for drizzle-kit 0.21
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  //driver: "pg",
  dbCredentials: { url: process.env.POSTGRES_URL as string }, //connectionString for previous versions of drizzle-kit
};
