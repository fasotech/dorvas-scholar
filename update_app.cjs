const fs = require('fs');
let code = fs.readFileSync('client/src/App.tsx', 'utf8');
code = code.replace(
  'import Landing from "./pages/Landing";',
  'import Landing from "./pages/Landing";\nimport StudentProfile from "./pages/StudentProfile";'
);
code = code.replace(
  '<Route path="/dashboard" component={Home} />',
  '<Route path="/dashboard" component={Home} />\n      <Route path="/students/:studentId" component={StudentProfile} />'
);
fs.writeFileSync('client/src/App.tsx', code);
