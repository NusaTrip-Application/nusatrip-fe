// app/saved-references/page.tsx
// ============================================================
// NusaTrip — Saved References (Referensi Tersimpan)
// Stack: Next.js + TypeScript + Tailwind CSS v4
// ============================================================

"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import {
  Calendar,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================
interface SavedItinerary {
  id: number;
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

// ============================================================
// MOCK DATA — 9 cards across 3 pages
// ============================================================
const MOCK_DATA: SavedItinerary[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: "5 Hari 4 Malam di Bandung",
  location: "Bandung, Jawa Barat",
  province: "Jawa Barat",
  days: 5,
  price: "Rp 3.000.000",
  rating: 4.8,
  reviewCount: 120,
  savedCount: "2.3K",
  authorName: "Budi Santoso",
  authorAvatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&auto=format&fit=crop&q=80",
  coverImage:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80",
  isSaved: true,
}));

const PAGE_SIZE = 6;
const TOTAL_PAGES = Math.ceil(MOCK_DATA.length / PAGE_SIZE);

// ============================================================
// CARD COMPONENT
// ============================================================
function ItineraryCard({
  item,
  onToggleSave,
}: {
  item: SavedItinerary;
  onToggleSave: (id: number) => void;
}) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      {/* Cover Image */}
      <div className="relative h-[185px] overflow-hidden">
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Bookmark badge */}
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

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <h3 className="text-[15px] font-bold text-text-heading leading-snug group-hover:text-brand-primary transition-colors">
          {item.title}
        </h3>

        {/* Location */}
        <p className="text-xs text-text-body font-medium">{item.location}</p>

        {/* Duration + Price */}
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

        {/* Rating + Saved */}
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

        {/* Divider */}
        <hr className="border-border-default" />

        {/* Author + CTA */}
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

// ============================================================
// PAGINATION
// ============================================================
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
      {/* Prev */}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-body hover:border-brand-primary hover:text-brand-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
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

      {/* Next */}
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

// ============================================================
// MAIN PAGE
// ============================================================
export default function SavedReferencesPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SavedItinerary[]>(MOCK_DATA);

  const toggleSave = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item
      )
    );
  };

  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow px-4 md:px-8 py-8 md:py-12 max-w-[1200px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-heading tracking-tight">
            Referensi Tersimpan
          </h1>
          <p className="text-text-body text-sm mt-1 max-w-2xl">
            Kumpulan rencana perjalanan inspiratif dari komunitas NusaTrip yang
            telah Anda tandai untuk petualangan Anda berikutnya.
          </p>
        </div>

        {/* Card Grid — 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageItems.map((item) => (
            <ItineraryCard key={item.id} item={item} onToggleSave={toggleSave} />
          ))}
        </div>

        {/* Pagination */}
        {TOTAL_PAGES > 1 && (
          <Pagination current={page} total={TOTAL_PAGES} onChange={setPage} />
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
