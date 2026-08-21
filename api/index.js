// server/vercel.ts
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import jwt2 from "jsonwebtoken";

// server/_core/trpc.ts
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
var JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret";
var t = initTRPC.context().create({ transformer: superjson });
var router = t.router;
var publicProcedure = t.procedure;
var protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error("UNAUTHORIZED");
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});

// server/_core/systemRouter.ts
var systemRouter = router({});

// server/models/school.ts
import mongoose from "mongoose";
var baseOptions = { timestamps: true };
var roleSchema = new mongoose.Schema({ name: String }, baseOptions);
var Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
var schoolUserSchema = new mongoose.Schema({
  email: String,
  oauthOpenId: String,
  password: { type: String },
  displayName: String,
  role: String,
  profileType: String,
  profileId: mongoose.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  photograph: String,
  telephone: String,
  gender: String,
  parentContact: String,
  academicSession: String,
  feeBalance: { type: Number, default: 0 },
  enrollmentStatus: { type: String, default: "Active" }
}, baseOptions);
var SchoolUser = mongoose.models.SchoolUser || mongoose.model("SchoolUser", schoolUserSchema);
var studentSchema = new mongoose.Schema({
  name: String,
  fullName: String,
  admissionNumber: String,
  status: String,
  state: String,
  address: String,
  dob: Date,
  classId: mongoose.Schema.Types.ObjectId,
  className: String,
  email: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
var teacherSchema = new mongoose.Schema({
  name: String,
  fullName: String,
  status: String,
  address: String,
  email: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
var parentSchema = new mongoose.Schema({ name: String, children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] }, baseOptions);
var Parent = mongoose.models.Parent || mongoose.model("Parent", parentSchema);
var schoolClassSchema = new mongoose.Schema({ name: String }, baseOptions);
var SchoolClass = mongoose.models.SchoolClass || mongoose.model("SchoolClass", schoolClassSchema);
var subjectSchema = new mongoose.Schema({ name: String }, baseOptions);
var Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
var classSubjectSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, subjectId: mongoose.Schema.Types.ObjectId, teacherId: mongoose.Schema.Types.ObjectId }, baseOptions);
var ClassSubject = mongoose.models.ClassSubject || mongoose.model("ClassSubject", classSubjectSchema);
var academicSessionSchema = new mongoose.Schema({ name: String }, baseOptions);
var AcademicSession = mongoose.models.AcademicSession || mongoose.model("AcademicSession", academicSessionSchema);
var termSchema = new mongoose.Schema({ name: String }, baseOptions);
var Term = mongoose.models.Term || mongoose.model("Term", termSchema);
var attendanceSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  date: Date,
  periodKey: String,
  status: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
attendanceSchema.index({ studentId: 1, date: 1, periodKey: 1 }, { unique: true });
var Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
var examSchema = new mongoose.Schema({ name: String, classId: mongoose.Schema.Types.ObjectId, subjectId: mongoose.Schema.Types.ObjectId, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
var questionSchema = new mongoose.Schema({ examId: mongoose.Schema.Types.ObjectId, text: String }, baseOptions);
var Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
var examAttemptSchema = new mongoose.Schema({
  examId: mongoose.Schema.Types.ObjectId,
  studentId: mongoose.Schema.Types.ObjectId,
  attemptNumber: Number
}, baseOptions);
examAttemptSchema.index({ examId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
var ExamAttempt = mongoose.models.ExamAttempt || mongoose.model("ExamAttempt", examAttemptSchema);
var examAnswerSchema = new mongoose.Schema({ attemptId: mongoose.Schema.Types.ObjectId }, baseOptions);
var ExamAnswer = mongoose.models.ExamAnswer || mongoose.model("ExamAnswer", examAnswerSchema);
var resultSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  examId: mongoose.Schema.Types.ObjectId,
  score: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });
var Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
var reportCardSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId }, baseOptions);
var ReportCard = mongoose.models.ReportCard || mongoose.model("ReportCard", reportCardSchema);
var feeSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId, amount: Number }, baseOptions);
var Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
var paymentSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
var announcementSchema = new mongoose.Schema({ title: String, content: String }, baseOptions);
var Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
var messageSchema = new mongoose.Schema({ fromId: mongoose.Schema.Types.ObjectId, toId: mongoose.Schema.Types.ObjectId, body: String }, baseOptions);
var Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
var notificationSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, message: String }, baseOptions);
var Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
var documentSchema = new mongoose.Schema({ url: String }, baseOptions);
var Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
var auditLogSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, targetId: mongoose.Schema.Types.ObjectId, action: String, details: String }, baseOptions);
var AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
var homeworkSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, title: String }, baseOptions);
var Homework = mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);
var assignmentSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, title: String }, baseOptions);
var Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
var timetableSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId }, baseOptions);
var Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
var admissionSchema = new mongoose.Schema({ studentName: String }, baseOptions);
var Admission = mongoose.models.Admission || mongoose.model("Admission", admissionSchema);
var cbtExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  examType: { type: String, enum: ["Teacher Assessment", "JAMB Practice", "Mock"], default: "Teacher Assessment" },
  subject: String,
  targetClass: String,
  durationMinutes: { type: Number, default: 30 },
  isPublished: { type: Boolean, default: false },
  createdBy: mongoose.Schema.Types.ObjectId,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var CBTExam = mongoose.models.CBTExam || mongoose.model("CBTExam", cbtExamSchema);
var cbtQuestionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "CBTExam", required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  marks: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var CBTQuestion = mongoose.models.CBTQuestion || mongoose.model("CBTQuestion", cbtQuestionSchema);
var cbtAttemptSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "CBTExam", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  score: Number,
  totalMarks: Number,
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOptionIndex: Number
  }],
  status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" }
}, baseOptions);
var CBTAttempt = mongoose.models.CBTAttempt || mongoose.model("CBTAttempt", cbtAttemptSchema);
var classNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  subject: String,
  targetClass: String,
  teacherId: mongoose.Schema.Types.ObjectId,
  teacherName: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var ClassNote = mongoose.models.ClassNote || mongoose.model("ClassNote", classNoteSchema);

// server/mongo.ts
import mongoose2 from "mongoose";
var nextRetryAt = 0;
var lastConnectionError = null;
async function getMongoConnection() {
  if (mongoose2.connection.readyState === 1) return mongoose2.connection;
  if (Date.now() < nextRetryAt) return null;
  const uri = process.env.MONGODB_URI;
  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    lastConnectionError = "MONGODB_URI is missing or is not a MongoDB connection URI.";
    return null;
  }
  try {
    await mongoose2.connect(uri, {
      connectTimeoutMS: 8e3,
      serverSelectionTimeoutMS: 8e3,
      maxPoolSize: 10
    });
    lastConnectionError = null;
    return mongoose2.connection;
  } catch (error) {
    lastConnectionError = error instanceof Error ? error.message : "MongoDB connection failed.";
    nextRetryAt = Date.now() + 3e4;
    await mongoose2.disconnect().catch(() => void 0);
    return null;
  }
}
function getMongoConnectionIssue() {
  return lastConnectionError;
}

// server/services/schoolAccess.ts
import { Types } from "mongoose";
function canAccessSection(role, section) {
  if (!role) return false;
  if (role === "admin") return true;
  if (role === "teacher" && section === "fees") return false;
  if (section === "settings") return false;
  if (role === "student" && (section === "results" || section === "students" || section === "attendance" || section === "exams")) return true;
  if (role === "student") return false;
  if (role === "parent" && (section === "attendance" || section === "results" || section === "students" || section === "fees" || section === "exams")) return true;
  if (role === "parent") return false;
  return true;
}
async function getScopedFilter(identity, section) {
  if (!identity || !identity.linked) return { _id: null };
  if (identity.role === "admin") return {};
  if (identity.role === "student") {
    const student = await Student.findById(identity.profileId).select("classId").lean();
    if (!student) return { _id: null };
    if (section === "attendance" || section === "results" || section === "fees") {
      return { studentId: new Types.ObjectId(identity.profileId) };
    }
    if (section === "exams" || section === "classes") {
      return { classId: student.classId };
    }
    return { _id: new Types.ObjectId(identity.profileId) };
  }
  if (identity.role === "teacher") {
    const teacher = await Teacher.findById(identity.profileId).select("classIds subjectIds").lean();
    if (!teacher) return { _id: null };
    if (section === "results" || section === "exams" || section === "attendance" || section === "students") {
      return { classId: { $in: teacher.classIds || [] } };
    }
    return { _id: new Types.ObjectId(identity.profileId) };
  }
  if (identity.role === "parent") {
    const parent = await Parent.findById(identity.profileId).select("studentIds").lean();
    if (!parent || !parent.studentIds || parent.studentIds.length === 0) return { _id: null };
    return { studentId: { $in: parent.studentIds } };
  }
  return {};
}

