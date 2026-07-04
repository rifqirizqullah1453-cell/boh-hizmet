import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/context";
import { getDb } from "@boh/db";
import { sql } from "drizzle-orm";
import { ensureCleaningSchema } from "./services/pricing/cleaning.schema-init";
import { ensureMovingSchema } from "./services/pricing/moving.schema-init";

const app = new Hono();

// Worker/Client are separate Vite dev servers (different origins), and the
// session lives in an httpOnly cookie — without explicit CORS + credentials
// here, the browser silently drops the Set-Cookie on login and blocks the
// mutation responses entirely. `credentials: true` requires an exact origin
// allowlist (not "*"), so this can't just be wildcarded.
const rawOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://localhost:5174").split(",");

// In development, allow any localhost port so Vite port conflicts don't break CORS.
const isProduction = process.env.NODE_ENV === "production";
const originCheck = isProduction
  ? rawOrigins
  : (origin: string) => (origin.startsWith("http://localhost:") ? origin : null);

app.use(
  "/api/*",
  cors({
    origin: originCheck,
    credentials: true,
  })
);

// Uptime / load-balancer probe — no auth, no DB, instant response.
app.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));

// Temporary: test Firebase Admin SDK initialization.
app.get("/debug-firebase", async (c) => {
  try {
    const { getApps, initializeApp, cert } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");
    const key = process.env.FIREBASE_PRIVATE_KEY ?? "";
    const keyInfo = {
      length: key.length,
      startsOk: key.startsWith("-----BEGIN"),
      hasNewlines: key.includes("\n"),
      hasLiteralN: key.includes("\\n"),
      first50: key.slice(0, 50),
    };
    if (!getApps().length) {
      initializeApp({ credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: key.replace(/\\n/g, "\n"),
      })});
    }
    const auth = getAuth();
    return c.json({ ok: true, apps: getApps().length, keyInfo });
  } catch (err: any) {
    return c.json({ ok: false, error: err?.message, code: err?.code }, 500);
  }
});

// Dev-only one-shot migration for cleaning schema.
// Hit GET /migrate-cleaning once after first deploy to create tables + seed data.
if (process.env.NODE_ENV !== "production") {
  app.get("/migrate-moving", async (c) => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return c.json({ ok: false, error: "DATABASE_URL not set" }, 500);
    try {
      const testDb = getDb(databaseUrl);
      await testDb.execute(sql`SELECT 1`);
      await ensureMovingSchema(testDb);
      return c.json({ ok: true, message: "Moving schema ensured." });
    } catch (err: any) {
      return c.json({ ok: false, error: { message: err?.message, code: err?.code } }, 500);
    }
  });

  app.get("/migrate-cleaning", async (c) => {
    const databaseUrl = process.env.DATABASE_URL;
    const urlInfo = {
      set:    !!databaseUrl,
      length: databaseUrl?.length ?? 0,
      prefix: databaseUrl?.slice(0, 8) ?? "",
    };
    if (!databaseUrl) return c.json({ ok: false, error: "DATABASE_URL not set", urlInfo }, 500);
    try {
      // Test connectivity first
      const testDb = getDb(databaseUrl);
      await testDb.execute(sql`SELECT 1`);
      await ensureCleaningSchema(testDb);
      return c.json({ ok: true, message: "Cleaning schema ensured." });
    } catch (err: any) {
      const detail = {
        message: err?.message,
        code:    err?.code,
        errno:   err?.errno,
        sql:     err?.sql,
        errors:  Array.isArray(err?.errors)
          ? err.errors.map((e: any) => ({ message: e?.message, code: e?.code }))
          : undefined,
      };
      return c.json({ ok: false, error: detail, urlInfo }, 500);
    }
  });
}

app.use("/api/trpc/*", async (c) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  })
);

const port = parseInt(process.env.PORT ?? "4000", 10);
serve({ fetch: app.fetch, port }, async () => {
  console.log(`[server] listening on http://localhost:${port}`);
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      await ensureCleaningSchema(getDb(databaseUrl));
    } catch (err) {
      console.error("[cleaning] Schema init failed (non-fatal):", err);
    }
    try {
      await ensureMovingSchema(getDb(databaseUrl));
    } catch (err) {
      console.error("[moving] Schema init failed (non-fatal):", err);
    }
  }
});
