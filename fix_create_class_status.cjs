const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  '  // Create generic document for other sections\n  const doc = await model.create({\n    ...payload,\n    isDeleted: false,',
  '  // Create generic document for other sections\n  const doc = await model.create({\n    status: payload.status || "active",\n    ...payload,\n    isDeleted: false,'
);

fs.writeFileSync('server/services/school.ts', code);
