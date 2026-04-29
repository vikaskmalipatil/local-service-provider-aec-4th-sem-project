"use client";

import { useState, useEffect } from "react";
import { Heart, Star, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SERVICES } from "../data/services";

export default function LikesPage() {
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLikes = localStorage.getItem("likedServices");
    if (savedLikes) {
      setLikedIds(JSON.parse(savedLikes));
    }
  }, []);

  const removeLike = (id: number) => {
    const newLikes = likedIds.filter((l) => l !== id);
    setLikedIds(newLikes);
    localStorage.setItem("likedServices", JSON.stringify(newLikes));
  };

  if (!mounted) return null;

  const likedServices = SERVICES.filter((s) => likedIds.includes(s.id));

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Liked Services</h1>
        </div>

        {likedServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Heart size={64} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No likes yet</h2>
            <p className="text-gray-500 mb-8">Services you like will appear here for easy access.</p>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedServices.map((service) => (
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
                    onClick={() => removeLike(service.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-50 shadow-md hover:bg-red-100 transition-colors z-30"
                  >
                    <Heart size={20} className="fill-red-500 text-red-500" />
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
                  <p className="text-gray-500 text-sm mb-4">
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
        )}
      </div>
    </div>
  );
}
