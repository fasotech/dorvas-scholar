const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

// Add male/female counts to the metrics
const regex = /const \[totalStudents, activeStudents, totalTeachers, totalClasses, upcoming\] = await Promise.all\(\[[\s\S]*?\]\);/;
if (code.match(regex)) {
  const newPromiseAll = `const [totalStudents, activeStudents, maleStudents, femaleStudents, totalTeachers, totalClasses, upcoming] = await Promise.all([
    Student.countDocuments({ isDeleted: false }),
    Student.countDocuments({ isDeleted: false, status: "active" }),
    Student.countDocuments({ isDeleted: false, status: "active", gender: "Male" }),
    Student.countDocuments({ isDeleted: false, status: "active", gender: "Female" }),
    Teacher.countDocuments({ isDeleted: false, status: "active" }),
    SchoolClass.countDocuments({ isDeleted: false, status: "active" }),
    Exam.find({ isDeleted: false, status: { $in: ["scheduled", "open"] }, startsAt: { $gte: start } }).sort({ startsAt: 1 }).limit(3).select("title examType startsAt").lean(),
  ]);`;
  
  code = code.replace(regex, newPromiseAll);
  
  const popData = `const populationData = [
    { name: 'Students', value: activeStudents },
    { name: 'Teachers', value: totalTeachers }
  ];`;
  const newPopData = `const populationData = [
    { name: 'Students', value: activeStudents },
    { name: 'Teachers', value: totalTeachers },
    { name: 'Male Students', value: maleStudents },
    { name: 'Female Students', value: femaleStudents }
  ];`;
  
  code = code.replace(popData, newPopData);
  
  fs.writeFileSync('server/services/school.ts', code);
  console.log("Updated school metrics for Educare UI.");
}
