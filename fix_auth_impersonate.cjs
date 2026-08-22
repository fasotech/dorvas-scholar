const fs = require('fs');
let code = fs.readFileSync('server/routers/auth.ts', 'utf8');

const newImpersonate = `
      let targetUser = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: { $ne: true }, isActive: { $ne: false } });
      
      if (!targetUser) {
        const { Teacher, Student } = require("../models/school");
        const teacher = await Teacher.findOne({ email: input.email });
        if (teacher) {
           const bcrypt = require("bcryptjs");
           const hashedPassword = await bcrypt.hash("Password123!", 10);
           targetUser = await SchoolUser.create({
             email: input.email.toLowerCase(),
             password: hashedPassword,
             displayName: teacher.fullName,
             role: "teacher",
             profileType: "Teacher",
             profileId: teacher._id,
             isActive: true,
             isDeleted: false
           });
        } else {
           const student = await Student.findOne({ email: input.email });
           if (student) {
             const bcrypt = require("bcryptjs");
             const hashedPassword = await bcrypt.hash("Password123!", 10);
             targetUser = await SchoolUser.create({
               email: input.email.toLowerCase(),
               password: hashedPassword,
               displayName: student.fullName,
               role: "student",
               profileType: "Student",
               profileId: student._id,
               isActive: true,
               isDeleted: false
             });
           }
        }
      }

      if (!targetUser) throw new Error("User not found in the system.");
`;

code = code.replace(
  '      const targetUser = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: { $ne: true }, isActive: { $ne: false } });\n      if (!targetUser) throw new Error("User not found");',
  newImpersonate
);

fs.writeFileSync('server/routers/auth.ts', code);
