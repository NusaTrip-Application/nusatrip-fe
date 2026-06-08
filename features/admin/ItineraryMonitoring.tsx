"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Star, MapPin, Bell, Settings } from "lucide-react";
import {
  getAdminItineraries,
  getAdminItinerarySummary,
  adminDeleteItinerary,
  getItineraryById,
  type AdminItinerary,
  type AdminItinerariesMetadata,
  type VisibilityStatus,
} from "@/services/plans";
import { getLocationOptions, type LocationOption } from "@/services/locations";

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

const MoneyIcon = () => (
  <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24">
    <path d="M12 6V18M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10M12 6C13.1046 6 14 6.89543 14 8M12 18C13.1046 18 14 17.1046 14 16C14 14.8954 13.1046 14 12 14M12 18C10.8954 18 10 17.1046 10 16M12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" fill="none" viewBox="0 0 18 18">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25ZM15.75 15.75L12.525 12.525" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M1.5465 8.739C1.48399 8.90739 1.48399 9.09261 1.5465 9.261C2.15528 10.7371 3.18864 11.9992 4.51558 12.8873C5.84252 13.7754 7.40328 14.2495 9 14.2495C10.5967 14.2495 12.1575 13.7754 13.4844 12.8873C14.8114 11.9992 15.8447 10.7371 16.4535 9.261C16.516 9.09261 16.516 8.90739 16.4535 8.739C15.8447 7.26289 14.8114 6.00078 13.4844 5.11267C12.1575 4.22457 10.5967 3.75046 9 3.75046C7.40328 3.75046 5.84252 4.22457 4.51558 5.11267C3.18864 6.00078 2.15528 7.26289 1.5465 8.739ZM9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M2.25 4.5H15.75M7.5 8.25V12.75M10.5 8.25V12.75M3.75 4.5L4.5 14.25C4.5 15.0784 5.17157 15.75 6 15.75H12C12.8284 15.75 13.5 15.0784 13.5 14.25L14.25 4.5M6.75 4.5V2.25C6.75 1.83579 7.08579 1.5 7.5 1.5H10.5C10.9142 1.5 11.25 1.83579 11.25 2.25V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 16 16">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 16 16">
    <path d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6667 1.33334V4.00001M5.33333 1.33334V4.00001M2 6.66666H14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 16 16">
    <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88563 10.781C9.38553 10.281 8.70726 10 8.00004 10H3.33337C2.62613 10 1.94785 10.281 1.44775 10.781C0.947654 11.2811 0.666703 11.9594 0.666703 12.6667V14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.66667 7.33333C7.13943 7.33333 8.33333 6.13943 8.33333 4.66667C8.33333 3.19391 7.13943 2 5.66667 2C4.19391 2 3 3.19391 3 4.66667C3 6.13943 4.19391 7.33333 5.66667 7.33333Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.3334 14V12.6667C13.3329 12.0758 13.1362 11.5019 12.7742 11.0349C12.4121 10.5679 11.9054 10.2344 11.3334 10.0867" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6666 2.08667C11.2402 2.23354 11.7485 2.56714 12.1116 3.03489C12.4748 3.50264 12.6719 4.07789 12.6719 4.67C12.6719 5.26211 12.4748 5.83736 12.1116 6.30511C11.7485 6.77286 11.2402 7.10646 10.6666 7.25333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
      <div className="mb-4">{icon}</div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="font-serif text-2xl text-text-heading">{value}</p>
    </div>
  );
}

// ─── Table Row Skeleton ──────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <div className="px-6 py-5 flex items-center animate-pulse border-b border-border-default last:border-0">
      <div className="grid grid-cols-12 gap-4 w-full items-center">
        <div className="col-span-3 flex items-center gap-3">
          <div className="w-16 h-12 bg-bg-soft-blue rounded-lg flex-shrink-0"></div>
          <div className="h-4 bg-bg-soft-blue rounded w-24"></div>
        </div>
        <div className="col-span-2">
          <div className="h-6 bg-bg-soft-blue rounded w-16"></div>
        </div>
        <div className="col-span-2">
          <div className="h-4 bg-bg-soft-blue rounded w-20"></div>
        </div>
        <div className="col-span-2">
          <div className="h-6 bg-bg-soft-blue rounded w-12"></div>
        </div>
        <div className="col-span-1">
          <div className="h-4 bg-bg-soft-blue rounded w-10"></div>
        </div>
        <div className="col-span-2 flex justify-end gap-2">
          <div className="w-9 h-9 bg-bg-soft-blue rounded-lg"></div>
          <div className="w-9 h-9 bg-bg-soft-blue rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

