"use client";

import { useState, useEffect } from "react";
import { Heart, Search, Star, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SERVICES } from "./data/services";

export default function Home() {
  const [likes, setLikes] = useState<number[]>([]);

  useEffect(() => {
    const savedLikes = localStorage.getItem("likedServices");
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }
  }, []);

  const toggleLike = (id: number) => {
    const newLikes = likes.includes(id)
      ? likes.filter((l) => l !== id)
      : [...likes, id];
    
    setLikes(newLikes);
    localStorage.setItem("likedServices", JSON.stringify(newLikes));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80" 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Expert Services at Your Fingertips
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Find and book trusted local professionals for everything your home needs.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="What service do you need?" 
              className="w-full pl-12 pr-4 py-4 rounded-full shadow-2xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 py-20">
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
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
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
