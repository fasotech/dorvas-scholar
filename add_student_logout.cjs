const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentDashboard.tsx', 'utf8');

code = code.replace(
  'import { Button } from "@/components/ui/button";',
  'import { Button } from "@/components/ui/button";\nimport { useAuth } from "@/_core/hooks/useAuth";\nimport { LogOut } from "lucide-react";'
);

code = code.replace(
  'export default function StudentDashboard() {',
  'export default function StudentDashboard() {\n  const { logout } = useAuth();'
);

const logoutButton = `
        {/* Logout Button */}
        <button onClick={() => void logout()} className="absolute top-6 right-6 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors" title="Logout">
          <LogOut size={20} />
        </button>
`;

code = code.replace(
  '{/* Abstract Background Shapes */}',
  logoutButton.trim() + '\n        {/* Abstract Background Shapes */}'
);

fs.writeFileSync('client/src/pages/StudentDashboard.tsx', code);