// ─── Visibility Badge ──────────────────────────────────────────────────────────

function VisibilityBadge({ status }: { status: VisibilityStatus }) {
  const config: Record<VisibilityStatus, { label: string; className: string; dot: string }> = {
    PUBLISHED: {
      label: "Published",
      className: "bg-success/10 text-success",
      dot: "bg-success",
    },
    PRIVATE: {
      label: "Private",
      className: "bg-amber-50 text-amber-600",
      dot: "bg-amber-400",
    },
  };

  const { label, className, dot } = config[status] ?? config.PRIVATE;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-full ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// Avatar logic removed per user request

// ─── Detail Modal ──────────────────────────────────────────────────────────────

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev";
const ITINERARY_FALLBACK = "/images/hero/pantaikuta.jpg";

function getItineraryImageUrl(urlOrKey?: string | null) {
  if (!urlOrKey) return ITINERARY_FALLBACK;
  if (urlOrKey.startsWith("http")) return urlOrKey;
  return `${STORAGE_URL}/${urlOrKey}`;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatRupiah(amount?: number | null) {
  if (amount === null || amount === undefined) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const generateTripDates = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return [];
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
    dates.push({
      label: formattedDate,
      value: currentDate.toISOString().split('T')[0]
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

function ItineraryDetailModal({
  itinerary,
  onClose,
}: {
  itinerary: AdminItinerary;
  onClose: () => void;
}) {
  const [fullData, setFullData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<string>("");

  useEffect(() => {
    getItineraryById(itinerary.itineraryId).then(res => {
      const data = res.data || res;
      setFullData(data);

      const dates = generateTripDates(data.startDate, data.endDate);
      if (dates.length > 0) setActiveDate(dates[0].value);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [itinerary.itineraryId]);

  let timelineData: any[] = [];
  if (fullData) {
    let items: any[] = [];
    if (fullData.itineraryItemsByDay) {
      Object.values(fullData.itineraryItemsByDay).forEach((dayItems: any) => {
        if (Array.isArray(dayItems)) items.push(...dayItems);
      });
    } else if (fullData.items || fullData.itineraryItems) {
      items = fullData.items || fullData.itineraryItems || [];
    }
    timelineData = items.map((item: any) => {
      const rawImg = item.place?.images?.[0]?.imageUrl || item.place?.images?.[0] || item.place?.image?.imageUrl || item.place?.coverImage || item.img;
      return {
        id: item.itineraryItemId || item.id,
        time: item.visitTime || item.time,
        date: item.visitDate ? new Date(item.visitDate).toISOString().split('T')[0] : item.date,
        title: item.place?.placeName || item.place?.name || item.title || "Unknown Place",
        subtitle: item.place?.address || item.subtitle || "",
        category: item.place?.categories?.[0]?.categoryName || item.category || "General",
        rating: item.place?.ratingValue || item.rating || 4.5,
        img: getItineraryImageUrl(rawImg),
        notes: item.notes || "",
      };
    });
    timelineData.sort((a, b) => a.time.localeCompare(b.time));
  }

  const currentDayTimeline = timelineData.filter((item) => item.date === activeDate);
  const tripDates = fullData ? generateTripDates(fullData.startDate, fullData.endDate) : [];

  const diffDays = tripDates.length || 1;
  const diffNights = Math.max(0, diffDays - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-white px-8 py-5 border-b border-border-default flex items-center justify-between flex-shrink-0 z-10">
          <div>
            <h2 className="font-serif text-2xl font-bold text-text-heading leading-tight mb-1">Detail Itinerary</h2>
            <p className="text-[13px] font-medium text-text-muted">
              {itinerary.title} • ID: #{itinerary.itineraryId.substring(0, 8).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-2.5 text-text-muted hover:bg-bg-hover hover:text-text-heading rounded-xl transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 size={32} className="animate-spin text-brand-primary mb-4" />
              <p className="text-text-muted font-medium">Memuat detail itinerary...</p>
            </div>
          ) : !fullData ? (
            <div className="text-center py-12 text-error font-medium">Gagal memuat data itinerary.</div>
          ) : (
            <div className="max-w-[950px] mx-auto">
              {/* Top Card */}
              <div className="bg-white rounded-2xl border border-border-default p-4 flex flex-col lg:flex-row gap-6 mb-8">
                {/* Banner Image */}
                <div className="w-full lg:w-[380px] h-[220px] rounded-xl overflow-hidden relative flex-shrink-0 bg-border-default">
                  <img src={getItineraryImageUrl(fullData.bannerImageUrl || fullData.bannerPhotoUrl)} alt={fullData.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">
                    Eksklusif
                  </div>
                </div>
                {/* Info Text */}
                <div className="flex-1 py-2 pr-4 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="font-serif text-[28px] font-bold text-brand-primary leading-tight">{fullData.title}</h3>
                    <div className="flex-shrink-0 mt-1">
                      {fullData.visibilityStatus === "PUBLISHED" ? (
                        <span className="bg-[#E6F4EA] text-[#137333] text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-[12px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[14.5px] text-text-body font-medium leading-relaxed mb-6 line-clamp-3">
                    {fullData.description || `Nikmati perjalanan ${diffDays} hari ${diffNights} malam yang dirancang khusus untuk mengeksplorasi keindahan destinasi ini. Setiap langkah membawa Anda lebih dekat dengan budaya dan keajaiban lokal.`}
                  </p>

                  <div className="mt-auto pt-5 border-t border-border-default flex gap-8">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-brand-primary"><CalendarIcon /></div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Durasi</p>
                        <p className="text-[13px] font-bold text-text-heading">{diffDays} Hari, {diffNights} Malam</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-brand-primary"><UsersIcon /></div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Kapasitas</p>
                        <p className="text-[13px] font-bold text-text-heading">Min. 1 - Maks. {fullData.travelerCount || "-"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-brand-primary"><MoneyIcon /></div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Harga Mulai</p>
                        <p className="text-[14px] font-bold text-brand-primary">{formatRupiah(fullData.estimatedTotalBudget || fullData.budgetPreference)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Days Tabs */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
                {tripDates.map((dateObj, index) => (
                  <button
                    key={dateObj.value}
                    onClick={() => setActiveDate(dateObj.value)}
                    className={`flex flex-col items-center justify-center min-w-[85px] py-3.5 rounded-xl transition-all border ${activeDate === dateObj.value
                      ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                      : 'bg-white text-text-heading border-border-default hover:bg-bg-hover'
                      }`}
                  >
                    <span className="text-[14.5px] font-bold">Hari {index + 1}</span>
                    <span className={`text-[12px] font-medium mt-0.5 ${activeDate === dateObj.value ? 'text-white/80' : 'text-text-muted'}`}>
                      {dateObj.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Timeline Items */}
              <div className="space-y-0 pl-1">
                {currentDayTimeline.length === 0 ? (
                  <div className="text-center py-12 text-text-muted font-medium bg-white rounded-2xl border border-dashed border-border-default">
                    Belum ada tempat di jadwal hari ini.
                  </div>
                ) : (
                  currentDayTimeline.map((item, index) => (
                    <ReadOnlyTimelineItem
                      key={item.id}
                      data={item}
                      isLast={index === currentDayTimeline.length - 1}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadOnlyTimelineItem({ data, isLast }: { data: any; isLast: boolean }) {
  return (
    <div className="flex gap-5 relative">
      {/* Vertical Line */}
      <div className="flex flex-col items-center mt-1 w-6 shrink-0">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary bg-[#F9FAFB] z-10 flex items-center justify-center">
          <MapPin size={12} className="text-brand-primary" strokeWidth={3} />
        </div>
        {!isLast && <div className="w-[2px] h-full bg-border-default -mt-2 pb-8" />}
      </div>

      <div className="flex-grow pb-10">
        <span className="font-bold text-[16px] text-brand-primary block mb-3 leading-none tracking-wide">{data.time}</span>

        <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-3 shadow-sm bg-black">
          <img src={data.img} alt={data.title} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-sm tracking-wider uppercase">
            {data.category}
          </div>

          <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
            <div>
              <h4 className="font-serif font-bold text-[22px] text-white leading-tight mb-1">{data.title}</h4>
              <p className="text-[13px] font-medium text-white/80">{data.subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#FFD700]">
              <Star size={15} className="fill-[#FFD700]" /> {data.rating}
            </div>
          </div>
        </div>

        {data.notes && (
          <p className="text-[14.5px] text-text-body font-medium leading-relaxed mt-4">
            Notes: {data.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────────

function DeleteModal({
  itinerary,
  onClose,
  onSuccess,
}: {
  itinerary: AdminItinerary;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminDeleteItinerary(itinerary.itineraryId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center text-error">
            <TrashIcon />
          </div>
          <h3 className="font-serif text-xl text-text-heading">Hapus Itinerary?</h3>
          <p className="text-sm text-text-body">
            Apakah kamu yakin ingin menghapus itinerary{" "}
            <span className="font-bold text-text-heading">&quot;{itinerary.title}&quot;</span> milik{" "}
            <span className="font-bold text-text-heading">{itinerary.user.fullName}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-sm text-error mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-border-default text-sm font-semibold text-text-body hover:bg-bg-hover transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-error hover:opacity-90 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;

export default function ItineraryMonitoring() {
  const [itineraries, setItineraries] = useState<AdminItinerary[]>([]);
  const [metadata, setMetadata] = useState<AdminItinerariesMetadata | null>(null);
  const [summary, setSummary] = useState<{ total: number; totalPublished: number; totalPrivate: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<VisibilityStatus | "">("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortParam, setSortParam] = useState("createdAtDesc");
  const [locations, setLocations] = useState<LocationOption[]>([]);

  const [detailItinerary, setDetailItinerary] = useState<AdminItinerary | null>(null);
  const [deleteItinerary, setDeleteItinerary] = useState<AdminItinerary | null>(null);

  // Load location options once
  useEffect(() => {
    getLocationOptions()
      .then((res) => { if (res.success) setLocations(res.data); })
      .catch(console.error);
  }, []);

  const fetchItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: ITEMS_PER_PAGE, sortBy: sortParam };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterLocation) params.locationId = filterLocation;

      const res = await getAdminItineraries(params);
      if (res.success) {
        setItineraries(res.data.items);
        setMetadata(res.data.metadata);
      }
    } catch (err) {
      console.error("Error fetching itineraries:", err);
    } finally {
      setIsLoading(false);
    }

    getAdminItinerarySummary()
      .then((res) => { if (res.success) setSummary(res.data); })
      .catch(console.error);
  }, [page, search, filterStatus, filterLocation, sortParam]);

  useEffect(() => { fetchItineraries(); }, [fetchItineraries]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (search !== trimmed) { setSearch(trimmed); setPage(1); }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, search]);

  const handleDelete = (itinerary: AdminItinerary) => {
    setDeleteItinerary(itinerary);
  };

  const totalPages = metadata?.totalPages ?? 1;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const max = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      {/* ── Top Header ── */}
      <div className="sticky top-0 z-10 bg-bg-surface border-b border-border-default shadow-sm h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 12H15M9 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl text-text-heading leading-tight">Monitoring Itinerary</h1>
            <p className="text-sm text-text-muted">Pantau dan kelola itinerary pengguna</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="p-2 rounded-full hover:bg-bg-hover relative">
            <Bell className="w-5 h-5 text-text-body" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-bg-hover">
            <Settings className="w-5 h-5 text-text-body" />
          </button>
          <div className="w-10 h-10 rounded-full bg-border-default overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin&background=F3F3FE&color=5855E9" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            label="Total Itinerary"
            value={summary?.total ?? 0}
            icon={
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Total Published Itinerary"
            value={summary?.totalPublished ?? 0}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Total Private Itinerary"
            value={summary?.totalPrivate ?? 0}
            icon={
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24">
                <path d="M12 22C13.3261 22 14.5979 21.4732 15.5355 20.5355C16.4732 19.5979 17 18.3261 17 17V11H7V17C7 18.3261 7.52678 19.5979 8.46447 20.5355C9.40215 21.4732 10.6739 22 12 22ZM17 11H19C19.5304 11 20.0391 10.7893 20.4142 10.4142C20.7893 10.0391 21 9.53043 21 9V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V9C3 9.53043 3.21071 10.0391 3.58579 10.4142C3.96086 10.7893 4.46957 11 5 11H7M17 11H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-4">
          <form
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput.trim()); setPage(1); }}
            className="flex-1 min-w-[200px] relative"
          >
            <SearchIcon />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari judul atau pembuat..."
              className="w-full bg-bg-soft-blue border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </form>

          <div className="relative">
            <select
              value={filterLocation}
              onChange={(e) => { setFilterLocation(e.target.value); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="">Semua Lokasi</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as VisibilityStatus | ""); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="">Semua Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="PRIVATE">Private</option>
            </select>
            <ChevronDownIcon />
          </div>

          <div className="relative">
            <select
              value={sortParam}
              onChange={(e) => { setSortParam(e.target.value); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="createdAtDesc">Terbaru</option>
              <option value="createdAtAsc">Terlama</option>
              <option value="titleAsc">Judul (A-Z)</option>
              <option value="titleDesc">Judul (Z-A)</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="bg-bg-soft-blue border-b border-border-default px-6 py-5">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
              <div className="col-span-3">Judul Itinerary</div>
              <div className="col-span-2">Pembuat</div>
              <div className="col-span-2">Lokasi</div>
              <div className="col-span-2">Budget Estimasi</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border-default">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : itineraries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-medium">Tidak ada itinerary ditemukan</p>
              </div>
            ) : (
              itineraries.map((itin) => (
                <div key={itin.itineraryId} className="px-6 py-5 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Title + thumbnail */}
                    <div className="col-span-3 flex items-center gap-3">
                      <img
                        src={getItineraryImageUrl(itin.bannerImageUrl)}
                        alt={itin.title}
                        className="w-14 h-14 rounded-xl object-cover bg-border-default flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = ITINERARY_FALLBACK; }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-text-heading text-sm leading-snug line-clamp-2">{itin.title}</p>
                        <p className="text-[11px] text-text-muted mt-0.5 font-mono">
                          ID: {itin.itineraryId.slice(0, 8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-text-muted">
                          <CalendarIcon />
                          <span>{formatDate(itin.startDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="col-span-2 flex flex-col justify-center">
                      <span className="text-sm font-medium text-text-heading line-clamp-1">{itin.user.fullName}</span>
                      <span className="text-xs text-text-muted line-clamp-1">{itin.user.email}</span>
                    </div>

                    {/* Location */}
                    <div className="col-span-2">
                      <p className="text-sm text-text-body font-medium line-clamp-2">
                        {itin.location.locationName}, {itin.location.province.provinceName}
                      </p>
                    </div>

                    {/* Budget */}
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-text-heading">
                        {formatRupiah(itin.estimatedTotalBudget ?? itin.budgetPreference)}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <VisibilityBadge status={itin.visibilityStatus} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => setDetailItinerary(itin)}
                        className="p-2 rounded-lg bg-bg-soft-blue hover:bg-brand-primary/10 text-brand-primary transition-colors border border-transparent hover:border-brand-primary/20"
                        title="Detail"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(itin)}
                        className="p-2 rounded-lg bg-bg-soft-blue hover:bg-error/10 text-error transition-colors border border-transparent hover:border-error/20"
                        title="Hapus"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="bg-bg-soft-blue border-t border-border-default px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-medium text-text-muted">
                Menampilkan {itineraries.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}–
                {Math.min(page * ITEMS_PER_PAGE, metadata?.totalItems ?? 0)} dari {metadata?.totalItems ?? 0} Itinerary
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12"><path d="M7.4 1.4L6 0L0 6L6 12L7.4 10.6L2.8 6L7.4 1.4Z" /></svg>
                </button>
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition ${page === pageNum ? "bg-brand-primary text-white" : "text-text-heading hover:bg-bg-hover"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || totalPages === 0}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12"><path d="M0.6 10.6L2 12L8 6L2 0L0.6 1.4L5.2 6L0.6 10.6Z" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {detailItinerary && (
        <ItineraryDetailModal
          itinerary={detailItinerary}
          onClose={() => setDetailItinerary(null)}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteItinerary && (
        <DeleteModal
          itinerary={deleteItinerary}
          onClose={() => setDeleteItinerary(null)}
          onSuccess={() => fetchItineraries()}
        />
      )}
    </>
  );
}
