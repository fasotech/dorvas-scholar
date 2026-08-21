const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminDashboard.tsx', 'utf8');

const pieChartImport = 'import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";';
code = code.replace('import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";', pieChartImport);

const chartDataInit = `  const { metrics = [], charts } = summary;
  const classDist = charts?.classDistribution || [];
  const popData = charts?.population || [];`;
code = code.replace('  const classDist = charts?.classDistribution || [];', '  const classDist = charts?.classDistribution || [];\n  const popData = charts?.population || [];');

const newPieChart = `          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5">School Population</h3>
            <div className="h-48">
              {popData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50 rounded border border-dashed">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={popData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5}>
                      {popData.map((entry: any, index: number) => (
                        <Cell key={\`cell-\${index}\`} fill={index === 0 ? "#1b4332" : "#52b788"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#1b4332]"></span> Students</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#52b788]"></span> Teachers</div>
            </div>
          </div>`;

code = code.replace('{/* Quick Actions */}\n        <div className="space-y-6">', '{/* Quick Actions */}\n        <div className="space-y-6">\n' + newPieChart);

fs.writeFileSync('client/src/pages/AdminDashboard.tsx', code);
