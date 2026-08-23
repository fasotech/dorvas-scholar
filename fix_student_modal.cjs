const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentProfile.tsx', 'utf8');

code = code.replace(
  'password: student.password || "",',
  'password: student.plainPassword || "",'
);

// If there was no 'password' in the initial state of editForm... Let's see what is there
// In my previous edit I only added password and confirmPassword fields, I didn't add them to initial setEditForm state!
const replacement = `
      address: student.address || "",
      academicSession: student.academicSession || "",
      feeBalance: student.feeBalance || 0,
      password: student.plainPassword || "",
      confirmPassword: student.plainPassword || ""
    });
`;

code = code.replace(
  `      address: student.address || "",
      academicSession: student.academicSession || "",
      feeBalance: student.feeBalance || 0
    });`,
  replacement
);

fs.writeFileSync('client/src/pages/StudentProfile.tsx', code);
console.log('Fixed edit modal initial state');
