"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Share2,
  Flag,
  Star,
  Copy,
  Bookmark,
  ChevronLeft,
} from "lucide-react";

interface CommunityDetailProps {
  itineraryId: string;
}

const MOCK_DATA = {
  title: "5 Hari 4 Malam di Bandung",
  author: "Budi Santoso",
  publishedAt: "Dipublikasikan 2 hari yang lalu",
  location: "Bandung, Jawa Barat",
  duration: "5 Hari",
  authorAvatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
  budget: "Rp 3.000.000",
  days: [
    { label: "Hari 1", date: "12 Mei" },
    { label: "Hari 2", date: "13 Mei" },
    { label: "Hari 3", date: "14 Mei" },
    { label: "Hari 4", date: "15 Mei" },
    { label: "Hari 5", date: "16 Mei" },
    { label: "Hari 6", date: "17 Mei" },
  ],
  timeline: [
    {
      time: "08:00",
      category: "NATURE",
      title: "Jatiluwih Rice Terraces",
      subtitle: "UNESCO World Heritage Site",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      notes:
        "Mulai hari dengan alam terlebih dahulu untuk menghirup udara segar dan melakukan meditasi.",
    },
    {
      time: "11:00",
      category: "NATURE",
      title: "Jatiluwih Rice Terraces",
      subtitle: "UNESCO World Heritage Site",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      notes:
        "Mulai hari dengan alam terlebih dahulu untuk menghirup udara segar dan melakukan meditasi.",
    },
    {
      time: "14:00",
      category: "NATURE",
      title: "Jatiluwih Rice Terraces",
      subtitle: "UNESCO World Heritage Site",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      notes:
        "Mulai hari dengan alam terlebih dahulu untuk menghirup udara segar dan melakukan meditasi.",
    },
  ],
  othersByAuthor: [
    {
      title: "5 Hari di Pulau Lombok",
      duration: "5 Hari",
      rating: 4.8,
      reviews: 120,
      image:
        "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=200&auto=format&fit=crop&q=80",
    },
    {
      title: "10 Hari di Yogyakarta",
      duration: "10 Hari",
      rating: 4.7,
      reviews: 10,
      image:
        "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=200&auto=format&fit=crop&q=80",
    },
    {
      title: "10 Hari di Yogyakarta",
      duration: "10 Hari",
      rating: 4.7,
      reviews: 10,
      image:
        "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=200&auto=format&fit=crop&q=80",
    },
    {
      title: "10 Hari di Yogyakarta",
      duration: "10 Hari",
      rating: 4.7,
      reviews: 10,
      image:
        "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=200&auto=format&fit=crop&q=80",
    },
    {
      title: "10 Hari di Yogyakarta",
      duration: "10 Hari",
      rating: 4.7,
      reviews: 10,
      image:
        "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=200&auto=format&fit=crop&q=80",
    },
  ],
  reviewsData: [
    {
      name: "Julian Dankworth",
      initials: "JD",
      time: "Kemarin - 19:42",
      text: "Itinerary ini benar-benar sempurna. Waktu untuk tarian Kecak sangat pas, dan rekomendasi restoran di Jimbaran adalah puncaknya. Sangat merekomendasikan untuk menduplikat ini!",
      rating: 5,
    },
    {
      name: "Julian Dankworth",
      initials: "JD",
      time: "Kemarin - 19:42",
      text: "Itinerary ini benar-benar sempurna. Waktu untuk tarian Kecak sangat pas, dan rekomendasi restoran di Jimbaran adalah puncaknya. Sangat merekomendasikan untuk menduplikat ini!",
      rating: 5,
    },
    {
      name: "Julian Dankworth",
      initials: "JD",
      time: "Kemarin - 19:42",
      text: "Itinerary ini benar-benar sempurna. Waktu untuk tarian Kecak sangat pas, dan rekomendasi restoran di Jimbaran adalah puncaknya. Sangat merekomendasikan untuk menduplikat ini!",
      rating: 5,
    },
  ],
};

