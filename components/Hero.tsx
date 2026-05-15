"use client";

import React, { useState, useRef } from "react";
import { MapPin, Search } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
    <section className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-16 items-center mb-16 mt-2 md:mt-0">
      <div className="flex-1 flex flex-col gap-4 w-full">
        <h1 className="text-[26px] leading-[1.25] md:text-5xl lg:text-[54px] font-bold md:leading-[1.1] tracking-tight text-[#1E293B]">
          Rencanakan perjalanan
          <br className="hidden md:block" /> terbaikmu di Indonesia
        </h1>
        <p className="text-gray-600 text-[15px] md:text-xl max-w-lg leading-relaxed">
          Temukan ide, susun itinerary, dan bagikan perjalananmu dengan
          komunitas.
        </p>

        <div className="flex gap-2.5 mt-2 md:mt-4">
          <div className="relative flex-1">
            <MapPin
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari kota, provinsi, atau daerah tujuan"
              className="w-full pl-10 pr-4 py-3 md:py-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0D7C4A] text-[13px] md:text-lg transition-shadow"
            />
          </div>
          <button className="bg-[#0D7C4A] text-white px-4 py-3 md:py-4 rounded-xl hover:bg-[#0a663d] transition-colors flex items-center justify-center shrink-0">
            <Search size={20} />
          </button>
        </div>

        <div className="hidden md:flex flex-wrap items-center gap-3 text-sm mt-3">
          <span className="text-gray-600 font-medium">Jelajahi populer:</span>
          {["Bandung", "Yogyakarta", "Bali", "Malang", "Lombok"].map((city) => (
            <button
              key={city}
              className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors font-medium"
            >
              {city}
            </button>
          ))}
          <button className="text-[#0D7C4A] font-semibold hover:underline ml-1">
            Lihat semua
          </button>
        </div>
      </div>

      <div className="flex-1 w-full lg:w-auto relative mt-2 md:mt-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto hide-scrollbar rounded-[20px] md:rounded-3xl shadow-lg ${
            isDragging
              ? "cursor-grabbing"
              : "snap-x snap-mandatory scroll-smooth cursor-grab"
          }`}
          onDragStart={(e) => e.preventDefault()}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative min-w-full aspect-[16/10] md:aspect-video lg:aspect-[4/3] snap-center group select-none"
            >
              <img
                src={slide.img}
                alt={slide.title}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 md:p-8 pointer-events-none">
                <h3 className="text-white text-[15px] md:text-3xl font-bold tracking-wide leading-tight">
                  {slide.title}
                </h3>
                <p className="text-white/90 text-[11px] md:text-base mt-1 md:mt-2 font-medium">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4 md:mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${activeIndex === i ? "bg-[#0D7C4A]" : "bg-gray-200 hover:bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
