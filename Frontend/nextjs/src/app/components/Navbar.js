"use client";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShoppingCart, User, Heart, PlusCircle, Users } from "lucide-react";


const Navbar = () => {
  const router = useRouter();
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg cursor-pointer shrink-0" onClick={() => router.push("/")}>
          <div className="bg-indigo-600 text-white px-2 py-1 rounded shadow-md">LF</div>
          <span className="hidden sm:inline">LocalFinder</span>
        </div>

        {/* Location */}
        <button onClick={() => router.push("/choose-location")} className="hidden lg:flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
          <MapPin size={16} className="text-indigo-600" />
          <span>Location</span>
        </button>

        {/* Search */}
        <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for services..."
            className="ml-2 w-full outline-none bg-transparent text-sm"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600 shrink-0">
          <button
            onClick={() => router.push("/providers")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all font-medium text-sm border border-purple-100"
            title="Browse Providers"
          >
            <Users size={16} />
            <span className="hidden md:inline">Providers</span>
          </button>
          <button
            onClick={() => router.push("/request-service")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all font-medium text-sm border border-indigo-100"
            title="Request Service"
          >
            <PlusCircle size={16} />
            <span className="hidden md:inline">Request</span>
          </button>
          <button
            onClick={() => router.push("/likes")}
            className="p-2 rounded-full hover:bg-gray-100 hover:text-red-500 transition-all"
            title="Liked Services"
          >
            <Heart size={20} />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-all"
            title="Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="p-2 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-all"
            title="Profile"
          >
            <User size={20} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;