"use client";

import React, { useState, useEffect } from "react";
import { Bell, Settings } from "lucide-react";
import {
  getAdminDashboard,
  type DashboardData,
  type UserGrowthItem,
  type PopularDestination,
  type RecentUser,
  type RecentItinerary,
  type RecentReview,
} from "@/services/dashboard";

// ─── Icons ───────────────────────────────────────────────────────────────────

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-[22px] h-[22px] text-white"} fill="none" viewBox="0 0 22 22">
    <path d="M15.5833 19.25V17.4167C15.5833 16.4442 15.197 15.5116 14.5094 14.8239C13.8218 14.1363 12.8891 13.75 11.9167 13.75H4.58333C3.61087 13.75 2.67824 14.1363 1.99062 14.8239C1.30298 15.5116 0.916664 16.4442 0.916664 17.4167V19.25" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.25 10.0833C10.2751 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39163 10.2751 2.75 8.25 2.75C6.22496 2.75 4.58333 4.39163 4.58333 6.41667C4.58333 8.44171 6.22496 10.0833 8.25 10.0833Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.0833 19.25V17.4167C21.0827 16.6005 20.8175 15.8072 20.3284 15.1577C19.8393 14.5083 19.1533 14.0385 18.3742 13.8183" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.6667 2.81836C15.4478 3.03741 16.136 3.50737 16.6265 4.15788C17.1171 4.80839 17.3829 5.60338 17.3829 6.42127C17.3829 7.23916 17.1171 8.03415 16.6265 8.68466C16.136 9.33517 15.4478 9.80513 14.6667 10.0242" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <Bell className="w-5 h-5 text-text-body" />
);

const SettingsIcon = () => (
  <Settings className="w-5 h-5 text-text-body" />
);

const StarFilled = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 18 18">
    <path d="M9 1.5C6.51472 1.5 4.5 3.51472 4.5 6C4.5 9.75 9 16.5 9 16.5C9 16.5 13.5 9.75 13.5 6C13.5 3.51472 11.4853 1.5 9 1.5ZM9 8.25C7.75736 8.25 6.75 7.24264 6.75 6C6.75 4.75736 7.75736 3.75 9 3.75C10.2426 3.75 11.25 4.75736 11.25 6C11.25 7.24264 10.2426 8.25 9 8.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev";

function resolveUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STORAGE_URL}/${url}`;
}

function Avatar({ name, photoUrl, size = "md" }: { name: string; photoUrl?: string | null; size?: "sm" | "md" | "lg" }) {
  const [error, setError] = useState(false);
  const sizeClass = size === "sm" ? "w-8 h-8 text-[11px]" : size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-xs";
  const url = resolveUrl(photoUrl);
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  if (url && !error) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-border-default flex-shrink-0`}
        onError={() => setError(true)}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-border-default`}>
      {initials}
    </div>
  );
}

function ItineraryThumbnail({ url, title }: { url?: string | null; title: string }) {
  const [error, setError] = useState(false);
  const resolved = resolveUrl(url);

  if (resolved && !error) {
    return (
      <img
        src={resolved}
        alt={title}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        onError={() => setError(true)}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
      <MapPinIcon />
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <StarFilled
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-amber-400" : "text-border-default"}`}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-text-muted">{rating > 0 ? rating.toFixed(1) : "-"}</span>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: UserGrowthItem[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end gap-3 h-48 px-2">
      {data.map((item, idx) => {
        const heightPct = (item.count / maxCount) * 100;
        const isMax = item.count === maxCount;
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex flex-col justify-end" style={{ height: "160px" }}>
              <div
                className={`w-full rounded-t-lg transition-all duration-700 ease-out ${isMax ? "bg-brand-primary" : "bg-brand-primary/25"} group-hover:bg-brand-primary`}
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                title={`${item.month} ${item.year}: ${item.count}`}
              />
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-text-heading text-white text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-10">
                {item.count}
              </div>
            </div>
            <span className="text-[11px] text-text-muted font-medium">{item.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
      <div className="mb-4">{icon}</div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="font-serif text-2xl text-text-heading">{value}</p>
    </div>
  );
}

// ─── Popular Destinations Bar ─────────────────────────────────────────────────

function PopularBar({ item, maxPct }: { item: PopularDestination; maxPct: number }) {
  const width = maxPct > 0 ? (item.percentage / maxPct) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border-default last:border-0">
      <div className="w-28 text-sm font-semibold text-text-heading truncate">{item.locationName}</div>
      <div className="flex-1 bg-brand-primary/10 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-700"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="text-xs font-bold text-text-muted w-8 text-right">{item.percentage}%</div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="text-brand-primary">{icon}</div>
      <h2 className="font-serif text-lg font-bold text-text-heading">{title}</h2>
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-5 bg-border-default/40 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setError("Gagal memuat data dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary;
  const userGrowth = data?.userGrowth ?? [];
  const popularDests = data?.popularDestinations ?? [];
  const recentUsers = data?.recentUsers ?? [];
  const recentItins = data?.recentPublishedItineraries ?? [];
  const recentReviews = data?.recentReviews ?? [];

  const maxPct = Math.max(...popularDests.map(d => d.percentage), 1);

  return (
    <>
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-bg-surface border-b border-border-default shadow-sm h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor" opacity=".8"/>
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl text-text-heading leading-tight">Dashboard</h1>
            <p className="text-sm text-text-muted">Ringkasan data sistem</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="p-2 rounded-full hover:bg-bg-hover relative">
            <BellIcon />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-bg-hover">
            <SettingsIcon />
          </button>
          <div className="w-10 h-10 rounded-full bg-border-default overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin&background=F3F3FE&color=5855E9" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-sm text-error font-medium">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-5">
          <StatCard
            label="Total User"
            value={(summary?.totalUsers ?? 0).toLocaleString("id-ID")}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 22 22">
                <path d="M15.5833 19.25V17.4167C15.5833 15.3916 13.9418 13.75 11.9167 13.75H4.58333C2.55829 13.75 0.916672 15.3916 0.916672 17.4167V19.25" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.25 10.0833C10.2751 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39163 10.2751 2.75 8.25 2.75C6.22496 2.75 4.58333 4.39163 4.58333 6.41667C4.58333 8.44171 6.22496 10.0833 8.25 10.0833Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.0833 19.25V17.4167C21.0827 16.6005 20.8175 15.8072 20.3284 15.1577C19.8393 14.5083 19.1533 14.0385 18.3742 13.8183" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.6667 2.81836C15.4478 3.03741 16.136 3.50737 16.6265 4.15788C17.1171 4.80839 17.3829 5.60338 17.3829 6.42127C17.3829 7.23916 17.1171 8.03415 16.6265 8.68466C16.136 9.33517 15.4478 9.80513 14.6667 10.0242" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Total Tempat"
            value={(summary?.totalPlaces ?? 0).toLocaleString("id-ID")}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 22 22">
                <path d="M4.125 9.16667C4.125 5.25063 7.29063 2.08333 11.2083 2.08333C15.1261 2.08333 18.2917 5.25063 18.2917 9.16667C18.2917 13.3333 11.2083 20.625 11.2083 20.625C11.2083 20.625 4.125 13.3333 4.125 9.16667Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.2083 11.4583C12.4709 11.4583 13.4896 10.4397 13.4896 9.17708C13.4896 7.91445 12.4709 6.89583 11.2083 6.89583C9.94567 6.89583 8.92708 7.91445 8.92708 9.17708C8.92708 10.4397 9.94567 11.4583 11.2083 11.4583Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Total Lokasi"
            value={(summary?.totalLocations ?? 0).toLocaleString("id-ID")}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 22 22">
                <path d="M3.66667 3.66667H18.3333V14.6667H3.66667V3.66667Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.33333 18.3333H14.6667M11 14.6667V18.3333" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Total Itinerary Published"
            value={(summary?.totalPublishedItineraries ?? 0).toLocaleString("id-ID")}
            icon={
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 22 22">
                <path d="M11 1.83333L13.7775 7.46083L20 8.38083L15.5 12.7667L16.555 19L11 16.0783L5.445 19L6.5 12.7667L2 8.38083L8.2225 7.46083L11 1.83333Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-5">
          {/* User Growth Bar Chart */}
          <div className="col-span-2 bg-bg-surface rounded-xl border border-border-default shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-lg font-bold text-text-heading">Pertumbuhan Pengguna Bulanan</h2>
                <p className="text-xs text-text-muted mt-0.5">Jumlah user baru per bulan</p>
              </div>
              <span className="text-xs font-bold text-text-muted px-3 py-1.5 rounded-lg bg-bg-soft-blue border border-border-default">
                {userGrowth.length > 0 ? `${userGrowth[0]?.year}` : ""}
              </span>
            </div>
            {loading ? (
              <div className="h-48 flex items-end gap-3 px-2 animate-pulse">
                {[60, 40, 75, 55, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-border-default/40 rounded-t-lg" style={{ height: `${h}%` }} />
                ))}
              </div>
            ) : (
              <BarChart data={userGrowth} />
            )}
          </div>

          {/* Popular Destinations */}
          <div className="bg-bg-surface rounded-xl border border-border-default shadow-sm p-6">
            <div className="mb-5">
              <h2 className="font-serif text-lg font-bold text-text-heading">Destinasi Populer</h2>
              <p className="text-xs text-text-muted mt-0.5">Berdasarkan jumlah itinerary</p>
            </div>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 h-4 bg-border-default/40 rounded" />
                    <div className="flex-1 h-2 bg-border-default/40 rounded-full" />
                    <div className="w-8 h-4 bg-border-default/40 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {popularDests.slice(0, 5).map(dest => (
                  <PopularBar key={dest.locationId} item={dest} maxPct={maxPct} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border-default">
            <SectionHeader
              title="5 User Terbaru"
              icon={
                <UserGroupIcon className="w-5 h-5 text-brand-primary" />
              }
            />
          </div>
          {/* Header Row */}
          <div className="bg-bg-soft-blue px-6 py-4 border-b border-border-default grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
            <div className="col-span-4">Pengguna</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Bergabung</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y divide-border-default">
            {loading ? (
              <div className="px-6 py-4">
                <TableSkeleton rows={5} cols={4} />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-text-muted">Tidak ada data user.</div>
            ) : (
              recentUsers.map(user => (
                <div key={user.userId} className="px-6 py-4 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 flex items-center gap-3">
                      <Avatar name={user.fullName} photoUrl={user.profilePhotoUrl} size="sm" />
                      <span className="font-semibold text-text-heading text-sm truncate">{user.fullName}</span>
                    </div>
                    <div className="col-span-4 text-sm text-text-body truncate">{user.email}</div>
                    <div className="col-span-2 text-sm text-text-body">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="col-span-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${
                        !user.accountStatus || user.accountStatus === "ACTIVE"
                          ? "bg-success/10 text-success"
                          : "bg-border-default/60 text-text-muted"
                      }`}>
                        {!user.accountStatus || user.accountStatus === "ACTIVE" ? "AKTIF" : "NONAKTIF"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Published Itineraries */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border-default">
            <SectionHeader
              title="5 Itinerary Published Terbaru"
              icon={
                <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 22 22">
                  <path d="M11 1.83333L13.7775 7.46083L20 8.38083L15.5 12.7667L16.555 19L11 16.0783L5.445 19L6.5 12.7667L2 8.38083L8.2225 7.46083L11 1.83333Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>
          {/* Header Row */}
          <div className="bg-bg-soft-blue px-6 py-4 border-b border-border-default grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
            <div className="col-span-5">Judul</div>
            <div className="col-span-3">Pembuat</div>
            <div className="col-span-2">Lokasi</div>
            <div className="col-span-2 text-right">Rating</div>
          </div>
          <div className="divide-y divide-border-default">
            {loading ? (
              <div className="px-6 py-4">
                <TableSkeleton rows={5} cols={4} />
              </div>
            ) : recentItins.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-text-muted">Tidak ada itinerary terbaru.</div>
            ) : (
              recentItins.map(itin => (
                <div key={itin.itineraryId} className="px-6 py-4 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 flex items-center gap-3">
                      <ItineraryThumbnail url={itin.bannerImageUrl} title={itin.title} />
                      <div className="min-w-0">
                        <p className="font-semibold text-text-heading text-sm truncate">{itin.title}</p>
                        <p className="text-[11px] text-text-muted">
                          {new Date(itin.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-text-body truncate">{itin.userFullName}</div>
                    <div className="col-span-2 flex items-center gap-1 text-sm text-text-body">
                      <MapPinIcon />
                      <span className="truncate">{itin.locationName}</span>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <StarRating rating={itin.ratingValue} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border-default">
            <SectionHeader
              title="5 Review Terbaru"
              icon={
                <StarFilled className="w-5 h-5 text-amber-400" />
              }
            />
          </div>
          {/* Header Row */}
          <div className="bg-bg-soft-blue px-6 py-4 border-b border-border-default grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
            <div className="col-span-3">Itinerary</div>
            <div className="col-span-3">Reviewer</div>
            <div className="col-span-2">Rating</div>
            <div className="col-span-3">Komentar</div>
            <div className="col-span-1 text-right">Tanggal</div>
          </div>
          <div className="divide-y divide-border-default">
            {loading ? (
              <div className="px-6 py-4">
                <TableSkeleton rows={5} cols={5} />
              </div>
            ) : recentReviews.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-text-muted">Tidak ada review terbaru.</div>
            ) : (
              recentReviews.map(review => (
                <div key={review.reviewId} className="px-6 py-4 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <p className="font-semibold text-text-heading text-sm truncate">{review.itineraryTitle}</p>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Avatar name={review.reviewerFullName} photoUrl={review.reviewerPhotoUrl} size="sm" />
                      <span className="text-sm text-text-body truncate">{review.reviewerFullName}</span>
                    </div>
                    <div className="col-span-2">
                      <StarRating rating={review.rating} />
                    </div>
                    <div className="col-span-3 text-sm text-text-muted line-clamp-1">{review.comment}</div>
                    <div className="col-span-1 text-xs text-text-muted text-right whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
