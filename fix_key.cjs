const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(/\\`cell-\\\${index}\\`/g, '`cell-${index}`');
code = code.replace(/key=\{\\`cell-\\\$\{index\}\\`\}/g, 'key={`cell-${index}`}');
// Just in case it's literally `cell-${index}` but with a slash
code = code.replace(/key=\{`cell-\\\$\{index\}`\}/g, 'key={`cell-${index}`}');
code = code.replace(/key=\{\\`cell-\\\$\{index\}\\`\}/g, 'key={`cell-${index}`}');

fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
