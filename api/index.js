var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/models/school.ts
var school_exports = {};
__export(school_exports, {
  AcademicSession: () => AcademicSession,
  Admission: () => Admission,
  Announcement: () => Announcement,
  Assignment: () => Assignment,
  Attendance: () => Attendance,
  AuditLog: () => AuditLog,
  CBTAttempt: () => CBTAttempt,
  CBTExam: () => CBTExam,
  CBTQuestion: () => CBTQuestion,
  ClassNote: () => ClassNote,
  ClassSubject: () => ClassSubject,
  Document: () => Document,
  Exam: () => Exam,
  ExamAnswer: () => ExamAnswer,
  ExamAttempt: () => ExamAttempt,
  Fee: () => Fee,
  Homework: () => Homework,
  Message: () => Message,
  Notification: () => Notification,
  Parent: () => Parent,
  Payment: () => Payment,
  Question: () => Question,
  ReportCard: () => ReportCard,
  Result: () => Result,
  Role: () => Role,
  SchoolClass: () => SchoolClass,
  SchoolUser: () => SchoolUser,
  Student: () => Student,
  Subject: () => Subject,
  Teacher: () => Teacher,
  Term: () => Term,
  Timetable: () => Timetable
});
import mongoose from "mongoose";
var baseOptions, roleSchema, Role, schoolUserSchema, SchoolUser, studentSchema, Student, teacherSchema, Teacher, parentSchema, Parent, schoolClassSchema, SchoolClass, subjectSchema, Subject, classSubjectSchema, ClassSubject, academicSessionSchema, AcademicSession, termSchema, Term, attendanceSchema, Attendance, examSchema, Exam, questionSchema, Question, examAttemptSchema, ExamAttempt, examAnswerSchema, ExamAnswer, resultSchema, Result, reportCardSchema, ReportCard, feeSchema, Fee, paymentSchema, Payment, announcementSchema, Announcement, messageSchema, Message, notificationSchema, Notification, documentSchema, Document, auditLogSchema, AuditLog, homeworkSchema, Homework, assignmentSchema, Assignment, timetableSchema, Timetable, admissionSchema, Admission, cbtExamSchema, CBTExam, cbtQuestionSchema, CBTQuestion, cbtAttemptSchema, CBTAttempt, classNoteSchema, ClassNote;
var init_school = __esm({
  "server/models/school.ts"() {
    "use strict";
    baseOptions = { timestamps: true };
    roleSchema = new mongoose.Schema({ name: String }, baseOptions);
    Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
    schoolUserSchema = new mongoose.Schema({
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
    SchoolUser = mongoose.models.SchoolUser || mongoose.model("SchoolUser", schoolUserSchema);
    studentSchema = new mongoose.Schema({
      name: String,
      fullName: String,
      admissionNumber: String,
      status: String,
      state: String,
      address: String,
      dob: Date,
      classId: mongoose.Schema.Types.ObjectId,
      className: String,
      profilePicture: String,
      email: String,
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
    teacherSchema = new mongoose.Schema({
      name: String,
      fullName: String,
      status: String,
      address: String,
      email: String,
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
    parentSchema = new mongoose.Schema({ name: String, children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }] }, baseOptions);
    Parent = mongoose.models.Parent || mongoose.model("Parent", parentSchema);
    schoolClassSchema = new mongoose.Schema({ name: String }, baseOptions);
    SchoolClass = mongoose.models.SchoolClass || mongoose.model("SchoolClass", schoolClassSchema);
    subjectSchema = new mongoose.Schema({ name: String }, baseOptions);
    Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
    classSubjectSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, subjectId: mongoose.Schema.Types.ObjectId, teacherId: mongoose.Schema.Types.ObjectId }, baseOptions);
    ClassSubject = mongoose.models.ClassSubject || mongoose.model("ClassSubject", classSubjectSchema);
    academicSessionSchema = new mongoose.Schema({ name: String }, baseOptions);
    AcademicSession = mongoose.models.AcademicSession || mongoose.model("AcademicSession", academicSessionSchema);
    termSchema = new mongoose.Schema({ name: String }, baseOptions);
    Term = mongoose.models.Term || mongoose.model("Term", termSchema);
    attendanceSchema = new mongoose.Schema({
      studentId: mongoose.Schema.Types.ObjectId,
      date: Date,
      periodKey: String,
      status: String,
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    attendanceSchema.index({ studentId: 1, date: 1, periodKey: 1 }, { unique: true });
    Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
    examSchema = new mongoose.Schema({ name: String, classId: mongoose.Schema.Types.ObjectId, subjectId: mongoose.Schema.Types.ObjectId, isDeleted: { type: Boolean, default: false } }, baseOptions);
    Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
    questionSchema = new mongoose.Schema({ examId: mongoose.Schema.Types.ObjectId, text: String }, baseOptions);
    Question = mongoose.models.Question || mongoose.model("Question", questionSchema);
    examAttemptSchema = new mongoose.Schema({
      examId: mongoose.Schema.Types.ObjectId,
      studentId: mongoose.Schema.Types.ObjectId,
      attemptNumber: Number
    }, baseOptions);
    examAttemptSchema.index({ examId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
    ExamAttempt = mongoose.models.ExamAttempt || mongoose.model("ExamAttempt", examAttemptSchema);
    examAnswerSchema = new mongoose.Schema({ attemptId: mongoose.Schema.Types.ObjectId }, baseOptions);
    ExamAnswer = mongoose.models.ExamAnswer || mongoose.model("ExamAnswer", examAnswerSchema);
    resultSchema = new mongoose.Schema({
      studentId: mongoose.Schema.Types.ObjectId,
      examId: mongoose.Schema.Types.ObjectId,
      score: Number,
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });
    Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
    reportCardSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId }, baseOptions);
    ReportCard = mongoose.models.ReportCard || mongoose.model("ReportCard", reportCardSchema);
    feeSchema = new mongoose.Schema({ studentId: mongoose.Schema.Types.ObjectId, amount: Number }, baseOptions);
    Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
    paymentSchema = new mongoose.Schema({
      studentId: mongoose.Schema.Types.ObjectId,
      amount: Number,
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
    announcementSchema = new mongoose.Schema({ title: String, content: String }, baseOptions);
    Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
    messageSchema = new mongoose.Schema({ fromId: mongoose.Schema.Types.ObjectId, toId: mongoose.Schema.Types.ObjectId, body: String }, baseOptions);
    Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
    notificationSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, message: String }, baseOptions);
    Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
    documentSchema = new mongoose.Schema({ url: String }, baseOptions);
    Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
    auditLogSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, targetId: mongoose.Schema.Types.ObjectId, action: String, details: String }, baseOptions);
    AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
    homeworkSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, title: String }, baseOptions);
    Homework = mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);
    assignmentSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId, title: String }, baseOptions);
    Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
    timetableSchema = new mongoose.Schema({ classId: mongoose.Schema.Types.ObjectId }, baseOptions);
    Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
    admissionSchema = new mongoose.Schema({ studentName: String }, baseOptions);
    Admission = mongoose.models.Admission || mongoose.model("Admission", admissionSchema);
    cbtExamSchema = new mongoose.Schema({
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
    CBTExam = mongoose.models.CBTExam || mongoose.model("CBTExam", cbtExamSchema);
    cbtQuestionSchema = new mongoose.Schema({
      examId: { type: mongoose.Schema.Types.ObjectId, ref: "CBTExam", required: true },
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctOptionIndex: { type: Number, required: true },
      marks: { type: Number, default: 1 },
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    CBTQuestion = mongoose.models.CBTQuestion || mongoose.model("CBTQuestion", cbtQuestionSchema);
    cbtAttemptSchema = new mongoose.Schema({
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
    CBTAttempt = mongoose.models.CBTAttempt || mongoose.model("CBTAttempt", cbtAttemptSchema);
    classNoteSchema = new mongoose.Schema({
      title: { type: String, required: true },
      content: { type: String, required: true },
      subject: String,
      targetClass: String,
      teacherId: mongoose.Schema.Types.ObjectId,
      teacherName: String,
      isDeleted: { type: Boolean, default: false }
    }, baseOptions);
    ClassNote = mongoose.models.ClassNote || mongoose.model("ClassNote", classNoteSchema);
  }
});

// server/services/schoolAccess.ts
var schoolAccess_exports = {};
__export(schoolAccess_exports, {
  canAccessSection: () => canAccessSection,
  getScopedFilter: () => getScopedFilter
});
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
var init_schoolAccess = __esm({
  "server/services/schoolAccess.ts"() {
    "use strict";
    init_school();
  }
});

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

// server/services/studentProfile.ts
init_school();

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

// server/services/school.ts
init_school();
init_schoolAccess();
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
async function getDashboard(platformUser) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") return { identity, metrics: [], upcoming: [], followUps: [], charts: null };
  if (!identity.linked) return { identity, metrics: [], upcoming: [], followUps: [], charts: null };
  const start = todayStart();
  await Promise.all([
    Student.updateMany({ status: { $exists: false } }, { $set: { status: "active" } }),
    Teacher.updateMany({ status: { $exists: false } }, { $set: { status: "active" } }),
    SchoolClass.updateMany({ status: { $exists: false } }, { $set: { status: "active" } })
  ]);
  const [totalStudents, activeStudents, maleStudents, femaleStudents, totalTeachers, totalClasses, upcoming] = await Promise.all([
    Student.countDocuments({ isDeleted: false }),
    Student.countDocuments({ isDeleted: false, status: "active" }),
    Student.countDocuments({ isDeleted: false, status: "active", gender: "Male" }),
    Student.countDocuments({ isDeleted: false, status: "active", gender: "Female" }),
    Teacher.countDocuments({ isDeleted: false, status: "active" }),
    SchoolClass.countDocuments({ isDeleted: false, status: "active" }),
    Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start } }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean()
  ]);
  const classDistribution = await Student.aggregate([
    { $match: { isDeleted: false, status: "active" } },
    { $group: { _id: "$className", count: { $sum: 1 } } }
  ]);
  const chartData = classDistribution.map((d) => ({ name: d._id || "Unassigned", value: d.count }));
  const populationData = [
    { name: "Students", value: activeStudents },
    { name: "Teachers", value: totalTeachers },
    { name: "Male Students", value: maleStudents },
    { name: "Female Students", value: femaleStudents }
  ];
  return {
    identity,
    metrics: [
      { key: "students", label: "Active Students", value: String(activeStudents), detail: `Out of ${totalStudents} total enrolled` },
      { key: "classes", label: "Total Classes", value: String(totalClasses), detail: "Active grade levels and streams" },
      { key: "teachers", label: "Total Teachers", value: String(totalTeachers), detail: "Registered academic staff" }
    ],
    upcoming: upcoming.map((exam) => ({ id: exam._id.toString(), title: exam.title, type: exam.examType, startsAt: exam.startsAt ?? null })),
    followUps: [],
    charts: { classDistribution: chartData, population: populationData }
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
    const recordPayload = { ...payload, status: payload.status || "active" };
    delete recordPayload.password;
    recordPayload.name = recordPayload.fullName;
    const doc2 = await model.create({
      status: payload.status || "active",
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
    status: payload.status || "active",
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
  getTeacherProfile: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const { Teacher: Teacher2 } = (init_school(), __toCommonJS(school_exports));
    const teacher = await Teacher2.findById(input.id).lean();
    if (!teacher) throw new Error("Teacher not found");
    return { teacher };
  }),
  getStudentProfile: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error("Auth failed");
    return await getStudentProfile(ctx.user, input.id);
  }),
  updateProfilePicture: publicProcedure.input(z.object({ id: z.string().optional(), base64Image: z.string(), type: z.string().optional() })).mutation(async ({ ctx, input }) => {
    if (!ctx.user) throw new Error("Auth failed");
    const { SchoolUser: SchoolUser2, Student: Student2, Teacher: Teacher2 } = (init_school(), __toCommonJS(school_exports));
    let targetProfileId = null;
    let targetType = null;
    if (input.id) {
      const identity = await (init_schoolAccess(), __toCommonJS(schoolAccess_exports)).getSchoolIdentity(ctx.user);
      if (identity.role !== "admin" && identity.role !== "administrator") {
        throw new Error("Unauthorized to edit other profiles");
      }
      targetProfileId = input.id;
      targetType = input.type || "Student";
    } else {
      const schoolUser = await SchoolUser2.findOne({ email: ctx.user.email });
      if (!schoolUser) throw new Error("User not found");
      targetProfileId = schoolUser.profileId;
      targetType = schoolUser.profileType;
      schoolUser.profilePicture = input.base64Image;
      await schoolUser.save();
    }
    if (targetType === "Student" || targetType === "student") {
      await Student2.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
    } else if (targetType === "Teacher" || targetType === "teacher") {
      await Teacher2.findByIdAndUpdate(targetProfileId, { profilePicture: input.base64Image });
    } else if (targetType === "Admin" || targetType === "admin") {
    }
    return { success: true };
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
init_school();
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
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const { SchoolUser: SchoolUser2 } = (init_school(), __toCommonJS(school_exports));
    const user = await SchoolUser2.findById(ctx.user.id).lean();
    if (user) {
      return { ...ctx.user, profilePicture: user.profilePicture };
    }
    return ctx.user;
  })
});

