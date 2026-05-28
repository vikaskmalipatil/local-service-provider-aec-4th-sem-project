"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, MapPin, Package, Clock, ArrowRight, LogOut } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const [userRes, reqRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/requests/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            if (!userRes.ok) {
                router.push("/login");
                return;
            }

            const userData = await userRes.json();
            const reqData = await reqRes.json();

            setUser(userData.user);
            setRequests(Array.isArray(reqData) ? reqData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/requests/${id}/cancel`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData(); // Refresh list
            } else {
                const data = await res.json();
                alert(data.error || "Failed to cancel");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewSubmit = async (reqId, providerId, rating, comment) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/reviews`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ serviceRequestId: reqId, providerId, rating, comment })
            });
            if (res.ok) {
                alert("Review submitted successfully!");
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit review");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-lg shadow-indigo-100">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500 text-sm mb-8">{user?.email}</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/choose-location")}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-100 transition-all text-sm"
                            >
                                <MapPin size={18} /> Manage Addresses
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all text-sm"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Service Requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <Package className="text-indigo-600" />
                            Service History
                        </h3>
                        <span className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 border border-gray-100 shadow-sm">
                            {requests.length} Requests
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                            <div className="text-5xl mb-4">🔧</div>
                            <p className="font-bold text-lg text-gray-700">No requests yet</p>
                            <p className="text-sm mt-1 mb-6">You haven't requested any services yet.</p>
                            <button
                                onClick={() => router.push("/request-service")}
                                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                Request a Service
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map((req) => (
                                <div key={req._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900">
                                                    {req.serviceType === "Other" ? req.customServiceType : req.serviceType}
                                                    {req.requestedProvider && <span className="ml-2 text-xs font-normal bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Direct Request: {req.requestedProvider.name}</span>}
                                                </div>
                                                <div className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()} • {req.urgency}</div>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                            req.status === "Completed" ? "bg-green-50 text-green-600 border border-green-100" :
                                            req.status === "Pending" ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                                            req.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-100" :
                                            "bg-blue-50 text-blue-600 border border-blue-100"
                                        }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 italic">
                                        "{req.details}"
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex gap-2">
                                            {req.status !== "Pending" && req.status !== "Cancelled" && (
                                                <button
                                                    onClick={() => router.push(`/track/${req._id}`)}
                                                    className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:translate-x-1 transition-all"
                                                >
                                                    Track Progress <ArrowRight size={16} />
                                                </button>
                                            )}
                                            {(req.status === "Pending" || req.status === "Assigned") && (
                                                <button
                                                    onClick={() => handleCancel(req._id)}
                                                    className="flex items-center gap-2 text-red-500 font-bold text-sm hover:text-red-700 transition-all ml-2"
                                                >
                                                    Cancel Request
                                                </button>
                                            )}
                                            {req.status === "Completed" && !req.reviewed && req.assignedProvider && (
                                                <button
                                                    onClick={() => {
                                                        const rating = window.prompt("Rate out of 5:");
                                                        if (rating && rating >= 1 && rating <= 5) {
                                                            const comment = window.prompt("Leave a comment (optional):");
                                                            handleReviewSubmit(req._id, req.assignedProvider._id, Number(rating), comment);
                                                        } else if (rating) {
                                                            alert("Rating must be between 1 and 5");
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 text-amber-500 font-bold text-sm hover:text-amber-600 transition-all ml-2"
                                                >
                                                    ⭐ Leave a Review
                                                </button>
                                            )}
                                            {req.status === "Completed" && req.reviewed && (
                                                <span className="text-sm font-bold text-gray-400">✅ Reviewed</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                            ID: {req._id.slice(-6)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}