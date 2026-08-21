const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherProfile.tsx', 'utf8');

code = code.replace(/\\`Impersonating \\\${query.data\?\.teacher\.fullName}\\`/g, '`Impersonating ${query.data?.teacher.fullName}`');
code = code.replace(/className=\{\\`px-3 py-1 text-xs font-bold rounded-full border \\\$\{teacher.status === 'active' \? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}\\`\}/g, 'className={`px-3 py-1 text-xs font-bold rounded-full border ${teacher.status === \\'active\\' ? \\'bg-green-50 text-green-700 border-green-100\\' : \\'bg-red-50 text-red-700 border-red-100\\'}`}');

// Also check for `???`
code = code.replace(/Teacher Profile \?\?\? /g, 'Teacher Profile — ');
code = code.replace(/\{teacher\.email \|\| "\?\?\?"\}/g, '{teacher.email || "—"}');

fs.writeFileSync('client/src/pages/TeacherProfile.tsx', code);
