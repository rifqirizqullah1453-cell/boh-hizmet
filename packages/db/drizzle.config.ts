import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

// `npm run db:generate -w packages/db` runs with this package's directory as
// cwd, but DATABASE_URL lives in apps/server/.env (single source for the
// connection string, since that's also what the running server reads).
config({ path: resolve(__dirname, "../../apps/server/.env") });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Copy apps/server/.env.example to apps/server/.env and fill it in."
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
