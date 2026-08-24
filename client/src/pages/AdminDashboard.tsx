import { Users, GraduationCap, School, BookOpen, Clock, Activity, ArrowRight, TrendingUp, CalendarDays, Globe, Monitor, MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, CartesianGrid, Legend } from "recharts";
import { useAuth } from "@/_core/hooks/useAuth";

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#1abc9c', '#9b59b6', '#e74c3c', '#e67e22', '#34495e'];

export default function AdminDashboard({ summary, onNavigate }: { summary: any; onNavigate: (section: string) => void }) {
  const { user } = useAuth();
  
  if (summary?.identity?.connection !== "connected" || !summary?.identity?.linked) {
    return (
      <div className="p-12 text-center text-gray-500 font-sans">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Database Connection Required</h2>
        <p>Please link your MongoDB Atlas cluster in Settings to view your school dashboard.</p>
      </div>
    );
  }

  const { charts } = summary;
  const classDist = charts?.classDistribution || [];
  const popData = charts?.population || [];
  
  // Extract counts manually to match Educare style blocks
  const activeStudents = popData.find((p: any) => p.name === 'Students')?.value || 0;
  const maleStudents = popData.find((p: any) => p.name === 'Male Students')?.value || 0;
  const femaleStudents = popData.find((p: any) => p.name === 'Female Students')?.value || 0;
  const totalTeachers = popData.find((p: any) => p.name === 'Teachers')?.value || 0;
  const totalClasses = summary?.metrics?.find((m: any) => m.key === 'classes')?.value || 0;

  return (
    <div className="bg-[#f4f7f6] min-h-full p-8 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Welcome {user?.displayName || "Administrator"}</h1>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded shadow-sm hover:bg-blue-600 transition-colors">
            Quick Guide
          </button>
        </div>
      </div>

      {/* Colorful Educare-style Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-[#3498db] text-white p-5 rounded-md flex flex-col items-end justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden h-28" onClick={() => onNavigate("students")}>
          <Users size={80} className="absolute -left-4 opacity-20 text-white" />
          <span className="text-4xl font-light relative z-10">{activeStudents}</span>
          <span className="text-sm mt-1 opacity-90 relative z-10 capitalize">Active Students</span>
        </div>
        <div className="bg-[#2ecc71] text-white p-5 rounded-md flex flex-col items-end justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden h-28" onClick={() => onNavigate("students")}>
          <Users size={80} className="absolute -left-4 opacity-20 text-white" />
          <span className="text-4xl font-light relative z-10">{maleStudents}</span>
          <span className="text-sm mt-1 opacity-90 relative z-10 capitalize">Male Students</span>
        </div>
        <div className="bg-[#f1c40f] text-white p-5 rounded-md flex flex-col items-end justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden h-28" onClick={() => onNavigate("students")}>
          <Users size={80} className="absolute -left-4 opacity-20 text-white" />
          <span className="text-4xl font-light relative z-10">{femaleStudents}</span>
          <span className="text-sm mt-1 opacity-90 relative z-10 capitalize">Female Students</span>
        </div>
        <div className="bg-[#1abc9c] text-white p-5 rounded-md flex flex-col items-end justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden h-28" onClick={() => onNavigate("classes")}>
          <Monitor size={80} className="absolute -left-4 opacity-20 text-white" />
          <span className="text-4xl font-light relative z-10">{totalClasses}</span>
          <span className="text-sm mt-1 opacity-90 relative z-10 capitalize">Classes</span>
        </div>
        <div className="bg-[#9b59b6] text-white p-5 rounded-md flex flex-col items-end justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden h-28" onClick={() => onNavigate("teachers")}>
          <Globe size={80} className="absolute -left-4 opacity-20 text-white" />
          <span className="text-4xl font-light relative z-10">{totalTeachers}</span>
          <span className="text-sm mt-1 opacity-90 relative z-10 capitalize">Teachers</span>
        </div>
        <div className="bg-[#00bcd4] text-white p-5 rounded-md flex flex-col items-end justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative overflow-hidden h-28" onClick={() => onNavigate("attendance")}>
          <CalendarDays size={80} className="absolute -left-4 opacity-20 text-white" />
          <span className="text-4xl font-light relative z-10">0</span>
          <span className="text-sm mt-1 opacity-90 relative z-10 capitalize">Total Attendance</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">School Class Distribution</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">2026/2027 Session</p>
        </div>
        
        {classDist.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-dashed rounded-lg">
             <School size={48} className="mb-4 opacity-20" />
             <p>No active students enrolled to display distribution.</p>
             <button onClick={() => onNavigate("students")} className="mt-4 px-4 py-2 bg-[#3498db] text-white text-xs font-bold rounded">Add Student</button>
          </div>
        ) : (
          <div className="h-80 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classDist} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7f8c8d', fontWeight: 'bold' }} dy={15} angle={-30} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7f8c8d' }} label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', fill: '#95a5a6', fontSize: 11 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '4px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 0, 0, 0]} maxBarSize={30}>
                  {classDist.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => onNavigate("exams")} className="w-full bg-[#1abc9c] text-white font-bold text-xs py-3 px-4 rounded shadow-sm hover:opacity-90">My Schedules</button>
             <button onClick={() => onNavigate("results")} className="w-full bg-[#1abc9c] text-white font-bold text-xs py-3 px-4 rounded shadow-sm hover:opacity-90">Make Report</button>
             <button onClick={() => onNavigate("calendar")} className="w-full bg-[#34495e] text-white font-bold text-xs py-3 px-4 rounded shadow-sm hover:opacity-90">Event Calendar</button>
             <button onClick={() => onNavigate("attendance")} className="w-full bg-[#34495e] text-white font-bold text-xs py-3 px-4 rounded shadow-sm hover:opacity-90">Attendance Register</button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2"><CalendarDays size={16} className="text-[#2ecc71]"/> Upcoming Events</h3>
          <div className="text-center py-8 text-gray-400 text-sm">
             <p>No Recent Event</p>
          </div>
        </div>
      </div>
    </div>
  );
}
