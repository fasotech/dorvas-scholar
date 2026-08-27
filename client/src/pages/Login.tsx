import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (res: any) => {
      if (res.token) sessionStorage.setItem("manus-cookie", `auth_token=${res.token}`);
      queryClient.invalidateQueries({ queryKey: [["auth", "me"]] });
      setLocation("/dashboard");
    },
    onError: (err: any) => {
      setError(err.message || "Invalid credentials");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Image Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1b4332]">
        <div className="absolute inset-0">
          <img src="/login-bg.jpg" alt="Students in classroom" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <img src="/greenledger-logo.png" alt="Green Ledger" className="h-10 w-auto bg-white p-2 rounded-lg" />
          </div>
          
          <div className="text-white max-w-lg mb-8">
            <div className="flex items-center gap-2 mb-4 text-emerald-300 font-medium text-sm tracking-wide">
              <ShieldCheck size={18} />
              <span>Secure multi-tenant school portal</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Sign in to your school workspace</h1>
            <p className="text-gray-300 text-lg">
              Parents, teachers and staff each open their own portal — never a shared admin menu.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <img src="/greenledger-logo.png" alt="Green Ledger" className="h-10 w-auto bg-[#1b4332] p-2 rounded-lg mb-6" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h2>
          <p className="text-gray-500 mb-8 text-sm">
            Staff and parents use email. Students use their admission number and the password set by the school.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-3">
              <div className="mt-0.5">⚠️</div>
              <div>{error}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email or admission number</label>
              <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d6a4f] focus:border-[#2d6a4f] outline-none transition-all text-gray-800"
                placeholder="teacher@school.com"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2d6a4f] focus:border-[#2d6a4f] outline-none transition-all text-gray-800"
                  placeholder="••••••••"
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#2d6a4f] bg-gray-100 border-gray-300 rounded focus:ring-[#2d6a4f]"
              />
              <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-700">Remember me on this device</label>
            </div>

            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-[#40916c] hover:bg-[#2d6a4f] text-white p-3.5 rounded-lg font-bold text-[15px] transition-colors disabled:opacity-70 mt-2 shadow-sm"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            School not registered? <a href="#" className="text-[#2d6a4f] font-semibold hover:underline">Create school account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

