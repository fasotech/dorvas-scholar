const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

if (!code.includes('import StudentDashboard')) {
  code = code.replace(
    'import { useAuth }',
    'import { useAuth }\nimport StudentDashboard from "./StudentDashboard";'
  );
  fs.writeFileSync('client/src/pages/Home.tsx', code);
}
