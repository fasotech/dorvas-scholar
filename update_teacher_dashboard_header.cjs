const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherDashboard.tsx', 'utf8');

code = code.replace(
  'import { Button } from "@/components/ui/button";',
  'import { Button } from "@/components/ui/button";\nimport AvatarUploader from "../components/AvatarUploader";\nimport { useAuth } from "@/_core/hooks/useAuth";\nimport { LogOut } from "lucide-react";'
);

code = code.replace(
  'export default function TeacherDashboard({ summary, onNavigate }: { summary: any, onNavigate: (s: string) => void }) {',
  'export default function TeacherDashboard({ summary, onNavigate }: { summary: any, onNavigate: (s: string) => void }) {\n  const { user, logout } = useAuth();'
);

const headerReplacement = `
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
            <BookOpen size={12} /> Educator Portal
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to your classroom</h1>
          <p className="text-gray-500 mt-2">Manage your students, upload notes, and review assessments.</p>
        </div>
        <div className="flex items-center gap-4">
          <AvatarUploader 
            id={summary?.identity?.profileId}
            type="Teacher"
            currentPicture={user?.profilePicture}
            initials={user?.displayName?.charAt(0) || "T"}
            size="md"
          />
          <button onClick={() => void logout()} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
`;

code = code.replace(/\{\/\* Header \*\/\}.*?<p className="text-gray-500 mt-2">Manage your students, upload notes, and review assessments\.<\/p>\s*<\/div>/s, headerReplacement.trim());

fs.writeFileSync('client/src/pages/TeacherDashboard.tsx', code);
