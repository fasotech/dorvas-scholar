const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherProfile.tsx', 'utf8');

code = code.replace(
  'import { useAuth } from "../hooks/useAuth";',
  ''
);

code = code.replace(
  'const { user, login } = useAuth();',
  ''
);

code = code.replace(
  /onSuccess: \(data\) => \{[\s\S]*?\},/,
  `onSuccess: (res: any) => {
      if (res.token) sessionStorage.setItem("manus-cookie", \`auth_token=\${res.token}\`);
      window.location.href = "/dashboard";
    },`
);

fs.writeFileSync('client/src/pages/TeacherProfile.tsx', code);
