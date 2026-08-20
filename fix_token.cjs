const fs = require('fs');
let code = fs.readFileSync('server/vercel.ts', 'utf8');
code = code.replace(
  'const token = req.cookies?.auth_token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null);',
  'const token = (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null) || req.cookies?.auth_token;'
);
fs.writeFileSync('server/vercel.ts', code);
