const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  'const hashedPassword = await bcrypt.hash(payload.password || "Password123!", 10);',
  `const rawPassword = payload.password || "Password123!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);`
);

code = code.replace(
  'password: hashedPassword,',
  `password: hashedPassword,
      plainPassword: rawPassword,`
);

fs.writeFileSync('server/services/school.ts', code);
console.log('Fixed createRecord');
