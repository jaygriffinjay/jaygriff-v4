import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next, so load .env.local the same way Next does
loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // drizzle-kit rejects an unset/empty authToken, so omit it for local files
    ...(process.env.DATABASE_AUTH_TOKEN && { authToken: process.env.DATABASE_AUTH_TOKEN }),
  },
});
