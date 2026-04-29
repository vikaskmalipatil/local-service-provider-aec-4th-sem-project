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
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 flex-col justify-center items-center p-16 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-3 mb-10">
            <div className="bg-white/15 text-white font-black text-xl px-3 py-2 rounded-xl border border-white/20">LF</div>
            <span className="text-white font-bold text-xl">LocalFinder</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Welcome Back</h2>
          <p className="text-indigo-200 text-lg max-w-sm leading-relaxed">
            Sign in to access your dashboard, manage active jobs, and update your professional profile.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4">
            {["Accept job requests instantly", "Track your earnings & jobs", "Update availability anytime"].map((t) => (
              <div key={t} className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 text-white text-sm font-medium">
                <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-xs font-black text-white shrink-0">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-indigo-600 text-white font-black px-2 py-1 rounded-lg">LF</div>
            <span className="font-bold text-gray-800">LocalFinder</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-1">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-start gap-3">
              <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 border border-gray-200 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="Your password"
                />
                <button
                  type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
