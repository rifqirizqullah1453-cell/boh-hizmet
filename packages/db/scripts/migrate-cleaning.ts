/**
 * Migration runner for 0003_cleaning_pricing.sql
 * Uses the same PlanetScale HTTP connection as the server runtime.
 *
 * Usage:
 *   npx tsx packages/db/scripts/migrate-cleaning.ts
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

config({ path: resolve(__dirname, "../../../apps/server/.env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL not set in apps/server/.env");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { mode: "planetscale" });

const migrationPath = resolve(__dirname, "../migrations/0003_cleaning_pricing.sql");
const migrationSql = readFileSync(migrationPath, "utf-8");

// Split on drizzle's statement-breakpoint marker
const statements = migrationSql
  .split("--> statement-breakpoint")
  .map(s => s.trim())
  .filter(Boolean);

async function run() {
  console.log(`Running 0003_cleaning_pricing.sql (${statements.length} statements)...\n`);
  let ok = 0;
  let skip = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.slice(0, 60).replace(/\s+/g, " ");
    try {
      await db.execute(sql.raw(stmt));
      console.log(`  [${i + 1}/${statements.length}] ✅  ${preview}…`);
      ok++;
    } catch (err: any) {
      const msg: string = err?.message ?? String(err);
      // Skip "already exists" errors — idempotent re-runs are safe
      if (
        msg.includes("already exists") ||
        msg.includes("Duplicate entry") ||
        msg.includes("Table") && msg.includes("exist")
      ) {
        console.log(`  [${i + 1}/${statements.length}] ⏭  SKIP (already applied): ${preview}…`);
        skip++;
      } else {
        console.error(`  [${i + 1}/${statements.length}] ❌  FAILED: ${preview}…`);
        console.error(`       ${msg}`);
        console.error("Full error:", JSON.stringify(err, null, 2));
        process.exit(1);
      }
    }
  }

  console.log(`\nDone. ✅ ${ok} applied, ⏭ ${skip} skipped.`);
  process.exit(0);
}

run().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
