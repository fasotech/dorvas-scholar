const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Replace the old Dashboard function entirely
code = code.replace(/function Dashboard\([\s\S]*?(?=function Workspace)/, `
import AdminDashboard from "./AdminDashboard";

function Dashboard({ role, summary, isLoading, onNavigate, onCreate }: { role: PortalRole; summary: any; isLoading: boolean; onNavigate: (key: SectionKey) => void; onCreate: () => void }) {
  if (role === "Student") return <StudentDashboard />;
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[#1b4332]" size={32} /></div>;
  }
  
  return <AdminDashboard summary={summary} onNavigate={onNavigate} />;
}

`);

fs.writeFileSync('client/src/pages/Home.tsx', code);
