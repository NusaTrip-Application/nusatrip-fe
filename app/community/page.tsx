"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Calendar, Wallet, Star, Bookmark, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getCommunityItineraries } from "@/services/plans";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"Popular" | "Recent">("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});

  const [itineraries, setItineraries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const fetchCommunityItineraries = async () => {
      setIsLoading(true);
      try {
        const response = await getCommunityItineraries({
          search: appliedSearchQuery || undefined,
          sort: activeTab === "Popular" ? "popular" : "recent",
        });
        if (response.success) {
          setItineraries(response.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch community itineraries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityItineraries();
  }, [appliedSearchQuery, activeTab]);

  const toggleSave = (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-xl h-[400px] animate-pulse">
                <div className="h-48 bg-[var(--color-bg-soft-gray)] w-full rounded-t-xl" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-[var(--color-bg-soft-gray)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--color-bg-soft-gray)] rounded w-1/2" />
                  <div className="h-4 bg-[var(--color-bg-soft-gray)] rounded w-full mt-8" />
                </div>
              </div>
            ))}
          </div>
        ) : itineraries.length === 0 ? (
          <div className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-soft-blue)] flex items-center justify-center text-[var(--color-brand-primary)] mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-heading)]">
              Tidak Ada Hasil Ditemukan
            </h3>
            <p className="text-[var(--color-text-body)] text-sm mt-2 max-w-sm">
              Kami belum memiliki itinerary publik di komunitas saat ini. Silakan kembali lagi nanti!
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
            {itineraries.map((item) => (
            <div
              key={item.itineraryId}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-xl overflow-hidden flex flex-col shadow-sm"
            >
              <div className="relative h-48 w-full">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                  alt={item.title}
                  className="w-full h-full object-cover bg-gray-100"
                />
                <button
                  onClick={() => toggleSave(item.itineraryId)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-hover)] flex items-center justify-center shadow-md transition-colors cursor-pointer border border-[var(--color-border-default)]"
                >
                  <Bookmark
                    size={14}
                    className={`transition-colors ${
                      savedItems[item.itineraryId]
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
                <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-1">
                  {item.location?.locationName || "Berbagai Destinasi"}
                </p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-body)]">
                    <Calendar size={16} />
                    <span>{item.durationDays ? `${item.durationDays} Hari` : "Beberapa Hari"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-body)]">
                    <Wallet size={16} />
                    <span>{item.budgetPreference === 1 ? "Hemat" : item.budgetPreference === 2 ? "Menengah" : item.budgetPreference === 3 ? "Mewah" : "TBD"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Star
                      size={16}
                      className="fill-[var(--color-brand-warm)] text-[var(--color-brand-warm)]"
                    />
                    <span className="font-semibold text-[var(--color-text-heading)]">
                      {item.rating || "4.5"}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      ({item.reviewsCount || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                    <Bookmark size={16} />
                    <span>{item.bookmarkCount || 0} saved</span>
                  </div>
                </div>

                <div className="mt-auto border-t border-[var(--color-border-default)] pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.user?.profilePhotoUrl ? (
                      <img
                        src={item.user.profilePhotoUrl}
                        alt={item.user?.fullName || "User"}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {(item.user?.fullName || "User").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-[var(--color-text-body)]">
                      {item.user?.fullName || "Pengguna Anonim"}
                    </span>
                  </div>
                  <Link
                    href={`/community/${item.itineraryId}`}
                    className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)] transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {itineraries.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-[var(--color-bg-surface)] font-semibold shadow-sm transition-colors">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
