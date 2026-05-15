import React from "react";
import { MapPin, Search, Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-gray-600 hover:text-black">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-1.5 md:gap-2">
          <MapPin className="text-[#0D7C4A] md:w-7 md:h-7" size={24} />
          <span className="text-lg md:text-2xl font-bold">NusaTrip</span>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-600">
        <a
          href="#"
          className="text-[#0D7C4A] border-b-2 border-[#0D7C4A] pb-1 font-bold"
        >
          Home
        </a>
        <a href="#" className="hover:text-[#0D7C4A] transition-colors">
          My Plans
        </a>
        <a href="#" className="hover:text-[#0D7C4A] transition-colors">
          Community
        </a>
        <a href="#" className="hover:text-[#0D7C4A] transition-colors">
          Profile
        </a>
      </nav>

      <div className="hidden lg:flex items-center gap-4">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari location (kota, provinsi, atau daerah)..."
            className="pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D7C4A] w-72 xl:w-96 transition-shadow"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0D7C4A] text-white p-1.5 rounded-md hover:bg-[#0a663d] transition-colors">
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="text-gray-600 hover:text-[#0D7C4A] transition-colors">
          <Bell size={20} className="md:w-5 md:h-5" />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60"
            alt="User"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-sm"
          />
          <span className="hidden lg:block text-sm font-semibold">
            Derry Warido
          </span>
        </div>
      </div>
    </header>
  );
}
