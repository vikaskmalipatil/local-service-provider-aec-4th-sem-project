"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck, User, MapPin, AlertCircle } from "lucide-react";

const SERVICES = [
  { id: "Plumbing", name: "Plumbing", icon: "🔧", desc: "Leaking pipes, installs & more" },
  { id: "Electrical", name: "Electrical", icon: "⚡", desc: "Wiring, fixtures & repairs" },
  { id: "Gardening", name: "Gardening", icon: "🌿", desc: "Lawn care & landscaping" },
  { id: "House Painting", name: "House Painting", icon: "🖌️", desc: "Interior & exterior painting" },
  { id: "Cleaning", name: "Cleaning", icon: "🧹", desc: "Deep cleaning & organization" },
  { id: "Other", name: "Other Service", icon: "✨", desc: "Custom requirement" },
];

function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProviderId = searchParams?.get("providerId");
  const directProviderName = searchParams?.get("providerName");
  const directSpecialty = searchParams?.get("specialty");

  const [selectedService, setSelectedService] = useState(directSpecialty || "");
  const [customServiceType, setCustomServiceType] = useState("");
  const [details, setDetails] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check direct specialty
    if (directSpecialty && SERVICES.some(s => s.id === directSpecialty)) {
      setSelectedService(directSpecialty);
    } else if (directSpecialty) {
      setSelectedService("Other");
      setCustomServiceType(directSpecialty);
    }
    
    // Check for saved address from choose-location page
    const savedAddress = localStorage.getItem("selectedAddressString");
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, [directSpecialty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!selectedService) {
      setError("Please select a service type");
      return;
    }

    if (selectedService === "Other" && !customServiceType.trim()) {
      setError("Please specify your custom service requirement");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          serviceType: selectedService, 
          customServiceType: selectedService === "Other" ? customServiceType : "",
          details,
          urgency,
          address,
          requestedProvider: directProviderId || null
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Request Sent!</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {directProviderId 
              ? `Your request has been sent directly to ${directProviderName || "the provider"}. You'll be notified when they accept.`
              : `Your service request has been broadcasted to all qualified professionals in your area. You'll be notified when someone accepts.`}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/profile")}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Track Request Status
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl border-2 border-indigo-50 hover:bg-indigo-50 transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Need a Professional?</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            {directProviderId 
              ? `You are booking a service directly. Fill out the details below so they know exactly what you need.`
              : `Select a service and describe what you need. We'll match you with the best local providers.`}
          </p>
        </div>

        {directProviderId && (
          <div className="mb-8 glass-panel bg-indigo-50/80 rounded-2xl p-4 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <User size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Direct Booking</p>
                <p className="text-indigo-950 font-black text-lg">{directProviderName || "Selected Provider"}</p>
              </div>
            </div>
            <button 
              onClick={() => router.push("/request-service")}
              className="text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
            >
              Cancel Direct Booking
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Form Side */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-panel bg-white/80 rounded-3xl p-8 space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
                  ⚠ {error}
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                  What service do you need?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedService(s.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group ${
                        selectedService === s.id
                          ? "border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100"
                          : "border-gray-50 bg-gray-50/50 hover:border-indigo-200 hover:bg-white"
                      }`}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className={`text-xs font-black ${selectedService === s.id ? "text-indigo-700" : "text-gray-500"}`}>
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedService === "Other" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Specify Your Custom Service
                  </label>
                  <input
                    type="text"
                    required
                    value={customServiceType}
                    onChange={(e) => setCustomServiceType(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-indigo-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-gray-700"
                    placeholder="e.g. Piano Tuning, Dog Walking, IT Support..."
                  />
                </div>
              )}

              {/* Details */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Explain your requirements
                </label>
                <textarea
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none min-h-[120px] text-gray-700 placeholder:text-gray-400"
                  placeholder="Please describe exactly what you need done..."
                />
              </div>

              {/* Urgency & Address */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-gray-700 font-semibold"
                  >
                    <option value="Low">Low - Flexible timing</option>
                    <option value="Normal">Normal - Standard booking</option>
                    <option value="High">High - Need it soon</option>
                    <option value="Emergency">Emergency - Need it ASAP!</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Service Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-gray-700"
                      placeholder="Your full address..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedService || !details || !address}
                className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Submit Request <ArrowRight size={20} /></>
                )}
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
              <ShieldCheck className="w-10 h-10 mb-4 text-indigo-200" />
              <h3 className="text-xl font-black mb-3 text-white">Safe & Reliable</h3>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90 font-medium">
                Every professional on LocalFinder is verified. We ensure you get quality service with transparent pricing and secure handling of your requests.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How it works</h3>
              <div className="space-y-5">
                {[
                  { step: 1, title: "Submit Request", text: "Fill out the form with your needs." },
                  { step: 2, title: "Provider Matches", text: "Relevant pros are notified instantly." },
                  { step: 3, title: "Get Connected", text: "A provider accepts and contacts you." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{s.title}</h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {urgency === "Emergency" && (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-red-700 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <AlertCircle size={18} /> High Priority Alert
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  You've selected Emergency priority. This will alert all providers in your area immediately with a high-priority push notification. Additional charges may apply depending on the provider.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestService() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"/></div>}>
      <RequestForm />
    </Suspense>
  );
}
