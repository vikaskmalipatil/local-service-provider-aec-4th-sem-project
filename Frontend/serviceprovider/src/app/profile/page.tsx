"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../components/MapPicker"), { ssr: false });

export default function ProviderProfile() {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [form, setForm] = useState({ 
    bio: "", phone: "", experience: "", available: true,
    address: "", city: "", state: "", zip: "", country: "",
    lat: undefined as number | undefined, lng: undefined as number | undefined
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const getToken = () => localStorage.getItem("providerToken");

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/providers/profile`, {
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
          address: data.provider?.address || "",
          city: data.provider?.city || "",
          state: data.provider?.state || "",
          zip: data.provider?.zip || "",
          country: data.provider?.country || "",
          lat: data.provider?.location?.coordinates?.[1],
          lng: data.provider?.location?.coordinates?.[0],
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/providers/profile`, {
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        alert("Location captured successfully!");
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] animate-fade-in">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl hover:scale-105 transition-transform">
            <span className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-2.5 py-1 rounded-lg text-sm shadow-md">LF</span>
            <span className="text-gradient bg-gradient-to-r from-slate-900 to-indigo-900">LocalFinder</span>
          </Link>
          <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-bold text-sm hover:from-indigo-100 hover:to-purple-100 shadow-sm border border-indigo-100 transition-all active:scale-95">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Identity Card */}
          <div className="md:col-span-1">
            <div className="glass-panel bg-white/70 rounded-3xl p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl font-black text-indigo-700 mx-auto mb-5 shadow-inner border border-indigo-200/50 group-hover:scale-105 transition-transform">
                {provider.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-slate-900">{provider.name}</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">{provider.email}</p>

              <div className="mt-6 space-y-3">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 rounded-xl py-2.5 px-4 font-bold text-sm shadow-sm">
                  🔧 {provider.specialty}
                </div>
                <div className={`rounded-xl py-2.5 px-4 font-bold text-sm shadow-sm border ${provider.available ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {provider.available ? "🟢 Available" : "🔴 Unavailable"}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience</div>
                  <div className="font-black text-slate-800 mt-1">{provider.experience} yrs</div>
                </div>
                <div className="bg-white/60 border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Jobs</div>
                  <div className="font-black text-slate-800 mt-1">{provider.totalJobs}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="glass-panel bg-white/80 rounded-3xl p-8 lg:p-10 shadow-xl relative">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Edit Profile</h3>

              {saved && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 animate-fade-in">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
                  <input
                    type="number" min="0" value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Professional Bio</label>
                  <textarea
                    rows={4} value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm resize-none"
                    placeholder="Briefly describe your expertise, specialties, and any notable certifications or skills..."
                  />
                </div>

                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-100 rounded-2xl shadow-inner">
                  <input
                    type="checkbox" id="available" checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-all"
                  />
                  <label htmlFor="available" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                    Open for new service requests
                  </label>
                </div>

                <hr className="my-8 border-slate-100" />
                <h4 className="text-xl font-black text-slate-900 mb-6">Location & Service Area</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                    <input
                      type="text" value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                    <input
                      type="text" value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">State/Province</label>
                    <input
                      type="text" value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text" value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                    <input
                      type="text" value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-2xl p-6 border border-indigo-100 shadow-sm mt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-5">
                    <div>
                      <h5 className="font-bold text-indigo-900">GPS Coordinates</h5>
                      <p className="text-sm text-indigo-700/80 mt-1 font-medium">
                        {form.lat && form.lng 
                          ? `Lat: ${form.lat.toFixed(6)}, Lng: ${form.lng.toFixed(6)}`
                          : "No coordinates captured. Customers won't see you in 'Nearby' searches."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="whitespace-nowrap px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl text-sm transition-all shadow-sm border border-indigo-200 active:scale-95"
                    >
                      📍 Use Current Location
                    </button>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden border border-indigo-200 shadow-inner">
                    <MapPicker 
                      defaultLocation={form.lat && form.lng ? [form.lat, form.lng] : null}
                      onSelect={(pos: {lat: number, lng: number}) => setForm(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }))}
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200 mt-8 active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