// server/services/school.ts
import bcrypt from "bcryptjs";
var dashboardSections = ["students", "teachers", "classes", "attendance", "exams", "results", "fees", "announcements", "calendar", "settings"];
async function getSchoolIdentity(platformUser) {
  const connection = await getMongoConnection();
  if (!connection) return { connection: "unavailable", issue: getMongoConnectionIssue(), linked: false, role: null, displayName: platformUser.name ?? "Signed-in user", profileId: null, schoolUserId: null };
  const schoolUser = await SchoolUser.findOne({ isDeleted: { $ne: true }, isActive: { $ne: false }, $or: [{ oauthOpenId: platformUser.openId }, ...platformUser.email ? [{ email: platformUser.email.toLowerCase() }] : []] }).lean();
  return { connection: "connected", issue: null, linked: Boolean(schoolUser), role: schoolUser?.role ?? null, displayName: schoolUser?.displayName ?? platformUser.name ?? "Signed-in user", profileId: schoolUser?.profileId?.toString() ?? null, schoolUserId: schoolUser?._id?.toString() ?? null };
}
var todayStart = () => {
  const value = /* @__PURE__ */ new Date();
  value.setHours(0, 0, 0, 0);
  return value;
};
var displayCurrency = (value) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
async function getDashboard(platformUser) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") return { identity, metrics: [], upcoming: [], followUps: [] };
  if (!identity.linked) return { identity, metrics: [], upcoming: [], followUps: [] };
  const start = todayStart();
  const studentScope = canAccessSection(identity.role, "students") ? await getScopedFilter(identity, "students") : { _id: null };
  const attendanceScope = canAccessSection(identity.role, "attendance") ? await getScopedFilter(identity, "attendance") : { _id: null };
  const examScope = canAccessSection(identity.role, "exams") ? await getScopedFilter(identity, "exams") : { _id: null };
  const feeScope = canAccessSection(identity.role, "fees") ? await getScopedFilter(identity, "fees") : { _id: null };
  const attemptScope = identity.role === "teacher" || identity.role === "student" ? attendanceScope : identity.role === "admin" ? {} : { _id: null };
  const [students, present, attempts, payments, absent, upcoming] = await Promise.all([
    Student.countDocuments({ isDeleted: false, status: "active", ...studentScope }),
    Attendance.countDocuments({ isDeleted: false, date: { $gte: start }, status: "present", ...attendanceScope }),
    ExamAttempt.countDocuments({ isDeleted: false, isPractice: true, submittedAt: { $gte: start }, ...attemptScope }),
    Payment.aggregate([{ $match: { isDeleted: false, status: "successful", ...feeScope } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Attendance.countDocuments({ isDeleted: false, date: { $gte: start }, status: "absent", ...attendanceScope }),
    Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start }, ...examScope }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean()
  ]);
  const attendanceRate = students > 0 ? `${(present / students * 100).toFixed(1)}%` : "\u2014";
  return {
    identity,
    metrics: [
      { key: "attendance", label: "Student attendance", value: attendanceRate, detail: `${present} present today` },
      { key: "practice", label: "Practice completion", value: String(attempts), detail: "Submitted practice attempts today" },
      { key: "fees", label: "Fees received", value: displayCurrency(Number(payments[0]?.total ?? 0)), detail: "Successful payments recorded" },
      { key: "attention", label: "Needs attention", value: String(absent), detail: "Students absent today" }
    ],
    upcoming: upcoming.map((exam) => ({ id: exam._id.toString(), title: exam.title, type: exam.examType, startsAt: exam.startsAt ?? null })),
    followUps: absent > 0 ? [{ label: "Attendance review", detail: `${absent} student${absent === 1 ? "" : "s"} marked absent today` }] : []
  };
}
var recordDefinitions = {
  students: { columns: ["Student", "Admission no.", "Status", "Created"], model: Student, fields: ["fullName", "admissionNumber", "status", "createdAt"] },
  teachers: { columns: ["Teacher", "Status", "Created"], model: Teacher, fields: ["fullName", "status", "createdAt"] },
  classes: { columns: ["Class", "Code", "Level", "Status"], model: SchoolClass, fields: ["name", "code", "gradeLevel", "status"] },
  attendance: { columns: ["Student", "Date", "Status", "Period"], model: Attendance, fields: ["studentId", "date", "status", "periodKey"] },
  exams: { columns: ["Assessment", "Type", "Status", "Starts"], model: Exam, fields: ["title", "examType", "status", "startsAt"] },
  results: { columns: ["Student", "Score", "Grade", "Status"], model: Result, fields: ["studentId", "percentage", "grade", "status"] },
  fees: { columns: ["Fee", "Amount", "Due date", "Status"], model: Fee, fields: ["name", "totalAmount", "dueDate", "status"] },
  announcements: { columns: ["Announcement", "Priority", "Published", "Status"], model: Announcement, fields: ["title", "priority", "publishAt", "isPublished"] },
  calendar: { columns: ["Assessment", "Type", "Starts", "Status"], model: Exam, fields: ["title", "examType", "startsAt", "status"] },
  settings: { columns: ["Academic session", "Starts", "Ends", "Status"], model: AcademicSession, fields: ["name", "startDate", "endDate", "status"] }
};
function cell(value) {
  if (value === null || value === void 0 || value === "") return "\u2014";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "boolean") return value ? "Published" : "Draft";
  if (typeof value === "number") return String(value);
  return String(value);
}
async function getRecords(platformUser, section, query) {
  const identity = await getSchoolIdentity(platformUser);
  const definition = recordDefinitions[section];
  if (identity.connection !== "connected") return { identity, columns: definition.columns, records: [], total: 0 };
  const scope = await getScopedFilter(identity, section);
  const textFilter = query ? { $or: [{ name: { $regex: query, $options: "i" } }, { title: { $regex: query, $options: "i" } }, { fullName: { $regex: query, $options: "i" } }, { admissionNumber: { $regex: query, $options: "i" } }, { code: { $regex: query, $options: "i" } }] } : {};
  const filter = { $and: [{ isDeleted: false }, scope, textFilter] };
  const [records, total] = await Promise.all([definition.model.find(filter).sort({ createdAt: -1 }).limit(50).lean(), definition.model.countDocuments(filter)]);
  return { identity, columns: definition.columns, records: records.map((record) => ({ id: record._id, cells: definition.fields.map((field) => cell(record[field])) })), total };
}
async function createRecord(platformUser, section, payload) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") throw new Error("Database not connected");
  const role = identity.role?.toLowerCase() || "";
  if (role !== "admin" && role !== "administrator" && role !== "teacher") throw new Error("Unauthorized");
  const definition = recordDefinitions[section];
  const model = definition.model;
  if (section === "students" || section === "teachers") {
    let email = payload.email || payload.fullName.toLowerCase().replace(/\s+/g, ".") + "@dorvas.edu.ng";
    let exists = await SchoolUser.findOne({ email });
    let counter = 1;
    while (exists) {
      email = payload.fullName.toLowerCase().replace(/\s+/g, ".") + counter + "@dorvas.edu.ng";
      exists = await SchoolUser.findOne({ email });
      counter++;
    }
    const hashedPassword = await bcrypt.hash(payload.password || "Password123!", 10);
    const recordPayload = { ...payload };
    delete recordPayload.password;
    recordPayload.name = recordPayload.fullName;
    const doc2 = await model.create({
      ...recordPayload,
      isDeleted: false,
      schoolId: identity.profileId || "default-school"
    });
    await SchoolUser.create({
      email,
      password: hashedPassword,
      displayName: payload.fullName,
      role: section === "students" ? "student" : "teacher",
      profileType: section === "students" ? "Student" : "Teacher",
      profileId: doc2._id,
      isActive: true,
      isDeleted: false
    });
    return { success: true, id: doc2._id, email };
  }
  const doc = await model.create({
    ...payload,
    isDeleted: false,
    schoolId: identity.profileId || "default-school"
  });
  return { success: true, id: doc._id };
}

