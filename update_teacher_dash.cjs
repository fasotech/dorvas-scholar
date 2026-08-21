const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  'if (role === "Teacher") return <TeacherDashboard />;',
  'if (role === "Teacher") return <TeacherDashboard summary={summary} onNavigate={onNavigate} />;'
);
fs.writeFileSync('client/src/pages/Home.tsx', code);
