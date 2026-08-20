
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
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
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f4] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="bg-[#125c3a] p-8 text-center">
          <h1 className="text-3xl font-serif font-semibold text-white mb-2 tracking-tight">GREEN LEDGER</h1>
          <p className="text-[#a5cbb7] text-sm font-medium uppercase tracking-widest">Secure School Workspace</p>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Account Login</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"
                placeholder="adielasam2015@gmail.com"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#125c3a] focus:border-[#125c3a] outline-none transition-colors text-gray-800"
                placeholder="��������"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-[#125c3a] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#0e482d] transition-colors disabled:opacity-70 mt-2"
            >
              {loginMutation.isPending ? "Signing In..." : "Secure Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

