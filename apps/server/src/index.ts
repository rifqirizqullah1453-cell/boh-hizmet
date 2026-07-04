// Type-only entry point for other workspaces (e.g. apps/worker) to import
// `AppRouter` for their tRPC client. Never import runtime code from here in
// a frontend bundle — only `import type` — otherwise the bundler will try
// to pull in server-only dependencies (firebase-admin, drizzle, etc).
export type { AppRouter } from "./trpc/router";
