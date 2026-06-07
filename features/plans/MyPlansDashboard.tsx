"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ListFilter, ArrowUpDown, Plus, Calendar, Star, Bookmark, Loader2 } from "lucide-react";
import { getMyItineraries } from "@/services/plans";
import { getMyProfile } from "@/services/auth";

const formatTripRange = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return "Tanggal tidak ditentukan";
  const startObj = new Date(startStr);
  const endObj = new Date(endStr);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${startObj.toLocaleDateString('id-ID', options)} - ${endObj.toLocaleDateString('id-ID', { ...options, year: 'numeric' })}`;
};

export default function MyPlansDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setIsLoading(true);
        setError(null);
        
        const [response, profileRes] = await Promise.all([
          getMyItineraries(),
          getMyProfile().catch(() => null)
        ]);

        const list = Array.isArray(response) ? response : (response.data?.items || response.data || []);
        
        const userProfileUrl = profileRes?.data?.profilePhotoUrl;
        const defaultUserAvatar = userProfileUrl 
          ? (userProfileUrl.startsWith('http') ? userProfileUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${userProfileUrl}`) 
          : "https://ui-avatars.com/api/?name=User&background=F3F3FE&color=5855E9";

        const loadedPlans = list.map((item: any) => {
          const bannerUrl = item.bannerPhotoUrl || item.bannerImageUrl || item.bannerImage;
          const finalBannerImage = bannerUrl ? (bannerUrl.startsWith('http') ? bannerUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${bannerUrl}`) : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&auto=format&fit=crop&q=60";

          const rawAvatarUrl = item.account?.profilePhotoUrl || item.author?.profilePhotoUrl || item.author?.avatarUrl;
          const finalAvatar = rawAvatarUrl 
            ? (rawAvatarUrl.startsWith('http') ? rawAvatarUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${rawAvatarUrl}`) 
            : defaultUserAvatar;

          return {
            id: item.itineraryId || item.id,
            title: item.title || "Untitled Plan",
            location: item.location?.name ? `${item.location.name}, Indonesia` : (item.location?.locationName ? `${item.location.locationName}, Indonesia` : "Lokasi tidak ditentukan"),
            date: formatTripRange(item.startDate, item.endDate),
            type: item.visibilityStatus === "PUBLISHED" || item.visibilityStatus === "PUBLIC" || item.isPublic ? "Published" : "Private",
            rating: item.rating || null,
            reviews: item.reviewCount || null,
            saved: item.savedCount ? `${item.savedCount} saved` : null,
            img: finalBannerImage,
            avatar: finalAvatar
          };
        });

        setPlans(loadedPlans);
      } catch (err: any) {
        setError(err.message || "Gagal memuat daftar rencana perjalanan.");
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const filteredPlans = plans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plan.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-12">
      <div className="mb-6">
        <h1 className="text-[32px] md:text-[36px] font-serif font-bold text-text-heading">
          My Plans
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        <div className="relative w-full md:w-auto md:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search plans..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-border-default rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default rounded-lg text-[14px] font-medium text-text-body hover:bg-bg-hover transition-colors">
            <ListFilter size={18} /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default rounded-lg text-[14px] font-medium text-text-body hover:bg-bg-hover transition-colors">
            <ArrowUpDown size={18} /> Sort
          </button>

          <Link href="/my-plans/create" className="hidden md:flex flex-1 md:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-brand-primary text-text-light rounded-lg text-[14px] font-bold hover:bg-brand-primary-hover transition-colors shadow-sm">
            <Plus size={18} /> Tambah Plans
          </Link>
        </div>

        <Link href="/my-plans/create" className="md:hidden w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-primary text-text-light rounded-lg text-[14px] font-bold hover:bg-brand-primary-hover transition-colors shadow-sm">
          <Plus size={18} /> Tambah Plans
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-muted">
            <Loader2 size={32} className="animate-spin mb-4 text-brand-primary" />
            <p className="font-medium text-[15px]">Memuat rencana perjalanan Anda...</p>
          </div>
        ) : error ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-error">
            <p className="font-medium text-[15px]">{error}</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-muted bg-bg-surface border border-dashed border-border-default rounded-xl">
            <Calendar size={48} className="mb-4 text-border-strong" />
            <p className="font-medium text-[16px] text-text-heading mb-2">Belum ada rencana</p>
            <p className="text-[14px] mb-6 text-center max-w-sm">Mulai petualangan Anda dengan membuat rencana perjalanan pertama.</p>
            <Link href="/my-plans/create" className="px-6 py-2.5 bg-brand-primary text-text-light rounded-lg text-[14px] font-bold hover:bg-brand-primary-hover transition-colors">
              Buat Sekarang
            </Link>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">

            <div className="relative h-48 w-full">
              <img src={plan.img} alt={plan.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-brand-primary text-white text-[11px] font-bold px-3 py-1 rounded-sm shadow-sm">
                {plan.type}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-[16px] text-text-heading mb-1">{plan.title}</h3>
              <p className="text-[13px] text-text-muted mb-4">{plan.location}</p>
              
              <div className="flex items-center gap-2 text-[12px] text-text-body font-medium mb-4">
                <Calendar size={14} className="text-text-muted" />
                {plan.date}
              </div>

              {plan.type === "Published" && plan.rating && (
                <div className="flex items-center gap-4 text-[12px] font-medium text-text-muted mb-4 pt-4 border-t border-border-default/50">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-brand-warm text-brand-warm" />
                    <span className="text-text-heading font-bold">{plan.rating}</span>
                    <span>({plan.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark size={14} />
                    <span>{plan.saved} saved</span>
                  </div>
                </div>
              )}

              <div className="flex-grow"></div>

              <div className={`flex items-center justify-between pt-4 ${plan.type === "Private" ? "border-t border-border-default/50" : ""}`}>
                <img src={plan.avatar} alt="User Avatar" className="w-7 h-7 rounded-full object-cover border border-border-default" />
                <Link href={`/my-plans/${plan.id}`} className="text-[13px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors">
                  View Details
                </Link>
              </div>

            </div>
          </div>
        )))}
      </div>
    </div>
  );
}