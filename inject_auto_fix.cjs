const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

const fixCode = `
  // Auto-fix ghost records (missing status)
  await Promise.all([
    Student.updateMany({ status: { $exists: false } }, { $set: { status: "active" } }),
    Teacher.updateMany({ status: { $exists: false } }, { $set: { status: "active" } }),
    SchoolClass.updateMany({ status: { $exists: false } }, { $set: { status: "active" } })
  ]);
`;

code = code.replace('const [totalStudents, activeStudents', fixCode + '\n  const [totalStudents, activeStudents');

fs.writeFileSync('server/services/school.ts', code);
