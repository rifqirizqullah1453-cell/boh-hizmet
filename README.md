# BÖH Hizmet — Monorepo

T3-style stack: React + tRPC + Drizzle ORM (MySQL, source of truth) + Firestore (real-time event bus) + Hono.

## Structure

```
apps/
  client/   Customer-facing app (placeholder scaffold)
  worker/   Worker + Admin dashboard — has the Firestore listener + OrderContext
  server/   Hono + tRPC backend — order state machine lives here
packages/
  db/         Drizzle schema (users, orders) + connection helper
  contracts/  Zod schemas shared between server and both frontends
```

## What's implemented

- `packages/db/src/schema/{users,orders}.ts` — order status enum `PENDING | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED`.
- `apps/server/src/services/order/order.repository.ts` — `acceptOrderAtomic`: the PENDING→ACCEPTED race-condition guard is a single conditional `UPDATE ... WHERE status = 'PENDING'`, not a transaction wrapper. Returns `null` on lost race; the service layer turns that into `TRPCError({ code: "CONFLICT" })`.
- `apps/server/src/services/order/order.service.ts` — orchestrates SQL (source of truth, committed first) then Firestore (best-effort mirror; failures are logged, not thrown — a Firestore outage should never roll back a confirmed SQL order).
- `apps/server/src/services/firestore/activeOrders.service.ts` — broadcast on create, merge-patch on state change, delete on COMPLETED/CANCELLED.
- `apps/server/src/trpc/routers/{order,admin}.router.ts` — `order.create`, `order.accept`, `order.updateStatus` (protectedProcedure); `admin.forceReassignOrder`, `admin.forceCancelOrder` (adminProcedure — bypasses the status precondition entirely, gated only by role).
- `apps/worker/src/features/orders/{useActiveOrdersListener.ts,OrderContext.tsx}` — `onSnapshot` on `active_orders` where `status == PENDING`, deduped by order id so the audio/vibration alert fires once per order, not once per snapshot.

## Not yet done / explicitly out of scope this round

- `apps/client` and `apps/worker` are package.json + tsconfig scaffolds only — no actual screens/routing yet.
- No `npm install` has been run and no build/typecheck has been verified — this repo has new heavy dependencies (`firebase-admin`, `firebase`, `@trpc/server`, `drizzle-kit`) that aren't installed, and no real `DATABASE_URL` / Firebase service account exists to test against. Treat this as reviewed-by-construction code, not verified-by-running code.
- `services/auth/authenticate.ts` is a minimal JWT-cookie stub so `ctx.user` has something to type-check against — swap for whatever real identity provider (Firebase Auth, Kimi OAuth, etc.) the project settles on.
- Drizzle Kit config (`drizzle.config.ts`) for `db:generate`/`db:migrate` isn't written yet.

## Env setup

Copy `.env.example` → `.env` in `apps/server` and `apps/worker`:
- `apps/server/.env.example` — `DATABASE_URL`, `APP_SECRET`, Firebase Admin SDK service-account credentials.
- `apps/worker/.env.example` — Firebase Web SDK public config.
