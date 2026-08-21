const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

const imports = `import { getStudentProfile, updateStudentProfile, toggleStudentStatus, deleteStudent } from "../services/studentProfile";\n`;
code = imports + code;

const newProcedures = `
  getStudentProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await getStudentProfile(ctx.user as any, input.id);
    }),
  updateStudentProfile: publicProcedure
    .input(z.object({ id: z.string(), updates: z.any() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await updateStudentProfile(ctx.user as any, input.id, input.updates);
    }),
  toggleStudentStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await toggleStudentStatus(ctx.user as any, input.id, input.status);
    }),
  deleteStudent: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      return await deleteStudent(ctx.user as any, input.id);
    }),
`;

code = code.replace(
  'createRecord: publicProcedure',
  newProcedures + '\  createRecord: publicProcedure'
);

fs.writeFileSync('server/routers/school.ts', code);
