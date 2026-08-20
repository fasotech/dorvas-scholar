const fs = require('fs');

// 1. Update server/vercel.ts
let vercelCode = fs.readFileSync('server/vercel.ts', 'utf8');
vercelCode = vercelCode.replace(
  'const token = req.cookies?.auth_token;',
  'const authHeader = req.headers.authorization;\n      const token = req.cookies?.auth_token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null);'
);
fs.writeFileSync('server/vercel.ts', vercelCode);

// 2. Update server/routers/auth.ts
let authCode = fs.readFileSync('server/routers/auth.ts', 'utf8');
authCode = authCode.replace(
  'return { success: true, role: user.role };',
  'return { success: true, role: user.role, token };'
);
fs.writeFileSync('server/routers/auth.ts', authCode);

// 3. Update client/src/pages/Login.tsx
let loginCode = fs.readFileSync('client/src/pages/Login.tsx', 'utf8');
loginCode = loginCode.replace(
  'queryClient.invalidateQueries({ queryKey: [["auth", "me"]] });',
  'if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);\n      queryClient.invalidateQueries({ queryKey: [["auth", "me"]] });'
);
loginCode = loginCode.replace(
  'onSuccess: () => {',
  'onSuccess: (res: any) => {'
);
fs.writeFileSync('client/src/pages/Login.tsx', loginCode);
