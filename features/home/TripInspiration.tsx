"use client";

import { Star, Bookmark, Calendar, Wallet, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCommunityItineraries, toggleSaveItinerary, getSavedItineraries } from "@/services/plans";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

function resolveUrl(url?: string | null) {
  if (!url) return FALLBACK_IMG;
  return url.startsWith("http") ? url : `${STORAGE_URL}/${url}`;
}

function calcDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return null;
  const diff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
  return diff > 0 ? diff : 1;
}

function budgetLabel(value?: number | null) {
  if (value === 1) return "Hemat";
  if (value === 2) return "Menengah";
  if (value === 3) return "Mewah";
  return "TBD";
}

export default function TripInspiration() {
  const router = useRouter();
  const [savedTrips, setSavedTrips] = useState<Record<string, boolean>>({});
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await getSavedItineraries({ limit: 100 });
        if (response.success && response.data.items) {
          const map: Record<string, boolean> = {};
          response.data.items.forEach((item: any) => {
            map[item.itineraryId] = true;
          });
          setSavedTrips(map);
        }
      } catch (error) {
        console.error("Failed to fetch saved itineraries:", error);
      }
    };
    fetchSaved();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const res = await getCommunityItineraries({ sort: "popular", limit: 3 });
        if (res.success) {
          setTrips(res.data.items || []);
        }
      } catch {
        // fail silently — homepage section
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const toggleSave = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setSavedTrips((prev) => ({ ...prev, [id]: !prev[id] }));
    try {
      await toggleSaveItinerary(id);
    } catch {
      // revert on error
      setSavedTrips((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  return (
    <section className="mb-20 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[28px] md:text-[32px] font-serif font-bold text-text-heading tracking-tight leading-snug">
          Inspirasi Trip dari Komunitas
        </h2>
        <Link
          href="/community"
          className="text-brand-primary font-bold flex items-center gap-1.5 hover:text-brand-primary-hover hover:underline text-sm md:text-base"
        >
          Lihat semua →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[16/9.5] bg-bg-soft-gray w-full" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-bg-soft-gray rounded w-3/4" />
                <div className="h-4 bg-bg-soft-gray rounded w-1/2" />
                <div className="h-4 bg-bg-soft-gray rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-text-muted text-sm font-medium">
          Belum ada inspirasi trip dari komunitas.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const days = calcDays(trip.startDate, trip.endDate);
            const isSaved = !!savedTrips[trip.itineraryId];
            const bannerImg = resolveUrl(trip.bannerImageUrl);
            const avatarImg = trip.user?.photoUrl
              ? resolveUrl(trip.user.photoUrl)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(trip.user?.fullName || "User")}&background=F3F3FE&color=5855E9`;

            return (
              <div
                key={trip.itineraryId}
                className="bg-bg-surface rounded-2xl border border-border-default overflow-hidden shadow-sm hover:shadow-md hover:border-border-strong transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/9.5] w-full overflow-hidden shrink-0">
                  <img
                    src={bannerImg}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                  />
                  <button
                    className="absolute top-4 right-4 bg-white hover:bg-bg-hover rounded-full p-2.5 shadow-md flex items-center justify-center transition-colors cursor-pointer border border-border-default"
                    aria-label="Save Trip"
                    onClick={(e) => { e.preventDefault(); toggleSave(trip.itineraryId); }}
                  >
                    <Bookmark
                      size={15}
                      className={`transition-colors ${
                        isSaved
                          ? "text-brand-primary fill-brand-primary"
                          : "text-brand-primary fill-transparent hover:fill-brand-primary"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base md:text-[17px] font-bold text-text-heading mb-1 leading-snug line-clamp-2">
                    {trip.title}
                  </h3>
                  <span className="text-[13px] font-medium text-text-body mb-4 block line-clamp-1">
                    {trip.location?.locationName || "Berbagai Destinasi"}
                  </span>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-6">
                      {days && (
                        <div className="flex items-center gap-2 text-text-body font-semibold text-[13px]">
                          <Calendar size={15} className="text-text-muted" />
                          <span>{days} Hari</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-text-body font-semibold text-[13px]">
                        <Wallet size={15} className="text-text-muted" />
                        <span>{budgetLabel(trip.budgetPreference)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-heading">
                        <Star size={15} className="text-brand-warm fill-brand-warm" />
                        <span>{trip.ratingValue || "0"}</span>
                        <span className="text-text-muted font-medium">({trip.ratingCount || 0})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-text-body">
                        <Bookmark size={15} className="text-text-muted" />
                        <span>{trip.savedCount || 0} saved</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-default my-3.5" />

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={avatarImg}
                        alt={trip.user?.fullName || "User"}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-border-default"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=U&background=F3F3FE&color=5855E9`; }}
                      />
                      <span className="text-[13.5px] font-bold text-text-heading">
                        {trip.user?.fullName || "Anonim"}
                      </span>
                    </div>
                    <Link
                      href={`/community/${trip.itineraryId}`}
                      className="text-[13.5px] font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
