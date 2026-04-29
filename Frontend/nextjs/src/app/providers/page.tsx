"use client";

import { useState, useEffect } from "react";
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

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [specialty, setSpecialty] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url =
      specialty === "All"
        ? "http://localhost:5000/api/providers/all"
        : `http://localhost:5000/api/providers/all?specialty=${encodeURIComponent(specialty)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProviders(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialty]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      providers.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.specialty.toLowerCase().includes(q) ||
          (p.bio || "").toLowerCase().includes(q)
      )
    );
  }, [search, providers]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Service Providers</h1>
          <p className="text-gray-500 mt-2">Browse trusted local professionals ready to help you.</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, specialty, bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Specialty Filter */}
        <div className="flex gap-3 flex-wrap mb-8">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all border ${
                specialty === s
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span>{SPECIALTY_ICONS[s]}</span> {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading providers...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl font-bold text-gray-700">No providers found</p>
            <p className="text-gray-400 text-sm mt-2">Try a different specialty or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center relative">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="fill-amber-300 text-amber-300" /> 
                    {p.averageRating > 0 ? p.averageRating : "New"}
                    <span className="opacity-70 text-[10px] ml-0.5">({p.reviewCount || 0})</span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black mx-auto mb-3 border-2 border-white/30">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-extrabold">{p.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1 text-indigo-200 text-sm">
                    <span>{SPECIALTY_ICONS[p.specialty] || "✨"}</span>
                    <span>{p.specialty}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {p.bio && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{p.bio}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs font-medium">Experience</div>
                      <div className="font-bold text-gray-900 mt-0.5">{p.experience} yrs</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
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
                    className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-sm border border-indigo-100 hover:border-indigo-600"
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
