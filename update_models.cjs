const fs = require('fs');
let code = fs.readFileSync('server/models/school.ts', 'utf8');

const newStudent = `const studentSchema = new mongoose.Schema({ 
  name: String, 
  fullName: String,
  admissionNumber: String,
  status: String,
  state: String,
  address: String,
  dob: Date,
  classId: mongoose.Schema.Types.ObjectId,
  isDeleted: { type: Boolean, default: false } 
}, baseOptions);`;

const newTeacher = `const teacherSchema = new mongoose.Schema({ 
  name: String,
  fullName: String,
  status: String,
  isDeleted: { type: Boolean, default: false } 
}, baseOptions);`;

code = code.replace(/const studentSchema = new mongoose\.Schema\(\{ name: String, isDeleted: \{ type: Boolean, default: false \} \}, baseOptions\);/, newStudent);
code = code.replace(/const teacherSchema = new mongoose\.Schema\(\{ name: String, isDeleted: \{ type: Boolean, default: false \} \}, baseOptions\);/, newTeacher);

fs.writeFileSync('server/models/school.ts', code);
