const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherProfile.tsx', 'utf8');

// 1. Add useState
code = code.replace(
  'const { impersonate } = require("../lib/trpc");',
  '// Handled by standard imports'
);

code = code.replace(
  'import { useRoute } from "wouter";',
  'import { useRoute } from "wouter";\nimport { useState } from "react";'
);

// 2. Add state & mutations
code = code.replace(
  'const { teacher } = query.data;',
  `const { teacher } = query.data;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const trpcContext = trpc.useContext();
  const updateMutation = trpc.school.updateTeacherProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      trpcContext.school.getTeacherProfile.invalidate({ id: params.teacherId });
    },
    onError: (err) => toast.error(err.message)
  });
  
  const openEditModal = () => {
    setEditForm({
      fullName: teacher.fullName,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber,
      address: teacher.address
    });
    setIsEditModalOpen(true);
  };
`
);

// 3. Add Edit Button
code = code.replace(
  '<button onClick={() => setLocation("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">\n          <ArrowLeft size={20} />\n        </button>',
  '<button onClick={() => setLocation("/dashboard")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">\n          <ArrowLeft size={20} />\n        </button>\n        <div className="ml-auto">\n          <Button onClick={openEditModal} variant="outline" size="sm">Edit Info</Button>\n        </div>'
);

// 4. Add the Modal at the bottom
const modalHTML = `
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Edit Teacher Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <ArrowLeft size={20} className="rotate-180" />
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
              <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: teacher._id, updates: editForm })}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/main>\s*<\/div>\s*\);\s*\}/, '</div>\n        </div>\n      </main>\n' + modalHTML);

fs.writeFileSync('client/src/pages/TeacherProfile.tsx', code);
