const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

// Replace standard font-sans with a forced custom font style
code = code.replace(
  '<div className="bg-[#f8f9fa] min-h-full p-8 font-sans">',
  '<div className="bg-[#f8f9fa] min-h-full p-8" style={{ fontFamily: "\'DM Sans\', sans-serif" }}>'
);

fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
