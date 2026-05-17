"use client";

import { MapPin, Search, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-bg-surface border-b border-border-default sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-text-body hover:text-text-heading transition-colors">
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center gap-1.5 md:gap-2">
          <MapPin className="text-text-body md:w-7 md:h-7" size={24} />
          <span className="text-lg md:text-2xl font-bold text-text-heading tracking-tight">NusaTrip</span>
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-body">
        <Link
          href="/"
          className={`pb-1 transition-colors ${
            pathname === "/" 
              ? "text-brand-primary border-b-2 border-brand-primary" 
              : "hover:text-brand-primary-hover"
          }`}
        >
          Home
        </Link>
        <Link 
          href="/my-plans" 
          className={`pb-1 transition-colors ${
            pathname === "/my-plans" 
              ? "text-brand-primary border-b-2 border-brand-primary" 
              : "hover:text-brand-primary-hover"
          }`}
        >
          My Plans
        </Link>
        <Link 
          href="/community" 
          className={`pb-1 transition-colors ${
            pathname === "/community" 
              ? "text-brand-primary border-b-2 border-brand-primary" 
              : "hover:text-brand-primary-hover"
          }`}
        >
          Community
        </Link>
        <Link 
          href="/profile" 
          className={`pb-1 transition-colors ${
            pathname === "/profile" 
              ? "text-brand-primary border-b-2 border-brand-primary" 
              : "hover:text-brand-primary-hover"
          }`}
        >
          Profile
        </Link>
      </nav>

      <div className="hidden lg:flex items-center gap-4">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-text-body transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari location (kota, provinsi, atau daerah)..."
            className="pl-10 pr-12 py-2.5 bg-bg-main border border-border-default rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-border-focus w-72 xl:w-96 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="text-text-body hover:text-brand-primary transition-colors">
          <Bell size={20} className="md:w-5 md:h-5" />
        </button>
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60"
            alt="User"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-sm"
          />
          <span className="hidden lg:block text-sm font-semibold text-text-heading">
            Derry Warido
          </span>
        </div>
      </div>
    </header>
  );
}