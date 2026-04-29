"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProviderProfile() {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [form, setForm] = useState({ bio: "", phone: "", experience: "", available: true });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const getToken = () => localStorage.getItem("providerToken");

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }

    fetch("http://localhost:5000/api/providers/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProvider(data.provider);
        setForm({
          bio: data.provider?.bio || "",
          phone: data.provider?.phone || "",
          experience: String(data.provider?.experience || 0),
          available: data.provider?.available ?? true,
        });
      })
      .catch(console.error);
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const token = getToken();
    try {
      const res = await fetch("http://localhost:5000/api/providers/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, experience: Number(form.experience) }),
      });
      const data = await res.json();
      if (res.ok) {
        setProvider(data.provider);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl">
            <span className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-sm">LF</span>
            LocalFinder
          </Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Identity Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-black text-indigo-700 mx-auto mb-4">
                {provider.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">{provider.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{provider.email}</p>

              <div className="mt-4 space-y-2">
                <div className="bg-indigo-50 text-indigo-700 rounded-xl py-2 px-4 font-bold text-sm">
                  🔧 {provider.specialty}
                </div>
                <div className={`rounded-xl py-2 px-4 font-bold text-sm ${provider.available ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {provider.available ? "🟢 Available" : "🔴 Unavailable"}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 font-medium">Experience</div>
                  <div className="font-bold text-gray-900 mt-0.5">{provider.experience} yrs</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 font-medium">Total Jobs</div>
                  <div className="font-bold text-gray-900 mt-0.5">{provider.totalJobs}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>

              {saved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium">
                  ✅ Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number" min="0" value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Professional Bio</label>
                  <textarea
                    rows={4} value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none"
                    placeholder="Briefly describe your expertise, specialties, and any notable certifications or skills..."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox" id="available" checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <label htmlFor="available" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Open for new service requests
                  </label>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
