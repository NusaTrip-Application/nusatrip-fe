"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { getLocations, type Location } from "@/services/locations";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60";

const getImageUrl = (url: any, fallback: string) => {
  if (typeof url !== 'string') return fallback;
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${url}`;
};

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await getLocations({ limit: 5 });
        if (res.success) {
          setDestinations(res.data.items);
        }
      } catch (err) {
        console.error("Error fetching PopularDestinations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[32px] font-bold leading-[1.3] -tracking-[0.01em] text-text-heading">
          Destinasi Populer
        </h2>
        <Link
          href="/search"
          className="text-brand-primary font-semibold flex items-center gap-1.5 hover:underline text-sm md:text-base"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="flex items-stretch overflow-x-auto gap-5 pb-4 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-[220px] md:w-[260px] shrink-0 snap-start bg-bg-surface rounded-lg overflow-hidden border border-border-default shadow-sm animate-pulse flex flex-col"
            >
              <div className="w-full h-40 md:h-48 bg-bg-soft-gray shrink-0" />
              <div className="p-5 space-y-2 flex-grow">
                <div className="h-5 bg-bg-soft-gray rounded w-3/4" />
                <div className="h-4 bg-bg-soft-gray rounded w-1/2" />
              </div>
            </div>
          ))
        ) : destinations.length === 0 ? (
          <div className="flex items-center justify-center w-full py-10 text-text-muted">
            <span className="text-sm">Belum ada destinasi populer.</span>
          </div>
        ) : (
          destinations.map((dest) => (
            <Link
              key={dest.locationId}
              href={`/search/${dest.locationId}`}
              className="w-[220px] md:w-[260px] shrink-0 snap-start bg-bg-surface rounded-lg overflow-hidden border border-border-default shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="overflow-hidden h-40 md:h-48 w-full shrink-0">
                <img
                  src={getImageUrl(dest.imageUrl, FALLBACK_IMAGE)}
                  alt={dest.locationName}
                  className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-[20px] font-semibold leading-[1.4] -tracking-[0.01em] text-text-heading mb-1 line-clamp-1" title={dest.locationName}>
                    {dest.locationName}
                  </h3>
                  <p className="text-[14px] font-medium leading-[1.5] text-text-body flex items-center gap-1.5 line-clamp-1" title={dest.province.provinceName}>
                    <MapPin size={16} className="text-text-muted" />
                    {dest.province.provinceName}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}