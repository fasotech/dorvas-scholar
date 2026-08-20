
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret";

export type Context = {
  req?: any;
  res?: any;
  user?: { id: string; email: string; role: string; name: string } | null;
};

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error("UNAUTHORIZED");
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

