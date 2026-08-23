const fs = require('fs');
let code = fs.readFileSync('server/services/studentProfile.ts', 'utf8');

code = code.replace(
  'await SchoolUser.updateMany({ profileId: studentId }, { $set: { password: hashedPassword } });',
  'await SchoolUser.updateMany({ profileId: studentId }, { $set: { password: hashedPassword, plainPassword: updates.password } });'
);

fs.writeFileSync('server/services/studentProfile.ts', code);
console.log('Fixed updateStudentProfile');
