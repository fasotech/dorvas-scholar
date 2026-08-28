import { Users, BookOpen, ClipboardList, TrendingUp, CalendarDays, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarUploader from "../components/AvatarUploader";
import { useAuth } from "@/_core/hooks/useAuth";
import { LogOut, Edit, X } from "lucide-react";
import { useState } from "react";
import { trpc } from "../lib/trpc";
import { toast } from "sonner";

export default function TeacherDashboard({ summary, onNavigate }: { summary: any, onNavigate: (s: any) => void }) {
  const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const utils = trpc.useContext();
  const query = trpc.school.getTeacherProfile.useQuery({ id: summary?.identity?.profileId }, { enabled: !!summary?.identity?.profileId });
  const updateMutation = trpc.school.updateTeacherProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
      setIsEditModalOpen(false);
      query.refetch();
      utils.auth.me.invalidate();
      utils.school.dashboard.invalidate();
    },
    onError: (err) => toast.error(err.message)
  });

  const openEditModal = () => {
    if (query.data?.teacher) {
      setEditForm({
        fullName: query.data.teacher.fullName,
        email: query.data.teacher.email,
        phoneNumber: query.data.teacher.phoneNumber,
        address: query.data.teacher.address
      });
      setIsEditModalOpen(true);
    } else {
      toast.error("Profile data not loaded yet.");
    }
  };
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
            <BookOpen size={12} /> Educator Portal
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to your classroom</h1>
          <p className="text-gray-500 mt-2">Manage your students, upload notes, and review assessments.</p>
        </div>
        <div className="flex items-center gap-4">
          <AvatarUploader 
            id={summary?.identity?.profileId}
            type="Teacher"
            currentPicture={(user as any)?.profilePicture}
            initials={(user as any)?.displayName?.charAt(0) || "T"}
            size="md"
            editable={false}
          />
          <button onClick={openEditModal} className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Edit Profile"><Edit size={20} /></button>
          <button onClick={() => void logout()} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Edit My Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profile Picture</label>
                {editForm.profilePicture && (
                  <img src={editForm.profilePicture} alt="Preview" className="w-20 h-20 object-cover rounded-full mb-2 border border-gray-200" />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditForm((p: any) => ({ ...p, profilePicture: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                <input type="password" placeholder="Leave blank to keep current" onChange={e => setEditForm({...editForm, password: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input value={editForm.fullName || ''} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input value={editForm.phoneNumber || ''} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                <input value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: summary.identity.profileId, updates: editForm })}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
