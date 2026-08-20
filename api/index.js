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

// server/routers/school.ts
import { z } from "zod";

// server/mongo.ts
import mongoose from "mongoose";
var nextRetryAt = 0;
var lastConnectionError = null;
async function getMongoConnection() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (Date.now() < nextRetryAt) return null;
  const uri = process.env.MONGODB_URI;
  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    lastConnectionError = "MONGODB_URI is missing or is not a MongoDB connection URI.";
    return null;
  }
  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 8e3,
      serverSelectionTimeoutMS: 8e3,
      maxPoolSize: 10
    });
    lastConnectionError = null;
    return mongoose.connection;
  } catch (error) {
    lastConnectionError = error instanceof Error ? error.message : "MongoDB connection failed.";
    nextRetryAt = Date.now() + 3e4;
    await mongoose.disconnect().catch(() => void 0);
    return null;
  }
}
function getMongoConnectionIssue() {
  return lastConnectionError;
}

// server/models/school.ts
import mongoose2 from "mongoose";
var baseOptions = { timestamps: true };
var roleSchema = new mongoose2.Schema({ name: String }, baseOptions);
var Role = mongoose2.models.Role || mongoose2.model("Role", roleSchema);
var schoolUserSchema = new mongoose2.Schema({
  email: String,
  oauthOpenId: String,
  password: { type: String },
  displayName: String,
  role: String,
  profileType: String,
  profileId: mongoose2.Schema.Types.ObjectId,
  isActive: { type: Boolean, default: true }
}, baseOptions);
var SchoolUser = mongoose2.models.SchoolUser || mongoose2.model("SchoolUser", schoolUserSchema);
var studentSchema = new mongoose2.Schema({ name: String, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Student = mongoose2.models.Student || mongoose2.model("Student", studentSchema);
var teacherSchema = new mongoose2.Schema({ name: String, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Teacher = mongoose2.models.Teacher || mongoose2.model("Teacher", teacherSchema);
var parentSchema = new mongoose2.Schema({ name: String, children: [{ type: mongoose2.Schema.Types.ObjectId, ref: "Student" }] }, baseOptions);
var Parent = mongoose2.models.Parent || mongoose2.model("Parent", parentSchema);
var schoolClassSchema = new mongoose2.Schema({ name: String }, baseOptions);
var SchoolClass = mongoose2.models.SchoolClass || mongoose2.model("SchoolClass", schoolClassSchema);
var subjectSchema = new mongoose2.Schema({ name: String }, baseOptions);
var Subject = mongoose2.models.Subject || mongoose2.model("Subject", subjectSchema);
var classSubjectSchema = new mongoose2.Schema({ classId: mongoose2.Schema.Types.ObjectId, subjectId: mongoose2.Schema.Types.ObjectId, teacherId: mongoose2.Schema.Types.ObjectId }, baseOptions);
var ClassSubject = mongoose2.models.ClassSubject || mongoose2.model("ClassSubject", classSubjectSchema);
var academicSessionSchema = new mongoose2.Schema({ name: String }, baseOptions);
var AcademicSession = mongoose2.models.AcademicSession || mongoose2.model("AcademicSession", academicSessionSchema);
var termSchema = new mongoose2.Schema({ name: String }, baseOptions);
var Term = mongoose2.models.Term || mongoose2.model("Term", termSchema);
var attendanceSchema = new mongoose2.Schema({
  studentId: mongoose2.Schema.Types.ObjectId,
  date: Date,
  periodKey: String,
  status: String,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
attendanceSchema.index({ studentId: 1, date: 1, periodKey: 1 }, { unique: true });
var Attendance = mongoose2.models.Attendance || mongoose2.model("Attendance", attendanceSchema);
var examSchema = new mongoose2.Schema({ name: String, classId: mongoose2.Schema.Types.ObjectId, subjectId: mongoose2.Schema.Types.ObjectId, isDeleted: { type: Boolean, default: false } }, baseOptions);
var Exam = mongoose2.models.Exam || mongoose2.model("Exam", examSchema);
var questionSchema = new mongoose2.Schema({ examId: mongoose2.Schema.Types.ObjectId, text: String }, baseOptions);
var Question = mongoose2.models.Question || mongoose2.model("Question", questionSchema);
var examAttemptSchema = new mongoose2.Schema({
  examId: mongoose2.Schema.Types.ObjectId,
  studentId: mongoose2.Schema.Types.ObjectId,
  attemptNumber: Number
}, baseOptions);
examAttemptSchema.index({ examId: 1, studentId: 1, attemptNumber: 1 }, { unique: true });
var ExamAttempt = mongoose2.models.ExamAttempt || mongoose2.model("ExamAttempt", examAttemptSchema);
var examAnswerSchema = new mongoose2.Schema({ attemptId: mongoose2.Schema.Types.ObjectId }, baseOptions);
var ExamAnswer = mongoose2.models.ExamAnswer || mongoose2.model("ExamAnswer", examAnswerSchema);
var resultSchema = new mongoose2.Schema({
  studentId: mongoose2.Schema.Types.ObjectId,
  examId: mongoose2.Schema.Types.ObjectId,
  score: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });
var Result = mongoose2.models.Result || mongoose2.model("Result", resultSchema);
var reportCardSchema = new mongoose2.Schema({ studentId: mongoose2.Schema.Types.ObjectId }, baseOptions);
var ReportCard = mongoose2.models.ReportCard || mongoose2.model("ReportCard", reportCardSchema);
var feeSchema = new mongoose2.Schema({ studentId: mongoose2.Schema.Types.ObjectId, amount: Number }, baseOptions);
var Fee = mongoose2.models.Fee || mongoose2.model("Fee", feeSchema);
var paymentSchema = new mongoose2.Schema({
  studentId: mongoose2.Schema.Types.ObjectId,
  amount: Number,
  isDeleted: { type: Boolean, default: false }
}, baseOptions);
var Payment = mongoose2.models.Payment || mongoose2.model("Payment", paymentSchema);
var announcementSchema = new mongoose2.Schema({ title: String, content: String }, baseOptions);
var Announcement = mongoose2.models.Announcement || mongoose2.model("Announcement", announcementSchema);
var messageSchema = new mongoose2.Schema({ fromId: mongoose2.Schema.Types.ObjectId, toId: mongoose2.Schema.Types.ObjectId, body: String }, baseOptions);
var Message = mongoose2.models.Message || mongoose2.model("Message", messageSchema);
var notificationSchema = new mongoose2.Schema({ userId: mongoose2.Schema.Types.ObjectId, message: String }, baseOptions);
var Notification = mongoose2.models.Notification || mongoose2.model("Notification", notificationSchema);
var documentSchema = new mongoose2.Schema({ url: String }, baseOptions);
var Document = mongoose2.models.Document || mongoose2.model("Document", documentSchema);
var auditLogSchema = new mongoose2.Schema({ action: String }, baseOptions);
var AuditLog = mongoose2.models.AuditLog || mongoose2.model("AuditLog", auditLogSchema);
var homeworkSchema = new mongoose2.Schema({ classId: mongoose2.Schema.Types.ObjectId, title: String }, baseOptions);
var Homework = mongoose2.models.Homework || mongoose2.model("Homework", homeworkSchema);
var assignmentSchema = new mongoose2.Schema({ classId: mongoose2.Schema.Types.ObjectId, title: String }, baseOptions);
var Assignment = mongoose2.models.Assignment || mongoose2.model("Assignment", assignmentSchema);
var timetableSchema = new mongoose2.Schema({ classId: mongoose2.Schema.Types.ObjectId }, baseOptions);
var Timetable = mongoose2.models.Timetable || mongoose2.model("Timetable", timetableSchema);
var admissionSchema = new mongoose2.Schema({ studentName: String }, baseOptions);
var Admission = mongoose2.models.Admission || mongoose2.model("Admission", admissionSchema);

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
  records: publicProcedure.input(z.object({ section: z.enum(dashboardSections), query: z.string().optional().default("") })).query(async ({ ctx, input }) => {
    const user = ctx.user || { id: "local-dev", name: "Dev User", email: "dev@example.com" };
    return await getRecords({ openId: user.id || user.openId || user.email, email: user.email, name: user.name }, input.section, input.query);
  })
});

// server/routers/auth.ts
import { z as z2 } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var JWT_SECRET2 = process.env.JWT_SECRET || "default_unsafe_secret";
var authRouter = router({
  login: publicProcedure.input(z2.object({
    email: z2.string().email(),
    password: z2.string().min(6)
  })).mutation(async ({ input, ctx }) => {
    const user = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: false, isActive: true });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    let isValid = false;
    if (!user.password) {
      if (input.password === "Admin123!") {
        isValid = true;
        user.password = await bcrypt.hash("Admin123!", 10);
        await user.save();
      }
    } else {
      isValid = await bcrypt.compare(input.password, user.password);
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
import { z as z3 } from "zod";
import bcrypt2 from "bcryptjs";
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
    const hashedPassword = await bcrypt2.hash(input.password, 10);
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

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: authRouter,
  school: schoolRouter,
  users: usersRouter
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
      const token = req.cookies?.auth_token;
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
