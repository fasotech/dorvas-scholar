const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

code = code.replace(
  'require("../services/schoolAccess").getSchoolIdentity',
  'require("../services/school").getSchoolIdentity'
);

fs.writeFileSync('server/routers/school.ts', code);
