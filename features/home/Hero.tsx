"use client";

import React, { useState, useRef } from "react";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&auto=format&fit=crop&q=60",
    title: "Labuan Bajo, Nusa Tenggara Timur",
    desc: "Keindahan alam yang memukau untuk petualangan tak terlupakan",
  },
  {
    img: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=1000&auto=format&fit=crop&q=60",
    title: "Candi Prambanan, Yogyakarta",
    desc: "Situs bersejarah dengan arsitektur memukau",
  },
  {
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&auto=format&fit=crop&q=60",
    title: "Pantai Kuta, Bali",
    desc: "Destinasi selancar dan pemandangan matahari terbenam",
  },
  {
    img: "https://images.unsplash.com/photo-1583130190518-e397cff177ce?w=1000&auto=format&fit=crop&q=60",
    title: "Kawah Putih, Bandung",
    desc: "Danau kawah vulkanik yang indah",
  },
];

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim() ? searchQuery.trim() : "Semua";
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeftPos = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollLeftPos / width);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  return (
    <section className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-16 items-center mb-16 mt-2 md:mt-0 font-sans">
      <div className="flex-1 flex flex-col gap-4 w-full">
        <h1 className="text-[32px] leading-[1.2] md:text-[48px] lg:text-[54px] font-serif font-bold md:leading-[1.1] tracking-tight text-text-heading drop-shadow-sm">
          Rencanakan perjalanan
          <br className="hidden md:block" /> terbaikmu di Indonesia
        </h1>
        <p className="text-text-body text-[15px] md:text-base font-medium max-w-lg leading-relaxed">
          Temukan ide, susun itinerary, dan bagikan perjalananmu dengan
          komunitas.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2.5 mt-2 md:mt-4">
          <div className="relative flex-1">
            <MapPin
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari kota, provinsi, atau daerah tujuan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-11 pr-4 py-3.5 bg-bg-surface border border-border-default rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-border-focus text-sm md:text-base font-medium transition-shadow"
            />
          </div>
          <button type="submit" className="bg-brand-primary text-text-light px-5 rounded-md hover:bg-brand-primary-hover transition-colors flex items-center justify-center shrink-0 shadow-sm cursor-pointer">
            <Search size={22} />
          </button>
        </form>

        <div className="hidden md:flex flex-wrap items-center gap-3 text-sm mt-3">
          <span className="text-text-body font-semibold">Jelajahi populer:</span>
          {["Bandung", "Yogyakarta", "Bali", "Malang", "Lombok"].map((city) => (
            <button
              key={city}
              onClick={() => router.push(`/search?q=${encodeURIComponent(city)}`)}
              className="bg-bg-hover text-text-body px-4 py-1.5 rounded-full border border-border-default hover:border-border-strong hover:bg-border-default transition-colors font-medium text-[13px] cursor-pointer"
            >
              {city}
            </button>
          ))}
          <button 
            onClick={() => router.push(`/search`)}
            className="text-brand-primary font-semibold hover:underline ml-1 text-[13px] cursor-pointer"
          >
            Lihat semua →
          </button>
        </div>
      </div>

      <div className="flex-1 w-full lg:w-auto relative mt-4 md:mt-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto hide-scrollbar rounded-lg shadow-md ${
            isDragging
              ? "cursor-grabbing"
              : "snap-x snap-mandatory scroll-smooth cursor-grab"
          }`}
          onDragStart={(e) => e.preventDefault()}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative min-w-full aspect-[16/10] md:aspect-video lg:aspect-[4/3] snap-center group select-none overflow-hidden rounded-lg"
            >
              <img
                src={slide.img}
                alt={slide.title}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8 pointer-events-none">
                <h3 className="text-text-light text-lg md:text-[28px] font-serif font-bold tracking-wide leading-tight drop-shadow-md mb-1.5">
                  {slide.title}
                </h3>
                <p className="text-text-light/90 text-[13px] md:text-sm font-medium drop-shadow-sm">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2.5 mt-5 md:mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === i ? "bg-brand-primary w-6" : "bg-border-strong hover:bg-border-focus"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}