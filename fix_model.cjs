const fs = require('fs');
let code = fs.readFileSync('server/models/school.ts', 'utf8');

// The schema is strict: false, so plainPassword will just be saved! No need to modify school.ts schema definitions.
// Oh wait, schoolUserSchema explicitly lists fields, let's just make sure.
// actually wait, earlier I changed baseOptions to { timestamps: true, strict: false }
// so plainPassword will save perfectly fine!
console.log('Skipping model update since strict is false');
