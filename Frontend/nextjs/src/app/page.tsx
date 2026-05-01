"use client";

import { useState } from "react";
import { Heart, Search, Star, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SERVICES } from "./data/services";

export default function Home() {
  const [likes, setLikes] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedLikes = localStorage.getItem("likedServices");
      return savedLikes ? JSON.parse(savedLikes) : [];
    } catch {
      return [];
    }
  });

  const toggleLike = (id: number) => {
    const newLikes = likes.includes(id)
      ? likes.filter((l) => l !== id)
      : [...likes, id];
    
    setLikes(newLikes);
    localStorage.setItem("likedServices", JSON.stringify(newLikes));
  };

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center animate-fade-in-up">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542644917-8e100f28a38b?w=2000&q=80&auto=format&fit=crop"
            alt="Local Indian services background"
            className="h-full w-full object-cover animate-float"
            style={{ transformOrigin: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/80 to-purple-950/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.4),transparent_60%)]" />
        </div>

        <div className="relative z-10 page-container py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-50 ring-1 ring-white/15 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Trusted local pros, fast booking
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Expert Services,
                <span className="block text-gradient bg-gradient-to-r from-indigo-300 via-white to-purple-300 pb-2">
                  right when you need them
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-indigo-100/90 sm:text-xl font-medium">
                Find verified professionals for repairs, cleaning, and maintenance — compare pricing, book in minutes, and track your request live.
              </p>

              <div className="mt-8 max-w-2xl">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/70"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search: plumber, electrician, AC repair…"
                    className="w-full rounded-2xl bg-white/95 pl-12 pr-28 py-4 text-sm text-slate-900 shadow-2xl ring-1 ring-white/30 backdrop-blur placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:text-base"
                    aria-label="Search for a service"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors">
                    Search
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Plumbing", "Electrician", "Cleaning", "AC Repair", "Carpentry"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50 ring-1 ring-white/15 hover:bg-white/15 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { k: "4.8+", v: "Average rating" },
                    { k: "10k+", v: "Bookings served" },
                    { k: "30m", v: "Typical response" },
                    { k: "Verified", v: "Background checks" },
                  ].map((s) => (
                    <div
                      key={s.v}
                      className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur"
                    >
                      <div className="text-lg font-extrabold text-white">{s.k}</div>
                      <div className="text-[11px] font-semibold text-indigo-100/80">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="text-lg font-bold text-white">Popular this week</div>
                    <div className="text-sm text-indigo-200">Services people book the most</div>
                  </div>
                  <div className="rounded-full bg-indigo-500/30 border border-indigo-300/30 px-3 py-1 text-xs font-bold text-indigo-100 shadow-inner">
                    Near you
                  </div>
                </div>
                <div className="space-y-4">
                  {SERVICES.slice(0, 3).map((service) => (
                    <div
                      key={service.id}
                      className="group flex items-center gap-4 rounded-2xl bg-white/10 border border-white/10 p-3 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="h-16 w-16 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-base font-bold text-white group-hover:text-indigo-100 transition-colors">{service.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-indigo-200">
                          <span className="inline-flex items-center text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                            <Star size={12} className="fill-amber-400 mr-1" /> {service.rating}
                          </span>
                          <span className="text-white/20">•</span>
                          <span className="truncate">{service.category}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-sm font-extrabold text-white bg-indigo-600/50 px-2 py-1 rounded-lg border border-indigo-500/30">{service.price}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/providers"
                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                  >
                    Browse providers
                  </Link>
                  <Link
                    href="/request-service"
                    className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center text-sm font-bold text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    Request now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="page-container py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Services</h2>
            <p className="text-gray-600 mt-2">The most popular services in your area</p>
          </div>
          <Link href="/services" className="flex items-center text-indigo-600 font-semibold hover:text-indigo-700">
            View All <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button 
                  onClick={() => toggleLike(service.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors z-30"
                >
                  <Heart 
                    size={20} 
                    className={likes.includes(service.id) ? "fill-red-500 text-red-500" : "text-gray-600"} 
                  />
                </button>
                <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                  {service.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <div className="flex items-center text-amber-500 text-sm font-bold">
                    <Star size={16} className="fill-amber-500 mr-1" /> {service.rating}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center text-gray-400 text-xs">
                    <MapPin size={14} className="mr-1" /> Locally Available
                  </div>
                  <div className="text-indigo-600 font-bold">{service.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-indigo-50 py-20 px-4">
        <div className="page-container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose LocalFinder?
            </h2>
            <div className="space-y-6">
              {[
                { title: "Vetted Professionals", text: "Every pro is background-checked and expert-verified." },
                { title: "Upfront Pricing", text: "No hidden fees. See prices before you book." },
                { title: "24/7 Customer Support", text: "We're here to help you anytime, day or night." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
              alt="Team collaboration" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
