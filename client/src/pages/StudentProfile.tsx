import { useState } from "react";
import { trpc } from "../lib/trpc";
import { 
  ArrowLeft, Edit, Download, Trash, FileText, CheckCircle2, 
  XCircle, MessageCircle, FileDown, Eye, EyeOff, AlertCircle, LogIn, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarUploader from "../components/AvatarUploader";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function StudentProfile({ params }: { params: { studentId: string } }) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const trpcContext = trpc.useContext();
  const query = trpc.school.getStudentProfile.useQuery({ id: params.studentId }, { retry: false });
  
  const impersonate = trpc.auth.impersonate.useMutation();

  const updateMutation = trpc.school.updateStudentProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      trpcContext.school.getStudentProfile.invalidate({ id: params.studentId });
    },
    onError: (err) => toast.error(err.message)
  });

  const toggleStatusMutation = trpc.school.toggleStudentStatus.useMutation({
    onSuccess: (data) => {
      toast.success(`Student is now ${data.enrollmentStatus}`);
      trpcContext.school.getStudentProfile.invalidate({ id: params.studentId });
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
  const isActive = student.enrollmentStatus === "Active" || !student.enrollmentStatus;

  const handleImpersonate = () => {
    if (confirm("AUDIT WARNING: You are about to log in as this student. All your actions will be recorded. Proceed?")) {
      impersonate.mutate({ email: student.email });
    }
  };

  const handleDeactivate = () => {
    const newStatus = isActive ? "Deactivated" : "Active";
    if (confirm(`Are you sure you want to mark this student as ${newStatus}?`)) {
      toggleStatusMutation.mutate({ id: student._id, status: newStatus });
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(query.data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${student.fullName}_profile.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Profile exported!");
  };

  const handlePrintId = () => {
    // Quick printable version using browser print
    window.print();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.password || editForm.confirmPassword) {
      if (editForm.password !== editForm.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }
    updateMutation.mutate({ id: student._id, updates: editForm });
  };

  const openEditModal = () => {
    setEditForm({
      fullName: student.fullName || "",
      email: student.email || "",
      telephone: student.telephone || "",
      dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
      gender: student.gender || "",
      parentContact: student.parentContact || "",
      className: student.className || "",

      address: student.address || "",
      academicSession: student.academicSession || "",
      feeBalance: student.feeBalance || 0,
      password: student.plainPassword || "",
      confirmPassword: student.plainPassword || ""
    });

    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen pb-12 print:bg-white">
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex items-center gap-4 shadow-sm print:hidden">
        <button onClick={() => setLocation("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-serif text-[#1b4332] font-semibold">Student Record</h1>
          <p className="text-sm text-gray-500">Secure Profile View</p>
        </div>
      </header>

      {/* Printable ID Card (Only visible when printing) */}
      <div className="hidden print:block border-2 border-[#1b4332] rounded-xl w-[3.375in] h-[2.125in] p-4 m-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-[#1b4332]" />
        <div className="relative z-10 flex gap-4 mt-2">
          <div className="w-20 h-24 bg-gray-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
            {student.photograph ? (
              <img src={student.photograph} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-serif text-3xl">
                {student.fullName?.charAt(0) || "S"}
              </div>
            )}
          </div>
          <div className="flex-1 text-sm">
            <h2 className="font-bold text-[#1b4332] text-lg leading-tight uppercase">{student.fullName}</h2>
            <p className="text-gray-600 font-bold mb-2">{student.className || "Student"}</p>
            <p className="text-xs"><b>ID:</b> {student.admissionNumber || "N/A"}</p>
            <p className="text-xs"><b>DOB:</b> {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}</p>
            <p className="text-xs"><b>Blood:</b> {student.bloodGroup || "N/A"}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-[#d8f3dc] text-center text-[10px] text-[#1b4332] py-1 font-bold">
          Green Ledger Academy • Student ID Card
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-8 print:hidden">
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
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isActive ? 'bg-[#d8f3dc] text-[#1b4332]' : 'bg-red-100 text-red-800'}`}>
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
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={openEditModal}><Edit size={14} className="mr-1" /> Edit</Button>
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={handlePrintId}><FileText size={14} className="mr-1" /> Print ID</Button>
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={handleExport}><Download size={14} className="mr-1" /> Export</Button>
                <Button size="sm" variant="outline" className="text-xs h-8" onClick={handleImpersonate} disabled={!student.email}><LogIn size={14} className="mr-1" /> Impersonate</Button>
                <Button size="sm" variant="outline" className={`text-xs h-8 ${isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`} onClick={handleDeactivate}>
                  {isActive ? <XCircle size={14} className="mr-1" /> : <CheckCircle2 size={14} className="mr-1" />}
                  {isActive ? 'Deactivate' : 'Activate'}
                </Button>
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
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Class</label><div className="font-medium">{student.className || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label><div className="font-medium">{student.email || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Telephone</label><div className="font-medium">{student.telephone || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Date of Birth</label><div className="font-medium">{student.dob ? new Date(student.dob).toLocaleDateString() : "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Gender</label><div className="font-medium">{student.gender || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Parent/Guardian Contact</label><div className="font-medium">{student.parentContact || "—"}</div></div>
              <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Academic Session</label><div className="font-medium">{student.academicSession || "Current"}</div></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Permanent Address</label><div className="font-medium">{student.address || "—"}</div></div>
            </div>
          )}

          {activeTab === "audit history" && isAdmin && (
            <div>
              {auditLogs.length ? (
                <ul className="divide-y border rounded overflow-hidden">
                  {auditLogs.map((log: any) => (
                    <li key={log._id} className="p-4 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(log.createdAt).toLocaleString()} • User: {log.userId}</p>
                      {log.details && <p className="text-sm mt-2 text-gray-700 bg-white p-3 border rounded font-mono text-xs overflow-x-auto">{log.details}</p>}
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

      {/* Edit Modal Overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Edit Student Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="edit-student-form" onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required className="w-full p-2 border rounded" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input className="w-full p-2 border rounded" value={editForm.className || ""} onChange={e => setEditForm({...editForm, className: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full p-2 border rounded" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                  <input className="w-full p-2 border rounded" value={editForm.telephone} onChange={e => setEditForm({...editForm, telephone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" className="w-full p-2 border rounded" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="w-full p-2 border rounded" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Contact</label>
                  <input className="w-full p-2 border rounded" value={editForm.parentContact} onChange={e => setEditForm({...editForm, parentContact: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>
                  <input className="w-full p-2 border rounded" value={editForm.academicSession} onChange={e => setEditForm({...editForm, academicSession: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Balance (₦)</label>
                  <input type="number" className="w-full p-2 border rounded" value={editForm.feeBalance} onChange={e => setEditForm({...editForm, feeBalance: Number(e.target.value)})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                  <textarea className="w-full p-2 border rounded" rows={2} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" form="edit-student-form" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
