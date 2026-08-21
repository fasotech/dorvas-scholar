const fs = require('fs');
let code = fs.readFileSync('client/src/App.tsx', 'utf8');

code = code.replace(
  'import StudentProfile from "./pages/StudentProfile";',
  'import StudentProfile from "./pages/StudentProfile";\nimport TeacherProfile from "./pages/TeacherProfile";'
);

code = code.replace(
  '<Route path="/students/:studentId" component={StudentProfile} />',
  '<Route path="/students/:studentId" component={StudentProfile} />\n      <Route path="/teachers/:teacherId" component={TeacherProfile} />'
);

fs.writeFileSync('client/src/App.tsx', code);