// server/services/studentProfile.ts
async function getStudentProfile(platformUser, studentId) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") throw new Error("Database not connected");
  const role = identity.role?.toLowerCase() || "";
  if (!["admin", "administrator", "teacher", "parent", "student"].includes(role)) {
    throw new Error("Unauthorized");
  }
  const student = await Student.findOne({ _id: studentId, isDeleted: { $ne: true } }).lean();
  if (!student) throw new Error("Student not found");
  if (role === "student") {
    if (identity.profileId !== studentId) throw new Error("Forbidden: You can only view your own profile");
  } else if (role === "parent") {
  } else if (role === "teacher") {
  }
  const attendances = await Attendance.find({ studentId, isDeleted: { $ne: true } }).lean();
  const attendanceStats = {
    present: 0,
    late: 0,
    authorizedAbsent: 0,
    unauthorizedAbsent: 0,
    totalPercentage: 0
  };
  attendances.forEach((a) => {
    const s = a.status?.toLowerCase();
    if (s === "present") attendanceStats.present++;
    else if (s === "late") attendanceStats.late++;
    else if (s === "excused" || s === "authorized") attendanceStats.authorizedAbsent++;
    else if (s === "absent" || s === "unauthorized") attendanceStats.unauthorizedAbsent++;
  });
  const total = attendances.length;
  if (total > 0) {
    attendanceStats.totalPercentage = Math.round((attendanceStats.present + attendanceStats.late) / total * 100);
  }
  const auditLogs = await AuditLog.find({ targetId: studentId }).sort({ createdAt: -1 }).limit(20).lean();
  return {
    student,
    attendanceStats,
    auditLogs,
    identityRole: role
  };
}
async function logAdminAction(userId, targetId, action, details = "") {
  await AuditLog.create({
    userId,
    targetId,
    action,
    details
  });
}
async function updateStudentProfile(platformUser, studentId, updates) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") throw new Error("Database not connected");
  const role = identity.role?.toLowerCase() || "";
  if (role !== "admin" && role !== "administrator") throw new Error("Unauthorized: Only admins can edit profiles");
  const student = await Student.findByIdAndUpdate(studentId, { $set: updates }, { new: true });
  if (updates.email) {
    await SchoolUser.updateMany({ profileId: studentId }, { $set: { email: updates.email.toLowerCase() } });
  }
  if (identity.schoolUserId) {
    await logAdminAction(identity.schoolUserId, studentId, "Updated Profile", JSON.stringify(updates));
  }
  return student;
}
async function toggleStudentStatus(platformUser, studentId, newStatus) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.role?.toLowerCase() !== "admin" && identity.role?.toLowerCase() !== "administrator") throw new Error("Unauthorized");
  const student = await Student.findByIdAndUpdate(studentId, { enrollmentStatus: newStatus }, { new: true });
  if (identity.schoolUserId) {
    await logAdminAction(identity.schoolUserId, studentId, "Changed Status", `Status changed to ${newStatus}`);
  }
  return student;
}
async function deleteStudent(platformUser, studentId) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.role?.toLowerCase() !== "admin" && identity.role?.toLowerCase() !== "administrator") throw new Error("Unauthorized");
  await Student.findByIdAndUpdate(studentId, { isDeleted: true });
  await SchoolUser.updateMany({ profileId: studentId }, { isDeleted: true, isActive: false });
  if (identity.schoolUserId) {
    await logAdminAction(identity.schoolUserId, studentId, "Deleted Student", "Soft deleted student record");
  }
  return { success: true };
}

