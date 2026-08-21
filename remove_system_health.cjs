const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

const systemHealthRegex = /<div className="bg-white rounded-xl border border-gray-100 shadow-\[0_2px_10px_-4px_rgba\(0,0,0,0\.05\)\] p-6">\s*<h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5">System Health<\/h3>[\s\S]*?<\/div>\s*<\/div>/;

if (code.match(systemHealthRegex)) {
  code = code.replace(systemHealthRegex, '');
  fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
  console.log("System Health removed.");
} else {
  console.log("System Health not found.");
}
