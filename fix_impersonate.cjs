const fs = require('fs');

// 1. Add Impersonate to auth.ts
let authCode = fs.readFileSync('server/routers/auth.ts', 'utf8');
const impersonateRoute = `
  impersonate: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      // Must be an admin to impersonate
      if (!ctx.user || ctx.user.role !== 'admin') {
        throw new Error("Only admins can impersonate users.");
      }

      const targetUser = await SchoolUser.findOne({ email: input.email.toLowerCase(), isDeleted: { $ne: true }, isActive: { $ne: false } });
      if (!targetUser) throw new Error("User not found");

      const token = jwt.sign(
        { id: targetUser._id, email: targetUser.email, role: targetUser.role, name: targetUser.displayName },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      if (ctx.res) {
        ctx.res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
      }

      return { success: true, role: targetUser.role, token };
    }),
`;

authCode = authCode.replace('logout: publicProcedure', impersonateRoute + '\n  logout: publicProcedure');
fs.writeFileSync('server/routers/auth.ts', authCode);

// 2. Modify Home.tsx
let homeCode = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');

// Add topbar logout button
homeCode = homeCode.replace(
  '<span className="avatar top-avatar">{initials}</span></div></header>',
  '<span className="avatar top-avatar">{initials}</span><button className="notice-button" style={{marginLeft:"8px"}} onClick={() => void logout()} aria-label="Sign out" title="Log Out"><LogOut size={18} /></button></div></header>'
);

// Add impersonate button to UserManagement
const impMutation = `
  const impersonateMutation = trpc.auth.impersonate.useMutation({
    onSuccess: (res: any) => {
      if (res.token) sessionStorage.setItem("manus-cookie", \`auth_token=\${res.token}\`);
      window.location.href = "/dashboard";
    },
    onError: (err) => toast.error(err.message)
  });
`;

homeCode = homeCode.replace(
  'const [password, setPassword] = useState("Password123!");',
  'const [password, setPassword] = useState("Password123!");' + impMutation
);

homeCode = homeCode.replace(
  '<button onClick={() => {',
  '<button onClick={() => impersonateMutation.mutate({ email: u.email })} className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-4">Impersonate</button>\n<button onClick={() => {'
);

fs.writeFileSync('client/src/pages/Home.tsx', homeCode);
