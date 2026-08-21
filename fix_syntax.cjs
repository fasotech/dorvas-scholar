const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  'import { useAuth }\nimport StudentDashboard from "./StudentDashboard"; from "@/_core/hooks/useAuth";',
  'import { useAuth } from "@/_core/hooks/useAuth";\nimport StudentDashboard from "./StudentDashboard";'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
