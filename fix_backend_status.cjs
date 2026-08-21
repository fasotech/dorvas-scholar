const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  '    status: payload.status || (section === "classes" ? "active" : undefined),',
  '    status: payload.status || "active",'
);

fs.writeFileSync('server/services/school.ts', code);
