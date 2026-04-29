"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";
import ChatWindow from "../components/ChatWindow";

const STATUS_COLORS: Record<string, string> = {
  "Pending":    "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Assigned":   "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress":"bg-indigo-50 text-indigo-700 border-indigo-200",
  "Completed":  "bg-green-50 text-green-700 border-green-200",
  "Cancelled":  "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [availableRequests, setAvailableRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"available" | "mine">("available");
  const [loading, setLoading] = useState(true);
  const [chatRequest, setChatRequest] = useState<any>(null);

  const getToken = () => localStorage.getItem("providerToken");

  const fetchData = async () => {
    const token = getToken();
    if (!token) { router.push("/login"); return; }

    try {
      const [profileRes, myReqRes, availRes] = await Promise.all([
        fetch("http://localhost:5000/api/providers/profile", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/providers/requests", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/providers/available-requests", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (profileRes.status === 401 || profileRes.status === 403) {
        localStorage.removeItem("providerToken");
        router.push("/login");
        return;
      }

      const profileData = await profileRes.json();
      const myReqData = await myReqRes.json();
      const availData = await availRes.json();

      setProvider(profileData.provider);
      setMyRequests(Array.isArray(myReqData) ? myReqData : []);
      setAvailableRequests(Array.isArray(availData) ? availData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAccept = async (requestId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:5000/api/providers/accept/${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.msg || "Failed to accept");
      alert("Request accepted!");
      fetchData();
    } catch { alert("Server error"); }
  };

  const handleStatusUpdate = async (requestId: string, status: string) => {
    const token = getToken();
    try {
      const res = await fetch(`http://localhost:5000/api/providers/request/${requestId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.msg || "Failed to update status");
      fetchData();
    } catch { alert("Server error"); }
  };

  const handleTrackingUpdate = async (requestId: string, etaMinutes: number) => {
    const token = getToken();
    const etaDate = new Date();
    etaDate.setMinutes(etaDate.getMinutes() + etaMinutes);

    try {
      const res = await fetch(`http://localhost:5000/api/providers/request/${requestId}/tracking`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          eta: etaDate,
          location: { lat: 12.9716, lng: 77.5946 } // Simulated location
        }),
      });
      if (res.ok) {
        alert(`ETA updated to ${etaMinutes} minutes!`);
        fetchData();
      }
    } catch { alert("Server error"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("providerInfo");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl">
            <span className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-sm">LF</span>
            LocalFinder
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                {provider?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-bold">{provider?.name}</div>
                <div className="text-xs text-gray-400">{provider?.specialty}</div>
              </div>
            </div>
            <Link href="/profile" className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Specialty", value: provider?.specialty, icon: "🔧" },
            { label: "Experience", value: `${provider?.experience} yrs`, icon: "📅" },
            { label: "Total Jobs", value: provider?.totalJobs || 0, icon: "✅" },
            { label: "Status", value: provider?.available ? "Available" : "Busy", icon: "🟢" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-center">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === "available" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Available Requests ({availableRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === "mine" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            My Jobs ({myRequests.length})
          </button>
        </div>

        {/* Available Requests Tab */}
        {activeTab === "available" && (
          <div>
            {availableRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                <div className="text-5xl mb-4">🎉</div>
                <p className="font-bold text-lg text-gray-700">All caught up!</p>
                <p className="text-sm mt-1">New service requests matching your specialty will appear here.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {availableRequests.map((req) => (
                  <div key={req._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    {req.requestedProvider === provider?._id && (
                       <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                         Direct Request to You
                       </div>
                    )}
                    <div className="flex items-center justify-between mb-3 mt-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg">
                        {req.serviceType === "Other" ? req.customServiceType : req.serviceType}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-gray-700 text-sm font-bold">
                        Customer: <span className="text-indigo-600 font-extrabold">{req.user?.name}</span>
                      </p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        req.urgency === 'Emergency' ? 'text-red-600 border-red-200 bg-red-50' :
                        req.urgency === 'High' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                        'text-gray-500 border-gray-200 bg-gray-50'
                      }`}>
                        {req.urgency || "Normal"} Priority
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-3 italic">Email: {req.user?.email}</p>
                    
                    {req.address && (
                       <div className="mb-3 text-xs text-gray-600 flex items-center gap-1.5">
                         <span className="text-gray-400">📍</span> {req.address}
                       </div>
                    )}

                    <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                      <p className="text-gray-600 text-sm leading-relaxed">{req.details}</p>
                    </div>
                    <button
                      onClick={() => handleAccept(req._id)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Accept Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === "mine" && (
          <div>
            {myRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-bold text-lg text-gray-700">No active jobs</p>
                <p className="text-sm mt-1">Accept requests from the "Available" tab to begin your work.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myRequests.map((req) => (
                  <div key={req._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg">
                        {req.serviceType === "Other" ? req.customServiceType : req.serviceType}
                      </span>
                      <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_COLORS[req.status] || "bg-gray-100"}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-gray-700 text-sm font-medium">
                            Customer: <span className="text-gray-900">{req.user?.name}</span>
                          </p>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                            req.urgency === 'Emergency' ? 'text-red-600 border-red-200 bg-red-50' :
                            req.urgency === 'High' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                            'text-gray-500 border-gray-200 bg-gray-50'
                          }`}>
                            {req.urgency || "Normal"}
                          </span>
                        </div>
                        {req.address && (
                           <div className="mb-2 text-xs text-gray-600 flex items-center gap-1.5">
                             <span className="text-gray-400">📍</span> {req.address}
                           </div>
                        )}
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{req.details}</p>
                      </div>
                      <button 
                        onClick={() => setChatRequest(req)}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"
                      >
                        <MessageSquare size={20} />
                      </button>
                    </div>
                    {req.status !== "Completed" && req.status !== "Cancelled" && (
                      <div className="flex gap-2">
                        {req.status === "Assigned" && (
                          <button
                            onClick={() => handleStatusUpdate(req._id, "In Progress")}
                            className="flex-1 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-all"
                          >
                            Start Job
                          </button>
                        )}
                        {req.status === "In Progress" && (
                          <div className="w-full space-y-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleTrackingUpdate(req._id, 15)}
                                className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-all"
                              >
                                15m ETA
                              </button>
                              <button
                                onClick={() => handleTrackingUpdate(req._id, 30)}
                                className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-all"
                              >
                                30m ETA
                              </button>
                            </div>
                            <button
                              onClick={() => handleStatusUpdate(req._id, "Completed")}
                              className="w-full py-2 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-all"
                            >
                              Mark Completed
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat Overlay */}
      {chatRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-end p-4 md:p-8">
          <div className="relative w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
            <button 
              onClick={() => setChatRequest(null)}
              className="absolute -top-4 -right-4 bg-white text-gray-900 p-2 rounded-full shadow-xl z-[70] hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
            <ChatWindow 
              requestId={chatRequest._id}
              userId={provider?._id}
              userRole="provider"
              recipientName={chatRequest.user?.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}

