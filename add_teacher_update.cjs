const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

const newEndpoint = `
  updateTeacherProfile: publicProcedure
    .input(z.object({ id: z.string(), updates: z.any() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { Teacher, SchoolUser } = require("../models/school");
      
      const identity = await require("../services/school").getSchoolIdentity(ctx.user as any);
      
      // Admins can edit any teacher, Teachers can edit themselves
      if (identity.role !== 'admin' && identity.role !== 'administrator' && identity.profileId !== input.id) {
        throw new Error("Unauthorized to edit this teacher");
      }

      const teacher = await Teacher.findByIdAndUpdate(input.id, { $set: input.updates }, { new: true });
      
      if (input.updates.email) {
        await SchoolUser.updateMany({ profileId: input.id }, { $set: { email: input.updates.email.toLowerCase() } });
      }

      return teacher;
    }),
`;

code = code.replace(
  'updateStudentProfile: publicProcedure',
  newEndpoint + '\n  updateStudentProfile: publicProcedure'
);

fs.writeFileSync('server/routers/school.ts', code);
