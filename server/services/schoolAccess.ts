
import { Types } from "mongoose";
import { Parent, Student, Teacher } from "../models/school";

export function canAccessSection(role: string | null, section: string): boolean {
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

export async function getScopedFilter(identity: any, section: string): Promise<Record<string, any>> {
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

