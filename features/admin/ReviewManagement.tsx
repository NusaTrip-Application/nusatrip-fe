"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Settings } from "lucide-react";
import {
  getAdminReviews,
  getAdminReviewSummary,
  adminDeleteReview,
  type AdminReview,
  type AdminReviewsMetadata,
  type AdminReviewSummary,
} from "@/services/reviews";

// ─── SVG Icons ──────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" fill="none" viewBox="0 0 18 18">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25ZM15.75 15.75L12.525 12.525" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M1.5465 8.739C1.48399 8.90739 1.48399 9.09261 1.5465 9.261C2.15528 10.7371 3.18864 11.9992 4.51558 12.8873C5.84252 13.7754 7.40328 14.2495 9 14.2495C10.5967 14.2495 12.1575 13.7754 13.4844 12.8873C14.8114 11.9992 15.8447 10.7371 16.4535 9.261C16.516 9.09261 16.516 8.90739 16.4535 8.739C15.8447 7.26289 14.8114 6.00078 13.4844 5.11267C12.1575 4.22457 10.5967 3.75046 9 3.75046C7.40328 3.75046 5.84252 4.22457 4.51558 5.11267C3.18864 6.00078 2.15528 7.26289 1.5465 8.739ZM9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M2.25 4.5H15.75M14.25 4.5V15C14.25 15.75 13.5 16.5 12.75 16.5H5.25C4.5 16.5 3.75 15.75 3.75 15V4.5M6 4.5V3C6 2.25 6.75 1.5 7.5 1.5H10.5C11.25 1.5 12 2.25 12 3V4.5M7.5 8.25V12.75M10.5 8.25V12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarFilled = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4 text-amber-400"} viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.04894 2.92705C7.3483 2.00574 8.6517 2.00574 8.95106 2.92705L9.90983 5.82779C10.0432 6.23926 10.4261 6.51779 10.8575 6.51779H13.9137C14.8822 6.51779 15.2849 7.75316 14.4999 8.32779L12.0477 10.1046C11.6976 10.3572 11.5533 10.8088 11.6867 11.2203L12.6455 14.121C12.9448 15.0423 11.8917 15.8084 11.1067 15.2338L8.65451 13.457C8.30444 13.2044 7.82556 13.2044 7.47549 13.457L5.02329 15.2338C4.23827 15.8084 3.18517 15.0423 3.48452 14.121L4.44329 11.2203C4.5767 10.8088 4.43237 10.3572 4.08229 10.1046L1.63009 8.32779C0.845073 7.75316 1.2478 6.51779 2.21629 6.51779H5.27253C5.70386 6.51779 6.08677 6.23926 6.22017 5.82779L7.04894 2.92705Z"/>
  </svg>
);

// ─── StatCard ───────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
      <div className="mb-4">{icon}</div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="font-serif text-2xl text-text-heading">{value}</p>
    </div>
  );
}

// ─── Table Row Skeleton ──────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <div className="px-6 py-4 animate-pulse">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3 flex items-center gap-3">
          <div className="w-12 h-10 rounded-lg bg-bg-soft-blue flex-shrink-0" />
          <div className="h-4 bg-bg-soft-blue rounded w-28" />
        </div>
        <div className="col-span-2"><div className="h-4 bg-bg-soft-blue rounded w-24" /></div>
        <div className="col-span-2"><div className="h-4 bg-bg-soft-blue rounded w-16" /></div>
        <div className="col-span-2"><div className="h-4 bg-bg-soft-blue rounded w-28" /></div>
        <div className="col-span-1"><div className="h-4 bg-bg-soft-blue rounded w-16" /></div>
        <div className="col-span-1"><div className="h-6 bg-bg-soft-blue rounded w-14" /></div>
        <div className="col-span-1 flex justify-end gap-2">
          <div className="w-8 h-8 bg-bg-soft-blue rounded" />
          <div className="w-8 h-8 bg-bg-soft-blue rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Star Rating Display ─────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarFilled
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-amber-400" : "text-border-strong"}`}
        />
      ))}
      <span className="text-sm font-bold text-text-heading ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Review Detail Modal ─────────────────────────────────────────────────────────

