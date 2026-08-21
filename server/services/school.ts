import { getMongoConnection, getMongoConnectionIssue } from "../mongo";
import {
  AcademicSession, Announcement, Attendance, Exam, ExamAttempt, Fee, Payment, Result, SchoolClass, SchoolRole, SchoolUser, Student, Teacher,
} from "../models/school";
import { canAccessSection, getScopedFilter } from "./schoolAccess";

export const dashboardSections = ["students", "teachers", "classes", "attendance", "exams", "results", "fees", "announcements", "calendar", "settings"] as const;
export type DashboardSection = (typeof dashboardSections)[number];

type PlatformUser = { openId: string; email?: string | null; name?: string | null };

export async function getSchoolIdentity(platformUser: PlatformUser) {
  const connection = await getMongoConnection();
  if (!connection) return { connection: "unavailable" as const, issue: getMongoConnectionIssue(), linked: false as const, role: null, displayName: platformUser.name ?? "Signed-in user", profileId: null, schoolUserId: null };
  const schoolUser = await SchoolUser.findOne({ isDeleted: { $ne: true }, isActive: { $ne: false }, $or: [{ oauthOpenId: platformUser.openId }, ...(platformUser.email ? [{ email: platformUser.email.toLowerCase() }] : [])] }).lean();
  return { connection: "connected" as const, issue: null, linked: Boolean(schoolUser), role: (schoolUser?.role ?? null) as SchoolRole | null, displayName: schoolUser?.displayName ?? platformUser.name ?? "Signed-in user", profileId: schoolUser?.profileId?.toString() ?? null, schoolUserId: schoolUser?._id?.toString() ?? null };
}

const todayStart = () => { const value = new Date(); value.setHours(0, 0, 0, 0); return value; };
const displayCurrency = (value: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);


export async function getDashboard(platformUser: PlatformUser) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") return { identity, metrics: [], upcoming: [], followUps: [], charts: null };
  if (!identity.linked) return { identity, metrics: [], upcoming: [], followUps: [], charts: null };

  const start = todayStart();
  
  // Auto-fix ghost records (missing status)
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
    Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start } }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean(),
  ]);

  // Aggregate student distribution by class for charting
  const classDistribution = await Student.aggregate([
    { $match: { isDeleted: false, status: "active" } },
    { $group: { _id: "$className", count: { $sum: 1 } } }
  ]);
  
  const chartData = classDistribution.map(d => ({ name: d._id || 'Unassigned', value: d.count }));
  const populationData = [
    { name: 'Students', value: activeStudents },
    { name: 'Teachers', value: totalTeachers },
    { name: 'Male Students', value: maleStudents },
    { name: 'Female Students', value: femaleStudents }
  ];

  return {
    identity,
    metrics: [
      { key: "students", label: "Active Students", value: String(activeStudents), detail: `Out of ${totalStudents} total enrolled` },
      { key: "classes", label: "Total Classes", value: String(totalClasses), detail: "Active grade levels and streams" },
      { key: "teachers", label: "Total Teachers", value: String(totalTeachers), detail: "Registered academic staff" },
    ],
    upcoming: upcoming.map((exam: any) => ({ id: exam._id.toString(), title: exam.title, type: exam.examType, startsAt: exam.startsAt ?? null })),
    followUps: [],
    charts: { classDistribution: chartData, population: populationData }
  };
}

const recordDefinitions: Record<DashboardSection, { columns: string[]; model: any; fields: string[] }> = {
  students: { columns: ["Student", "Admission no.", "Status", "Created"], model: Student, fields: ["fullName", "admissionNumber", "status", "createdAt"] },
  teachers: { columns: ["Teacher", "Status", "Created"], model: Teacher, fields: ["fullName", "status", "createdAt"] },
  classes: { columns: ["Class", "Code", "Level", "Status"], model: SchoolClass, fields: ["name", "code", "gradeLevel", "status"] },
  attendance: { columns: ["Student", "Date", "Status", "Period"], model: Attendance, fields: ["studentId", "date", "status", "periodKey"] },
  exams: { columns: ["Assessment", "Type", "Status", "Starts"], model: Exam, fields: ["title", "examType", "status", "startsAt"] },
  results: { columns: ["Student", "Score", "Grade", "Status"], model: Result, fields: ["studentId", "percentage", "grade", "status"] },
  fees: { columns: ["Fee", "Amount", "Due date", "Status"], model: Fee, fields: ["name", "totalAmount", "dueDate", "status"] },
  announcements: { columns: ["Announcement", "Priority", "Published", "Status"], model: Announcement, fields: ["title", "priority", "publishAt", "isPublished"] },
  calendar: { columns: ["Assessment", "Type", "Starts", "Status"], model: Exam, fields: ["title", "examType", "startsAt", "status"] },
  settings: { columns: ["Academic session", "Starts", "Ends", "Status"], model: AcademicSession, fields: ["name", "startDate", "endDate", "status"] },
};

