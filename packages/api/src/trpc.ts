import { createTRPCReact } from "@trpc/react-query";
// Type-only import — AppRouter never pulls server runtime code (drizzle,
// firebase-admin, etc.) into a frontend bundle, only its inferred shape.
import type { AppRouter } from "@boh/server";

export const trpc = createTRPCReact<AppRouter>();