// server/routers/school.ts
import { z } from "zod";
var schoolRouter = router({
  dashboard: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);
    const user = ctx.user;
    return await getDashboard({ openId: user.id || user.openId || user.email, email: user.email, name: user.name });
  }),
  records: publicProcedure.input(z.object({ section: z.enum(dashboardSections), query: z.string().optional().default("") })).query(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);
    const user = ctx.user;
    return await getRecords({ openId: user.id || user.openId || user.email, email: user.email, name: user.name }, input.section, input.query);
  }),
  getStudentProfile: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error("Auth failed");
    return await getStudentProfile(ctx.user, input.id);
  }),
  updateStudentProfile: publicProcedure.input(z.object({ id: z.string(), updates: z.any() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error("Auth failed");
    return await updateStudentProfile(ctx.user, input.id, input.updates);
  }),
  toggleStudentStatus: publicProcedure.input(z.object({ id: z.string(), status: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error("Auth failed");
    return await toggleStudentStatus(ctx.user, input.id, input.status);
  }),
  deleteStudent: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error("Auth failed");
    return await deleteStudent(ctx.user, input.id);
  }),
  createRecord: publicProcedure.input(z.object({ section: z.enum(dashboardSections), payload: z.any() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error(`Auth failed! Cookies: ${JSON.stringify(ctx.req?.cookies)}, AuthHeader: ${ctx.req?.headers?.authorization}`);
    const user = ctx.user;
    return await createRecord({ openId: user.id || user.openId || user.email, email: user.email, name: user.name }, input.section, input.payload);
  })
});

