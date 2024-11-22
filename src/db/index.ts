import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import { privateEnv } from "@/lib/env/private";
import * as schema from "./schema";

const client = new Client({
  connectionString: privateEnv.POSTGRES_URL,
  connectionTimeoutMillis: 5000,
  // timeout of 5000 milliseconds
});
await client.connect();
export const db = drizzle(client, { schema });
