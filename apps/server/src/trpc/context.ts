import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@boh/db";
import { getDb } from "@boh/db";
import { env } from "../env";
import { authenticateRequest } from "../services/auth/authenticate";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  db: ReturnType<typeof getDb>;
  user?: User;
};

export async function createContext(opts: FetchCreateContextFnOptions): Promise<TrpcContext> {
  const db = getDb(env.databaseUrl);
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders, db };
  try {
    ctx.user = await authenticateRequest(opts.req.headers, db);
  } catch {
    // Anonymous request — protectedProcedure/adminProcedure will reject downstream.
  }
  return ctx;
}
