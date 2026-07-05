import { z } from "zod";

export const serviceTypeSchema = z.enum(["delivery", "shopping", "cleaning", "moving"]);
export const orderStatusSchema = z.enum(["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

const latitude = z.number().min(-90).max(90);
const longitude = z.number().min(-180).max(180);

export const createOrderInput = z.object({
  serviceType: serviceTypeSchema,
  pickupAddress: z.string().min(1),
  pickupLat: latitude,
  pickupLng: longitude,
  destinationAddress: z.string().min(1),
  destinationLat: latitude,
  destinationLng: longitude,
  notes: z.string().optional(),
  stopCount: z.number().int().min(0).default(0).optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderInput>;

// Same coordinate pair shape order.create needs, used standalone so the
// client can ask for a live quote before submitting the full order.
export const estimatePriceInput = z.object({
  serviceType: serviceTypeSchema,
  pickupLat: latitude,
  pickupLng: longitude,
  destinationLat: latitude,
  destinationLng: longitude,
  stopCount: z.number().int().min(0).default(0).optional(),
});
export type EstimatePriceInput = z.infer<typeof estimatePriceInput>;

export const acceptOrderInput = z.object({
  orderId: z.string(),
});
export type AcceptOrderInput = z.infer<typeof acceptOrderInput>;

export const updateOrderStatusInput = z.object({
  orderId: z.string(),
  status: orderStatusSchema,
  // Only meaningful when status === "CANCELLED"; ignored otherwise.
  cancelReason: z.string().min(1).max(300).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInput>;

export const listMyOrdersInput = z.object({
  // Page size is capped — this is a phone-sized history list, not an export.
  limit: z.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
  // Optional single-status filter, e.g. "COMPLETED" for history, "PENDING"
  // for in-flight orders. Omit to return all statuses.
  status: orderStatusSchema.optional(),
});
export type ListMyOrdersInput = z.infer<typeof listMyOrdersInput>;

// Shape of the real-time document mirrored into Firestore's `active_orders` collection.
// Intentionally a subset of the SQL row — only what the Worker App needs to render a live job card.
export const activeOrderDoc = z.object({
  orderId: z.string(),
  status: orderStatusSchema,
  serviceType: serviceTypeSchema,
  pickupAddress: z.string(),
  pickupLat: z.number(),
  pickupLng: z.number(),
  destinationAddress: z.string().optional(),
  destinationLat: z.number().optional(),
  destinationLng: z.number().optional(),
  price: z.number(),
  customerName: z.string(),
  workerId: z.string().nullable(),
  workerFirebaseUid: z.string().nullable().optional(),
  createdAt: z.number(), // epoch ms, set by server at broadcast time
  notes: z.string().nullable().optional(),
});
export type ActiveOrderDoc = z.infer<typeof activeOrderDoc>;
