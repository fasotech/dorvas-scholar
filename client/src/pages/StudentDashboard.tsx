import { useState } from "react";
import { trpc } from "../lib/trpc";
import { 
  BookOpen, FileText, CheckSquare, ClipboardList, CreditCard, 
  UserSquare2, ArrowRight, Loader2, PlayCircle, Lock, GraduationCap, Sparkles, CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { LogOut } from "lucide-react";
import AvatarUploader from "../components/AvatarUploader";
import { useLocation } from "wouter";

export default function StudentDashboard({ onNavigate }: { onNavigate?: (key: string) => void }) {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useContext();
  const query = trpc.studentPortal.getDashboardData.useQuery();
  const seedMutation = trpc.studentPortal.seedDemoData.useMutation({
    onSuccess: () => utils.studentPortal.getDashboardData.invalidate()
  });

  if (query.isLoading) {
    return <div className="p-12 flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin mr-3 text-[#2d6a4f]" /> Loading your learning portal...</div>;
  }

  if (query.isError) {
    return <div className="p-12 text-center text-red-600">Failed to load student dashboard. Please ensure you are logged in as a student.</div>;
  }

  if (!query.data) return null;
  const { student, exams, recentNotes } = query.data!;

  const handleStartExam = (exam: any) => {
    if (exam.examType === 'Teacher Assessment' && exam.hasAttempted) {
      alert("You have already completed this official assessment.");
      return;
    }
    setLocation(`/cbt/${exam._id}`);
  };

  return (
    <div className="bg-[#f4f7f6] min-h-screen pb-12 font-sans">
      {/* Premium Profile Header Block */}
      <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] px-8 pt-12 pb-24 shadow-lg relative overflow-hidden text-white">
        {/* Logout Button */}
        <button onClick={() => void logout()} className="absolute top-6 right-6 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors" title="Logout">
          <LogOut size={20} />
        </button>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#081c15] opacity-20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-36 h-36 shrink-0 relative group">
            <AvatarUploader 
              id={student._id}
              type="Student"
              currentPicture={student.profilePicture || student.photograph}
              initials={student.fullName?.charAt(0) || "S"}
              size="xl"
            />
          </div>
          <div className="text-center md:text-left mt-4 md:mt-4">
            <h1 className="text-4xl font-serif tracking-wide font-bold drop-shadow-md">{student.fullName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 opacity-90">
              <GraduationCap size={18} />
              <p className="uppercase tracking-widest text-sm font-semibold">{student.className || "Unassigned Class"}</p>
            </div>
            <p className="mt-4 text-emerald-100 max-w-md leading-relaxed text-sm">
              Welcome back to your learning portal. Check your upcoming assessments, review your notes, and track your academic progress.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 grid grid-cols-3 md:grid-cols-6 gap-4 border border-gray-100">
          <ActionBtn onClick={() => onNavigate?.("classes")} icon={BookOpen} label="Subjects" color="text-blue-600" bg="bg-blue-50" border="border-blue-100" hover="hover:bg-blue-600 hover:text-white" />
          <ActionBtn onClick={() => onNavigate?.("exams")} icon={FileText} label="Assignments" color="text-amber-600" bg="bg-amber-50" border="border-amber-100" hover="hover:bg-amber-600 hover:text-white" />
          <ActionBtn onClick={() => onNavigate?.("exams")} icon={CheckSquare} label="CBT Exams" color="text-rose-600" bg="bg-rose-50" border="border-rose-100" hover="hover:bg-rose-600 hover:text-white" />
          <ActionBtn onClick={() => alert("Coming soon")} icon={PlayCircle} label="eClassroom" color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100" hover="hover:bg-emerald-600 hover:text-white" />
          <ActionBtn onClick={() => alert("Coming soon")} icon={BookOpen} label="Library" color="text-purple-600" bg="bg-purple-50" border="border-purple-100" hover="hover:bg-purple-600 hover:text-white" />
          <ActionBtn onClick={() => alert("Coming soon")} icon={Sparkles} label="Rate Teachers" color="text-indigo-600" bg="bg-indigo-50" border="border-indigo-100" hover="hover:bg-indigo-600 hover:text-white" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-6">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b px-8 py-4 flex gap-8 text-sm font-bold text-gray-400 overflow-x-auto bg-gray-50/50">
              <span onClick={() => onNavigate?.("overview")} className="text-[#1b4332] border-b-2 border-[#1b4332] pb-4 -mb-4 transition-colors cursor-pointer">Overview</span>
              <span onClick={() => onNavigate?.("attendance")} className="hover:text-gray-900 transition-colors cursor-pointer">Attendance</span>
              <span onClick={() => onNavigate?.("results")} className="hover:text-gray-900 transition-colors cursor-pointer">Result</span>
              <span onClick={() => alert("Coming soon")} className="hover:text-gray-900 transition-colors cursor-pointer">Medical</span>
              <span onClick={() => alert("Coming soon")} className="hover:text-gray-900 transition-colors cursor-pointer">Remarks</span>
              <span onClick={() => onNavigate?.("results")} className="hover:text-gray-900 transition-colors cursor-pointer whitespace-nowrap">Result Analysis</span>
            </div>
            
            <div className="p-8">
              <div className="bg-gray-50 border rounded-xl p-4 mb-8 text-gray-400 text-sm italic shadow-inner flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                Share an update, question, or discussion with your class...
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-amber-500" size={20} />
                <h3 className="font-serif font-bold text-xl text-[#1b4332]">Recent eClassroom Notes</h3>
              </div>
              
              {recentNotes.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                  <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                  No recent notes uploaded for your class.
                  {exams.length === 0 && (
                    <div className="mt-4">
                      <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending} className="bg-[#1b4332] hover:bg-[#2d6a4f]">
                        {seedMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Generate Demo LMS Data"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {recentNotes.map((note: any) => (
                    <div key={note._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">{note.teacherName?.charAt(0) || "T"}</div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{note.teacherName}</div>
                            <div className="text-xs text-gray-500 font-medium">{new Date(note.createdAt || Date.now()).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          </div>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">{note.subject}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-3 text-[#1b4332]">{note.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <CheckSquare size={18} className="text-rose-500" /> Active CBT Exams
            </h3>
            {exams.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No active exams available.</p>
            ) : (
              <div className="space-y-4">
                {exams.map((exam: any) => (
                  <div key={exam._id} className="p-4 border rounded-xl bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] group hover:border-rose-200 transition-colors">
                    <div className="font-bold text-gray-900 mb-1">{exam.title}</div>
                    <div className="flex items-center gap-2 text-xs font-semibold mb-3">
                      <span className={`px-2 py-0.5 rounded ${exam.examType === 'Teacher Assessment' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>
                        {exam.examType}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 flex items-center gap-1"><ClockIcon size={12}/> {exam.durationMinutes} mins</span>
                    </div>
                    
                    {exam.hasAttempted ? (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Score: {exam.score}/{exam.totalMarks}</span>
                        {exam.examType !== 'Teacher Assessment' && (
                          <button onClick={() => handleStartExam(exam)} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Retake</button>
                        )}
                        {exam.examType === 'Teacher Assessment' && (
                          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider"><Lock size={12}/> Locked</span>
                        )}
                      </div>
                    ) : (
                      <Button onClick={() => handleStartExam(exam)} className="w-full text-xs font-bold h-9 mt-1 bg-[#1b4332] hover:bg-[#2d6a4f] shadow-md transition-transform active:scale-95">
                        START EXAM
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-amber-500" /> Today's Schedules
            </h3>
            <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">No Lessons Scheduled</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" /> Upcoming Events
            </h3>
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">No Events Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color, bg, border, hover, onClick }: { icon: any, label: string, color: string, bg: string, border: string, hover: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center justify-center p-4 bg-white cursor-pointer transition-all duration-300 border ${border} rounded-xl shadow-sm text-center group hover:-translate-y-1 hover:shadow-md`}>
      <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-3 transition-colors ${hover.split(' ')[0]} ${color} group-hover:text-white`}>
        <Icon size={22} />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 group-hover:text-gray-900">{label}</span>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
