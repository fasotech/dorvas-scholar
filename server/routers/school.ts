
import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { getDashboard, getRecords, dashboardSections } from "../services/school";

export const schoolRouter = router({
  dashboard: publicProcedure.query(async ({ ctx }) => {
    // If auth is strictly required, we can assert ctx.user exists. 
    // For now we map to the expected PlatformUser.
    const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
    return await getDashboard({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name });
  }),
  records: publicProcedure
    .input(z.object({ section: z.enum(dashboardSections as any), query: z.string().optional().default("") }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
      return await getRecords({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name }, input.section, input.query);
    })
});

