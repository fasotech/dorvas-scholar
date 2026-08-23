const fs = require('fs');
let code = fs.readFileSync('server/services/studentProfile.ts', 'utf8');

// The student object is returned at the very end of getStudentProfile
// Let's replace the return statement with logic to fetch plainPassword if admin

const replacement = `
  if (role === 'admin' || role === 'administrator') {
    const schoolUser = await SchoolUser.findOne({ profileId: studentId });
    if (schoolUser && schoolUser.plainPassword) {
      student.plainPassword = schoolUser.plainPassword;
    }
  }

  return { student, attendanceStats, examResults, latestFees, auditLogs };`;

code = code.replace(
  'return { student, attendanceStats, examResults, latestFees, auditLogs };',
  replacement
);

fs.writeFileSync('server/services/studentProfile.ts', code);
console.log('Fixed getStudentProfile');
