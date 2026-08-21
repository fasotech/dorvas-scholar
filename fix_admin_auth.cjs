const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  'import { useAuth } from "../hooks/useAuth";',
  'import { useAuth } from "@/_core/hooks/useAuth";'
);

fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
