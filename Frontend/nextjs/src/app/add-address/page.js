"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../components/MapPicker"), {
    ssr: false,
    loading: () => <p className="text-center p-4">Loading map...</p>
});

export default function AddAddress() {
    const router = useRouter();
    const [coords, setCoords] = useState(null);

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!coords) {
            setError("Please select location on map");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5000/api/address/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    lat: coords.lat,
                    lng: coords.lng,
                }),
            });

            const contentType = res.headers.get("content-type");

            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error(text);
                throw new Error("Server error");
            }

            if (!res.ok) {
                setError(data.error);
            } else {
                alert("Saved!");
                router.push("/profile");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">
                <h2 className="text-xl font-bold text-center">Add Address</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="city" placeholder="City" onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="state" placeholder="State" onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="zip" placeholder="ZIP" onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="country" placeholder="Country" onChange={handleChange} className="w-full border p-2 rounded" required />

                    {/* MAP */}
                    <MapPicker onSelect={setCoords} />

                    {coords && (
                        <p className="text-green-600 text-sm text-center">
                            📍 {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </p>
                    )}

                    <button className="w-full bg-blue-600 text-white py-2 rounded">
                        {loading ? "Saving..." : "Save Address"}
                    </button>
                </form>
            </div>
        </div>
    );
}