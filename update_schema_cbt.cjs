const fs = require('fs');
let code = fs.readFileSync('server/models/school.ts', 'utf8');

const newSchemas = `
// --- CBT ENGINE SCHEMAS ---
const cbtExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  examType: { type: String, enum: ['Teacher Assessment', 'JAMB Practice', 'Mock'], default: 'Teacher Assessment' },
  subject: String,
  targetClass: String,
  durationMinutes: { type: Number, default: 30 },
  isPublished: { type: Boolean, default: false },
  createdBy: mongoose.Schema.Types.ObjectId,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
export const CBTExam = mongoose.models.CBTExam || mongoose.model('CBTExam', cbtExamSchema);

const cbtQuestionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'CBTExam', required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  marks: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
export const CBTQuestion = mongoose.models.CBTQuestion || mongoose.model('CBTQuestion', cbtQuestionSchema);

const cbtAttemptSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'CBTExam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  score: Number,
  totalMarks: Number,
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOptionIndex: Number
  }],
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' }
}, baseOptions);
export const CBTAttempt = mongoose.models.CBTAttempt || mongoose.model('CBTAttempt', cbtAttemptSchema);

const classNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  subject: String,
  targetClass: String,
  teacherId: mongoose.Schema.Types.ObjectId,
  teacherName: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
export const ClassNote = mongoose.models.ClassNote || mongoose.model('ClassNote', classNoteSchema);
`;

if (!code.includes('CBTExam')) {
  code = code + '\n' + newSchemas;
  fs.writeFileSync('server/models/school.ts', code);
}
