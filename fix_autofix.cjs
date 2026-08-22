const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  'Student.updateMany({ status: { $exists: false } }, { $set: { status: "active" } }),',
  'Student.updateMany({ status: { $exists: false } }, { $set: { status: "active", isDeleted: false } }),'
);
code = code.replace(
  'Teacher.updateMany({ status: { $exists: false } }, { $set: { status: "active" } }),',
  'Teacher.updateMany({ status: { $exists: false } }, { $set: { status: "active", isDeleted: false } }),'
);
code = code.replace(
  'SchoolClass.updateMany({ status: { $exists: false } }, { $set: { status: "active" } })',
  'SchoolClass.updateMany({ status: { $exists: false } }, { $set: { status: "active", isDeleted: false } })'
);

fs.writeFileSync('server/services/school.ts', code);
