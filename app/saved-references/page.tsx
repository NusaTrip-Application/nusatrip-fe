"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getSavedItineraries, toggleSaveItinerary } from "@/services/plans";
import { Loader2, 
  Calendar,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SavedItinerary {
  id: string;
  title: string;
  location: string;
  province: string;
  days: number;
  price: string;
  rating: number;
  reviewCount: number;
  savedCount: string;
  authorName: string;
  authorAvatar: string;
  coverImage: string;
  isSaved: boolean;
}

const PAGE_SIZE = 6;

function ItineraryCard({
  item,
  onToggleSave,
}: {
  item: SavedItinerary;
  onToggleSave: (id: string) => void;
}) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative h-[185px] overflow-hidden">
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          type="button"
          onClick={() => onToggleSave(item.id)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
          aria-label="Toggle save"
        >
          {item.isSaved ? (
            <BookmarkCheck size={17} className="text-brand-primary fill-brand-primary" />
          ) : (
            <Bookmark size={17} className="text-text-muted" />
          )}
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-[15px] font-bold text-text-heading leading-snug group-hover:text-brand-primary transition-colors">
          {item.title}
        </h3>

        <p className="text-xs text-text-body font-medium">{item.location}</p>

        <div className="flex items-center gap-4 text-xs text-text-body font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-text-muted" />
            {item.days} Hari
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-text-muted" />
            {item.price}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-body font-medium">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-brand-warm fill-brand-warm" />
            <span className="font-bold text-text-heading">{item.rating}</span>
            <span className="text-text-muted">({item.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={12} className="text-text-muted" />
            {item.savedCount} saved
          </span>
        </div>

        <hr className="border-border-default" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={item.authorAvatar}
              alt={item.authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-border-default"
            />
            <span className="text-xs font-semibold text-text-body">
              {item.authorName}
            </span>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-body hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`
            w-9 h-9 rounded-full border text-sm font-semibold transition-colors
            ${
              page === current
                ? "bg-brand-primary border-brand-primary text-white shadow-sm"
                : "border-border-default text-text-body hover:border-brand-primary hover:text-brand-primary"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-body hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function SavedReferencesPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SavedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  React.useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const res = await getSavedItineraries();
        const list = Array.isArray(res) ? res : (res.data?.items || res.data || []);
        
        const mapped = list.map((rawItem: any) => {
          const item = rawItem.itinerary || rawItem;
          
          const bannerUrl = item.bannerPhotoUrl || item.bannerImageUrl || item.bannerImage;
          const finalBannerImage = bannerUrl ? (bannerUrl.startsWith('http') ? bannerUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${bannerUrl}`) : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80";

          const rawAvatarUrl = item.author?.profilePhotoUrl || item.author?.avatarUrl || item.account?.profilePhotoUrl;
          const finalAvatar = rawAvatarUrl 
            ? (rawAvatarUrl.startsWith('http') ? rawAvatarUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${rawAvatarUrl}`) 
            : "https://ui-avatars.com/api/?name=User&background=F3F3FE&color=5855E9";
            
          let days = item.durationDays;
          if (!days && item.startDate && item.endDate) {
             days = Math.ceil((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 3600 * 24));
          }
          if (!days || days < 1) days = 1;

          return {
            id: rawItem.savedReferenceId || item.itineraryId || item.id,
            title: item.title || "Untitled Plan",
            location: item.location?.name || item.location?.locationName || "Lokasi tidak ditentukan",
            province: item.location?.province || "Indonesia",
            days: days,
            price: item.estimatedTotalBudget ? `Rp ${item.estimatedTotalBudget.toLocaleString('id-ID')}` : "Gratis",
            rating: item.rating || 0,
            reviewCount: item.reviewCount || 0,
            savedCount: item.savedCount ? `${item.savedCount}` : "0",
            authorName: item.author?.fullName || item.author?.name || "Anonim",
            authorAvatar: finalAvatar,
            coverImage: finalBannerImage,
            isSaved: true,
          };
        });
        
        setItems(mapped);
      } catch (err: any) {
        setError("Gagal memuat referensi tersimpan");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleSave = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    
    try {
      await toggleSaveItinerary(id);
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  const TOTAL_PAGES = Math.ceil(items.length / PAGE_SIZE) || 1;
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow px-4 md:px-8 py-8 md:py-12 max-w-[1200px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-heading tracking-tight">
            Referensi Tersimpan
          </h1>
          <p className="text-text-body text-sm mt-1 max-w-2xl">
            Kumpulan rencana perjalanan inspiratif dari komunitas NusaTrip yang
            telah Anda tandai untuk petualangan Anda berikutnya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-muted">
              <Loader2 size={32} className="animate-spin mb-4 text-brand-primary" />
              <p className="font-medium">Memuat referensi...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-error">
              <p className="font-medium">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-muted bg-bg-surface border border-dashed border-border-default rounded-xl">
              <Bookmark size={48} className="mb-4 text-border-strong" />
              <p className="font-medium text-[16px] text-text-heading mb-2">Belum ada referensi tersimpan</p>
              <p className="text-[14px] mb-6 text-center max-w-sm">Jelajahi komunitas dan simpan rencana perjalanan yang menginspirasi Anda.</p>
            </div>
          ) : (
            pageItems.map((item) => (
              <ItineraryCard key={item.id} item={item} onToggleSave={toggleSave} />
            ))
          )}
        </div>

        {!isLoading && items.length > 0 && TOTAL_PAGES > 1 && (
          <Pagination current={page} total={TOTAL_PAGES} onChange={setPage} />
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
