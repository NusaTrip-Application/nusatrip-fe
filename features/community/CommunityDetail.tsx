"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  getItineraryById,
  getCommunitySummary,
  getOtherAuthorItineraries,
  duplicateItinerary,
  toggleSaveItinerary,
  getSavedItineraries,
} from "@/services/plans";
import { getReviewsByItineraryId, createReview } from "@/services/reviews";
import { notification } from "@/lib/notification";

interface CommunityDetailProps {
  itineraryId: string;
}

const resolveStorageUrl = (path: string | null) => {
  if (!path) return "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  if (path.startsWith("http")) return path;
  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev";
  return `${baseUrl}/${path}`;
};

const getDaysArray = (startStr: string, endStr: string) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const arr = [];
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const current = new Date(start);
  while (current <= end) {
    arr.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return arr;
};

const formatDateLabel = (dateObj: Date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
};

const formatDateRelative = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateDuration = (start: string, end: string) => {
  const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return `${diffDays} Hari`;
};

const formatCurrency = (value: number | null) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function CommunityDetail({ itineraryId }: CommunityDetailProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const router = useRouter();

  // API States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<any>(null);
  const [summary, setSummary] = useState<any>({
    averageRating: 0,
    ratingCount: 0,
    totalReviews: 0,
    totalComments: 0,
    totalSaves: 0,
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsMetadata, setReviewsMetadata] = useState<any>({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [othersByAuthor, setOthersByAuthor] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const requireAuth = (callback: () => void) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    callback();
  };

  const fetchReviewsOnly = async (page: number) => {
    try {
      const res = await getReviewsByItineraryId(itineraryId, { page, limit: 5 });
      setReviews(res.data.items);
      setReviewsMetadata(res.data.metadata);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadData() {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        if (active) {
          setError("Unauthorized");
          setLoading(false);
          router.push("/login");
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch itinerary detail
        const itinRes = await getItineraryById(itineraryId);
        if (!active) return;
        setItinerary(itinRes.data);

        // Fetch community data
        try {
          const [summaryRes, reviewsRes, othersRes, savedRes] = await Promise.all([
            getCommunitySummary(itineraryId),
            getReviewsByItineraryId(itineraryId, { page: 1, limit: 5 }),
            getOtherAuthorItineraries(itineraryId),
            getSavedItineraries({ limit: 100 }).catch(() => ({ success: false, data: { items: [] } })),
          ]);

          if (active) {
            setSummary(summaryRes.data);
            setReviews(reviewsRes.data.items);
            setReviewsMetadata(reviewsRes.data.metadata);
            setOthersByAuthor(othersRes.data.items || []);

            // Check if current itinerary is saved
            const isItinSaved = savedRes.success && savedRes.data?.items?.some(
              (item: any) => item.itineraryId === itineraryId
            );
            setIsSaved(!!isItinSaved);
          }
        } catch (err: any) {
          console.error("Failed to load community details:", err.message || err);
        }

      } catch (err: any) {
        console.error("Failed to load itinerary:", err.message || err);
        if (active) {
          setError(err.message || (typeof err === "string" ? err : "Gagal memuat detail itinerary."));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [itineraryId]);

  useEffect(() => {
    if (!loading) {
      fetchReviewsOnly(reviewPage);
    }
  }, [reviewPage]);

  const handleSave = () => {
    requireAuth(async () => {
      try {
        setIsSaving(true);
        await toggleSaveItinerary(itineraryId);
        setIsSaved(true);
        setSummary((prev: any) => ({ ...prev, totalSaves: (prev.totalSaves || 0) + 1 }));
        notification.success("Itinerary berhasil disimpan ke referensi!");
      } catch (err: any) {
        if (err.message && err.message.includes("already saved")) {
          notification.error("Itinerary sudah disimpan di referensi.");
          setIsSaved(true);
        } else {
          notification.error(err.message || "Gagal menyimpan itinerary.");
        }
      } finally {
        setIsSaving(false);
      }
    });
  };

  const handleDuplicate = () => {
    requireAuth(async () => {
      try {
        setIsDuplicating(true);
        await duplicateItinerary(itineraryId);
        notification.success("Itinerary berhasil diduplikat ke rencana Anda!");
        router.push("/my-plans");
      } catch (err: any) {
        notification.error(err.message || "Gagal menduplikat itinerary.");
      } finally {
        setIsDuplicating(false);
      }
    });
  };

  const handleSubmitReview = () => {
    requireAuth(async () => {
      if (reviewRating === 0) {
        notification.error("Silakan pilih rating bintang terlebih dahulu.");
        return;
      }
      try {
        setIsSubmittingReview(true);
        await createReview(itineraryId, {
          rating: reviewRating,
          comment: reviewText.trim() || undefined,
        });
        notification.success("Ulasan Anda berhasil dikirim!");
        setIsReviewModalOpen(false);
        setReviewRating(0);
        setReviewText("");
        // Refresh reviews and summary stats
        fetchReviewsOnly(reviewPage);
        const summaryRes = await getCommunitySummary(itineraryId);
        setSummary(summaryRes.data);
      } catch (err: any) {
        notification.error(err.message || "Gagal mengirimkan ulasan.");
      } finally {
        setIsSubmittingReview(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 bg-bg-main relative animate-pulse">
        <div className="h-6 w-32 bg-border-default rounded mb-4" />
        <div className="h-10 w-2/3 bg-border-default rounded mb-6" />
        <div className="flex gap-4 mb-8">
          <div className="w-10 h-10 bg-border-default rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-border-default rounded" />
            <div className="h-3 w-32 bg-border-default rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-16 bg-border-default rounded-xl" />
            <div className="h-64 bg-border-default rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-border-default rounded-xl" />
            <div className="h-40 bg-border-default rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[600px] mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-text-heading mb-4 font-serif">Akses Terbatasi</h2>
        <p className="text-text-body mb-6">
          {error.includes("Unauthorized") || error.includes("Token") || error.includes("401")
            ? "Silakan masuk (login) terlebih dahulu untuk dapat melihat detail itinerary ini."
            : error}
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
        >
          Masuk ke Akun
        </button>
      </div>
    );
  }

  const daysArray = itinerary ? getDaysArray(itinerary.startDate, itinerary.endDate) : [];
  const activeDateObj = daysArray[activeDay];
  let timelineItems: any[] = [];
  if (activeDateObj && itinerary?.itineraryItemsByDay) {
    const year = activeDateObj.getFullYear();
    const month = String(activeDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(activeDateObj.getDate()).padStart(2, '0');
    const activeDateKey = `${year}-${month}-${day}`;
    timelineItems = itinerary.itineraryItemsByDay[activeDateKey] || [];
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 bg-bg-main relative">
      {/* Breadcrumbs & Header */}
      <div className="mb-8 border-b border-border-default pb-6">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link href="/community" className="hover:text-brand-primary transition-colors">
            Komunitas
          </Link>
          <ChevronRight size={14} />
          <span className="text-text-heading font-medium line-clamp-1">{itinerary.title}</span>
        </div>

        <h1 className="text-[28px] md:text-4xl font-serif font-bold text-text-heading mb-6 leading-tight">
          {itinerary.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
          <div className="flex items-center gap-3">
            <img
              src={resolveStorageUrl(itinerary.user?.photoUrl)}
              alt={itinerary.user?.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border-default"
            />
            <div>
              <p className="text-[14px] font-bold text-text-heading leading-tight">{itinerary.user?.fullName || "Anonim"}</p>
              <p className="text-[12px] text-text-muted mt-0.5">
                Dipublikasikan pada {formatDateRelative(itinerary.createdAt)}
              </p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-border-default" />
          <div className="flex items-center gap-2 text-text-body">
            <MapPin size={18} className="text-text-muted" />
            <span className="text-[14px] font-medium">{itinerary.location?.locationName || "Berbagai Destinasi"}</span>
          </div>
          <div className="flex items-center gap-2 text-text-body">
            <Calendar size={18} className="text-text-muted" />
            <span className="text-[14px] font-medium">{calculateDuration(itinerary.startDate, itinerary.endDate)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Content (Left) */}
        <div className="flex-grow min-w-0">
          {/* Days Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {daysArray.map((dayDate, idx) => {
              const isActive = activeDay === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`flex flex-col items-center justify-center min-w-[80px] md:min-w-[90px] py-3 px-2 rounded-xl border transition-all snap-start ${isActive
                      ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                      : "bg-bg-surface border-border-default text-text-body hover:bg-bg-hover"
                    }`}
                >
                  <span className={`text-[13px] md:text-[14px] font-bold mb-0.5 ${isActive ? "text-white" : "text-text-heading"}`}>
                    Hari {idx + 1}
                  </span>
                  <span className={`text-[11px] md:text-[12px] ${isActive ? "text-white/90" : "text-text-muted"}`}>
                    {formatDateLabel(dayDate)}
                  </span>
                </button>
              );
            })}
          </div>

          <h2 className="text-[22px] md:text-[24px] font-bold text-text-heading mt-6 mb-8 font-serif">
            Hari Ke-{activeDay + 1}
          </h2>

          {/* Timeline */}
          <div className="relative ml-1 md:ml-2 mb-10">
            {timelineItems.length > 0 ? (
              <>
                {/* Vertical Line */}
                <div className="absolute left-[13px] top-6 bottom-4 w-[2px] bg-[#C3C6D7] z-0" />

                <div className="space-y-10 relative z-10">
                  {timelineItems.map((item, idx) => {
                    const placeImage = item.place?.images?.[0]?.imageUrl
                      ? resolveStorageUrl(item.place.images[0].imageUrl)
                      : "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

                    return (
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
                          <p className="text-[#2563EB] font-bold text-[16px] mb-3 leading-none pt-1">{item.visitTime}</p>
                          <div className="rounded-xl overflow-hidden mb-4 relative aspect-[16/9] md:aspect-[21/9] shadow-sm">
                            <img src={placeImage} alt={item.place?.placeName} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute top-4 left-4 bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1.5 rounded tracking-wide">
                              {item.place?.categories?.[0]?.toUpperCase() || "VISIT"}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 md:p-5 pt-16">
                              <h3 className="font-bold text-white text-lg md:text-xl line-clamp-1">{item.place?.placeName}</h3>
                              <p className="text-white/90 text-[13px] mt-1 line-clamp-1">{item.place?.address}</p>
                            </div>
                          </div>
                          <p className="text-[#475569] text-[15px] leading-relaxed">
                            Notes: {item.notes || "Tidak ada catatan."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-bg-surface border border-border-default rounded-xl p-8 text-center text-text-muted">
                Tidak ada destinasi rencana perjalanan pada hari ini.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <aside className="lg:w-[340px] shrink-0">
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-heading mb-4">Tindakan Cepat</h3>
            <button
              disabled={isDuplicating}
              onClick={handleDuplicate}
              className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-[14px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-3 transition-colors shadow-sm cursor-pointer"
            >
              <Copy size={18} /> {isDuplicating ? "Menduplikat..." : "Duplikat ke Rencana Saya"}
            </button>
            <button
              disabled={isSaved || isSaving}
              onClick={handleSave}
              className="w-full border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5 disabled:border-gray-300 disabled:text-gray-400 disabled:bg-transparent font-bold text-[14px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 mb-4 transition-colors cursor-pointer"
            >
              <Bookmark size={18} /> {isSaved ? "Tersimpan di Referensi" : isSaving ? "Menyimpan..." : "Simpan ke Referensi"}
            </button>
            <div className="flex gap-3">
              <button className="flex-1 border border-border-default text-text-body hover:bg-bg-hover font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[13px] transition-colors cursor-pointer">
                <Share2 size={16} className="text-text-muted" /> Bagikan
              </button>
              <button className="flex-1 border border-border-default text-text-body hover:bg-bg-hover font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[13px] transition-colors cursor-pointer">
                <Flag size={16} className="text-text-muted" /> Laporkan
              </button>
            </div>
          </div>

          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-heading mb-2">Biaya Anggaran</h3>
            <p className="text-[24px] font-serif font-bold text-text-heading tracking-tight">
              {formatCurrency(itinerary.budgetPreference)}
            </p>
          </div>

          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-text-heading mb-5">Lainnya oleh {itinerary.user?.fullName || "Penulis"}</h3>
            <div className="space-y-5">
              {othersByAuthor.length > 0 ? (
                othersByAuthor.map((trip, idx) => (
                  <Link href={`/community/${trip.itineraryId}`} key={idx} className="flex gap-4 items-center group">
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 border border-border-default">
                      <img
                        src={resolveStorageUrl(trip.bannerImageUrl)}
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
                          <Calendar size={13} /> {calculateDuration(trip.startDate, trip.endDate)}
                        </span>
                        <span className="flex items-center gap-1 text-[#BC4800] font-bold">
                          <Star size={13} className="fill-[#BC4800]" /> {trip.ratingValue || 0} <span className="font-medium text-text-muted">({trip.ratingCount || 0})</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-[14px] text-text-muted">Tidak ada itinerary lain dari penulis ini.</p>
              )}
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
                  <Star
                    key={i}
                    className={i < Math.round(summary.averageRating) ? "fill-current" : "text-text-muted"}
                    size={16}
                  />
                ))}
              </div>
              <span className="ml-1 font-semibold">
                {summary.averageRating}/5 dari {summary.totalReviews} ulasan
              </span>
            </div>
          </div>
          <button
            onClick={() => requireAuth(() => setIsReviewModalOpen(true))}
            className="bg-[#2563EB] text-white font-semibold text-[14px] py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-sm self-start md:self-auto w-full md:w-auto cursor-pointer"
          >
            Tulis Ulasan
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <div key={idx} className="bg-bg-surface border border-border-default rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold flex items-center justify-center text-[14px]">
                      {getInitials(review.reviewer?.fullName)}
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] text-text-heading">{review.reviewer?.fullName}</p>
                      <p className="text-[12px] text-text-muted mt-0.5">{formatDateRelative(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={i < review.rating ? "fill-current" : "text-text-muted"} size={14} />
                    ))}
                  </div>
                </div>
                <p className="text-text-body text-[14px] leading-relaxed">
                  {review.comment || "Penilai tidak meninggalkan komentar."}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-bg-surface border border-border-default rounded-xl p-8 text-center text-text-muted">
              Belum ada ulasan untuk itinerary ini. Jadilah yang pertama memberikan ulasan!
            </div>
          )}
        </div>

        {/* Pagination */}
        {reviewsMetadata.totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              disabled={!reviewsMetadata.hasPrevPage}
              onClick={() => setReviewPage((p) => p - 1)}
              className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(reviewsMetadata.totalPages)].map((_, i) => {
              const pg = i + 1;
              const isCurrent = reviewsMetadata.page === pg;
              return (
                <button
                  key={pg}
                  onClick={() => setReviewPage(pg)}
                  className={`w-9 h-9 rounded-full font-semibold flex items-center justify-center text-[14px] cursor-pointer ${isCurrent
                      ? "bg-[#2563EB] text-white"
                      : "border border-border-default text-text-body hover:bg-bg-hover transition-colors"
                    }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              disabled={!reviewsMetadata.hasNextPage}
              onClick={() => setReviewPage((p) => p + 1)}
              className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
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
                    className="focus:outline-none cursor-pointer"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={20}
                      className={`transition-colors ${star <= (hoverRating || reviewRating)
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setReviewRating(0);
                  setReviewText("");
                }}
                className="border border-border-default text-text-body font-semibold text-[14px] py-2.5 px-6 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={isSubmittingReview}
                onClick={handleSubmitReview}
                className="bg-[#2563EB] text-white font-semibold text-[14px] py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-md cursor-pointer"
              >
                {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}