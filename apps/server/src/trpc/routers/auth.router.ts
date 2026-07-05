import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@boh/db";
import { router, protectedProcedure } from "../procedures";

const profileFields = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Nomor telepon tidak valid")
    .optional(),
});

export const authRouter = router({
  // Returns the caller's own MySQL user row. Lets the frontend know the
  // server-assigned role (customer / worker / admin) and display name.
  me: protectedProcedure.query(({ ctx }) => ({
    id: ctx.user.id,
    name: ctx.user.name,
    role: ctx.user.role,
    rating: ctx.user.rating,
    totalRatings: ctx.user.totalRatings,
    isOnline: ctx.user.isOnline,
  })),

  // Called once immediately after Firebase sign-in to persist name and role.
  // Role can only be upgraded from the auto-assigned "customer" default — a
  // worker who logs into the customer app later can't accidentally demote
  // themselves back to customer this way.
  // Updates display name and/or phone number. Separate from auth.register so
  // the Profile page doesn't have to pass a role every time name/phone changes.
  updateProfile: protectedProcedure.input(profileFields).mutation(async ({ ctx, input }) => {
    if (!input.name && !input.phone) return { ok: true };
    await ctx.db
      .update(users)
      .set({
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.user.id));
    return { ok: true };
  }),

  saveFcmToken: protectedProcedure
    .input(z.object({ token: z.string().min(1).max(512) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ fcmToken: input.token, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));
      return { ok: true };
    }),

  register: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        role: z.enum(["customer", "worker"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          updatedAt: new Date(),
          // Role is set on first registration (current role is the "customer"
          // default we assigned in authenticateRequest). After that it's
          // immutable via this endpoint — admin.router.ts handles role changes.
          ...(ctx.user.role === "customer" ? { role: input.role } : {}),
        })
        .where(eq(users.id, ctx.user.id));

      return { ok: true };
    }),
});
