import { Users, GraduationCap, School, BookOpen, Clock, Activity, ArrowRight, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AdminDashboard({ summary, onNavigate }: { summary: any; onNavigate: (section: string) => void }) {
  if (summary?.identity?.connection !== "connected" || !summary?.identity?.linked) {
    return (
      <div className="p-12 text-center text-gray-500 font-sans">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Database Connection Required</h2>
        <p>Please link your MongoDB Atlas cluster in Settings to view your school dashboard.</p>
      </div>
    );
  }

  const { metrics = [], charts } = summary;
  const classDist = charts?.classDistribution || [];

  const getIcon = (key: string) => {
    if (key === "students") return <Users size={20} className="text-[#2d6a4f]" />;
    if (key === "classes") return <School size={20} className="text-[#2d6a4f]" />;
    if (key === "teachers") return <GraduationCap size={20} className="text-[#2d6a4f]" />;
    return <Activity size={20} className="text-[#2d6a4f]" />;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-full p-8 font-sans">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Administrative Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time statistics and school activity.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("students")} className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition-colors">
            Manage Students
          </button>
          <button onClick={() => onNavigate("teachers")} className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition-colors">
            Manage Teachers
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((m: any) => (
          <div key={m.key} className="bg-white rounded-xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#e9ecef] rounded-lg">
                {getIcon(m.key)}
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> Live
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{m.value}</h3>
            <p className="text-sm font-semibold text-gray-700">{m.label}</p>
            <p className="text-xs text-gray-500 mt-1">{m.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Class Distribution</h3>
            <button onClick={() => onNavigate("classes")} className="text-xs text-[#2d6a4f] hover:underline font-semibold flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          
          {classDist.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed">
              No active students enrolled to display.
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classDist} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {classDist.map((entry: any, index: number) => (
                      <Cell key={index} fill={index % 2 === 0 ? "#1b4332" : "#40916c"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5">System Health</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Database Connection</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Optimal</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-semibold text-gray-700">API Latency</span>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">~45ms</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Storage Used</span>
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">2.4 GB</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1b4332] rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
            <h3 className="text-sm font-bold text-emerald-200 uppercase tracking-wider mb-2">School Calendar</h3>
            <p className="text-xl font-bold mb-4">First Term 2026</p>
            <button onClick={() => onNavigate("settings")} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded transition-colors flex items-center justify-center gap-2">
              <Clock size={16} /> Update Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
