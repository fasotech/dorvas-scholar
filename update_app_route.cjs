const fs = require('fs');
let code = fs.readFileSync('client/src/App.tsx', 'utf8');

if (!code.includes('import CBTPlatform')) {
  code = code.replace(
    'import Home from "./pages/Home";',
    'import Home from "./pages/Home";\nimport CBTPlatform from "./pages/CBTPlatform";'
  );
}

if (!code.includes('<Route path="/cbt/:examId"')) {
  code = code.replace(
    '<Route path="/students/:studentId" component={StudentProfile} />',
    '<Route path="/students/:studentId" component={StudentProfile} />\n      <Route path="/cbt/:examId" component={CBTPlatform} />'
  );
}

fs.writeFileSync('client/src/App.tsx', code);
