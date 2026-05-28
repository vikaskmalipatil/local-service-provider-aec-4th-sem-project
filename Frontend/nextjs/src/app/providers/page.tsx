"use client";

import { useMemo, useState, useEffect } from "react";
import { Star, MapPin, Search } from "lucide-react";

const SPECIALTIES = ["All", "Plumbing", "Electrical", "Gardening", "House Painting", "Cleaning"];

const SPECIALTY_ICONS: Record<string, string> = {
  "Plumbing": "🔧",
  "Electrical": "⚡",
  "Gardening": "🌿",
  "House Painting": "🖌️",
  "Cleaning": "🧹",
  "All": "🔍",
};

type Provider = {
  _id: string;
  name: string;
  specialty: string;
  bio?: string;
  experience?: number;
  totalJobs?: number;
  phone?: string;
  available?: boolean;
  averageRating?: number;
  reviewCount?: number;
  distance?: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [specialty, setSpecialty] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    let url = `http://localhost:5000/api/providers/all`;
    const params = new URLSearchParams();
    
    if (specialty !== "All") params.append("specialty", specialty);
    if (userLocation) {
      params.append("lat", userLocation.lat.toString());
      params.append("lng", userLocation.lng.toString());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProviders(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialty, userLocation]);

  const handleGetLocation = async () => {
    if (userLocation) {
      setUserLocation(null);
      return;
    }

    setLoading(true);

    // Try to get saved address first
    const token = localStorage.getItem("token");
    const selectedAddressId = localStorage.getItem("selectedAddress");
    
    if (token && selectedAddressId) {
      try {
        const res = await fetch(`http://localhost:5000/api/address/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const addr = data.addresses?.find((a: any) => a._id === selectedAddressId);
          if (addr && addr.location?.coordinates) {
            setUserLocation({
              lat: addr.location.coordinates[1], // GeoJSON is [lng, lat]
              lng: addr.location.coordinates[0]
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch saved address location:", err);
      }
    }

    // Fallback to browser geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser and no saved address was found.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error.message || error);
        alert(`Unable to retrieve your location: ${error.message || "Permission denied."}\nPlease enable location access or select an address in the Choose Location page.`);
        setLoading(false);
      }
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const spec = (p.specialty || "").toLowerCase();
      const bio = (p.bio || "").toLowerCase();
      return name.includes(q) || spec.includes(q) || bio.includes(q);
    });
  }, [providers, search]);

  return (
    <div className="bg-[var(--background)]">
      {/* Header */}
      <div className="relative overflow-hidden min-h-[35vh] flex items-center animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.3),transparent_60%)] animate-float" />
        <div className="relative page-container py-12 md:py-16 z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 ring-1 ring-white/20 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Browse verified professionals
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white">
              Service Providers
            </h1>
            <p className="mt-4 text-lg text-indigo-100/90 font-medium">
              Filter by specialty, search by name, and request direct booking in seconds.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container py-10 -mt-10 relative z-20">
        {/* Toolbar */}
        <div className="glass-panel rounded-3xl p-5 md:p-6 shadow-xl mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search and Location */}
            <div className="relative w-full lg:max-w-xl flex gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, specialty, bio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
              <button
                onClick={handleGetLocation}
                className={`whitespace-nowrap px-5 py-3.5 font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2 active:scale-95 ${
                  userLocation 
                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700" 
                    : "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100 hover:shadow-md"
                }`}
                title="Find providers near me"
              >
                {userLocation ? "❌" : "📍"} <span className="hidden sm:inline">{userLocation ? "Clear Location" : "Near Me"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-700 px-3 py-1.5 bg-white/50 rounded-lg">
                {loading ? "Loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
              </div>
              {specialty !== "All" && (
                <button
                  type="button"
                  onClick={() => setSpecialty("All")}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Specialty Filter */}
          <div className="mt-5 flex gap-2 flex-wrap">
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-semibold text-sm transition-all border ${
                  specialty === s
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span aria-hidden="true">{SPECIALTY_ICONS[s]}</span> {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="surface rounded-3xl overflow-hidden shadow-sm">
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                    <div className="flex-1">
                      <div className="h-4 w-40 rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="h-16 rounded-2xl bg-slate-100" />
                    <div className="h-16 rounded-2xl bg-slate-100" />
                  </div>
                  <div className="mt-4 h-11 rounded-2xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 surface rounded-3xl border-dashed p-14 text-center">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <p className="text-xl font-bold text-slate-800">No providers found</p>
            <p className="text-slate-500 text-sm mt-2">Try a different specialty or search term.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 text-white relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="fill-amber-300 text-amber-300" /> 
                    {(p.averageRating ?? 0) > 0 ? p.averageRating : "New"}
                    <span className="opacity-70 text-[10px] ml-0.5">({p.reviewCount || 0})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black border border-white/25">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-extrabold">{p.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-indigo-100/90 text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15">
                          <span aria-hidden="true">{SPECIALTY_ICONS[p.specialty] || "✨"}</span>
                          <span className="font-semibold">{p.specialty}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-100/90">
                          <MapPin size={14} className="opacity-90" />
                          {p.distance !== undefined ? `${(p.distance / 1000).toFixed(5)} km away` : "Nearby"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  {p.bio && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{p.bio}</p>
                  )}

                  <div className="bg-slate-50 rounded-2xl p-3 mb-4 border border-slate-100">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                      <div className="text-sm font-medium text-slate-700">
                        {p.address || p.city || p.state ? (
                          <>
                            {p.address && <span>{p.address}</span>}
                            {(p.address && (p.city || p.state)) && <>, </>}
                            {p.city && <span>{p.city}</span>}
                            {(p.city && p.state) && <>, </>}
                            {p.state && <span>{p.state}</span>}
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Location not specified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <div className="text-gray-400 text-xs font-medium">Experience</div>
                      <div className="font-bold text-gray-900 mt-0.5">{p.experience} yrs</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-center">
                      <div className="text-gray-400 text-xs font-medium">Jobs Done</div>
                      <div className="font-bold text-gray-900 mt-0.5">{p.totalJobs}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                        p.available
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.available ? "bg-green-500" : "bg-gray-400"}`} />
                      {p.available ? "Available" : "Unavailable"}
                    </span>

                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors"
                      >
                        📞 Call
                      </a>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => window.location.href = `/request-service?providerId=${p._id}&providerName=${encodeURIComponent(p.name)}&specialty=${encodeURIComponent(p.specialty)}`}
                    className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-sm border border-indigo-100 hover:border-indigo-600"
                  >
                    Request Direct Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
