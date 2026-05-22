"use client";

import { Star, Bookmark, Calendar, Wallet } from "lucide-react";

export default function TripInspiration() {
  const trips = [
    {
      title: "5 Hari 4 Malam di Bandung",
      loc: "Bandung, Jawa Barat",
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
      author: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      duration: "5 Hari",
      budget: "Rp 3.000.000",
      rating: "4.8",
      reviewCount: "120",
      saves: "2.3K saved"
    },
    {
      title: "5 Hari 4 Malam di Bandung",
      loc: "Bandung, Jawa Barat",
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
      author: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      duration: "5 Hari",
      budget: "Rp 3.000.000",
      rating: "4.8",
      reviewCount: "120",
      saves: "2.3K saved"
    },
    {
      title: "5 Hari 4 Malam di Bandung",
      loc: "Bandung, Jawa Barat",
      img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
      author: "Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      duration: "5 Hari",
      budget: "Rp 3.000.000",
      rating: "4.8",
      reviewCount: "120",
      saves: "2.3K saved"
    }
  ];

  return (
    <section className="mb-20 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[28px] md:text-[32px] font-serif font-bold text-text-heading tracking-tight leading-snug">
          Inspirasi Trip dari Komunitas
        </h2>
        <button className="text-brand-primary font-bold flex items-center gap-1.5 hover:text-brand-primary-hover hover:underline text-sm md:text-base cursor-pointer">
          Lihat semua →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip, i) => (
          <div
            key={i}
            className="bg-bg-surface rounded-2xl border border-border-default overflow-hidden shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-300 flex flex-col group"
          >
            <div className="relative aspect-[16/9.5] w-full overflow-hidden shrink-0">
              <img
                src={trip.img}
                alt={trip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                className="absolute top-4 right-4 bg-white hover:bg-bg-hover rounded-full p-2.5 shadow-md flex items-center justify-center transition-colors cursor-pointer group/btn border border-border-default"
                aria-label="Save Trip"
              >
                <Bookmark size={15} className="text-brand-primary fill-transparent group-hover/btn:fill-brand-primary transition-colors" />
              </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-base md:text-[17px] font-bold text-text-heading mb-1 leading-snug">
                {trip.title}
              </h3>
              <span className="text-[13px] font-medium text-text-body mb-4 block">
                {trip.loc}
              </span>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-text-body font-semibold text-[13px]">
                    <Calendar size={15} className="text-text-muted" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-body font-semibold text-[13px]">
                    <Wallet size={15} className="text-text-muted" />
                    <span>{trip.budget}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-heading">
                    <Star size={15} className="text-brand-warm fill-brand-warm" />
                    <span>{trip.rating}</span>
                    <span className="text-text-muted font-medium">({trip.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-body">
                    <Bookmark size={15} className="text-text-muted" />
                    <span>{trip.saves}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border-default my-3.5" />

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2.5">
                  <img
                    src={trip.avatar}
                    alt={trip.author}
                    className="w-8.5 h-8.5 rounded-full object-cover ring-1 ring-border-default"
                  />
                  <span className="text-[13.5px] font-bold text-text-heading">
                    {trip.author}
                  </span>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13.5px] font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors cursor-pointer"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}