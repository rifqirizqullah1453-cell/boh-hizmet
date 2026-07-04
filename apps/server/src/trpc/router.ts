import { router } from "./procedures";
import { orderRouter } from "./routers/order.router";
import { adminRouter } from "./routers/admin.router";
import { authRouter } from "./routers/auth.router";
import { workerRouter } from "./routers/worker.router";
import { ratingRouter } from "./routers/rating.router";
import { cleaningRouter } from "./routers/cleaning.router";
import { movingRouter } from "./routers/moving.router";

export const appRouter = router({
  auth:     authRouter,
  order:    orderRouter,
  admin:    adminRouter,
  worker:   workerRouter,
  rating:   ratingRouter,
  cleaning: cleaningRouter,
  moving:   movingRouter,
});

export type AppRouter = typeof appRouter;
