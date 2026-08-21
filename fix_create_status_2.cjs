const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  'const recordPayload = { ...payload, status: payload.status || "active" };',
  'const recordPayload = { ...payload, status: payload.status || "active" };'
);

code = code.replace(
  'const doc = await model.create({\n    status: "active",',
  'const doc = await model.create({\n    status: payload.status || (section === "classes" ? "active" : undefined),'
);

fs.writeFileSync('server/services/school.ts', code);
