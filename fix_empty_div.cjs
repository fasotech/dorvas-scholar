const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

const regex = /\{\/\* Quick Actions \/ System Health \*\/\}\s*<div className="space-y-6">\s*<\/div>\s*<div className="bg-\[#1b4332\]/m;

if (code.match(regex)) {
  code = code.replace(
    /\{\/\* Quick Actions \/ System Health \*\/\}\s*<div className="space-y-6">\s*<\/div>\s*<div className="bg-\[#1b4332\]/m,
    '{/* Quick Actions */}\n        <div className="space-y-6">\n          <div className="bg-[#1b4332]'
  );
  fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
  console.log("Fixed empty div issue.");
} else {
  console.log("Empty div pattern not found.");
}
