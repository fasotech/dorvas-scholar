const fs = require('fs');
let code = fs.readFileSync('server/routers/school.ts', 'utf8');

code = code.replace(
  /const user = ctx\.user \|\| \{ id: "local-dev", name: "Dev User", email: "dev@example\.com" \};/g,
  'if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);\n      const user = ctx.user;'
);

fs.writeFileSync('server/routers/school.ts', code);
