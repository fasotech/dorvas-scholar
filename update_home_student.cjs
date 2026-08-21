const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

if (!code.includes('import StudentDashboard')) {
  // It's probably easier to just replace a known import
  code = code.replace(
    'import { UserManagement }',
    'import { UserManagement }\nimport StudentDashboard from "./StudentDashboard";'
  );
}

if (!code.includes('<StudentDashboard />')) {
  code = code.replace(
    'function Dashboard({ role, summary, isLoading, onNavigate, onCreate }: { role: PortalRole; summary: any; isLoading: boolean; onNavigate: (key: SectionKey) => void; onCreate: () => void }) {',
    'function Dashboard({ role, summary, isLoading, onNavigate, onCreate }: { role: PortalRole; summary: any; isLoading: boolean; onNavigate: (key: SectionKey) => void; onCreate: () => void }) {\n  if (role === "Student") return <StudentDashboard />;\n'
  );
}

fs.writeFileSync('client/src/pages/Home.tsx', code);
