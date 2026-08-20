"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/vercel.ts
var vercel_exports = {};
__export(vercel_exports, {
  default: () => vercel_default
});
module.exports = __toCommonJS(vercel_exports);
var import_express = __toESM(require("express"), 1);
var trpcExpress = __toESM(require("@trpc/server/adapters/express"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);

// server/_core/trpc.ts
var import_server = require("@trpc/server");
var import_superjson = __toESM(require("superjson"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret";
var t = import_server.initTRPC.context().create({ transformer: import_superjson.default });
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

// server/routers/school.ts
var import_zod = require("zod");

// server/mongo.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var nextRetryAt = 0;
var lastConnectionError = null;
async function getMongoConnection() {
  if (import_mongoose.default.connection.readyState === 1) return import_mongoose.default.connection;
  if (Date.now() < nextRetryAt) return null;
  const uri = process.env.MONGODB_URI;
  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    lastConnectionError = "MONGODB_URI is missing or is not a MongoDB connection URI.";
    return null;
  }
  try {
    await import_mongoose.default.connect(uri, {
      connectTimeoutMS: 8e3,
      serverSelectionTimeoutMS: 8e3,
      maxPoolSize: 10
    });
    lastConnectionError = null;
    return import_mongoose.default.connection;
  } catch (error) {
    lastConnectionError = error instanceof Error ? error.message : "MongoDB connection failed.";
    nextRetryAt = Date.now() + 3e4;
    await import_mongoose.default.disconnect().catch(() => void 0);
    return null;
  }
}
function getMongoConnectionIssue() {
  return lastConnectionError;
}

// server/models/school.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var baseOptions = { timestamps: true };
var roleSchema = new import_mongoose2.default.Schema({ name: String }, baseOptions);
var Role = import_mongoose2.default.models.Role || import_mongoose2.default.model("Role", roleSchema);
var schoolUserSchema = new import_mongoose2.default.Schema({
  email: String,
  oauthOpenId: String,
  password: { type: String },
  displayName: String,
  role: String,
  profileType: String,
  profileId: import_mongoose2.default.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true }
}, baseOptions);
var SchoolUser = import_mongoose2.default.models.SchoolUser || import_mongoose2.default.model("SchoolUser", schoolUserSchema);
var studentSchema = new import_mongoose2.default.Schema({ name: String, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Student = import_mongoose2.default.models.Student || import_mongoose2.default.model("Student", studentSchema);
var teacherSchema = new import_mongoose2.default.Schema({ name: String, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Teacher = import_mongoose2.default.models.Teacher || import_mongoose2.default.model("Teacher", teacherSchema);
var parentSchema = new import_mongoose2.default.Schema({ name: String, children: [{ type: import_mongoose2.default.Schema.Types.ObjectId, ref: "Student" }] }, baseOptions);
var Parent = import_mongoose2.default.models.Parent || import_mongoose2.default.model("Parent", parentSchema);
var schoolClassSchema = new import_mongoose2.default.Schema({ name: String }, baseOptions);
var SchoolClass = import_mongoose2.default.models.SchoolClass || import_mongoose2.default.model("SchoolClass", schoolClassSchema);
var subjectSchema = new import_mongoose2.default.Schema({ name: String }, baseOptions);
var Subject = import_mongoose2.default.models.Subject || import_mongoose2.default.model("Subject", subjectSchema);
var classSubjectSchema = new import_mongoose2.default.Schema({ classId: import_mongoose2.default.Schema.Types.ObjectId, subjectId: import_mongoose2.default.Schema.Types.ObjectId, teacherId: import_mongoose2.default.Schema.Types.ObjectId }, baseOptions);
var ClassSubject = import_mongoose2.default.models.ClassSubject || import_mongoose2.default.model("ClassSubject", classSubjectSchema);
var academicSessionSchema = new import_mongoose2.default.Schema({ name: String }, baseOptions);
var AcademicSession = import_mongoose2.default.models.AcademicSession || import_mongoose2.default.model("AcademicSession", academicSessionSchema);
var termSchema = new import_mongoose2.default.Schema({ name: String }, baseOptions);
var Term = import_mongoose2.default.models.Term || import_mongoose2.default.model("Term", termSchema);
var attendanceSchema = new import_mongoose2.default.Schema({
  studentId: import_mongoose2.default.Schema.Types.ObjectId,
  date: Date,
  periodKey: String,
  status: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
attendanceSchema.index({ studentId: 1, date: 1, periodKey: 1 }, { unique: true });
var Attendance = import_mongoose2.default.models.Attendance || import_mongoose2.default.model("Attendance", attendanceSchema);
var examSchema = new import_mongoose2.default.Schema({ name: String, classId: import_mongoose2.default.Schema.Types.ObjectId, subjectId: import_mongoose2.default.Schema.Types.ObjectId, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Exam = import_mongoose2.default.models.Exam || import_mongoose2.default.model("Exam", examSchema);
var questionSchema = new import_mongoose2.default.Schema({ examId: import_mongoose2.default.Schema.Types.ObjectId, text: String }, baseOptions);
var Question = import_mongoose2.default.models.Question || import_mongoose2.default.model("Question", questionSchema);
var examAttemptSchema = new import_mongoose2.default.Schema({
  examId: import_mongoose2.default.Schema.Types.ObjectId,
  studentId: import_mongoose2.default.Schema.Types.ObjectId,
  attemptNumber: Number
}, baseOptions);
examAttemptSchema.index({ examId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
var ExamAttempt = import_mongoose2.default.models.ExamAttempt || import_mongoose2.default.model("ExamAttempt", examAttemptSchema);
var examAnswerSchema = new import_mongoose2.default.Schema({ attemptId: import_mongoose2.default.Schema.Types.ObjectId }, baseOptions);
var ExamAnswer = import_mongoose2.default.models.ExamAnswer || import_mongoose2.default.model("ExamAnswer", examAnswerSchema);
var resultSchema = new import_mongoose2.default.Schema({
  studentId: import_mongoose2.default.Schema.Types.ObjectId,
  examId: import_mongoose2.default.Schema.Types.ObjectId,
  score: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });
var Result = import_mongoose2.default.models.Result || import_mongoose2.default.model("Result", resultSchema);
var reportCardSchema = new import_mongoose2.default.Schema({ studentId: import_mongoose2.default.Schema.Types.ObjectId }, baseOptions);
var ReportCard = import_mongoose2.default.models.ReportCard || import_mongoose2.default.model("ReportCard", reportCardSchema);
var feeSchema = new import_mongoose2.default.Schema({ studentId: import_mongoose2.default.Schema.Types.ObjectId, amount: Number }, baseOptions);
var Fee = import_mongoose2.default.models.Fee || import_mongoose2.default.model("Fee", feeSchema);
var paymentSchema = new import_mongoose2.default.Schema({
  studentId: import_mongoose2.default.Schema.Types.ObjectId,
  amount: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var Payment = import_mongoose2.default.models.Payment || import_mongoose2.default.model("Payment", paymentSchema);
var announcementSchema = new import_mongoose2.default.Schema({ title: String, content: String }, baseOptions);
var Announcement = import_mongoose2.default.models.Announcement || import_mongoose2.default.model("Announcement", announcementSchema);
var messageSchema = new import_mongoose2.default.Schema({ fromId: import_mongoose2.default.Schema.Types.ObjectId, toId: import_mongoose2.default.Schema.Types.ObjectId, body: String }, baseOptions);
var Message = import_mongoose2.default.models.Message || import_mongoose2.default.model("Message", messageSchema);
var notificationSchema = new import_mongoose2.default.Schema({ userId: import_mongoose2.default.Schema.Types.ObjectId, message: String }, baseOptions);
var Notification = import_mongoose2.default.models.Notification || import_mongoose2.default.model("Notification", notificationSchema);
var documentSchema = new import_mongoose2.default.Schema({ url: String }, baseOptions);
var Document = import_mongoose2.default.models.Document || import_mongoose2.default.model("Document", documentSchema);
var auditLogSchema = new import_mongoose2.default.Schema({ action: String }, baseOptions);
var AuditLog = import_mongoose2.default.models.AuditLog || import_mongoose2.default.model("AuditLog", auditLogSchema);
var homeworkSchema = new import_mongoose2.default.Schema({ classId: import_mongoose2.default.Schema.Types.ObjectId, title: String }, baseOptions);
var Homework = import_mongoose2.default.models.Homework || import_mongoose2.default.model("Homework", homeworkSchema);
var assignmentSchema = new import_mongoose2.default.Schema({ classId: import_mongoose2.default.Schema.Types.ObjectId, title: String }, baseOptions);
var Assignment = import_mongoose2.default.models.Assignment || import_mongoose2.default.model("Assignment", assignmentSchema);
var timetableSchema = new import_mongoose2.default.Schema({ classId: import_mongoose2.default.Schema.Types.ObjectId }, baseOptions);
var Timetable = import_mongoose2.default.models.Timetable || import_mongoose2.default.model("Timetable", timetableSchema);
var admissionSchema = new import_mongoose2.default.Schema({ studentName: String }, baseOptions);
var Admission = import_mongoose2.default.models.Admission || import_mongoose2.default.model("Admission", admissionSchema);

// server/services/schoolAccess.ts
var import_mongoose3 = require("mongoose");
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
      return { studentId: new import_mongoose3.Types.ObjectId(identity.profileId) };
    }
    if (section === "exams" || section === "classes") {
      return { classId: student.classId };
    }
    return { _id: new import_mongoose3.Types.ObjectId(identity.profileId) };
  }
  if (identity.role === "teacher") {
    const teacher = await Teacher.findById(identity.profileId).select("classIds subjectIds").lean();
    if (!teacher) return { _id: null };
    if (section === "results" || section === "exams" || section === "attendance" || section === "students") {
      return { classId: { $in: teacher.classIds || [] } };
    }
    return { _id: new import_mongoose3.Types.ObjectId(identity.profileId) };
  }
  if (identity.role === "parent") {
    const parent = await Parent.findById(identity.profileId).select("studentIds").lean();
    if (!parent || !parent.studentIds || parent.studentIds.length === 0) return { _id: null };
    return { studentId: { $in: parent.studentIds } };
  }
  return {};
}

// server/services/school.ts
var dashboardSections = ["students", "classes", "attendance", "exams", "results", "fees", "announcements", "calendar", "settings"];
async function getSchoolIdentity(platformUser) {
  const connection = await getMongoConnection();
  if (!connection) return { connection: "unavailable", issue: getMongoConnectionIssue(), linked: false, role: null, displayName: platformUser.name ?? "Signed-in user", profileId: null, schoolUserId: null };
  const schoolUser = await SchoolUser.findOne({ isDeleted: false, isActive: true, $or: [{ oauthOpenId: platformUser.openId }, ...platformUser.email ? [{ email: platformUser.email.toLowerCase() }] : []] }).lean();
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
  return { identity, columns: definition.columns, records: records.map((record) => definition.fields.map((field) => cell(record[field]))), total };
}

// server/routers/school.ts
var schoolRouter = router({
  dashboard: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
    return await getDashboard({ openId: user.id || user.openId || user.email, email: user.email, name: user.name });
  }),
  records: publicProcedure.input(import_zod.z.object({ section: import_zod.z.enum(dashboardSections), query: import_zod.z.string().optional().default("") })).query(async ({ ctx, input }) => {
    const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
    return await getRecords({ openId: user.id || user.openId || user.email, email: user.email, name: user.name }, input.section, input.query);
  })
});

// server/routers/auth.ts
var import_zod2 = require("zod");
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET2 = process.env.JWT_SECRET || "default_unsafe_secret";
var authRouter = router({
  login: publicProcedure.input(import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6)
  })).mutation(async ({ input, ctx }) => {
    const user = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: false, isActive: true });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    let isValid = false;
    if (!user.password) {
      if (input.password === "Admin123!") {
        isValid = true;
        user.password = await import_bcryptjs.default.hash("Admin123!", 10);
        await user.save();
      }
    } else {
      isValid = await import_bcryptjs.default.compare(input.password, user.password);
    }
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
    const token = import_jsonwebtoken.default.sign(
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
    return { success: true, role: user.role };
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
var import_zod3 = require("zod");
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
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
  createUser: protectedProcedure.input(import_zod3.z.object({
    email: import_zod3.z.string().email(),
    displayName: import_zod3.z.string(),
    role: import_zod3.z.enum(["admin", "teacher", "student", "parent"]),
    password: import_zod3.z.string().min(6)
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user?.role !== "admin") throw new Error("UNAUTHORIZED");
    const existingUser = await SchoolUser.findOne({ email: input.email.toLowerCase() });
    if (existingUser && !existingUser.isDeleted) throw new Error("Email already in use");
    const hashedPassword = await import_bcryptjs2.default.hash(input.password, 10);
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
  deleteUser: protectedProcedure.input(import_zod3.z.object({ id: import_zod3.z.string() })).mutation(async ({ input, ctx }) => {
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

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: authRouter,
  school: schoolRouter,
  users: usersRouter
});

// server/vercel.ts
var import_mongoose4 = __toESM(require("mongoose"), 1);
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.use((0, import_cookie_parser.default)());
var isConnected = false;
var connectDB = async () => {
  if (isConnected || import_mongoose4.default.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set!");
    return;
  }
  try {
    await import_mongoose4.default.connect(process.env.MONGODB_URI);
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
      const token = req.cookies?.auth_token;
      if (token) {
        try {
          user = import_jsonwebtoken2.default.verify(token, JWT_SECRET3);
        } catch (e) {
        }
      }
      return { req, res, user };
    }
  })
);
var vercel_default = app;
