"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  Bookmark,
  ChevronRight,
  PlusCircle,
  Check,
  Loader2,
  Calendar,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getLocationById, Location } from "@/services/locations";
import { getPlaceRecommendations, RecommendedPlace } from "@/services/places";
import { getCommunityItineraries, getSavedItineraries, toggleSaveItinerary } from "@/services/plans";
import { notification } from "@/lib/notification";

interface CommunityTrip {
  title: string;
  location: string;
  rating: string;
  reviews: string;
  saved: string;
  author: string;
  avatar: string;
  image: string;
}

const DEFAULT_COMMUNITY_INSPIRATIONS: CommunityTrip[] = [
  {
    title: "5 Hari 4 Malam di Trip",
    location: "Indonesia",
    rating: "4.8",
    reviews: "120",
    saved: "2.5k",
    author: "Sarah Wijaya",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Weekend Seru Bersama Keluarga",
    location: "Indonesia",
    rating: "4.6",
    reviews: "82",
    saved: "1.6k",
    author: "Dina Pratama",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "4 Hari 3 Malam - Honeymoon",
    location: "Indonesia",
    rating: "4.9",
    reviews: "90",
    saved: "3.1k",
    author: "Mega Lestari",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Trip Singkat 3 Hari 2 Malam",
    location: "Indonesia",
    rating: "4.5",
    reviews: "70",
    saved: "1.7k",
    author: "Rizky Mahendra",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&auto=format&fit=crop&q=80",
  },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80";

const getImageUrl = (url: any, fallback: string) => {
  if (!url) return fallback;
  const urlString = typeof url === 'object' && url !== null && 'imageUrl' in url ? url.imageUrl : url;
  if (typeof urlString !== 'string') return fallback;
  if (urlString.startsWith('http')) return urlString;
  return `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${urlString}`;
};

export default function DestinationDetails({
  destinationSlug,
}: {
  destinationSlug: string;
}) {
  const [locationData, setLocationData] = useState<Location | null>(null);
  const [popularPlaces, setPopularPlaces] = useState<RecommendedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [addedItineraries, setAddedItineraries] = useState<Record<string, boolean>>({});
  const [communityItineraries, setCommunityItineraries] = useState<any[]>([]);
  const [isCommunityLoading, setIsCommunityLoading] = useState(true);
  const [savedCommunityItineraries, setSavedCommunityItineraries] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [locRes, placesRes] = await Promise.all([
          getLocationById(destinationSlug).catch(() => null),
          getPlaceRecommendations(destinationSlug, { limit: 6 }).catch(() => null),
        ]);

        if (locRes && locRes.success) {
          setLocationData(locRes.data);
          
          // Fetch community itineraries for this location
          setIsCommunityLoading(true);
          try {
            const commRes = await getCommunityItineraries({
              search: locRes.data.locationName,
              limit: 4,
            });
            if (commRes && commRes.success) {
              setCommunityItineraries(commRes.data.items || []);
            }
          } catch (commErr) {
            console.error("Failed to fetch community itineraries:", commErr);
          } finally {
            setIsCommunityLoading(false);
          }
        }
        if (placesRes && placesRes.success) {
          setPopularPlaces(placesRes.data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch destination data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [destinationSlug]);

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
          setSavedCommunityItineraries(map);
        }
      } catch (error) {
        console.error("Failed to fetch saved itineraries:", error);
      }
    };
    fetchSaved();
  }, []);

  const handleToggleSaveItinerary = async (itineraryId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const isCurrentlySaved = !!savedCommunityItineraries[itineraryId];
    setSavedCommunityItineraries((prev) => ({ ...prev, [itineraryId]: !isCurrentlySaved }));
    try {
      const res = await toggleSaveItinerary(itineraryId);
      if (res.success) {
        if (!isCurrentlySaved) {
          notification.success("Itinerary berhasil disimpan.");
        } else {
          notification.success("Itinerary dihapus dari simpanan.");
        }
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch (err) {
      setSavedCommunityItineraries((prev) => ({ ...prev, [itineraryId]: isCurrentlySaved }));
      notification.error("Gagal menyimpan perubahan. Silakan coba lagi.");
      console.error("Failed to toggle save itinerary:", err);
    }
  };

  const toggleItinerary = (placeId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const isAdded = !!addedItineraries[placeId];
    setAddedItineraries((prev) => ({
      ...prev,
      [placeId]: !isAdded,
    }));
    if (!isAdded) {
      notification.success("Tempat berhasil ditambahkan ke rencana.");
    } else {
      notification.success("Tempat dihapus dari rencana.");
    }
  };

  const handleStartPlanning = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Redirect to create plan with destination pre-filled
    router.push(`/my-plans/create?dest=${locationData?.locationId || destinationSlug}`);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center font-sans text-text-body bg-bg-main">
        <Loader2 size={40} className="animate-spin text-brand-primary mb-4" />
        <p className="text-lg font-semibold">Memuat data destinasi...</p>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center font-sans text-text-body bg-bg-main">
        <MapPin size={48} className="text-text-muted mb-4" />
        <h2 className="text-2xl font-bold mb-2">Destinasi Tidak Ditemukan</h2>
        <p className="text-text-body">Lokasi yang Anda cari mungkin tidak ada atau telah dihapus.</p>
        <Link href="/search" className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors">
          Kembali ke Pencarian
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-sans text-text-body bg-bg-main">
      <div
        className="relative w-full h-[320px] md:h-[420px] bg-cover bg-center flex flex-col justify-end"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${getImageUrl(locationData.imageUrl, FALLBACK_IMAGE)})`,
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pb-8 md:pb-12 text-white">
          <div className="flex items-center gap-1 text-[11px] md:text-[13px] font-semibold text-white/85 uppercase tracking-wider mb-2 md:mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="opacity-80" />
            <Link href="/search" className="hover:text-white transition-colors">
              Search
            </Link>
            <ChevronRight size={12} className="opacity-80" />
            <span className="text-white font-bold">{locationData.locationName}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide drop-shadow-md mb-2 md:mb-3">
            {locationData.locationName}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] md:text-[15px] font-semibold text-white/95 mb-5 md:mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-white/80" />
              <span>{locationData.province?.provinceName}, Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span>{popularPlaces.length} Tempat Populer</span>
            </div>
          </div>

          <button 
            onClick={handleStartPlanning}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs md:text-sm px-5 py-2.5 md:px-6 md:py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Mulai Rencanakan Trip
          </button>
        </div>
      </div>

      <div className="bg-bg-surface w-full py-8 md:py-12 border-b border-border-default">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-[1020px] flex flex-col gap-5 text-[14px] md:text-[16px] leading-[1.7] text-text-body font-medium">
            <p>{locationData.description || "Destinasi wisata yang menawarkan pesona tersendiri. Dikenal dengan keramahan penduduknya serta kekayaan budayanya yang memukau bagi setiap pengunjung. Nikmati keindahan lanskap alam yang asri, dipadukan dengan berbagai destinasi modern dan kuliner lokal khas daerah setempat."}</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#F5F6FF] py-10 md:py-14 border-b border-border-default">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-text-heading leading-tight">
                Tempat Populer di {locationData.locationName}
              </h2>
              <p className="text-text-body text-[13px] md:text-[15px] mt-1.5 font-medium">
                Destinasi yang direkomendasikan untuk kunjungan Anda.
              </p>
            </div>
          </div>

          {popularPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPlaces.map((place) => {
                const isAdded = addedItineraries[place.placeId];
                return (
                  <div
                    key={place.placeId}
                    className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(place.image, FALLBACK_IMAGE)}
                        alt={place.placeName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                      {place.categories && place.categories.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[85%]">
                          {place.categories.slice(0, 2).map((cat: any, idx: number) => (
                            <span key={idx} className="bg-brand-primary/95 text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                              {cat.categoryName}
                            </span>
                          ))}
                          {place.categories.length > 2 && (
                            <span className="bg-black/60 text-white text-[10px] md:text-[11px] font-bold px-2 py-1 rounded-md tracking-wider shadow-sm">
                              +{place.categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="text-[16px] md:text-lg font-semibold text-text-heading leading-snug line-clamp-1">
                            {place.placeName}
                          </h3>
                          <div className="flex items-center gap-1 text-[13.5px] font-bold text-[#2563EB] shrink-0">
                            <Star
                              size={15}
                              className="text-[#2563EB] fill-[#2563EB]"
                            />
                            <span>{place.ratingValue?.toFixed(1) || "New"}</span>
                          </div>
                        </div>

                        <p className="text-[13px] md:text-[14px] text-text-body leading-relaxed font-normal mb-4 line-clamp-2">
                          {place.shortDescription || place.address}
                        </p>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between border-t border-border-default pt-4 mb-4">
                          <span className="text-[13px] md:text-[14px] font-semibold text-text-heading">
                            Rp {place.priceMin.toLocaleString("id-ID")} {place.priceMax > place.priceMin ? `- ${place.priceMax.toLocaleString("id-ID")}` : ""}
                          </span>
                          <span className="text-[11px] font-normal text-text-muted uppercase tracking-wider">
                            {place.priceDescription || "Harga"}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleItinerary(place.placeId)}
                          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all border ${isAdded
                              ? "bg-bg-soft-green border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                              : "bg-brand-primary border-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
                            }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={16} />
                              Added to Itinerary
                            </>
                          ) : (
                            <>
                              <PlusCircle size={16} />
                              Add to Itinerary
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center text-center">
              <MapPin size={40} className="text-text-muted mb-3" />
              <p className="text-text-body font-medium">Belum ada tempat wisata yang direkomendasikan untuk lokasi ini.</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-bg-surface py-10 md:py-14">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-text-heading leading-tight">
              Inspirasi Komunitas
            </h2>
            <Link
              href="/community"
              className="text-brand-primary font-bold flex items-center gap-1.5 hover:text-brand-primary-hover hover:underline text-sm cursor-pointer shrink-0"
            >
              Lihat Semua
              <ChevronRight size={16} />
            </Link>
          </div>

          {isCommunityLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-brand-primary" size={32} />
            </div>
          ) : communityItineraries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityItineraries.map((trip) => (
                <div
                  key={trip.itineraryId}
                  className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group relative"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                    <Link href={`/community/${trip.itineraryId}`} className="block w-full h-full">
                      <img
                        src={trip.bannerImageUrl
                          ? getImageUrl(trip.bannerImageUrl, FALLBACK_IMAGE)
                          : "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>
                    <button
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white hover:bg-bg-hover flex items-center justify-center shadow-md transition-colors cursor-pointer border border-border-default z-10"
                      onClick={() => handleToggleSaveItinerary(trip.itineraryId)}
                    >
                      <Bookmark
                        size={14}
                        className={`transition-colors ${savedCommunityItineraries[trip.itineraryId]
                            ? "text-brand-primary fill-brand-primary"
                            : "text-brand-primary fill-transparent hover:fill-brand-primary"
                          }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow min-h-[180px]">
                    <Link href={`/community/${trip.itineraryId}`} className="block flex-grow group-hover:no-underline">
                      <div>
                        <h3 className="text-[14px] md:text-[15px] font-semibold text-text-heading leading-snug line-clamp-2 mb-1 group-hover:text-brand-primary transition-colors">
                          {trip.title}
                        </h3>
                        <span className="text-[11px] md:text-[12px] font-normal text-text-body block mb-2">
                          {trip.location?.locationName || "Berbagai Destinasi"}
                        </span>

                        <div className="flex items-center gap-3 mb-2 text-[11px] md:text-[12px] text-text-body">
                          <div className="flex items-center gap-1">
                            <Calendar size={13} className="text-text-muted" />
                            <span>
                              {trip.startDate && trip.endDate
                                ? `${Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24)) + 1} Hari`
                                : "TBD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wallet size={13} className="text-text-muted" />
                            <span>
                              {trip.budgetPreference
                                ? `Rp ${trip.budgetPreference.toLocaleString("id-ID")}`
                                : "TBD"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[11px] md:text-[12px] font-medium mb-3 text-text-body">
                          <div className="flex items-center gap-1 text-[#BC4800] font-bold">
                            <Star
                              size={13}
                              className="text-[#BC4800] fill-[#BC4800]"
                            />
                            <span>{trip.ratingValue || "0"}</span>
                            <span className="text-text-muted font-normal">
                              ({trip.ratingCount || 0})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bookmark size={13} className="text-text-muted" />
                            <span>{trip.savedCount || 0} saved</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="border-t border-border-default pt-3 mt-auto flex items-center gap-2">
                      {trip.user?.profilePhotoUrl ? (
                        <img
                          src={getImageUrl(trip.user.profilePhotoUrl, FALLBACK_IMAGE)}
                          alt={trip.user?.fullName || "User"}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-border-default"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold ring-1 ring-border-default">
                          {(trip.user?.fullName || "User").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-[11.5px] md:text-[12.5px] font-semibold text-text-heading line-clamp-1">
                        {trip.user?.fullName || "Pengguna Anonim"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-bg-surface border border-border-default rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-bg-soft-blue flex items-center justify-center text-brand-primary mb-3">
                <Bookmark size={22} className="text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-heading">Belum Ada Inspirasi Komunitas</h3>
              <p className="text-text-body text-sm mt-1 max-w-md">
                Jadilah orang pertama yang membagikan rencana perjalanan luar biasa di {locationData?.locationName || "destinasi ini"}!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
