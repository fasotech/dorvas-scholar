const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentProfile.tsx', 'utf8');

if (!code.includes('EyeOff')) {
  code = code.replace('Eye, AlertCircle', 'Eye, EyeOff, AlertCircle');
}

if (!code.includes('showPassword')) {
  code = code.replace(
    'const [isEditModalOpen, setIsEditModalOpen] = useState(false);',
    'const [isEditModalOpen, setIsEditModalOpen] = useState(false);\n  const [showPassword, setShowPassword] = useState(false);\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);'
  );
}

if (!code.includes('if (editForm.password !== editForm.confirmPassword)')) {
  code = code.replace(
    '  const handleEditSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    updateMutation.mutate({ id: student._id, updates: editForm });\n  };',
    '  const handleEditSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    if (editForm.password || editForm.confirmPassword) {\n      if (editForm.password !== editForm.confirmPassword) {\n        toast.error("Passwords do not match");\n        return;\n      }\n    }\n    updateMutation.mutate({ id: student._id, updates: editForm });\n  };'
  );
}

if (!code.includes('placeholder="Leave blank to keep current"')) {
  code = code.replace(
    '                <div className="md:col-span-2 flex justify-end gap-3 mt-4">',
    `                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className="w-full p-2 border rounded" placeholder="Leave blank to keep current" value={editForm.password || ""} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} className="w-full p-2 border rounded" placeholder="Confirm password" value={editForm.confirmPassword || ""} onChange={e => setEditForm({...editForm, confirmPassword: e.target.value})} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">`
  );
}

fs.writeFileSync('client/src/pages/StudentProfile.tsx', code);
console.log('Done StudentProfile.tsx');
