"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function ProviderLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/providers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.msg || data.error || "Login failed"); return; }

      localStorage.setItem("providerToken", data.token);
      localStorage.setItem("providerInfo", JSON.stringify(data.provider));
      router.push("/dashboard");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-800 via-indigo-600 to-purple-800 flex-col justify-center items-center p-16 relative overflow-hidden animate-fade-in">
        <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative text-center z-10">
          <div className="inline-flex items-center gap-3 mb-10">
            <div className="bg-white/20 backdrop-blur-md text-white font-black text-xl px-4 py-2 rounded-xl border border-white/30 shadow-xl">LF</div>
            <span className="text-white font-black text-2xl tracking-tight">LocalFinder</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Welcome Back</h2>
          <p className="text-indigo-100 text-lg max-w-sm leading-relaxed font-medium">
            Sign in to access your dashboard, manage active jobs, and update your professional profile.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4">
            {["Accept job requests instantly", "Track your earnings & jobs", "Update availability anytime"].map((t) => (
              <div key={t} className="flex items-center gap-3 glass-panel bg-white/10 rounded-2xl px-5 py-3 text-white text-sm font-semibold shadow-sm hover:bg-white/20 transition-all cursor-default">
                <span className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-[var(--background)] p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black px-3 py-1.5 rounded-lg shadow-md">LF</div>
            <span className="font-black text-gray-900 text-xl tracking-tight">LocalFinder</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-2 font-medium">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-start gap-3 shadow-sm animate-fade-in">
              <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative group">
                <input
                  type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="Your password"
                />
                <button
                  type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-black hover:text-purple-600 transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
