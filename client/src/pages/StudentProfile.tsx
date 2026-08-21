import { useState } from "react";
import { trpc } from "../lib/trpc";
import { 
  ArrowLeft, Edit, Download, Trash, FileText, CheckCircle2, 
  XCircle, MessageCircle, FileDown, Eye, AlertCircle, LogIn, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function StudentProfile({ params }: { params: { studentId: string } }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const query = trpc.school.getStudentProfile.useQuery({ id: params.studentId }, { retry: false });
  const impersonate = trpc.auth.impersonate.useMutation({
    onSuccess: (res: any) => {
      if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);
      window.location.href = "/dashboard";
    },
    onError: (err) => toast.error(err.message)
  });

  if (query.isLoading) {
    return <div className="p-12 text-center text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading student profile...</div>;
  }

  if (query.isError) {
    return (
      <div className="p-12 max-w-2xl mx-auto">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-200">
          <h2 className="font-bold text-lg mb-2 flex items-center"><AlertCircle className="mr-2" /> Access Restricted</h2>
          <p>{query.error.message === "Unauthorized" ? "You do not have permission to view this profile." : query.error.message}</p>
          <Button onClick={() => setLocation("/dashboard")} className="mt-4" variant="outline">Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { student, attendanceStats, auditLogs, identityRole } = query.data!;
  const isAdmin = identityRole === "admin" || identityRole === "administrator";

  const handleImpersonate = () => {
    if (confirm("AUDIT WARNING: You are about to log in as this student. All your actions will be recorded. Proceed?")) {
      impersonate.mutate({ email: student.email });
    }
  };

  const handleAction = (action: string) => {
    toast.info(`${action} workflow initiated. (Placeholder)`);
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen pb-12">
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => setLocation("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-serif text-[#1b4332] font-semibold">Student Record</h1>
          <p className="text-sm text-gray-500">Secure Profile View</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
          <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden shrink-0 border-4 border-white shadow-md">
            {student.photograph ? (
              <img src={student.photograph} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-serif text-3xl">
                {student.fullName?.charAt(0) || "S"}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-3xl font-serif text-gray-900">{student.fullName}</h2>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${student.enrollmentStatus === 'Active' ? 'bg-[#d8f3dc] text-[#1b4332]' : 'bg-red-100 text-red-800'}`}>
                {student.enrollmentStatus || "Active"}
              </span>
              {(student.feeBalance || 0) > 0 && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                  Outstanding Balance: ₦{student.feeBalance}
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{student.className || "Unassigned Class"} • {student.admissionNumber || "No Reg No."}</p>
            
            {isAdmin && (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleAction("Edit Profile")}><Edit size={14} className="mr-1" /> Edit</Button>
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleAction("Print ID")}><FileText size={14} className="mr-1" /> Print ID</Button>
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => handleAction("Export Profile")}><Download size={14} className="mr-1" /> Export</Button>
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={handleImpersonate} disabled={!student.email}><LogIn size={14} className="mr-1" /> Impersonate</Button>
                <Button size="sm" variant="outline" className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction("Deactivate")}><XCircle size={14} className="mr-1" /> Deactivate</Button>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-5 mb-8 border-l-4 border-l-[#2d6a4f]">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Attendance Summary</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${attendanceStats.totalPercentage}%` }} className="bg-[#40916c] h-full transition-all"></div>
            </div>
            <span className="font-bold text-[#1b4332]">{attendanceStats.totalPercentage}%</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 text-sm text-center">
            <div className="bg-[#f0fff4] p-2 rounded text-[#276749]"><b>{attendanceStats.present}</b><br/>Present</div>
            <div className="bg-blue-50 p-2 rounded text-blue-700"><b>{attendanceStats.late}</b><br/>Late</div>
            <div className="bg-amber-50 p-2 rounded text-amber-700"><b>{attendanceStats.authorizedAbsent}</b><br/>Excused</div>
            <div className="bg-red-50 p-2 rounded text-red-700"><b>{attendanceStats.unauthorizedAbsent}</b><br/>Unauthorized</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6 flex overflow-x-auto">
          {["Overview", "Attendance", "Results", "Fees & Payments", "Documents", "Assignments", "Audit History"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.toLowerCase() ? 'border-[#1b4332] text-[#1b4332]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[300px]">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label><div className="font-medium">{student.email || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Telephone</label><div className="font-medium">{student.telephone || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Date of Birth</label><div className="font-medium">{student.dob ? new Date(student.dob).toLocaleDateString() : "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Gender</label><div className="font-medium">{student.gender || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Parent/Guardian</label><div className="font-medium">{student.parentContact || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Academic Session</label><div className="font-medium">{student.academicSession || "Current"}</div></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Permanent Address</label><div className="font-medium">{student.address || "—"}</div></div>
            </div>
          )}

          {activeTab === "audit history" && isAdmin && (
            <div>
              {auditLogs.length ? (
                <ul className="divide-y">
                  {auditLogs.map((log: any) => (
                    <li key={log._id} className="py-3">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()} • User: {log.userId}</p>
                      {log.details && <p className="text-sm mt-1 text-gray-600 bg-gray-50 p-2 rounded border">{log.details}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-500 py-8">No audit logs found for this profile.</div>
              )}
            </div>
          )}

          {activeTab !== "overview" && activeTab !== "audit history" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 capitalize">{activeTab}</h3>
              <p className="text-gray-500 mt-1 max-w-sm">Detailed {activeTab} records will appear here once connected to the respective module.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
