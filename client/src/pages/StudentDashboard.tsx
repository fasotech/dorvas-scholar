import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { 
  BookOpen, FileText, CheckSquare, ClipboardList, CreditCard, 
  UserSquare2, ArrowRight, Loader2, PlayCircle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const query = trpc.studentPortal.getDashboardData.useQuery();

  if (query.isLoading) {
    return <div className="p-12 flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin mr-3 text-[#2d6a4f]" /> Loading your learning portal...</div>;
  }

  if (query.isError) {
    return <div className="p-12 text-center text-red-600">Failed to load student dashboard. Please ensure you are logged in as a student.</div>;
  }

  const { student, exams, recentNotes } = query.data!;

  const handleStartExam = (exam: any) => {
    if (exam.examType === 'Teacher Assessment' && exam.hasAttempted) {
      alert("You have already completed this official assessment.");
      return;
    }
    setLocation(`/cbt/${exam._id}`);
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen">
      {/* Profile Header Block */}
      <div className="bg-white border-b px-8 py-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#1b4332]" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
            {student.photograph ? (
              <img src={student.photograph} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-gray-400 font-serif">{student.fullName?.charAt(0) || "S"}</span>
            )}
          </div>
          <div className="text-center md:text-left mt-4 md:mt-2">
            <h1 className="text-3xl font-serif text-[#1b4332] uppercase tracking-wide font-bold">{student.fullName}</h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold mt-1">{student.className || "Unassigned Class"}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-6 gap-4">
          <ActionBtn icon={BookOpen} label="Subjects" color="text-blue-500" />
          <ActionBtn icon={FileText} label="Assignments" color="text-amber-500" />
          <ActionBtn icon={CheckSquare} label="CBT Exams" color="text-red-500" />
          <ActionBtn icon={PlayCircle} label="eClassroom" color="text-emerald-500" />
          <ActionBtn icon={CreditCard} label="My Invoices" color="text-purple-500" />
          <ActionBtn icon={UserSquare2} label="ID Card" color="text-gray-700" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-6 pb-12">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="border-b px-6 py-4 flex gap-6 text-sm font-semibold text-gray-500 overflow-x-auto">
              <span className="text-[#1b4332] border-b-2 border-[#1b4332] pb-4 -mb-4">Overview</span>
              <span className="hover:text-gray-900 cursor-pointer">Attendance</span>
              <span className="hover:text-gray-900 cursor-pointer">Result</span>
              <span className="hover:text-gray-900 cursor-pointer">Medical</span>
              <span className="hover:text-gray-900 cursor-pointer">Remarks</span>
            </div>
            
            <div className="p-6 bg-gray-50">
              <div className="bg-white border rounded p-4 mb-6 text-gray-400 text-sm italic">
                Share an update with your teacher...
              </div>

              <h3 className="font-serif font-bold text-lg mb-4 text-[#1b4332]">Recent eClassroom Notes</h3>
              {recentNotes.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-8">No recent notes uploaded for your class.</div>
              ) : (
                <div className="space-y-4">
                  {recentNotes.map((note: any) => (
                    <div key={note._id} className="bg-white p-5 rounded border shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">{note.teacherName?.charAt(0) || "T"}</div>
                        <div>
                          <div className="font-bold text-sm uppercase">{note.teacherName}</div>
                          <div className="text-xs text-gray-500">{new Date(note.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <h4 className="font-bold text-md mb-2">{note.title}</h4>
                      <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded border shadow-sm p-5">
            <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <CheckSquare size={16} className="text-[#2d6a4f]" /> Active CBT Exams
            </h3>
            {exams.length === 0 ? (
              <p className="text-xs text-gray-500">No active exams available.</p>
            ) : (
              <div className="space-y-3">
                {exams.map((exam: any) => (
                  <div key={exam._id} className="p-3 border rounded bg-gray-50 text-sm">
                    <div className="font-bold mb-1">{exam.title}</div>
                    <div className="text-xs text-gray-500 mb-2">{exam.examType} • {exam.durationMinutes} mins</div>
                    
                    {exam.hasAttempted ? (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t">
                        <span className="text-xs font-bold text-emerald-600">Score: {exam.score}/{exam.totalMarks}</span>
                        {exam.examType !== 'Teacher Assessment' && (
                          <button onClick={() => handleStartExam(exam)} className="text-xs text-blue-600 hover:underline">Retake</button>
                        )}
                        {exam.examType === 'Teacher Assessment' && (
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Lock size={12}/> Locked</span>
                        )}
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => handleStartExam(exam)} className="w-full text-xs h-7 mt-2 bg-[#1b4332] hover:bg-[#2d6a4f]">Start Exam</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded border shadow-sm p-5">
            <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">Today's Schedules</h3>
            <p className="text-xs text-gray-500 uppercase">No Lessons</p>
          </div>

          <div className="bg-white rounded border shadow-sm p-5">
            <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">Upcoming Events</h3>
            <p className="text-xs text-gray-500 uppercase">No Events Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gray-50 cursor-pointer transition-colors border rounded-xl shadow-sm text-center h-24">
      <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 shadow-inner border ${color}`}>
        <Icon size={18} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">{label}</span>
    </div>
  );
}
