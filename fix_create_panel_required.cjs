const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

code = code.replace(
  '<input \n                required\n                style={{ width: \'100%\', padding: \'8px 12px\', border: \'1px solid #ddd\', borderRadius: 6 }}',
  '<input \n                required={f.key !== "email"}\n                style={{ width: \'100%\', padding: \'8px 12px\', border: \'1px solid #ddd\', borderRadius: 6 }}'
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