// server/routers/auth.ts
import { z as z2 } from "zod";
import bcrypt2 from "bcryptjs";
import jwt from "jsonwebtoken";
var JWT_SECRET2 = process.env.JWT_SECRET || "default_unsafe_secret";
var authRouter = router({
  login: publicProcedure.input(z2.object({
    email: z2.string().email(),
    password: z2.string().min(6)
  })).mutation(async ({ input, ctx }) => {
    let user = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: { $ne: true }, isActive: { $ne: false } });
    if (!user && input.email.toLowerCase() === "adielasam2015@gmail.com") {
      const hash = await bcrypt2.hash(input.password, 10);
      user = await SchoolUser.create({
        email: "adielasam2015@gmail.com",
        displayName: "Super Admin",
        role: "admin",
        password: hash,
        isActive: true,
        isDeleted: false
      });
    }
    if (!user) {
      throw new Error("Invalid email or password");
    }
    let isValid = false;
    if (!user.password) {
      if (input.password === "Admin123!") {
        isValid = true;
        user.password = await bcrypt2.hash("Admin123!", 10);
        await user.save();
      }
    } else {
      isValid = await bcrypt2.compare(input.password, user.password);
    }
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.displayName },
      JWT_SECRET2,
      { expiresIn: "7d" }
    );
    if (ctx.res) {
      ctx.res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
    }
    return { success: true, role: user.role, token };
  }),
  impersonate: publicProcedure.input(z2.object({ email: z2.string().email() })).mutation(async ({ input, ctx }) => {
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new Error("Only admins can impersonate users.");
    }
    const targetUser = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: { $ne: true }, isActive: { $ne: false } });
    if (!targetUser) throw new Error("User not found");
    const token = jwt.sign(
      { id: targetUser._id, email: targetUser.email, role: targetUser.role, name: targetUser.displayName },
      JWT_SECRET2,
      { expiresIn: "7d" }
    );
    if (ctx.res) {
      ctx.res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
    }
    return { success: true, role: targetUser.role, token };
  }),
  logout: publicProcedure.mutation(({ ctx }) => {
    if (ctx.res) {
      ctx.res.cookie("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: /* @__PURE__ */ new Date(0)
      });
    }
    return { success: true };
  }),
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user || null;
  })
});

// server/routers/users.ts
import { z as z3 } from "zod";
import bcrypt3 from "bcryptjs";
var usersRouter = router({
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");
    const users = await SchoolUser.find({ isDeleted: false }).lean();
    return users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      isActive: u.isActive
    }));
  }),
  createUser: protectedProcedure.input(z3.object({
    email: z3.string().email(),
    displayName: z3.string(),
    role: z3.enum(["admin", "teacher", "student", "parent"]),
    password: z3.string().min(6)
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");
    const existingUser = await SchoolUser.findOne({ email: input.email.toLowerCase() });
    if (existingUser && !existingUser.isDeleted) throw new Error("Email already in use");
    const hashedPassword = await bcrypt3.hash(input.password, 10);
    let profileId = null;
    if (input.role === "student") {
      const student = await Student.create({ name: input.displayName });
      profileId = student._id;
    } else if (input.role === "teacher") {
      const teacher = await Teacher.create({ name: input.displayName });
      profileId = teacher._id;
    } else if (input.role === "parent") {
      const parent = await Parent.create({ name: input.displayName });
      profileId = parent._id;
    }
    const newUser = await SchoolUser.create({
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      role: input.role,
      password: hashedPassword,
      profileType: input.role === "admin" ? null : input.role,
      profileId,
      isActive: true,
      isDeleted: false
    });
    return { success: true, id: newUser._id.toString() };
  }),
  deleteUser: protectedProcedure.input(z3.object({ id: z3.string() })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");
    const userToDelete = await SchoolUser.findById(input.id);
    if (!userToDelete) throw new Error("User not found");
    if (userToDelete.role === "admin" && ctx.user.email !== "adielasam2015@gmail.com") {
      throw new Error("Only the super admin can remove other admins");
    }
    if (userToDelete.email === "adielasam2015@gmail.com") {
      throw new Error("Cannot delete super admin");
    }
    userToDelete.isDeleted = true;
    userToDelete.isActive = false;
    await userToDelete.save();
    return { success: true };
  })
});

