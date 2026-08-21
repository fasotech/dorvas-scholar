const fs = require('fs');
let code = fs.readFileSync('server/models/school.ts', 'utf8');

code = code.replace(
  '  className: String,',
  '  className: String,\n  profilePicture: String,'
);
code = code.replace(
  '  phoneNumber: String,',
  '  phoneNumber: String,\n  profilePicture: String,'
);
code = code.replace(
  '  profileId: String,',
  '  profileId: String,\n  profilePicture: String,'
);

fs.writeFileSync('server/models/school.ts', code);
