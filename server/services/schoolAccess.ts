import { TRPCError } from "@trpc/server";
import { Types } from "mongoose";
import { Parent, SchoolRole, Student, Teacher } from "../models/school";
import type { DashboardSection } from "./school";

export type SchoolIdentityScope = {
  role: SchoolRole | null;
  linked: boolean;
  profileId: string | null;
  schoolUserId: string | null;
};

const accessMatrix: Record<SchoolRole, readonly DashboardSection[]> = {
  admin: ["students", "classes", "attendance", "exams", "results", "fees", "announcements", "calendar", "settings"],
  teacher: ["students", "classes", "attendance", "exams", "results", "announcements", "calendar"],
  student: ["students", "attendance", "exams", "results", "announcements", "calendar"],
  parent: ["students", "attendance", "results", "fees", "announcements", "calendar"],
};

export function canAccessSection(role: SchoolRole | null, section: DashboardSection) {
  return Boolean(role && accessMatrix[role].includes(section));
}

function deny(message: string): never {
  throw new TRPCError({ code: "FORBIDDEN", message });
}

function objectId(value: string | null) {
  if (!value || !Types.ObjectId.isValid(value)) deny("Your school profile is missing a valid record reference.");
  return new Types.ObjectId(value);
}

export async function getScopedFilter(identity: SchoolIdentityScope, section: DashboardSection): Promise<Record<string, unknown>> {
  if (!identity.linked || !identity.role) deny("Your signed-in account has not been linked to a school role.");
  if (!canAccessSection(identity.role, section)) deny("Your school role does not have permission to access this section.");
  if (identity.role === "admin") return {};

  const profileId = objectId(identity.profileId);
  if (identity.role === "teacher") {
    const teacher = await Teacher.findById(profileId).select("classIds subjectIds").lean();
    if (!teacher) deny("Your teacher profile could not be found.");
    const classIds = teacher.classIds ?? [];
    const subjectIds = teacher.subjectIds ?? [];
    if (section === "students" || section === "attendance" || section === "results" || section === "calendar") return { classId: { $in: classIds } };
    if (section === "classes") return { _id: { $in: classIds } };
    if (section === "exams") return { $or: [{ classId: { $in: classIds } }, { subjectId: { $in: subjectIds } }] };
    if (section === "announcements") return { $or: [{ audienceRoles: "teacher" }, { targetClassIds: { $in: classIds } }, ...(identity.schoolUserId ? [{ targetUserIds: new Types.ObjectId(identity.schoolUserId) }] : [])] };
  }

  if (identity.role === "student") {
    const student = await Student.findById(profileId).select("classId").lean();
    if (!student) deny("Your student profile could not be found.");
    if (section === "students") return { _id: student._id };
    if (section === "attendance" || section === "results") return { studentId: student._id };
    if (section === "exams" || section === "calendar") return { classId: student.classId };
    if (section === "announcements") return { $or: [{ audienceRoles: "student" }, { targetClassIds: student.classId }, ...(identity.schoolUserId ? [{ targetUserIds: new Types.ObjectId(identity.schoolUserId) }] : [])] };
  }

  if (identity.role === "parent") {
    const parent = await Parent.findById(profileId).select("studentIds").lean();
    if (!parent) deny("Your parent profile could not be found.");
    const studentIds = parent.studentIds ?? [];
    const children = await Student.find({ _id: { $in: studentIds }, isDeleted: false }).select("classId").lean();
    const classIds = children.map((student) => student.classId).filter(Boolean);
    if (section === "students") return { _id: { $in: studentIds } };
    if (section === "attendance" || section === "results" || section === "fees") return { studentId: { $in: studentIds } };
    if (section === "exams" || section === "calendar") return { classId: { $in: classIds } };
    if (section === "announcements") return { $or: [{ audienceRoles: "parent" }, { targetClassIds: { $in: classIds } }, ...(identity.schoolUserId ? [{ targetUserIds: new Types.ObjectId(identity.schoolUserId) }] : [])] };
  }

  return {};
}

export function getDashboardMetricFilter(role: SchoolRole | null, profileId: string | null) {
  if (role === "student" || role === "parent") return { studentId: objectId(profileId) };
  return {};
}
