import { TRPCError } from "@trpc/server";
import type { SubmitRatingInput } from "@boh/contracts";
import type { Database, User } from "@boh/db";
import { findOrderById } from "../order/order.repository";
import { findRatingByOrderId, insertRating, applyRatingToWorker } from "./rating.repository";

export async function submitRating(db: Database, customer: User, input: SubmitRatingInput): Promise<void> {
  const order = await findOrderById(db, input.orderId);

  if (!order || order.customerId !== customer.id) {
    // NOT_FOUND rather than FORBIDDEN — same fingerprinting reasoning as
    // order.repository.ts#assertOrderAccess: a non-owner shouldn't be able
    // to tell "doesn't exist" apart from "exists but isn't yours".
    throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
  }
  if (order.status !== "COMPLETED" || !order.workerId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Only completed orders can be rated." });
  }

  const existing = await findRatingByOrderId(db, input.orderId);
  if (existing) {
    throw new TRPCError({ code: "CONFLICT", message: "This order has already been rated." });
  }

  try {
    await insertRating(db, {
      orderId: input.orderId,
      customerId: customer.id,
      workerId: order.workerId,
      stars: input.stars,
      comment: input.comment ?? null,
    });
  } catch (err) {
    // Unique index on orderId is the real race-condition guard for the
    // "already rated" check above (two concurrent submits both passing the
    // findRatingByOrderId check before either commits) — a second insert
    // hits the constraint and lands here instead of double-counting below.
    throw new TRPCError({ code: "CONFLICT", message: "This order has already been rated." });
  }

  await applyRatingToWorker(db, order.workerId, input.stars);
}
