import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;

const requireAuth = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required." });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(requireAuth);

const requireAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin role required." });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Strict admin-only gate. Used for force-reassign / force-cancel — operations
// that bypass the normal order state machine, so they must be auditable and
// restricted to a single role check point.
export const adminProcedure = t.procedure.use(requireAuth).use(requireAdmin);
