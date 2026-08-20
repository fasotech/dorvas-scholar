const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

const regex = /settings: \{ primary: "New academic session", secondary: "System configuration", note: "Manage academic years and grading periods", icon: Settings \},\s*teachers: \{ primary: "New Teacher", secondary: "Teacher roster", note: "Manage teaching staff", icon: Users \}/g;

code = code.replace(
  regex,
  'settings: { primary: "New academic session", secondary: "System configuration", note: "Manage academic years and grading periods", icon: Settings }'
);

// We need to inject teachers into moduleData.
code = code.replace(
  'settings: { eyebrow: "School settings", title: "Keep the foundation orderly.", description: "Academic sessions and protected school configuration are reserved for administrators.", primary: "Update settings" },',
  'settings: { eyebrow: "School settings", title: "Keep the foundation orderly.", description: "Academic sessions and protected school configuration are reserved for administrators.", primary: "Update settings" },\n  teachers: { eyebrow: "Teacher roster", title: "Manage teaching staff.", description: "Review and manage the teacher roster and subjects.", primary: "New Teacher" },'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
