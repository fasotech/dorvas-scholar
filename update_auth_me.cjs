const fs = require('fs');
let code = fs.readFileSync('server/routers/auth.ts', 'utf8');

code = code.replace(
  '  me: publicProcedure.query(({ ctx }) => {\n    return ctx.user || null;\n  })',
  `  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const { SchoolUser } = require("../models/school");
    const user = await SchoolUser.findById(ctx.user.id).lean();
    if (user) {
      return { ...ctx.user, profilePicture: user.profilePicture };
    }
    return ctx.user;
  })`
);

fs.writeFileSync('server/routers/auth.ts', code);
