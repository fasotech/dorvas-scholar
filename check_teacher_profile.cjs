const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentProfile.tsx', 'utf8');

// Simple search and replace to adapt StudentProfile to TeacherProfile
code = code.replace(/StudentProfile/g, 'TeacherProfile');
code = code.replace(/studentId/g, 'teacherId');
code = code.replace(/student\./g, 'teacher.');
code = code.replace(/student = /g, 'teacher = ');
code = code.replace(/getStudentProfile/g, 'getTeacherProfile'); // Wait, does getTeacherProfile exist?
// It probably doesn't. Admin can get records from school API.
// Wait, StudentProfile uses `trpc.school.getStudentProfile`. Let me check if that exists.
