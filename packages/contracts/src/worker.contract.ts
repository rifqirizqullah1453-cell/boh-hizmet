import { z } from "zod";

export const setOnlineInput = z.object({
  isOnline: z.boolean(),
});
export type SetOnlineInput = z.infer<typeof setOnlineInput>;
