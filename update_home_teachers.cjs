const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  'const isClickable = id && section === "students";',
  'const isClickable = id && (section === "students" || section === "teachers");'
);

code = code.replace(
  'onClick={() => isClickable && window.location.assign("/students/" + id)}',
  'onClick={() => { if (!isClickable) return; if (section === "students") window.location.assign("/students/" + id); else if (section === "teachers") window.location.assign("/teachers/" + id); }}'
);

// We need a TeacherDashboard similar to StudentDashboard.
code = code.replace(
  'import StudentDashboard from "./StudentDashboard";',
  'import StudentDashboard from "./StudentDashboard";\nimport TeacherDashboard from "./TeacherDashboard";'
);

code = code.replace(
  'if (role === "Student") return <StudentDashboard />;',
  'if (role === "Student") return <StudentDashboard />;\n  if (role === "Teacher") return <TeacherDashboard />;'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
