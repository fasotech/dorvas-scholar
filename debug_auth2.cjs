const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  "const role = identity.role?.toLowerCase() || '';\n  if (role !== 'admin' && role !== 'administrator' && role !== 'teacher') throw new Error('Unauthorized');",
  "const role = identity.role?.toLowerCase() || '';\n  if (role !== 'admin' && role !== 'administrator' && role !== 'teacher') throw new Error(`DebugAuth: role='${role}', identityRole='${identity.role}', email='${platformUser.email}', linked=${identity.linked}, isConnected=${identity.connection}`);"
);

fs.writeFileSync('server/services/school.ts', code);
