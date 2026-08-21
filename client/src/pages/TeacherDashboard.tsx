import { Users, BookOpen, ClipboardList, TrendingUp, CalendarDays, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard({ summary, onNavigate }: { summary: any, onNavigate: (s: string) => void }) {
  if (summary?.identity?.connection !== "connected") {
    return (
      <div className="p-12 text-center text-gray-500 font-sans">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Connection Offline</h2>
        <p>Please check your database connection.</p>
      </div>
    );
  }

  const { upcoming = [] } = summary;

  return (
    <div className="bg-[#fcfdfc] min-h-full p-8 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
          <BookOpen size={12} /> Educator Portal
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to your classroom</h1>
        <p className="text-gray-500 mt-2">Manage your students, upload notes, and review assessments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div onClick={() => onNavigate('students')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all group">
          <div className="w-12 h-12 bg-[#ecf7ea] text-[#2d6a4f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <h3 className="font-bold text-gray-900">My Students</h3>
          <p className="text-xs text-gray-500 mt-1">View class rosters</p>
        </div>
        
        <div onClick={() => onNavigate('attendance')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ClipboardList size={24} />
          </div>
          <h3 className="font-bold text-gray-900">Attendance</h3>
          <p className="text-xs text-gray-500 mt-1">Mark daily registers</p>
        </div>

        <div onClick={() => onNavigate('exams')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-gray-900">Assessments</h3>
          <p className="text-xs text-gray-500 mt-1">Create CBT & exams</p>
        </div>

        <div onClick={() => onNavigate('results')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all group">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-gray-900">Results</h3>
          <p className="text-xs text-gray-500 mt-1">Grade and review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><CalendarDays size={18} className="text-[#2d6a4f]"/> Upcoming Assessments</h3>
              <button onClick={() => onNavigate("exams")} className="text-xs font-semibold text-[#2d6a4f] hover:underline flex items-center">View Calendar <ArrowRight size={14} className="ml-1"/></button>
            </div>
            
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 border border-dashed rounded-xl bg-gray-50">No upcoming assessments scheduled.</div>
              ) : (
                upcoming.map((u: any) => (
                  <div key={u.id} className="p-4 border rounded-xl flex items-center justify-between hover:border-[#2d6a4f] transition-colors">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{u.title}</p>
                      <p className="text-xs text-gray-500">{u.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#2d6a4f]">{u.startsAt ? new Date(u.startsAt).toLocaleDateString() : 'TBD'}</p>
                      <Button variant="outline" size="sm" className="mt-1 h-6 text-[10px] px-2" onClick={() => onNavigate("exams")}>Manage</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
             <h3 className="font-bold text-emerald-200 mb-2 uppercase text-xs tracking-wider">Quick Actions</h3>
             <p className="text-lg font-bold mb-6">Ready to teach?</p>
             
             <div className="space-y-3 relative z-10">
               <button onClick={() => onNavigate('exams')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors">
                 Create CBT Exam <ArrowRight size={14}/>
               </button>
               <button onClick={() => onNavigate('attendance')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors">
                 Mark Register <ArrowRight size={14}/>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