function cell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "boolean") return value ? "Published" : "Draft";
  if (typeof value === "number") return String(value);
  return String(value);
}

export async function getRecords(platformUser: PlatformUser, section: DashboardSection, query: string) {
  const identity = await getSchoolIdentity(platformUser);
  const definition = recordDefinitions[section];
  if (identity.connection !== "connected") return { identity, columns: definition.columns, records: [], total: 0 };
  const scope = await getScopedFilter(identity, section);
  const textFilter = query ? { $or: [{ name: { $regex: query, $options: "i" } }, { title: { $regex: query, $options: "i" } }, { fullName: { $regex: query, $options: "i" } }, { admissionNumber: { $regex: query, $options: "i" } }, { code: { $regex: query, $options: "i" } }] } : {};
  const filter = { $and: [{ isDeleted: false }, scope, textFilter] };
  const [records, total] = await Promise.all([definition.model.find(filter).sort({ createdAt: -1 }).limit(50).lean(), definition.model.countDocuments(filter)]);
  return { identity, columns: definition.columns, records: records.map((record: Record<string, unknown>) => ({ id: record._id, cells: definition.fields.map((field) => cell(record[field])) })), total };
}

export async function getSchoolHealth(platformUser: PlatformUser) {
  const identity = await getSchoolIdentity(platformUser);
  return { database: identity.connection, profileLinked: identity.linked, role: identity.role, message: identity.connection === "unavailable" ? "MongoDB Atlas is unavailable. Check MONGODB_URI and Atlas Network Access." : !identity.linked ? "MongoDB is connected, but this OAuth account has not been linked to a school user record." : "Your secure school data connection is ready." };
}


import bcrypt from "bcryptjs";

export async function createRecord(platformUser: PlatformUser, section: DashboardSection, payload: any) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== 'connected') throw new Error('Database not connected');
  const role = identity.role?.toLowerCase() || '';
  if (role !== 'admin' && role !== 'administrator' && role !== 'teacher') throw new Error('Unauthorized');
  
  const definition = recordDefinitions[section];
  const model = definition.model;
  
  // Custom logic for Students and Teachers to auto-generate login accounts
  if (section === "students" || section === "teachers") {
    let email = payload.email || (payload.fullName.toLowerCase().replace(/\s+/g, '.') + '@dorvas.edu.ng');
    
    // Check if email exists
    let exists = await SchoolUser.findOne({ email });
    let counter = 1;
    while(exists) {
      email = payload.fullName.toLowerCase().replace(/\s+/g, '.') + counter + '@dorvas.edu.ng';
      exists = await SchoolUser.findOne({ email });
      counter++;
    }

    const hashedPassword = await bcrypt.hash(payload.password || "Password123!", 10);
    
    // Create the Student or Teacher record first
    const recordPayload = { ...payload, status: payload.status || "active" };
    delete recordPayload.password; // Don't save plaintext password to the student record
    recordPayload.name = recordPayload.fullName;
    
    const doc = await model.create({
    status: payload.status || "active",
      ...recordPayload,
      isDeleted: false,
      schoolId: identity.profileId || 'default-school'
    });

    // Create the SchoolUser login account linked to it
    await SchoolUser.create({
      email,
      password: hashedPassword,
      displayName: payload.fullName,
      role: section === "students" ? "student" : "teacher",
      profileType: section === "students" ? "Student" : "Teacher",
      profileId: doc._id,
      isActive: true,
      isDeleted: false
    });

    return { success: true, id: doc._id, email };
  }
  
  // Create generic document for other sections
  const doc = await model.create({
    status: payload.status || "active",
    ...payload,
    isDeleted: false,
    schoolId: identity.profileId || 'default-school'
  });
  
  return { success: true, id: doc._id };
}
