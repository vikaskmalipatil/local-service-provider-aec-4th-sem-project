"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, MapPin, CheckCircle2, Navigation, Phone, MessageSquare, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import ChatWindow from "../../components/ChatWindow";

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const [userRes, reqRes] = await Promise.all([
        fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/requests/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const requests = await reqRes.json();
      
      setUser(userData.user);
      const current = requests.find((r: any) => r._id === params.requestId);
      setRequest(current);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [params.requestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Request not found</h1>
        <p className="text-gray-500 mb-6">We couldn't find the tracking details for this request.</p>
        <Link href="/profile" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl">
          Back to Profile
        </Link>
      </div>
    );
  }

  const etaDate = request.estimatedArrivalTime ? new Date(request.estimatedArrivalTime) : null;
  const isExpired = etaDate && etaDate < new Date();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/profile")} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Track Your Professional</h1>
            <p className="text-gray-500 text-sm">{request.serviceType} Request #{request._id.slice(-6)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Status */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                    request.status === "In Progress" ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-green-500 text-white shadow-green-100"
                  }`}>
                    {request.status === "In Progress" ? <Navigation className="animate-pulse" /> : <CheckCircle2 />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Status</div>
                    <div className="text-2xl font-black text-gray-900">{request.status}</div>
                  </div>
                </div>
                {etaDate && !isExpired && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">ETA</div>
                    <div className="text-2xl font-black text-indigo-600">
                      {Math.ceil((etaDate.getTime() - new Date().getTime()) / 60000)} mins
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Line */}
              <div className="relative pt-4 pb-12 px-2">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />
                <div className="space-y-12">
                  {[
                    { label: "Request Placed", date: new Date(request.createdAt).toLocaleTimeString(), done: true },
                    { label: "Provider Assigned", done: !!request.assignedProvider },
                    { label: "En Route / In Progress", done: request.status === "In Progress" || request.status === "Completed" },
                    { label: "Work Completed", done: request.status === "Completed" },
                  ].map((s, i) => (
                    <div key={i} className="relative flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 ${
                        s.done ? "bg-indigo-600 border-indigo-100 text-white" : "bg-white border-gray-50 text-gray-300"
                      }`}>
                        {s.done ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold ${s.done ? "text-gray-900" : "text-gray-300"}`}>{s.label}</div>
                        {s.date && <div className="text-xs text-gray-400 mt-0.5">{s.date}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Map */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 overflow-hidden h-[300px] relative">
               <div className="absolute inset-0 bg-slate-100 flex items-center justify-center flex-col text-gray-400 gap-4">
                  <div className="relative">
                    <MapPin className="w-12 h-12 text-red-500 animate-bounce" />
                    <div className="w-12 h-4 bg-gray-900/10 rounded-[100%] blur-sm absolute -bottom-2 animate-pulse" />
                  </div>
                  <p className="font-bold text-sm">Provider is on the way...</p>
                  <p className="text-xs opacity-60 max-w-xs text-center px-6">Simulated Map: Tracking provider location via GPS at 12.9716, 77.5946</p>
               </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-black text-gray-900 mb-6">Your Professional</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl font-black text-indigo-600">
                  {request.serviceType?.charAt(0)}
                </div>
                <div>
                  <div className="text-xl font-black text-gray-900">Verified Pro</div>
                  <div className="text-sm font-bold text-indigo-600">{request.serviceType} Specialist</div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3">
                  <Phone size={18} /> Call Provider
                </button>
                <button 
                  onClick={() => setShowChat(true)}
                  className="w-full py-4 bg-white text-indigo-600 font-bold border-2 border-indigo-50 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3"
                >
                  <MessageSquare size={18} /> Chat
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                 <div className="flex items-center gap-3 text-sm text-gray-500">
                   <Clock size={16} />
                   <span>Avg. Completion: <strong>45 mins</strong></span>
                 </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-100">
               <h4 className="font-black text-yellow-800 text-sm mb-2 uppercase tracking-wider">Safety Tip</h4>
               <p className="text-yellow-700 text-xs leading-relaxed opacity-90">
                 Always verify the professional's ID before allowing entry to your premises. LocalFinder pros will always wear a digital badge.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Overlay */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4 md:p-8">
          <div className="relative w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
            <button 
              onClick={() => setShowChat(false)}
              className="absolute -top-4 -right-4 bg-white text-gray-900 p-2 rounded-full shadow-xl z-[60] hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
            <ChatWindow 
              requestId={params.requestId}
              userId={user?._id}
              userRole="user"
              recipientName="Service Provider"
            />
          </div>
        </div>
      )}
    </div>
  );
}
