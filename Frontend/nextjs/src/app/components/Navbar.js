"use client";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShoppingCart, User, Heart, PlusCircle, Users, FileText } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="w-full glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl cursor-pointer shrink-0 transition-transform hover:scale-105" onClick={() => router.push("/")}>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-2.5 py-1 rounded-lg shadow-md font-black">LF</div>
          <span className="hidden sm:inline bg-gradient-to-r from-indigo-950 to-purple-900 bg-clip-text text-transparent tracking-tight">LocalFinder</span>
        </div>

        {/* Location */}
        <button onClick={() => router.push("/choose-location")} className="hidden lg:flex items-center gap-2 bg-white/50 border border-gray-200/60 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm transition-all shrink-0">
          <MapPin size={16} className="text-indigo-600" />
          <span className="font-medium">Location</span>
        </button>

        {/* Search */}
        <div className="flex-1 flex items-center border border-gray-200/60 rounded-xl px-4 py-2 bg-white/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300 transition-all shadow-inner">
          <Search size={16} className="text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for services..."
            className="ml-3 w-full outline-none bg-transparent text-sm placeholder:text-gray-400"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 sm:gap-3 text-gray-600 shrink-0">
          <button
            onClick={() => router.push("/providers")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50/80 text-purple-700 hover:bg-purple-100 transition-all font-semibold text-sm border border-purple-200/50 shadow-sm hover:shadow"
            title="Browse Providers"
          >
            <Users size={16} />
            <span className="hidden md:inline">Providers</span>
          </button>
          <button
            onClick={() => router.push("/request-service")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
            title="Request Service"
          >
            <PlusCircle size={16} />
            <span className="hidden md:inline">Request</span>
          </button>
          <button
            onClick={() => router.push("/invoices")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 transition-all font-semibold text-sm border border-emerald-200/50 shadow-sm hover:shadow"
            title="My Invoices"
          >
            <FileText size={16} />
            <span className="hidden md:inline">Invoices</span>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
          <button
            onClick={() => router.push("/likes")}
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm hover:text-red-500 transition-all"
            title="Liked Services"
          >
            <Heart size={20} />
          </button>
          <button
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm hover:text-indigo-600 transition-all"
            title="Cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="p-2 rounded-xl bg-gray-100/80 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-200/50"
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