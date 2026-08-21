const fs = require('fs');
let code = fs.readFileSync('server/models/school.ts', 'utf8');

// Add missing fields to studentSchema
code = code.replace(
  'isDeleted: { type: Boolean, default: false }',
  'isDeleted: { type: Boolean, default: false },\n  photograph: String,\n  telephone: String,\n  gender: String,\n  parentContact: String,\n  academicSession: String,\n  feeBalance: { type: Number, default: 0 },\n  enrollmentStatus: { type: String, default: "Active" }'
);

// Add audit log model if not comprehensive enough
code = code.replace(
  'const auditLogSchema = new mongoose.Schema({ action: String }, baseOptions);',
  'const auditLogSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, targetId: mongoose.Schema.Types.ObjectId, action: String, details: String }, baseOptions);'
);

fs.writeFileSync('server/models/school.ts', code);
