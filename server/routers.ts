
import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { schoolRouter } from "./routers/school";
import { authRouter } from "./routers/auth";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  school: schoolRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

