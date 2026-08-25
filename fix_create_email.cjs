const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  'recordPayload.name = recordPayload.fullName;',
  'recordPayload.name = recordPayload.fullName;\\n    recordPayload.email = email;'
);

fs.writeFileSync('server/services/school.ts', code);
console.log('Fixed createRecord to save email to student model');
