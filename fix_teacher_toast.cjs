const fs = require('fs');
let code = fs.readFileSync('client/src/pages/TeacherProfile.tsx', 'utf8');

code = code.replace(
  '  const impersonate = trpc.auth.impersonate.useMutation({\n    onSuccess: (res: any) => {\n      if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);\n      window.location.href = "/dashboard";\n    },\n    onError: (err) => toast.error(err.message)\n  });',
  '  const impersonate = trpc.auth.impersonate.useMutation();'
);

code = code.replace(
  '    toast.loading("Switching context...", { duration: 1500 });\n    setTimeout(() => {\n      impersonate.mutate({ email: teacher.email });\n    }, 500);',
  '    const toastId = toast.loading("Switching context...");\n    impersonate.mutate({ email: teacher.email }, {\n      onSuccess: (res: any) => {\n        toast.success("Context switched", { id: toastId });\n        if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);\n        window.location.href = "/dashboard";\n      },\n      onError: (err) => {\n        toast.error(err.message, { id: toastId });\n      }\n    });'
);

fs.writeFileSync('client/src/pages/TeacherProfile.tsx', code);
