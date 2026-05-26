"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Calendar, Wallet, Star, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";

const DUMMY_DATA = Array.from({ length: 9 }).map((_, i) => ({
  id: i,
  title: "5 Hari 4 Malam di Bandung",
  location: "Bandung, Jawa Barat",
  duration: "5 Hari",
  price: "Rp 3.000.000",
  rating: "4.8",
  reviews: "(120)",
  saved: "2.3k saved",
  author: {
    name: "Budi Santoso",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
}));

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"Popular" | "Recent">("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<Record<number, boolean>>({});

  const toggleSave = (id: number) => {
    setSavedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearchQuery(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const filteredData = DUMMY_DATA.filter((item) =>
    item.title.toLowerCase().includes(appliedSearchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(appliedSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-main)] text-[var(--color-text-body)]">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-heading)] mb-3">
            Inspirasi Perjalanan dari Komunitas
          </h1>
          <p className="text-[var(--color-text-body)] max-w-3xl">
            Jelajahi rencana perjalanan yang dikurasi oleh para petualang lain. Temukan jadwal rute terbaik untuk liburan Anda berikutnya.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center bg-[var(--color-bg-soft-gray)] p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("Popular")}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "Popular"
                  ? "bg-[var(--color-bg-surface)] text-[var(--color-brand-primary)] shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveTab("Recent")}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "Recent"
                  ? "bg-[var(--color-bg-surface)] text-[var(--color-brand-primary)] shadow-sm"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
              }`}
            >
              Recent
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-shadow"
            />
          </form>
        </div>

        {filteredData.length === 0 ? (
          <div className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-soft-blue)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-heading)]">
              Tidak Ada Hasil Ditemukan
            </h3>
            <p className="text-[var(--color-text-body)] text-sm mt-2 max-w-sm">
              Kami tidak dapat menemukan komunitas yang sesuai dengan
              pencarian Anda. Coba kata kunci lain atau reset filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setAppliedSearchQuery("");
              }}
              className="mt-6 bg-[var(--color-brand-primary)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--color-brand-primary-hover)] font-bold text-sm shadow-sm transition-colors cursor-pointer"
            >
              Reset Semua Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-xl overflow-hidden flex flex-col shadow-sm"
            >
              <div className="relative h-48 w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleSave(item.id)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-hover)] flex items-center justify-center shadow-md transition-colors cursor-pointer border border-[var(--color-border-default)]"
                >
                  <Bookmark
                    size={14}
                    className={`transition-colors ${
                      savedItems[item.id]
                        ? "text-[var(--color-brand-primary)] fill-[var(--color-brand-primary)]"
                        : "text-[var(--color-brand-primary)] fill-transparent hover:fill-[var(--color-brand-primary)]"
                    }`}
                  />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {item.location}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-body)]">
                    <Calendar size={16} />
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-body)]">
                    <Wallet size={16} />
                    <span>{item.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Star
                      size={16}
                      className="fill-[var(--color-brand-warm)] text-[var(--color-brand-warm)]"
                    />
                    <span className="font-semibold text-[var(--color-text-heading)]">
                      {item.rating}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      {item.reviews}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                    <Bookmark size={16} />
                    <span>{item.saved}</span>
                  </div>
                </div>

                <div className="mt-auto border-t border-[var(--color-border-default)] pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold text-[var(--color-text-body)]">
                      {item.author.name}
                    </span>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)] transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-[var(--color-bg-surface)] font-semibold shadow-sm transition-colors">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-body)] hover:bg-[var(--color-bg-hover)] transition-colors">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-body)] hover:bg-[var(--color-bg-hover)] transition-colors">
            3
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
