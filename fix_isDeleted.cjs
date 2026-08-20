const fs = require('fs');

// 1. Fix server/routers/auth.ts
let authCode = fs.readFileSync('server/routers/auth.ts', 'utf8');
authCode = authCode.replace(
  /isDeleted: false, isActive: true/g,
  'isDeleted: { $ne: true }, isActive: { $ne: false }'
);
fs.writeFileSync('server/routers/auth.ts', authCode);

// 2. Fix server/services/school.ts
let schoolCode = fs.readFileSync('server/services/school.ts', 'utf8');
schoolCode = schoolCode.replace(
  /isDeleted: false, isActive: true/g,
  'isDeleted: { $ne: true }, isActive: { $ne: false }'
);

// Remove the debug popup and restore the correct Unauthorized error
schoolCode = schoolCode.replace(
  /const role = identity\.role\?\.toLowerCase\(\) \|\| '';\n  if \(role !== 'admin' && role !== 'administrator' && role !== 'teacher'\) throw new Error\(`DebugAuth:.*`\);/g,
  "const role = identity.role?.toLowerCase() || '';\n  if (role !== 'admin' && role !== 'administrator' && role !== 'teacher') throw new Error('Unauthorized');"
);

fs.writeFileSync('server/services/school.ts', schoolCode);

// 3. Fix server/models/school.ts schema (add isDeleted)
let modelCode = fs.readFileSync('server/models/school.ts', 'utf8');
modelCode = modelCode.replace(
  'isActive: { type: Boolean, default: true }',
  'isActive: { type: Boolean, default: true },\n  isDeleted: { type: Boolean, default: false }'
);
fs.writeFileSync('server/models/school.ts', modelCode);

