const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

code = code.replace(
  'import { getDashboard, getRecords, dashboardSections } from "../services/school";',
  'import { getDashboard, getRecords, createRecord, dashboardSections } from "../services/school";'
);

const newMutation = `
  createRecord: publicProcedure
    .input(z.object({ section: z.enum(dashboardSections as any), payload: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
      return await createRecord({ openId: user.id || (user as any).openId || user.email, email: user.email, name: user.name }, input.section, input.payload);
    })
});
`;

code = code.replace('});', newMutation);
fs.writeFileSync('server/routers/school.ts', code);
