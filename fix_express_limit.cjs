const fs = require('fs');
let code = fs.readFileSync('server/vercel.ts', 'utf8');

code = code.replace(
  'app.use(express.json());',
  'app.use(express.json({ limit: "10mb" }));'
);
// Also update server/index.ts just in case
let indexCode = fs.readFileSync('server/index.ts', 'utf8');
indexCode = indexCode.replace(
  'app.use(express.json());',
  'app.use(express.json({ limit: "10mb" }));'
);
fs.writeFileSync('server/vercel.ts', code);
fs.writeFileSync('server/index.ts', indexCode);
