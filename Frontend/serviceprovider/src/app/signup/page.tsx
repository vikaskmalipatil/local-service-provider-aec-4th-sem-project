"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const SPECIALTIES = [
  { name: "Plumbing", icon: "🔧", desc: "Pipes, leaks & more" },
  { name: "Electrical", icon: "⚡", desc: "Wiring & repairs" },
  { name: "Gardening", icon: "🌿", desc: "Lawn & landscaping" },
  { name: "House Painting", icon: "🖌️", desc: "Interior & exterior" },
  { name: "Cleaning", icon: "🧹", desc: "Deep cleaning" },
  { name: "Other", icon: "✨", desc: "Custom specialty" },
];

export default function ProviderSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", specialty: "",
    phone: "", bio: "", experience: ""
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [customSpecialty, setCustomSpecialty] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.specialty) { setError("Please select your specialty"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/providers/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specialty: form.specialty === "Other" ? customSpecialty : form.specialty,
          experience: Number(form.experience)
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || data.error || "Signup failed"); return; }
      alert("Registration successful! Please log in.");
      router.push("/login");
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
          <h2 className="text-4xl font-black text-white mb-4">The Professionals' Choice</h2>
          <p className="text-indigo-100 text-lg max-w-sm leading-relaxed font-medium">
            Your dedicated workspace for managing client requests and streamlining your daily operations.
          </p>

          {/* Step indicators */}
          <div className="mt-12 space-y-4">
            {["Create your account", "Choose your specialty", "Start accepting jobs"].map((t, i) => (
              <div key={t} className={`flex items-center gap-4 text-left transition-all glass-panel bg-white/5 rounded-2xl p-4 border-white/10 ${step > i ? "opacity-100 shadow-sm" : "opacity-50"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${step > i ? "bg-emerald-400 text-white shadow-md" : "bg-white/10 text-white"}`}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span className="text-white font-semibold text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-start justify-center bg-[var(--background)] p-8 overflow-y-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-xl border border-slate-100 my-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black px-3 py-1.5 rounded-lg shadow-md">LF</div>
            <span className="font-black text-gray-900 text-xl tracking-tight">LocalFinder</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-2 font-medium">Join as a service provider today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm shadow-sm animate-fade-in flex items-start gap-3">
              <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name *</label>
                <input
                  name="name" type="text" required value={form.name} onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email *</label>
                <input
                  name="email" type="email" required value={form.email} onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password *</label>
              <div className="relative group">
                <input
                  name="password" type={showPwd ? "text" : "password"} required value={form.password} onChange={handleChange}
                  className="w-full px-4 py-3.5 pr-12 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="Minimum 6 characters"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 hover:text-indigo-600 transition-colors">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Specialty Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Specialty *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s.name} type="button"
                    onClick={() => { setForm({ ...form, specialty: s.name }); setStep(2); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      form.specialty === s.name
                        ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100"
                        : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
                    }`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className={`text-xs font-bold ${form.specialty === s.name ? "text-indigo-700" : "text-gray-800"}`}>{s.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {form.specialty === "Other" && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specify your specialty *</label>
                  <input
                    type="text"
                    required
                    value={customSpecialty}
                    onChange={(e) => setCustomSpecialty(e.target.value)}
                    className="w-full px-4 py-3.5 border border-indigo-200 rounded-2xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                    placeholder="e.g. Yoga Instructor, Tutor, etc."
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                <input
                  name="phone" type="tel" value={form.phone} onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Experience (years)</label>
                <input
                  name="experience" type="number" min="0" value={form.experience} onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Bio / About You</label>
              <textarea
                name="bio" value={form.bio} onChange={handleChange} rows={3}
                className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm placeholder:text-gray-400 resize-none"
                placeholder="Tell customers about your skills and experience..."
              />
            </div>

            <button
              type="submit" disabled={loading || !form.specialty}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>Create Provider Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-black hover:text-purple-600 transition-colors">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
