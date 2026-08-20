import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getDashboard, getRecords, createRecord, dashboardSections } from "../services/school";

export const schoolRouter = router({
  dashboard: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
    return await getDashboard({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name });
  }),
  records: publicProcedure
    .input(z.object({ section: z.enum(dashboardSections as any), query: z.string().optional().default("") }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
      return await getRecords({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name }, input.section, input.query);
    }),
  createRecord: publicProcedure
    .input(z.object({ section: z.enum(dashboardSections as any), payload: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
      return await createRecord({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name }, input.section, input.payload);
    })
});
