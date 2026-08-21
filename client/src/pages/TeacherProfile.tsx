import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "../lib/trpc";

import { ArrowLeft, UserCircle, LogIn, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TeacherProfile() {
  const { teacherId } = useParams();
  const [, setLocation] = useLocation();
  
  
  const query = trpc.school.getTeacherProfile.useQuery(
    { id: teacherId! },
    { enabled: !!teacherId }
  );

  const impersonate = trpc.auth.impersonate.useMutation({
    onSuccess: (res: any) => {
      if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);
      window.location.href = "/dashboard";
    },
    onError: (err) => toast.error(err.message)
  });

  if (query.isLoading) {
    return <div className="p-12 flex justify-center items-center min-h-screen"><Loader2 className="animate-spin mr-3 text-[#2d6a4f]" /> Loading profile...</div>;
  }

  if (query.isError || !query.data?.teacher) {
    return (
      <div className="p-12 text-center text-red-600 font-sans">
        <XCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-bold">Teacher Not Found</h2>
        <Button variant="outline" className="mt-4" onClick={() => setLocation("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  const { teacher } = query.data;

  const handleImpersonate = () => {
    if (!teacher.email) {
      toast.error("Teacher has no email to impersonate.");
      return;
    }
    toast.loading("Switching context...", { duration: 1500 });
    setTimeout(() => {
      impersonate.mutate({ email: teacher.email });
    }, 500);
  };

  return (
    <div className="bg-[#fcfdfc] min-h-screen pb-12 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => setLocation("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{teacher.fullName}</h1>
          <p className="text-sm text-gray-500">Teacher Profile — {teacher.status}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
          <div className="w-24 h-24 bg-[#1b4332] text-white rounded-full flex items-center justify-center text-3xl font-bold shrink-0">
            {teacher.fullName.charAt(0)}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{teacher.fullName}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                Teacher
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${teacher.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {teacher.status || 'inactive'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button size="sm" className="text-xs h-8 bg-[#1b4332] hover:bg-[#2d6a4f]" onClick={handleImpersonate} disabled={!teacher.email || impersonate.isPending}>
                {impersonate.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <LogIn size={14} className="mr-1" />} 
                Impersonate Teacher
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-6 border-b pb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label><div className="font-medium text-gray-900">{teacher.email || "—"}</div></div>
            <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Registered On</label><div className="font-medium text-gray-900">{new Date(teacher.createdAt).toLocaleDateString()}</div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
