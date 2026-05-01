"use client";
import { useRouter } from "next/navigation";

const features = [
  { icon: "🔧", title: "Plumbing", desc: "Fix leaks, pipes & more" },
  { icon: "⚡", title: "Electrical", desc: "Wiring, repairs & installs" },
  { icon: "🌿", title: "Gardening", desc: "Lawn care & landscaping" },
  { icon: "🖌️", title: "House Painting", desc: "Interior & exterior work" },
  { icon: "🧹", title: "Cleaning", desc: "Deep clean & maintenance" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row animate-fade-in">
      {/* Left Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-800 via-indigo-600 to-purple-800 flex flex-col justify-between p-10 lg:p-16 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md text-white font-black text-xl px-4 py-2 rounded-xl border border-white/30 shadow-xl">LF</div>
          <span className="text-white font-black text-2xl tracking-tight">LocalFinder</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 my-12">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-bold px-4 py-2 rounded-full border border-white/20 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Provider Portal
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
            Scale Your Service Business<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">with LocalFinder</span>
          </h1>
          <p className="text-indigo-100 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg font-medium">
            Connect with thousands of local clients. Manage your workflow, build your professional reputation, and maximize your earnings—all through our streamlined platform.
          </p>

          {/* Service Chips */}
          <div className="flex flex-wrap gap-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold hover:bg-white/20 transition-all cursor-default shadow-sm">
                <span>{f.icon}</span>
                <span>{f.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative grid grid-cols-3 gap-6 mt-auto">
          {[
            { value: "2,500+", label: "Providers" },
            { value: "12,000+", label: "Jobs Done" },
            { value: "4.9★", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label} className="glass-panel rounded-2xl p-5 text-center">
              <div className="text-white font-black text-2xl">{s.value}</div>
              <div className="text-indigo-200 text-xs mt-1 font-bold tracking-wider uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 flex items-center justify-center bg-[var(--background)] p-8 lg:p-16">
        <div className="w-full max-w-md text-center bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Welcome back 👋</h2>
          <p className="text-gray-500 mb-8 font-medium">Choose an option to get started</p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Sign in to Your Account
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="w-full py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all active:scale-95 shadow-sm"
            >
              Register as a Provider
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            By continuing, you agree to LocalFinder's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
