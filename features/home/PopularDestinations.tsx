"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { getLocations, type Location } from "@/services/locations";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60";

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

      <div className="flex overflow-x-auto gap-5 pb-4 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[220px] md:min-w-[260px] flex-none snap-start bg-bg-surface rounded-lg overflow-hidden border border-border-default shadow-sm animate-pulse"
            >
              <div className="w-full h-40 md:h-48 bg-bg-soft-gray" />
              <div className="p-5 space-y-2">
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
              className="min-w-[220px] md:min-w-[260px] flex-none snap-start bg-bg-surface rounded-lg overflow-hidden border border-border-default shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer block"
            >
              <div className="overflow-hidden">
                <img
                  src={dest.imageUrl || FALLBACK_IMAGE}
                  alt={dest.locationName}
                  className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-[20px] font-semibold leading-[1.4] -tracking-[0.01em] text-text-heading mb-1">
                  {dest.locationName}
                </h3>
                <p className="text-[14px] font-medium leading-[1.5] text-text-body flex items-center gap-1.5">
                  <MapPin size={16} className="text-text-muted" />
                  {dest.province.provinceName}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}