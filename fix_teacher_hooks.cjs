const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherProfile.tsx', 'utf8');

// The faulty code has early returns before hooks:
//  if (query.isLoading) { return <div... }
//  if (query.isError || !query.data?.teacher) { return <div... }
//  const { teacher } = query.data;
//  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

const hooksCode = `
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const trpcContext = trpc.useContext();
  const updateMutation = trpc.school.updateTeacherProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      trpcContext.school.getTeacherProfile.invalidate({ id: teacherId! });
    },
    onError: (err) => toast.error(err.message)
  });
`;

// 1. Remove the hooks from where they currently are
code = code.replace(/const \[isEditModalOpen, setIsEditModalOpen\] = useState\(false\);[\s\S]*?onError: \(err\) => toast\.error\(err\.message\)\n  \}\);/, '');

// 2. Put them right after impersonate mutation (before the early returns)
code = code.replace(
  '    onError: (err) => toast.error(err.message)\n  });',
  '    onError: (err) => toast.error(err.message)\n  });\n\n' + hooksCode
);

fs.writeFileSync('client/src/pages/TeacherProfile.tsx', code);