// server/routers/users.ts
import { z as z3 } from "zod";
init_school();
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
init_school();
var studentPortalRouter = router({
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const { SchoolUser: SchoolUser2 } = (init_school(), __toCommonJS(school_exports));
    const schoolUser = await SchoolUser2.findOne({ _id: ctx.user.id });
    const student = schoolUser && schoolUser.profileId ? await Student.findOne({ _id: schoolUser.profileId, isDeleted: { $ne: true } }) : null;
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
    const { SchoolUser: SchoolUser2 } = (init_school(), __toCommonJS(school_exports));
    const schoolUser = await SchoolUser2.findOne({ _id: ctx.user.id });
    const student = schoolUser && schoolUser.profileId ? await Student.findOne({ _id: schoolUser.profileId, isDeleted: { $ne: true } }) : null;
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
  seedDemoData: protectedProcedure.mutation(async () => {
    const existing = await CBTExam.findOne({ title: "JAMB Mathematics Mock 2026" });
    if (existing) return { success: true, message: "Demo data already exists" };
    const exam = await CBTExam.create({
      title: "JAMB Mathematics Mock 2026",
      description: "Prepare for your UTME with this standard mock exam.",
      examType: "JAMB Practice",
      subject: "Mathematics",
      targetClass: "All",
      durationMinutes: 1,
      // 1 min for quick testing
      isPublished: true
    });
    await CBTQuestion.create([
      { examId: exam._id, questionText: "If 2x + 3 = 11, what is the value of x?", options: ["2", "3", "4", "5"], correctOptionIndex: 2, marks: 1 },
      { examId: exam._id, questionText: "What is the derivative of x^2 with respect to x?", options: ["x", "2x", "2", "x^2"], correctOptionIndex: 1, marks: 1 },
      { examId: exam._id, questionText: "Simplify: (3^2) * (3^3)", options: ["3^5", "3^6", "9^5", "9^6"], correctOptionIndex: 0, marks: 1 }
    ]);
    const exam2 = await CBTExam.create({
      title: "Mid-Term Physics Assessment",
      description: "Official mid-term assessment. Ensure you are ready before starting.",
      examType: "Teacher Assessment",
      subject: "Physics",
      targetClass: "All",
      durationMinutes: 30,
      isPublished: true
    });
    await CBTQuestion.create([
      { examId: exam2._id, questionText: "What is the SI unit of Force?", options: ["Joule", "Newton", "Watt", "Pascal"], correctOptionIndex: 1, marks: 5 }
    ]);
    await ClassNote.create({
      title: "Introduction to Quantum Mechanics",
      content: "Please read Chapter 4 of your textbook.\n\nKey Concepts:\n- Wave-particle duality\n- Heisenberg's Uncertainty Principle\n- Schr\xF6dinger equation\n\nBe prepared for a quiz on Friday.",
      subject: "Physics",
      targetClass: "All",
      teacherName: "Dr. Adebayo"
    });
    return { success: true };
  }),
  submitExam: protectedProcedure.input(z4.object({
    attemptId: z4.string(),
    answers: z4.array(z4.object({
      questionId: z4.string(),
      selectedOptionIndex: z4.number().nullable()
    }))
  })).mutation(async ({ ctx, input }) => {
    const { SchoolUser: SchoolUser2 } = (init_school(), __toCommonJS(school_exports));
    const schoolUser = await SchoolUser2.findOne({ _id: ctx.user.id });
    const attempt = schoolUser && schoolUser.profileId ? await CBTAttempt.findOne({ _id: input.attemptId, studentId: schoolUser.profileId }) : null;
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
app.use(express.json({ limit: "10mb" }));
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
