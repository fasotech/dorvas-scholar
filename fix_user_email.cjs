const fs = require('fs');
let code = fs.readFileSync('server/services/studentProfile.ts', 'utf8');

const oldLogic = `  const student = await Student.findByIdAndUpdate(studentId, { $set: updates }, { new: true });
  if (identity.schoolUserId) {`;

const newLogic = `  const student = await Student.findByIdAndUpdate(studentId, { $set: updates }, { new: true });
  
  // Keep the login account email in sync if it changed
  if (updates.email) {
    await SchoolUser.updateMany({ profileId: studentId }, { $set: { email: updates.email.toLowerCase() } });
  }

  if (identity.schoolUserId) {`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('server/services/studentProfile.ts', code);
