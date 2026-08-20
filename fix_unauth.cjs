const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  "if (identity.role !== 'admin' && identity.role !== 'teacher') throw new Error(`Unauthorized. Role: ${identity.role}, Email: ${platformUser.email}`);",
  "const role = identity.role?.toLowerCase() || '';\n  if (role !== 'admin' && role !== 'administrator' && role !== 'teacher') throw new Error('Unauthorized');"
);

fs.writeFileSync('server/services/school.ts', code);
