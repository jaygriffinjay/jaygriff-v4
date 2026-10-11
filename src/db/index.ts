import { drizzle } from "drizzle-orm/libsql";
import type { ResultSet } from "@libsql/client";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  schema,
});

/** The db or a transaction, so helpers can run inside either. */
export type Executor = BaseSQLiteDatabase<"async", ResultSet, typeof schema>;
