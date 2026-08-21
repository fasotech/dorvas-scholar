const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

const newEndpoint = `
  updateProfilePicture: publicProcedure
    .input(z.object({ id: z.string().optional(), base64Image: z.string(), type: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new Error("Auth failed");
      const { SchoolUser, Student, Teacher } = require("../models/school");
      
      let targetProfileId = null;
      let targetType = null;

      if (input.id) {
        // Admin updating someone else
        const identity = await require("../services/schoolAccess").getSchoolIdentity(ctx.user as any);
        if (identity.role !== 'admin' && identity.role !== 'administrator') {
          throw new Error("Unauthorized to edit other profiles");
        }
        targetProfileId = input.id;
        targetType = input.type || "Student"; // Default to student if not specified
      } else {
        // User updating themselves
        const schoolUser = await SchoolUser.findOne({ email: ctx.user.email });
        if (!schoolUser) throw new Error("User not found");
        targetProfileId = schoolUser.profileId;
        targetType = schoolUser.profileType;
        
        // Also update the SchoolUser itself
        schoolUser.profilePicture = input.base64Image;
        await schoolUser.save();
      }

      if (targetType === "Student" || targetType === "student") {
        await Student.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
      } else if (targetType === "Teacher" || targetType === "teacher") {
        await Teacher.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
      } else if (targetType === "Admin" || targetType === "admin") {
         // Admins might not have a profile, just update the SchoolUser which we already did
      }
      
      return { success: true };
    }),
`;

code = code.replace(
  'updateStudentProfile: publicProcedure',
  newEndpoint + '\n  updateStudentProfile: publicProcedure'
);

fs.writeFileSync('server/routers/school.ts', code);
