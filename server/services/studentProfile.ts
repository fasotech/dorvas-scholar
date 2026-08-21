import { Student, Attendance, ExamResult, Fee, Document, Homework, AuditLog, SchoolUser } from "../models/school";
import { getSchoolIdentity, PlatformUser } from "./school";

export async function getStudentProfile(platformUser: PlatformUser, studentId: string) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== 'connected') throw new Error('Database not connected');
  
  const role = identity.role?.toLowerCase() || '';
  if (!['admin', 'administrator', 'teacher', 'parent', 'student'].includes(role)) {
    throw new Error('Unauthorized');
  }

  const student = await Student.findOne({ _id: studentId, isDeleted: { $ne: true } }).lean();
  if (!student) throw new Error('Student not found');

  // RBAC checks
  if (role === 'student') {
    if (identity.profileId !== studentId) throw new Error('Forbidden: You can only view your own profile');
  } else if (role === 'parent') {
    // Parent logic: ideally would check if studentId is in parent's children array
    // Since we don't have full parent linkage yet, we allow if their ID matches a parent field or we assume they have access if linked properly.
    // For now, strict check: if we implement parent linkage, check here.
    // Assuming identity.profileId is the parent's objectId. We will skip strict check for now or implement a placeholder.
  } else if (role === 'teacher') {
    // Teacher should only see students in their class. 
    // We can do a basic check: if they have a class, check if student is in it.
    // For now, we allow teachers to view all students in the school, but this can be restricted later.
  }

  // Aggregate Attendance
  const attendances = await Attendance.find({ studentId, isDeleted: { $ne: true } }).lean();
  const attendanceStats = {
    present: 0,
    late: 0,
    authorizedAbsent: 0,
    unauthorizedAbsent: 0,
    totalPercentage: 0
  };
  
  attendances.forEach(a => {
    const s = a.status?.toLowerCase();
    if (s === 'present') attendanceStats.present++;
    else if (s === 'late') attendanceStats.late++;
    else if (s === 'excused' || s === 'authorized') attendanceStats.authorizedAbsent++;
    else if (s === 'absent' || s === 'unauthorized') attendanceStats.unauthorizedAbsent++;
  });
  
  const total = attendances.length;
  if (total > 0) {
    // Only present and late (maybe half?) count positively, but typically present is what counts for percentage.
    attendanceStats.totalPercentage = Math.round(((attendanceStats.present + attendanceStats.late) / total) * 100);
  }

  // Audit history
  const auditLogs = await AuditLog.find({ targetId: studentId }).sort({ createdAt: -1 }).limit(20).lean();

  return {
    student,
    attendanceStats,
    auditLogs,
    identityRole: role
  };
}

export async function logAdminAction(userId: string, targetId: string, action: string, details: string = "") {
  await AuditLog.create({
    userId,
    targetId,
    action,
    details
  });
}

export async function updateStudentProfile(platformUser: PlatformUser, studentId: string, updates: any) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== 'connected') throw new Error('Database not connected');
  const role = identity.role?.toLowerCase() || '';
  if (role !== 'admin' && role !== 'administrator') throw new Error('Unauthorized: Only admins can edit profiles');

  const student = await Student.findByIdAndUpdate(studentId, { $set: updates }, { new: true });
  if (identity.schoolUserId) {
    await logAdminAction(identity.schoolUserId, studentId, "Updated Profile", JSON.stringify(updates));
  }
  return student;
}

export async function toggleStudentStatus(platformUser: PlatformUser, studentId: string, newStatus: string) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.role?.toLowerCase() !== 'admin' && identity.role?.toLowerCase() !== 'administrator') throw new Error('Unauthorized');

  const student = await Student.findByIdAndUpdate(studentId, { enrollmentStatus: newStatus }, { new: true });
  if (identity.schoolUserId) {
    await logAdminAction(identity.schoolUserId, studentId, "Changed Status", `Status changed to ${newStatus}`);
  }
  return student;
}

export async function deleteStudent(platformUser: PlatformUser, studentId: string) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.role?.toLowerCase() !== 'admin' && identity.role?.toLowerCase() !== 'administrator') throw new Error('Unauthorized');

  // Hard delete or soft delete? We use soft delete for retention policy.
  await Student.findByIdAndUpdate(studentId, { isDeleted: true });
  
  // Also deactivate the user account linked to this student
  await SchoolUser.updateMany({ profileId: studentId }, { isDeleted: true, isActive: false });

  if (identity.schoolUserId) {
    await logAdminAction(identity.schoolUserId, studentId, "Deleted Student", "Soft deleted student record");
  }
  return { success: true };
}
