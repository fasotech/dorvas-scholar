const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

const newGetDashboard = `
export async function getDashboard(platformUser: PlatformUser) {
  const identity = await getSchoolIdentity(platformUser);
  if (identity.connection !== "connected") return { identity, metrics: [], upcoming: [], followUps: [], charts: null };
  if (!identity.linked) return { identity, metrics: [], upcoming: [], followUps: [], charts: null };

  const start = todayStart();
  const [totalStudents, activeStudents, totalTeachers, totalClasses, upcoming] = await Promise.all([
    Student.countDocuments({ isDeleted: false }),
    Student.countDocuments({ isDeleted: false, status: "active" }),
    Teacher.countDocuments({ isDeleted: false }),
    SchoolClass.countDocuments({ isDeleted: false }),
    Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start } }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean(),
  ]);

  // Aggregate student distribution by class for charting
  const classDistribution = await Student.aggregate([
    { $match: { isDeleted: false, status: "active" } },
    { $group: { _id: "$className", count: { $sum: 1 } } }
  ]);
  
  const chartData = classDistribution.map(d => ({ name: d._id || 'Unassigned', value: d.count }));

  return {
    identity,
    metrics: [
      { key: "students", label: "Active Students", value: String(activeStudents), detail: \`Out of \${totalStudents} total enrolled\` },
      { key: "classes", label: "Total Classes", value: String(totalClasses), detail: "Active grade levels and streams" },
      { key: "teachers", label: "Total Teachers", value: String(totalTeachers), detail: "Registered academic staff" },
    ],
    upcoming: upcoming.map((exam: any) => ({ id: exam._id.toString(), title: exam.title, type: exam.examType, startsAt: exam.startsAt ?? null })),
    followUps: [],
    charts: { classDistribution: chartData }
  };
}
`;

code = code.replace(/export async function getDashboard[\s\S]*?(?=const recordDefinitions)/, newGetDashboard + '\n');
fs.writeFileSync('server/services/school.ts', code);
