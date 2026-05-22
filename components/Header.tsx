"use client";

import { MapPin, Search, Bell, Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";

function HeaderSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") || "" : "";
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(query.toLowerCase() === "semua" ? "" : query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim() ? inputValue.trim() : "Semua";
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-text-body transition-colors"
        size={18}
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Cari lokasi (kota)..."
        className="pl-10 pr-12 py-2 bg-[#F3F3FE] border border-border-default rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-border-focus w-72 xl:w-96 transition-shadow"
      />
    </form>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-bg-surface border-b border-border-default sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-text-body hover:text-text-heading transition-colors">
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center gap-1.5 md:gap-2">
          <MapPin className="text-brand-primary md:w-7 md:h-7" size={24} />
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
        <Suspense fallback={
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Cari lokasi (kota)..."
              className="pl-10 pr-12 py-2 bg-[#F3F3FE] border border-border-default rounded-md text-sm font-medium w-72 xl:w-96"
              disabled
            />
          </div>
        }>
          <HeaderSearchInput />
        </Suspense>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="text-text-body hover:text-brand-primary transition-colors">
          <Bell size={20} className="md:w-5 md:h-5" />
        </button>
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Andi Wijaya"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-sm ring-1 ring-border-default"
          />
          <div className="hidden lg:flex items-center gap-1">
            <span className="text-sm font-semibold text-text-heading group-hover:text-brand-primary transition-colors">
              Andi Wijaya
            </span>
            <ChevronDown size={14} className="text-text-muted group-hover:text-text-heading transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}