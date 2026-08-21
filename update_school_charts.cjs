const fs = require('fs');
let code = fs.readFileSync('server/services/school.ts', 'utf8');

code = code.replace(
  "const chartData = classDistribution.map(d => ({ name: d._id || 'Unassigned', value: d.count }));",
  `const chartData = classDistribution.map(d => ({ name: d._id || 'Unassigned', value: d.count }));
  const populationData = [
    { name: 'Students', value: activeStudents },
    { name: 'Teachers', value: totalTeachers }
  ];`
);
code = code.replace(
  "charts: { classDistribution: chartData }",
  "charts: { classDistribution: chartData, population: populationData }"
);

fs.writeFileSync('server/services/school.ts', code);
