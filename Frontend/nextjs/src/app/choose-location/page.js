"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const fetchAddresses = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/address/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch addresses:", data.msg || data.error);
        return;
      }

      setAddresses(data.addresses || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("selectedAddress");
    if (saved) setSelectedId(saved);
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          router.push("/login");
          return;
        }
        setUser(data.user);
        fetchAddresses(token);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [router]);
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  const handleSelect = (addr) => {
    setSelectedId(addr._id);
    localStorage.setItem("selectedAddress", addr._id);
    localStorage.setItem("selectedAddressString", `${addr.address}, ${addr.city}, ${addr.state}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://local-service-provider-aec-4th-sem.onrender.com'}/api/address/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.msg || data.error);
        return;
      }
      setAddresses((prev) => prev.filter(addr => addr._id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        localStorage.removeItem("selectedAddress");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Addresses
          </h2>
          <button
            onClick={() => router.push("/add-address")}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-sm px-6 py-16 border border-gray-200">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No addresses found</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating a new address to use for your services.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => handleSelect(addr)}
                className={`relative bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md flex flex-col justify-between ${selectedId === addr._id
                  ? "border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50"
                  : "border-gray-200 hover:border-indigo-300"
                  }`}
              >
                {selectedId === addr._id && (
                  <div className="absolute top-4 right-4 text-indigo-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="pr-10">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{addr.address}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center"><span className="font-medium mr-2 text-gray-700">City:</span> {addr.city}, {addr.state}</p>
                    {addr.zip && <p className="flex items-center"><span className="font-medium mr-2 text-gray-700">Zip:</span> {addr.zip}</p>}
                    {addr.country && <p className="flex items-center"><span className="font-medium mr-2 text-gray-700">Country:</span> {addr.country}</p>}

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-100">
                        <svg className="h-3.5 w-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {addr.location?.coordinates[1]?.toFixed(5)}, {addr.location?.coordinates[0]?.toFixed(5)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addr._id);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
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