// server/routers/studentPortal.ts
import { z as z4 } from "zod";
var studentPortalRouter = router({
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const student = await Student.findOne({ _id: ctx.user.profileId, isDeleted: { $ne: true } });
    if (!student) throw new Error("Student profile not found");
    const activeExams = await CBTExam.find({
      isPublished: true,
      isDeleted: { $ne: true },
      $or: [
        { targetClass: student.className },
        { targetClass: "All" }
      ]
    }).lean();
    const recentNotes = await ClassNote.find({
      isDeleted: { $ne: true },
      $or: [
        { targetClass: student.className },
        { targetClass: "All" }
      ]
    }).sort({ _id: -1 }).limit(5).lean();
    const attempts = await CBTAttempt.find({ studentId: student._id }).lean();
    const exams = activeExams.map((exam) => {
      const attempt = attempts.find((a) => a.examId.toString() === exam._id.toString());
      return {
        ...exam,
        hasAttempted: !!attempt,
        score: attempt ? attempt.score : null,
        totalMarks: attempt ? attempt.totalMarks : null
      };
    });
    return {
      student,
      exams,
      recentNotes
    };
  }),
  startExam: protectedProcedure.input(z4.object({ examId: z4.string() })).mutation(async ({ ctx, input }) => {
    const student = await Student.findOne({ _id: ctx.user.profileId, isDeleted: { $ne: true } });
    if (!student) throw new Error("Student profile not found");
    const exam = await CBTExam.findOne({ _id: input.examId, isDeleted: { $ne: true } });
    if (!exam) throw new Error("Exam not found");
    let attempt = await CBTAttempt.findOne({ examId: exam._id, studentId: student._id });
    if (attempt && attempt.status === "completed" && exam.examType === "Teacher Assessment") {
      throw new Error("You have already completed this assessment. Retakes are not allowed.");
    }
    if (attempt && attempt.status === "completed") {
      await CBTAttempt.deleteOne({ _id: attempt._id });
      attempt = null;
    }
    if (!attempt) {
      attempt = await CBTAttempt.create({
        examId: exam._id,
        studentId: student._id,
        status: "in-progress"
      });
    }
    const questions = await CBTQuestion.find({ examId: exam._id, isDeleted: { $ne: true } }).lean();
    const safeQuestions = questions.map((q) => ({
      id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks
    }));
    return {
      attemptId: attempt._id,
      exam,
      questions: safeQuestions
    };
  }),
  submitExam: protectedProcedure.input(z4.object({
    attemptId: z4.string(),
    answers: z4.array(z4.object({
      questionId: z4.string(),
      selectedOptionIndex: z4.number().nullable()
    }))
  })).mutation(async ({ ctx, input }) => {
    const attempt = await CBTAttempt.findOne({ _id: input.attemptId, studentId: ctx.user.profileId });
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.status === "completed") throw new Error("Exam already submitted");
    const questions = await CBTQuestion.find({ examId: attempt.examId }).lean();
    let score = 0;
    let totalMarks = 0;
    for (const q of questions) {
      totalMarks += q.marks || 1;
      const submittedAnswer = input.answers.find((a) => a.questionId === q._id.toString());
      if (submittedAnswer && submittedAnswer.selectedOptionIndex === q.correctOptionIndex) {
        score += q.marks || 1;
      }
    }
    attempt.score = score;
    attempt.totalMarks = totalMarks;
    attempt.status = "completed";
    attempt.completedAt = /* @__PURE__ */ new Date();
    attempt.answers = input.answers;
    await attempt.save();
    return { score, totalMarks };
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: authRouter,
  school: schoolRouter,
  users: usersRouter,
  studentPortal: studentPortalRouter
});

// server/vercel.ts
import mongoose3 from "mongoose";
var app = express();
app.use(express.json());
app.use(cookieParser());
var isConnected = false;
var connectDB = async () => {
  if (isConnected || mongoose3.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set!");
    return;
  }
  try {
    await mongoose3.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};
var JWT_SECRET3 = process.env.JWT_SECRET || "default_unsafe_secret";
app.use(
  "/api/trpc",
  async (req, res, next) => {
    await connectDB();
    next();
  },
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      let user = null;
      const authHeader = req.headers.authorization;
      const token = (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null) || req.cookies?.auth_token;
      if (token) {
        try {
          user = jwt2.verify(token, JWT_SECRET3);
        } catch (e) {
        }
      }
      return { req, res, user };
    }
  })
);
var vercel_default = app;
export {
  vercel_default as default
};
