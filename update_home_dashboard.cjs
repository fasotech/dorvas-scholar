const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Add recharts import
if (!code.includes('import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";')) {
  code = code.replace(
    'import { ArrowRight,',
    'import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";\nimport { ArrowRight,'
  );
}

const adminDashboardOverride = `
  if (summary?.isAdminView) {
    const adminMetrics = summary.metrics || {};
    const chartData = summary.classDistribution || [];
    return (
      <>
        <section className="welcome-band">
          <div className="welcome-copy">
            <p className="eyebrow"><span /> Administrator Desk</p>
            <h1>School Operations Overview</h1>
            <p className="intro">Live statistics from your active, protected database.</p>
            <div className="welcome-actions">
              <Button onClick={onCreate}><Plus size={17} /> New Record</Button>
            </div>
          </div>
        </section>
        <ConnectionNotice summary={summary} />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: "Active Students", value: adminMetrics.activeStudents || 0, bg: "bg-blue-500" },
            { label: "Male Students", value: adminMetrics.maleStudents || 0, bg: "bg-emerald-400" },
            { label: "Female Students", value: adminMetrics.femaleStudents || 0, bg: "bg-amber-400" },
            { label: "Classes", value: adminMetrics.totalClasses || 0, bg: "bg-cyan-500" },
            { label: "Teachers", value: adminMetrics.totalTeachers || 0, bg: "bg-purple-600" },
            { label: "Total Attendance", value: (adminMetrics.totalAttendance || 0) + "%", bg: "bg-teal-400" }
          ].map(m => (
            <div key={m.label} className={\`\${m.bg} text-white p-4 rounded-xl shadow-sm flex flex-col justify-between\`}>
              <div className="text-3xl font-bold font-serif mb-2">{m.value}</div>
              <div className="text-xs uppercase tracking-wider font-semibold opacity-90">{m.label}</div>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">School Class Distribution</h2>
            <p className="text-sm text-gray-500">Number of Active Students per Class</p>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#2d6a4f" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <AlertCircle size={24} className="mb-2" />
                <p>No class distribution data available.</p>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
`;

code = code.replace(
  'const copy = roleCopy[role];',
  'const copy = roleCopy[role];\n' + adminDashboardOverride
);

fs.writeFileSync('client/src/pages/Home.tsx', code);
