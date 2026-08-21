const fs = require('fs');

// 1. Fix studentPortal.ts
let routerCode = fs.readFileSync('server/routers/studentPortal.ts', 'utf8');

routerCode = routerCode.replace(
  'const student = await Student.findOne({ _id: ctx.user.profileId, isDeleted: { $ne: true } });',
  'const { SchoolUser } = require("../models/school");\n    const schoolUser = await SchoolUser.findOne({ _id: ctx.user.id });\n    const student = schoolUser && schoolUser.profileId ? await Student.findOne({ _id: schoolUser.profileId, isDeleted: { $ne: true } }) : null;'
);
routerCode = routerCode.replace(
  'const student = await Student.findOne({ _id: ctx.user.profileId, isDeleted: { $ne: true } });',
  'const { SchoolUser } = require("../models/school");\n      const schoolUser = await SchoolUser.findOne({ _id: ctx.user.id });\n      const student = schoolUser && schoolUser.profileId ? await Student.findOne({ _id: schoolUser.profileId, isDeleted: { $ne: true } }) : null;'
);
routerCode = routerCode.replace(
  'attemptId: z.string(),',
  'attemptId: z.string(),'
);
routerCode = routerCode.replace(
  'const attempt = await CBTAttempt.findOne({ _id: input.attemptId, studentId: ctx.user.profileId });',
  'const { SchoolUser } = require("../models/school");\n      const schoolUser = await SchoolUser.findOne({ _id: ctx.user.id });\n      const attempt = schoolUser && schoolUser.profileId ? await CBTAttempt.findOne({ _id: input.attemptId, studentId: schoolUser.profileId }) : null;'
);

fs.writeFileSync('server/routers/studentPortal.ts', routerCode);

// 2. Fix StudentDashboard.tsx
let uiCode = fs.readFileSync('client/src/pages/StudentDashboard.tsx', 'utf8');
if (!uiCode.includes('if (!query.data)')) {
  uiCode = uiCode.replace(
    'const { student, exams, recentNotes } = query.data!;',
    'if (!query.data) return null;\n  const { student, exams, recentNotes } = query.data!;'
  );
  fs.writeFileSync('client/src/pages/StudentDashboard.tsx', uiCode);
}