export default function CommunityDetail({ itineraryId }: CommunityDetailProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 bg-bg-main relative">
      {/* Breadcrumbs & Header */}
      <div className="mb-8 border-b border-border-default pb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link href="/community" className="hover:text-brand-primary transition-colors">
            Komunitas
          </Link>
          <ChevronRight size={14} />
          <span className="text-text-heading font-medium line-clamp-1">{MOCK_DATA.title}</span>
        </div>

        <h1 className="text-[28px] md:text-4xl font-serif font-bold text-text-heading mb-6 leading-tight">
          {MOCK_DATA.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
          <div className="flex items-center gap-3">
            <img
              src={MOCK_DATA.authorAvatar}
              alt={MOCK_DATA.author}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border-default"
            />
            <div>
              <p className="text-[14px] font-bold text-text-heading leading-tight">{MOCK_DATA.author}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{MOCK_DATA.publishedAt}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border-default" />
          <div className="flex items-center gap-2 text-text-body">
            <MapPin size={18} className="text-text-muted" />
            <span className="text-[14px] font-medium">{MOCK_DATA.location}</span>
          </div>
          <div className="flex items-center gap-2 text-text-body">
            <Calendar size={18} className="text-text-muted" />
            <span className="text-[14px] font-medium">{MOCK_DATA.duration}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Content (Left) */}
        <div className="flex-grow min-w-0">
          {/* Days Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {MOCK_DATA.days.map((day, idx) => {
              const isActive = activeDay === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`flex flex-col items-center justify-center min-w-[80px] md:min-w-[90px] py-3 px-2 rounded-xl border transition-all snap-start ${
                    isActive
                      ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                      : "bg-bg-surface border-border-default text-text-body hover:bg-bg-hover"
                  }`}
                >
                  <span className={`text-[13px] md:text-[14px] font-bold mb-0.5 ${isActive ? "text-white" : "text-text-heading"}`}>
                    {day.label}
                  </span>
                  <span className={`text-[11px] md:text-[12px] ${isActive ? "text-white/90" : "text-text-muted"}`}>
                    {day.date}
                  </span>
                </button>
              );
            })}
          </div>

          <h2 className="text-[22px] md:text-[24px] font-bold text-text-heading mt-6 mb-8 font-serif">
            Hari Pertama
          </h2>

          {/* Timeline */}
          <div className="relative ml-1 md:ml-2 mb-10">
            {/* Vertical Line */}
            <div className="absolute left-[13px] top-6 bottom-4 w-[2px] bg-[#C3C6D7] z-0" />

            <div className="space-y-10 relative z-10">
              {MOCK_DATA.timeline.map((item, idx) => (
                <div key={idx} className="flex gap-5 md:gap-6">
                  {/* Circle Indicator */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#2563EB] bg-bg-main flex items-center justify-center relative mt-0.5">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#2563EB]" />
                      <div className="absolute -bottom-[5px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#2563EB]" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <p className="text-[#2563EB] font-bold text-[16px] mb-3 leading-none pt-1">{item.time}</p>
                    <div className="rounded-xl overflow-hidden mb-4 relative aspect-[16/9] md:aspect-[21/9] shadow-sm">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-4 left-4 bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1.5 rounded tracking-wide">
                        {item.category}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-5 pt-16">
                        <h3 className="font-bold text-white text-lg md:text-xl line-clamp-1">{item.title}</h3>
                        <p className="text-white/90 text-[13px] mt-1">{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-[#475569] text-[15px] leading-relaxed">
                      Notes: {item.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <aside className="lg:w-[340px] shrink-0">
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-heading mb-4">Tindakan Cepat</h3>
            <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[14px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-3 transition-colors shadow-sm">
              <Copy size={18} /> Duplikat ke Rencana Saya
            </button>
            <button className="w-full border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 font-bold text-[14px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 mb-4 transition-colors">
              <Bookmark size={18} /> Simpan ke Referensi
            </button>
            <div className="flex gap-3">
              <button className="flex-1 border border-border-default text-text-body hover:bg-bg-hover font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[13px] transition-colors">
                <Share2 size={16} className="text-text-muted" /> Bagikan
              </button>
              <button className="flex-1 border border-border-default text-text-body hover:bg-bg-hover font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[13px] transition-colors">
                <Flag size={16} className="text-text-muted" /> Laporkan
              </button>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-heading mb-2">Biaya Anggaran</h3>
            <p className="text-[26px] font-serif font-bold text-text-heading tracking-tight">{MOCK_DATA.budget}</p>
          </div>

          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-heading mb-5">Lainnya oleh {MOCK_DATA.author}</h3>
            <div className="space-y-5">
              {MOCK_DATA.othersByAuthor.map((trip, idx) => (
                <Link href="#" key={idx} className="flex gap-4 items-center group">
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 border border-border-default">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-text-heading line-clamp-2 leading-tight group-hover:text-[#2563EB] transition-colors mb-1.5">
                      {trip.title}
                    </p>
                    <div className="flex items-center gap-3 text-[12px] text-text-muted font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {trip.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[#BC4800] font-bold">
                        <Star size={13} className="fill-[#BC4800]" /> {trip.rating} <span className="font-medium text-text-muted">({trip.reviews})</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 md:mt-24 border-t border-border-default pt-12 md:pt-16 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[26px] md:text-3xl font-serif font-bold text-text-heading mb-2">Ulasan</h2>
            <div className="flex items-center gap-2 text-[14px] text-text-heading">
              <div className="flex gap-0.5 text-[#F59E0B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-current" size={16} />
                ))}
              </div>
              <span className="ml-1 font-semibold">4.8/5 dari 124 ulasan</span>
            </div>
          </div>
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[#2563EB] text-white font-semibold text-[14px] py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-sm self-start md:self-auto w-full md:w-auto"
          >
            Tulis Ulasan
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {MOCK_DATA.reviewsData.map((review, idx) => (
            <div key={idx} className="bg-bg-surface border border-border-default rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold flex items-center justify-center text-[14px]">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[14px] text-text-heading">{review.name}</p>
                    <p className="text-[12px] text-text-muted mt-0.5">{review.time}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-[#F59E0B]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="fill-current" size={14} />
                  ))}
                </div>
              </div>
              <p className="text-text-body text-[14px] leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-2">
          <button className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#2563EB] text-white font-semibold flex items-center justify-center text-[14px]">
            1
          </button>
          <button className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-body font-semibold hover:bg-bg-hover transition-colors text-[14px]">
            2
          </button>
          <button className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-body font-semibold hover:bg-bg-hover transition-colors text-[14px]">
            3
          </button>
          <button className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div 
            className="bg-[#F8FAFC] w-full max-w-[560px] rounded-xl border border-border-default p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-serif font-bold text-text-heading mb-4">
              Tulis Ulasan Anda
            </h2>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[14px] text-text-body font-medium">Beri rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={20}
                      className={`transition-colors cursor-pointer ${
                        star <= (hoverRating || reviewRating)
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "text-text-muted stroke-[1.5px] fill-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full h-32 md:h-40 p-4 rounded-xl border border-border-default bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] resize-none mb-6 text-[14px] text-text-body placeholder:text-text-muted shadow-sm transition-shadow"
              placeholder="Bagikan pendapat Anda tentang rencana ini..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setReviewRating(0);
                  setReviewText("");
                }}
                className="bg-[#2563EB] text-white font-semibold text-[14px] py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
