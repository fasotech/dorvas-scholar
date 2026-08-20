
import mongoose from "mongoose";

export type SchoolRole = "admin" | "teacher" | "student" | "parent";

const baseOptions = { timestamps: true };

const roleSchema = new mongoose.Schema({ name: String }, baseOptions);
export const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

const schoolUserSchema = new mongoose.Schema({
  email: String,
  oauthOpenId: String, password: { type: String }, 
  displayName: String,
  role: String,
  profileType: String,
  profileId: mongoose.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
export const SchoolUser = mongoose.models.SchoolUser || mongoose.model("SchoolUser", schoolUserSchema);

const studentSchema = new mongoose.Schema({ 
  name: String, 
  fullName: String,
  admissionNumber: String,
  status: String,
  state: String,
  address: String,
  dob: Date,
  classId: mongoose.Schema.Types.ObjectId,
  isDeleted: { type: Boolean, default: false } 
}, baseOptions);
export const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

const teacherSchema = new mongoose.Schema({ 
  name: String,
  fullName: String,
  status: String,
  isDeleted: { type: Boolean, default: false } 
}, baseOptions);
export const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

const parentSchema = new mongoose.Schema({ name: String, children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] }, baseOptions);
export const Parent = mongoose.models.Parent || mongoose.model("Parent", parentSchema);

const schoolClassSchema = new mongoose.Schema({ name: String }, baseOptions);
export const SchoolClass = mongoose.models.SchoolClass || mongoose.model("SchoolClass", schoolClassSchema);

const subjectSchema = new mongoose.Schema({ name: String }, baseOptions);
export const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

const classSubjectSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, subjectId: mongoose.Schema.Types.ObjectId, teacherId: mongoose.Schema.Types.ObjectId }, baseOptions);
export const ClassSubject = mongoose.models.ClassSubject || mongoose.model("ClassSubject", classSubjectSchema);

const academicSessionSchema = new mongoose.Schema({ name: String }, baseOptions);
export const AcademicSession = mongoose.models.AcademicSession || mongoose.model("AcademicSession", academicSessionSchema);

const termSchema = new mongoose.Schema({ name: String }, baseOptions);
export const Term = mongoose.models.Term || mongoose.model("Term", termSchema);

const attendanceSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  date: Date,
  periodKey: String,
  status: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
attendanceSchema.index({ studentId: 1, date: 1, periodKey: 1 }, { unique: true });
export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

const examSchema = new mongoose.Schema({ name: String, classId: mongoose.Schema.Types.ObjectId, subjectId: mongoose.Schema.Types.ObjectId, isDeleted: { type: Boolean, default: false } }, baseOptions);
export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);

const questionSchema = new mongoose.Schema({ examId: mongoose.Schema.Types.ObjectId, text: String }, baseOptions);
export const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

const examAttemptSchema = new mongoose.Schema({
  examId: mongoose.Schema.Types.ObjectId,
  studentId: mongoose.Schema.Types.ObjectId,
  attemptNumber: Number,
}, baseOptions);
examAttemptSchema.index({ examId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
export const ExamAttempt = mongoose.models.ExamAttempt || mongoose.model("ExamAttempt", examAttemptSchema);

const examAnswerSchema = new mongoose.Schema({ attemptId: mongoose.Schema.Types.ObjectId }, baseOptions);
export const ExamAnswer = mongoose.models.ExamAnswer || mongoose.model("ExamAnswer", examAnswerSchema);

const resultSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  examId: mongoose.Schema.Types.ObjectId,
  score: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });
export const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);

const reportCardSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId }, baseOptions);
export const ReportCard = mongoose.models.ReportCard || mongoose.model("ReportCard", reportCardSchema);

const feeSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId, amount: Number }, baseOptions);
export const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);

const paymentSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

const announcementSchema = new mongoose.Schema({ title: String, content: String }, baseOptions);
export const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);

const messageSchema = new mongoose.Schema({ fromId: mongoose.Schema.Types.ObjectId, toId: mongoose.Schema.Types.ObjectId, body: String }, baseOptions);
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

const notificationSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, message: String }, baseOptions);
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

const documentSchema = new mongoose.Schema({ url: String }, baseOptions);
export const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);

const auditLogSchema = new mongoose.Schema({ action: String }, baseOptions);
export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

const homeworkSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, title: String }, baseOptions);
export const Homework = mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);

const assignmentSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, title: String }, baseOptions);
export const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

const timetableSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId }, baseOptions);
export const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);

const admissionSchema = new mongoose.Schema({ studentName: String }, baseOptions);
export const Admission = mongoose.models.Admission || mongoose.model("Admission", admissionSchema);