function ReviewDetailModal({
  review,
  onClose,
}: {
  review: AdminReview;
  onClose: () => void;
}) {
  const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';
  const getItineraryImage = (url?: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60";
    if (url.startsWith("http")) return url;
    return `${STORAGE_URL}/${url}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-default flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-heading">Detail Review</h2>
            <p className="text-[12px] text-text-muted mt-0.5">ID: #{review.reviewId.substring(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:bg-bg-hover hover:text-text-heading rounded-xl transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Itinerary Card */}
          <div className="flex gap-4 p-4 bg-bg-soft-blue rounded-xl border border-border-default">
            <img
              src={getItineraryImage(review.itinerary.bannerImageUrl)}
              alt={review.itinerary.title}
              className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60"; }}
            />
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-1">Nama Itinerary</p>
              <p className="font-bold text-text-heading leading-snug">{review.itinerary.title}</p>
              <span className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded inline-block w-fit uppercase ${
                review.itinerary.visibilityStatus === "PUBLISHED"
                  ? "bg-success/10 text-success"
                  : "bg-border-default/50 text-text-muted"
              }`}>
                {review.itinerary.visibilityStatus}
              </span>
            </div>
          </div>

          {/* Reviewer */}
          <div className="p-4 bg-bg-soft-blue rounded-xl border border-border-default">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">Reviewer</p>
            <p className="font-bold text-text-heading">{review.reviewerUser.fullName}</p>
          </div>

          {/* Rating */}
          <div className="p-4 bg-bg-soft-blue rounded-xl border border-border-default">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">Rating</p>
            <StarRating rating={review.rating} />
          </div>

          {/* Comment */}
          <div className="p-4 bg-bg-soft-blue rounded-xl border border-border-default">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">Komentar</p>
            <p className="text-sm text-text-body leading-relaxed">{review.comment}</p>
          </div>

          {/* Meta */}
          <div className="flex gap-4 text-xs text-text-muted">
            <span>Tanggal: <span className="font-medium text-text-body">{new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span></span>
            <span>Status: <span className={`font-bold ${review.isHidden ? "text-error" : "text-success"}`}>{review.isHidden ? "Nonaktif" : "Aktif"}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────────

function DeleteModal({
  review,
  onClose,
  onSuccess,
}: {
  review: AdminReview;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminDeleteReview(review.reviewId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus review.");
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
          <h3 className="font-serif text-xl text-text-heading">Hapus Review?</h3>
          <p className="text-sm text-text-body">
            Apakah kamu yakin ingin menghapus review dari{" "}
            <span className="font-bold text-text-heading">&quot;{review.reviewerUser.fullName}&quot;</span>?
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

// ─── Main Component ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';

function getItineraryImage(url?: string | null) {
  if (!url) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60";
  if (url.startsWith("http")) return url;
  return `${STORAGE_URL}/${url}`;
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [metadata, setMetadata] = useState<AdminReviewsMetadata | null>(null);
  const [summary, setSummary] = useState<AdminReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "">("");
  const [sortParam, setSortParam] = useState("createdAtDesc");

  const [detailReview, setDetailReview] = useState<AdminReview | null>(null);
  const [deleteReview, setDeleteReview] = useState<AdminReview | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: ITEMS_PER_PAGE, sortBy: sortParam };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;

      const res = await getAdminReviews(params);
      if (res.success) {
        setReviews(res.data.items);
        setMetadata(res.data.metadata);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setIsLoading(false);
    }

    getAdminReviewSummary()
      .then((res) => { if (res.success) setSummary(res.data); })
      .catch(console.error);
  }, [page, search, filterStatus, sortParam]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (search !== trimmed) { setSearch(trimmed); setPage(1); }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
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
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-bg-surface border-b border-border-default shadow-sm h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl text-text-heading leading-tight">Review Management</h1>
            <p className="text-sm text-text-muted">Kelola dan moderasi ulasan pengguna</p>
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
            <img src="https://i.pravatar.cc/80?img=12" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          <StatCard
            label="Total Review"
            value={summary?.totalReviews ?? 0}
            icon={
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Total Review Aktif"
            value={summary?.totalActiveReviews ?? 0}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24">
                <path d="M21.801 10C22.2577 12.2413 21.9322 14.5714 20.8789 16.6018C19.8255 18.6322 18.1079 20.2401 16.0125 21.1573C13.9171 22.0746 11.5706 22.2458 9.3643 21.6424C7.15797 21.039 5.22519 19.6974 3.88828 17.8414C2.55136 15.9854 1.89112 13.7272 2.01766 11.4434C2.14421 9.15953 3.04988 6.98809 4.58365 5.29117C6.11742 3.59425 8.18658 2.47443 10.4461 2.11845C12.7056 1.76248 15.0188 2.19186 17 3.335M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Total Review Nonaktif"
            value={summary?.totalInactiveReviews ?? 0}
            icon={
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Rata-rata Rating"
            value={
              <span>
                {summary ? summary.averageRating.toFixed(1) : "0.0"}
                <span className="text-lg font-semibold text-text-muted">/5</span>
              </span>
            }
            icon={<StarFilled className="w-6 h-6 text-amber-400" />}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
            <SearchIcon />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari itinerary atau reviewer..."
              className="w-full bg-bg-soft-blue border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </form>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as "active" | "inactive" | ""); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
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
              <option value="ratingDesc">Rating Tertinggi</option>
              <option value="ratingAsc">Rating Terendah</option>
              <option value="titleAsc">Judul (A-Z)</option>
              <option value="titleDesc">Judul (Z-A)</option>
            </select>
            <ChevronDownIcon />
          </div>
        </div>

        {/* Table */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-bg-soft-blue border-b border-border-default px-6 py-5">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
              <div className="col-span-3">Nama Itinerary</div>
              <div className="col-span-2">Reviewer</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">Komentar</div>
              <div className="col-span-1">Tanggal</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Aksi</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border-default">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                <p className="text-sm font-medium">Tidak ada review ditemukan</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.reviewId} className="px-6 py-4 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Itinerary Name */}
                    <div className="col-span-3 flex items-center gap-3">
                      <img
                        src={getItineraryImage(review.itinerary.bannerImageUrl)}
                        alt={review.itinerary.title}
                        className="w-12 h-10 rounded-lg object-cover bg-border-default flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60"; }}
                      />
                      <span className="font-semibold text-text-heading text-sm line-clamp-2">{review.itinerary.title}</span>
                    </div>

                    {/* Reviewer */}
                    <div className="col-span-2 text-sm text-text-body font-medium">
                      {review.reviewerUser.fullName}
                    </div>

                    {/* Rating */}
                    <div className="col-span-2">
                      <StarRating rating={review.rating} />
                    </div>

                    {/* Comment */}
                    <div className="col-span-2 text-sm text-text-body line-clamp-2">
                      {review.comment}
                    </div>

                    {/* Date */}
                    <div className="col-span-1 text-xs text-text-muted font-medium whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      {!review.isHidden ? (
                        <span className="inline-block bg-success/10 text-success text-[11px] font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Aktif</span>
                      ) : (
                        <span className="inline-block bg-border-default/50 text-text-muted text-[11px] font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Nonaktif</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end gap-2">
                      <button onClick={() => setDetailReview(review)} className="p-2 rounded hover:bg-brand-primary/10 text-brand-primary transition-colors">
                        <EyeIcon />
                      </button>
                      <button onClick={() => setDeleteReview(review)} className="p-2 rounded hover:bg-error/10 text-error transition-colors">
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
                Menampilkan {reviews.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}-
                {Math.min(page * ITEMS_PER_PAGE, metadata?.totalItems ?? 0)} dari {metadata?.totalItems ?? 0} review
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12"><path d="M7.4 1.4L6 0L0 6L6 12L7.4 10.6L2.8 6L7.4 1.4Z"/></svg>
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition ${
                      page === pageNum
                        ? "bg-brand-primary text-white"
                        : "text-text-heading hover:bg-bg-hover"
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
                  <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12"><path d="M0.6 10.6L2 12L8 6L2 0L0.6 1.4L5.2 6L0.6 10.6Z"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {detailReview && (
        <ReviewDetailModal
          review={detailReview}
          onClose={() => setDetailReview(null)}
        />
      )}

      {deleteReview && (
        <DeleteModal
          review={deleteReview}
          onClose={() => setDeleteReview(null)}
          onSuccess={fetchReviews}
        />
      )}
    </>
  );
}
