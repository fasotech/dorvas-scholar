const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  "let email = payload.fullName.toLowerCase().replace(/\\s+/g, '.') + '@dorvas.edu.ng';",
  "let email = payload.email || (payload.fullName.toLowerCase().replace(/\\s+/g, '.') + '@dorvas.edu.ng');"
);

fs.writeFileSync('server/services/school.ts', code);
