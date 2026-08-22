const fs = require('fs');
let code = fs.readFileSync('server/models/school.ts', 'utf8');

code = code.replace(
  'const baseOptions = { timestamps: true };',
  'const baseOptions = { timestamps: true, strict: false };'
);

fs.writeFileSync('server/models/school.ts', code);
