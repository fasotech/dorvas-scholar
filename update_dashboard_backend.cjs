const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

const oldLogic = `const start = todayStart();
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
Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start }, ...examScope }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean(),
]);
const attendanceRate = students > 0 ? \`\${((present / students) * 100).toFixed(1)}%\` : "—";
return {
identity,
metrics: [
{ key: "attendance", label: "Student attendance", value: attendanceRate, detail: \`\${present} present today\` },
{ key: "practice", label: "Practice completion", value: String(attempts), detail: "Submitted practice attempts today" },
{ key: "fees", label: "Fees received", value: displayCurrency(Number(payments[0]?.total ?? 0)), detail: "Successful payments recorded" },
{ key: "attention", label: "Needs attention", value: String(absent), detail: "Students absent today" },
],
upcoming: upcoming.map((exam) => ({ id: exam._id.toString(), title: exam.title, type: exam.examType, startsAt: exam.startsAt ?? null })),
followUps: absent > 0 ? [{ label: "Attendance review", detail: \`\${absent} student\${absent === 1 ? "" : "s"} marked absent today\` }] : [],
};`;

const newLogic = `
  const start = todayStart();
  const isAdmin = identity.role === "admin" || identity.role === "administrator";
  
  if (isAdmin) {
    const [
      activeStudents, maleStudents, femaleStudents,
      totalClasses, totalTeachers,
      totalPresent, totalAttendanceRecords,
      classDistributionRaw
    ] = await Promise.all([
      Student.countDocuments({ isDeleted: { $ne: true }, enrollmentStatus: { $ne: "Deactivated" } }),
      Student.countDocuments({ isDeleted: { $ne: true }, gender: "Male", enrollmentStatus: { $ne: "Deactivated" } }),
      Student.countDocuments({ isDeleted: { $ne: true }, gender: "Female", enrollmentStatus: { $ne: "Deactivated" } }),
      SchoolClass.countDocuments({ isDeleted: { $ne: true } }),
      Teacher.countDocuments({ isDeleted: { $ne: true }, isActive: { $ne: false } }),
      Attendance.countDocuments({ isDeleted: { $ne: true }, status: { $regex: /present/i } }),
      Attendance.countDocuments({ isDeleted: { $ne: true } }),
      Student.aggregate([
        { $match: { isDeleted: { $ne: true }, enrollmentStatus: { $ne: "Deactivated" } } },
        { $group: { _id: "$className", count: { $sum: 1 } } }
      ])
    ]);
    
    let totalAttendance = 0;
    if (totalAttendanceRecords > 0) {
      totalAttendance = Math.round((totalPresent / totalAttendanceRecords) * 100);
    }
    
    const classDistribution = classDistributionRaw.map(r => ({ name: r._id || "Unassigned", count: r.count }));

    return {
      identity,
      isAdminView: true,
      metrics: {
        activeStudents,
        maleStudents,
        femaleStudents,
        totalClasses,
        totalTeachers,
        totalAttendance
      },
      classDistribution,
      upcoming: [],
      followUps: []
    };
  }

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
    Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start }, ...examScope }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean(),
  ]);
  const attendanceRate = students > 0 ? \`\${((present / students) * 100).toFixed(1)}%\` : "—";
  return {
    identity,
    isAdminView: false,
    metrics: [
      { key: "attendance", label: "Student attendance", value: attendanceRate, detail: \`\${present} present today\` },
      { key: "practice", label: "Practice completion", value: String(attempts), detail: "Submitted practice attempts today" },
      { key: "fees", label: "Fees received", value: displayCurrency(Number(payments[0]?.total ?? 0)), detail: "Successful payments recorded" },
      { key: "attention", label: "Needs attention", value: String(absent), detail: "Students absent today" },
    ],
    upcoming: upcoming.map((exam) => ({ id: exam._id.toString(), title: exam.title, type: exam.examType, startsAt: exam.startsAt ?? null })),
    followUps: absent > 0 ? [{ label: "Attendance review", detail: \`\${absent} student\${absent === 1 ? "" : "s"} marked absent today\` }] : [],
  };
`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('server/services/school.ts', code);
