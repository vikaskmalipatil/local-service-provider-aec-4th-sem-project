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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 flex flex-col justify-between p-10 lg:p-16 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="bg-white/15 backdrop-blur-sm text-white font-black text-xl px-3 py-2 rounded-xl border border-white/20">LF</div>
          <span className="text-white font-bold text-xl tracking-tight">LocalFinder</span>
        </div>

        {/* Hero Text */}
        <div className="relative">
          <div className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mb-6">
            🚀 Provider Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Scale Your Service Business<br />with LocalFinder
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-10">
            Connect with thousands of local clients. Manage your workflow, build your professional reputation, and maximize your earnings—all through our streamlined platform.
          </p>

          {/* Service Chips */}
          <div className="flex flex-wrap gap-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white px-4 py-2.5 rounded-2xl text-sm font-medium hover:bg-white/20 transition-all cursor-default">
                <span>{f.icon}</span>
                <span>{f.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-10">
          {[
            { value: "2,500+", label: "Providers" },
            { value: "12,000+", label: "Jobs Done" },
            { value: "4.9★", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-white font-extrabold text-xl">{s.value}</div>
              <div className="text-indigo-300 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 flex items-center justify-center bg-slate-50 p-8 lg:p-16">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Welcome back 👋</h2>
          <p className="text-gray-500 mb-8">Choose an option to get started</p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Sign in to Your Account
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="w-full py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg border-2 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all active:scale-95"
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
