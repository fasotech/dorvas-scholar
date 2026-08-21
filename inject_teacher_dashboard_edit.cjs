const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherDashboard.tsx', 'utf8');

code = code.replace(
  'import { LogOut } from "lucide-react";',
  'import { LogOut, Edit, X } from "lucide-react";\nimport { useState } from "react";\nimport { trpc } from "../lib/trpc";\nimport { toast } from "sonner";'
);

code = code.replace(
  'const { user, logout } = useAuth();',
  `const { user, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const query = trpc.school.getTeacherProfile.useQuery({ id: summary?.identity?.profileId }, { enabled: !!summary?.identity?.profileId });
  const updateMutation = trpc.school.updateTeacherProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
      setIsEditModalOpen(false);
      query.refetch();
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
  };`
);

code = code.replace(
  '<button onClick={() => void logout()}',
  '<button onClick={openEditModal} className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Edit Profile"><Edit size={20} /></button>\n          <button onClick={() => void logout()}'
);

const modalHTML = `
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
}`;

code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/, '</div>\n      </div>\n' + modalHTML);

fs.writeFileSync('client/src/pages/TeacherDashboard.tsx', code);
