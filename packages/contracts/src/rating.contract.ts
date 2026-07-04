import { z } from "zod";

export const submitRatingInput = z.object({
  orderId: z.string(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});
export type SubmitRatingInput = z.infer<typeof submitRatingInput>;
