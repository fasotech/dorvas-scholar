const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

if (!code.includes('getTeacherProfile:')) {
  code = code.replace(
    '  getStudentProfile: publicProcedure',
    `  getTeacherProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { Teacher } = require("../models/school");
      const teacher = await Teacher.findById(input.id).lean();
      if (!teacher) throw new Error("Teacher not found");
      return { teacher };
    }),
  getStudentProfile: publicProcedure`
  );
  fs.writeFileSync('server/routers/school.ts', code);
  console.log("Added getTeacherProfile");
}
