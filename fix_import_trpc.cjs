const fs = require('fs');
let code = fs.readFileSync('server/routers/studentPortal.ts', 'utf8');
code = code.replace(
  'import { router, protectedProcedure } from "../trpc";',
  'import { router, protectedProcedure } from "../_core/trpc";'
);
fs.writeFileSync('server/routers/studentPortal.ts', code);
