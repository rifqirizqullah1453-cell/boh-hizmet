import { TRPCError } from "@trpc/server";
import { setOnlineInput } from "@boh/contracts";
import { router, protectedProcedure } from "../procedures";
import { setOnlineStatus } from "../../services/worker/worker.repository";

function assertWorker(role: string) {
  if (role !== "worker") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only workers can change online status." });
  }
}

export const workerRouter = router({
  // Backs the Worker App's Online/Offline toggle — previously local-state
  // only, so a worker's availability never actually reached the backend.
  setOnline: protectedProcedure.input(setOnlineInput).mutation(async ({ ctx, input }) => {
    assertWorker(ctx.user.role);
    await setOnlineStatus(ctx.db, ctx.user.id, input.isOnline);
    return { isOnline: input.isOnline };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    assertWorker(ctx.user.role);
    return {
      isOnline: ctx.user.isOnline ?? false,
      rating: ctx.user.rating,
      totalRatings: ctx.user.totalRatings ?? 0,
    };
  }),
});
