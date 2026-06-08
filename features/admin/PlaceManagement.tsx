"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Settings } from "lucide-react";
import {
  getAdminPlaces,
  getPlacesSummary,
  deletePlace,
  getPlaceCategories,
  createPlace,
  updatePlace,
  getAdminPlaceById,
  type AdminPlace,
  type AdminPlacesMetadata,
  type PlaceCategory,
} from "@/services/places";
import { getLocationOptions, type LocationOption } from "@/services/locations";

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" fill="none" viewBox="0 0 18 18">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25ZM15.75 15.75L12.525 12.525" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M7.5 15L9.41475 16.4213L10.5 15.75V10.5L16.305 3.5025L15.75 2.25H2.25L1.6935 3.5025L7.11225 9.49425L7.5 10.5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SortIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M15.75 12L12.75 15L9.75 12M12.75 15V3M2.25 6L5.25 3L8.25 6M5.25 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M1.5465 8.739C1.48399 8.90739 1.48399 9.09261 1.5465 9.261C2.15528 10.7371 3.18864 11.9992 4.51558 12.8873C5.84252 13.7754 7.40328 14.2495 9 14.2495C10.5967 14.2495 12.1575 13.7754 13.4844 12.8873C14.8114 11.9992 15.8447 10.7371 16.4535 9.261C16.516 9.09261 16.516 8.90739 16.4535 8.739C15.8447 7.26289 14.8114 6.00078 13.4844 5.11267C12.1575 4.22457 10.5967 3.75046 9 3.75046C7.40328 3.75046 5.84252 4.22457 4.51558 5.11267C3.18864 6.00078 2.15528 7.26289 1.5465 8.739ZM9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18">
    <path d="M15.8805 5.109L12.891 2.11875L2.8815 12.1305L1.51575 16.017L5.24775 15.4935L15.8805 5.109Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-10 h-10 text-text-heading mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

// ─── Stat Card ──────────────────────────────────────────────────────────────────

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

// ─── Skeletons ──────────────────────────────────────────────────────────────────

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
          <div className="h-4 bg-bg-soft-blue rounded w-8"></div>
        </div>
        <div className="col-span-2 flex justify-end gap-2">
          <div className="w-8 h-8 bg-bg-soft-blue rounded"></div>
          <div className="w-8 h-8 bg-bg-soft-blue rounded"></div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Form ─────────────────────────────────────────────────────────────────

interface ModalState {
  open: boolean;
  mode?: "create" | "edit" | "view" | "delete";
  place?: AdminPlace | null;
}

interface ModalFormProps {
  mode: "create" | "edit" | "view";
  place?: AdminPlace | null;
  locations: LocationOption[];
  categories: PlaceCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

function PlaceFormModal({ mode, place, locations, categories, onClose, onSuccess }: ModalFormProps) {
  const [form, setForm] = useState({
    placeName: place?.placeName ?? "",
    locationId: place?.locationId ?? "",
    categories: place?.categories?.map(c => c.categoryId) ?? [],
    shortDescription: place?.shortDescription ?? "",
    address: place?.address ?? "",
    priceMin: place?.priceMin ?? "",
    priceMax: place?.priceMax ?? "",
    priceDescription: place?.priceDescription ?? "",
    websiteUrl: place?.websiteUrl ?? "",
    contactPhoneNumber: place?.contactPhoneNumber ?? "",
    ratingValue: place?.ratingValue ?? "",
    ratingCount: place?.ratingCount ?? "",
    isActive: place?.isActive ?? true,
    operatingHours: place?.operatingHours?.length ? place.operatingHours : [
      { dayOfWeek: "MONDAY", openTime: "", closeTime: "" },
      { dayOfWeek: "TUESDAY", openTime: "", closeTime: "" },
      { dayOfWeek: "WEDNESDAY", openTime: "", closeTime: "" },
      { dayOfWeek: "THURSDAY", openTime: "", closeTime: "" },
      { dayOfWeek: "FRIDAY", openTime: "", closeTime: "" },
      { dayOfWeek: "SATURDAY", openTime: "", closeTime: "" },
      { dayOfWeek: "SUNDAY", openTime: "", closeTime: "" },
    ],
    images: place?.images ?? [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const toggleCategory = (categoryId: string) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(categoryId)
        ? f.categories.filter(c => c !== categoryId)
        : [...f.categories, categoryId]
    }));
  };

  const handleOpHourChange = (index: number, field: string, value: string | number) => {
    const newHours = [...form.operatingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setForm(f => ({ ...f, operatingHours: newHours }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Ukuran file maksimal 10MB");
        return;
      }
      setUploadError(null);
      setIsUploadingImage(true);

      try {
        const { getPresignedUrl, uploadFileToS3 } = await import('@/services/media');
        const presigned = await getPresignedUrl(file.type, file.size, "place");
        const uploadData = (presigned as any).data || presigned;
        const uploadUrl = uploadData.uploadUrl || uploadData.presignedUrl || uploadData.url;
        const fileKey = uploadData.tempKey || uploadData.fileKey || uploadData.key || uploadData.path;

        if (!uploadUrl) throw new Error("URL upload tidak ditemukan");

        await uploadFileToS3(uploadUrl, file);
        setForm((f) => ({ ...f, images: [...f.images, fileKey] }));
      } catch (err: any) {
        console.error("Gagal upload gambar:", err);
        setUploadError("Gagal mengunggah gambar ke server.");
      } finally {
        setIsUploadingImage(false);
      }
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) return;
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        ...form,
        priceMin: form.priceMin === "" ? undefined : Number(form.priceMin),
        priceMax: form.priceMax === "" ? undefined : Number(form.priceMax),
        ratingValue: form.ratingValue === "" ? undefined : Number(form.ratingValue),
        ratingCount: form.ratingCount === "" ? undefined : Number(form.ratingCount),
        shortDescription: form.shortDescription || undefined,
        priceDescription: form.priceDescription || undefined,
        websiteUrl: form.websiteUrl || undefined,
        contactPhoneNumber: form.contactPhoneNumber || undefined,
        // Filter out empty operating hours if necessary
        operatingHours: form.operatingHours.filter(oh => oh.openTime && oh.closeTime),
        // Map images to object format required by backend
        images: form.images.map((img: any, idx: number) => ({
          imageUrl: typeof img === 'string' ? img : img.imageUrl,
          displayOrder: idx + 1
        }))
      };

      if (mode === "create") {
        await createPlace(payload);
      } else if (mode === "edit" && place) {
        await updatePlace(place.placeId, payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    create: "Tambah Tempat",
    edit: "Edit Tempat",
  };

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  
  const getDayValue = (dayName: string): any => {
    switch (dayName) {
      case "Senin": return "MONDAY";
      case "Selasa": return "TUESDAY";
      case "Rabu": return "WEDNESDAY";
      case "Kamis": return "THURSDAY";
      case "Jumat": return "FRIDAY";
      case "Sabtu": return "SATURDAY";
      case "Minggu": return "SUNDAY";
      default: return "MONDAY";
    }
  };

  const getDayRow = (dayName: string) => {
    const dayVal = getDayValue(dayName);
    const existing = form.operatingHours.find(oh => oh.dayOfWeek === dayVal);
    return existing || { dayOfWeek: dayVal, openTime: "", closeTime: "" };
  };

  const setDayRow = (dayName: string, field: string, value: string) => {
    const dayVal = getDayValue(dayName);
    const existingIdx = form.operatingHours.findIndex(oh => oh.dayOfWeek === dayVal);
    if (existingIdx >= 0) {
      handleOpHourChange(existingIdx, field, value);
    } else {
      setForm(f => ({
        ...f,
        operatingHours: [...f.operatingHours, { dayOfWeek: dayVal, openTime: field === "openTime" ? value : "", closeTime: field === "closeTime" ? value : "" }]
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-[1000px] max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-default flex-shrink-0">
          <h2 className="font-serif text-[28px] font-bold text-text-heading">{titleMap[mode as "create"|"edit"]}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-bg-hover text-text-muted transition-colors"><XIcon /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-8">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
              {error}
            </div>
          )}
          
          <form id="place-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Nama Tempat <span className="text-error">*</span></label>
                <input type="text" required value={form.placeName} onChange={e => setForm(f => ({ ...f, placeName: e.target.value }))} placeholder="Masukkan nama lengkap tempat" className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Kategori <span className="text-error">*</span></label>
                <div className="relative mb-2">
                  <select 
                    value="" 
                    onChange={e => {
                      const val = e.target.value;
                      if (val && !form.categories.includes(val)) {
                        setForm(f => ({ ...f, categories: [...f.categories, val] }));
                      }
                    }} 
                    className="w-full border border-border-default rounded-xl px-4 py-3.5 pr-10 text-sm text-text-muted focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface appearance-none"
                  >
                    <option value="" disabled>Pilih kategori tempat</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId} disabled={form.categories.includes(cat.categoryId)}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.categories.map((id) => {
                    const catName = categories.find((c) => c.categoryId === id)?.categoryName || id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                        {catName}
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, categories: f.categories.filter((cid) => cid !== id) }))}
                          className="hover:text-brand-primary-hover focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Deskripsi Singkat <span className="text-error">*</span></label>
                <textarea required value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Berikan deskripsi yang menarik" rows={4} className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface resize-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Lokasi <span className="text-error">*</span></label>
                <div className="relative">
                  <select required value={form.locationId} onChange={e => setForm(f => ({ ...f, locationId: e.target.value }))} className="w-full border border-border-default rounded-xl px-4 py-3.5 pr-10 text-sm text-text-muted focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface appearance-none">
                    <option value="" disabled>Pilih lokasi</option>
                    {locations.map(loc => <option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>)}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Alamat Lengkap <span className="text-error">*</span></label>
                <textarea required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Jl. Raya, Kecamatan, Kota/Kabupaten..." rows={2} className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-heading mb-2">Rentang Harga (Min)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                    <input type="number" value={form.priceMin} onChange={e => setForm(f => ({ ...f, priceMin: e.target.value }))} placeholder="0" className="w-full border border-border-default rounded-xl pl-10 pr-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-heading mb-2">Rentang Harga (Max)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                    <input type="number" value={form.priceMax} onChange={e => setForm(f => ({ ...f, priceMax: e.target.value }))} placeholder="1.000.000" className="w-full border border-border-default rounded-xl pl-10 pr-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Deskripsi Harga</label>
                <input type="text" value={form.priceDescription} onChange={e => setForm(f => ({ ...f, priceDescription: e.target.value }))} placeholder="Contoh: Tiket Masuk" className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-heading mb-2">Rating Value</label>
                  <input type="number" step="0.1" value={form.ratingValue} onChange={e => setForm(f => ({ ...f, ratingValue: e.target.value }))} placeholder="Masukkan Rating Value" className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-heading mb-2">Rating Count</label>
                  <input type="number" value={form.ratingCount} onChange={e => setForm(f => ({ ...f, ratingCount: e.target.value }))} placeholder="Masukkan Rating Count" className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Nomor Telepon</label>
                <input type="text" value={form.contactPhoneNumber} onChange={e => setForm(f => ({ ...f, contactPhoneNumber: e.target.value }))} placeholder="Masukkan nomor telepon yang aktif" className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Website URL</label>
                <input type="url" value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://example.com" className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Link Google Maps</label>
                <input type="url" placeholder="https://maps.google.com/..." className="w-full border border-border-default rounded-xl px-4 py-3.5 text-sm text-text-heading focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface" />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-4">Jam Operasional</label>
                <div className="space-y-3">
                  {days.map((dayName) => {
                    const row = getDayRow(dayName);
                    return (
                      <div key={dayName} className="flex items-center gap-4">
                        <span className="w-16 text-sm font-bold text-text-heading">{dayName}</span>
                        <input type="time" value={row.openTime} onChange={(e) => setDayRow(dayName, "openTime", e.target.value)} className="w-28 border border-border-default bg-bg-soft-blue rounded-lg px-3 py-2 text-sm text-text-muted focus:ring-1 outline-none" />
                        <span className="text-text-muted">-</span>
                        <input type="time" value={row.closeTime} onChange={(e) => setDayRow(dayName, "closeTime", e.target.value)} className="w-28 border border-border-default bg-bg-soft-blue rounded-lg px-3 py-2 text-sm text-text-muted focus:ring-1 outline-none" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Upload Gambar (Opsional)</label>
                {uploadError && <p className="text-xs text-error mb-2">{uploadError}</p>}
                
                <div className="border-2 border-dashed border-brand-primary/30 bg-bg-soft-blue rounded-2xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-brand-primary/5 transition-colors cursor-pointer group mb-4">
                  <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  
                  {isUploadingImage ? (
                    <svg className="animate-spin h-10 w-10 text-brand-primary mb-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <UploadIcon />
                  )}
                  
                  <button type="button" className="bg-brand-primary text-white font-bold text-sm px-8 py-2.5 rounded-xl shadow-sm hover:bg-brand-primary-hover mb-3">Upload</button>
                  <p className="text-sm font-bold text-text-heading">Drop your images here, or click to browse</p>
                  <p className="text-xs text-text-muted mt-1">Images will be displayed in the order they are uploaded</p>
                </div>

                {form.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto py-2 border-2 border-dashed border-brand-primary/30 bg-bg-surface rounded-xl p-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border-default group flex-shrink-0">
                        <img src={getImageUrl(img)} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <XIcon />
                        </button>
                      </div>
                    ))}
                    <div className="w-16 h-16 border border-brand-primary/30 bg-bg-soft-blue rounded-xl flex items-center justify-center text-brand-primary hover:bg-brand-primary/10 transition flex-shrink-0 cursor-pointer relative">
                       <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                       <span className="text-xl">+</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-text-heading mb-2">Status <span className="text-error">*</span></label>
                <div className="relative">
                  <select required value={form.isActive ? "true" : "false"} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "true" }))} className="w-full border border-border-default rounded-xl px-4 py-3.5 pr-10 text-sm text-text-muted focus:ring-2 focus:ring-brand-primary/30 outline-none bg-bg-surface appearance-none">
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-border-default px-8 py-5 flex justify-between gap-3 bg-bg-surface flex-shrink-0 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={loading} className="w-1/2 py-3.5 rounded-xl text-sm font-bold text-text-heading bg-bg-surface border border-border-default hover:bg-bg-hover transition-colors">Batal</button>
          <button type="submit" form="place-form" disabled={loading} className="w-1/2 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover shadow-sm transition-colors flex items-center justify-center gap-2">
            {loading ? "Menyimpan..." : (mode === "create" ? "Tambah Tempat" : "Simpan Perubahan")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlaceViewModal({ place, onClose }: ModalFormProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!place) return null;

  const images = place.images?.length > 0 ? place.images : [];
  const imageSrc = images.length > 0 ? getImageUrl(images[currentImageIndex]) : FALLBACK_IMAGE;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Format Jam Operasional String
  const formatTime = (timeStr?: string) => timeStr ? timeStr.substring(0, 5) : "";
  const formatDays = (dayVal: string) => {
    const dayNameMapping: Record<string, string> = {
      MONDAY: "Senin", TUESDAY: "Selasa", WEDNESDAY: "Rabu", THURSDAY: "Kamis", FRIDAY: "Jumat", SATURDAY: "Sabtu", SUNDAY: "Minggu"
    };
    return dayNameMapping[dayVal] || dayVal;
  };

  // Grouper logic is simplified for now, we just list them or group weekday/weekend
  // We'll just display up to 2 distinct blocks if they match the picture
  const ohs = place.operatingHours || [];
  const renderOH = () => {
    if (ohs.length === 0) return <p className="text-sm text-text-muted">Tidak ada data jam operasional</p>;
    return ohs.map((oh, i) => (
      <div key={i} className="flex justify-between items-center text-sm py-1">
        <span className="text-text-muted">{formatDays(oh.dayOfWeek as string)}</span>
        <span className="text-brand-primary font-medium">{formatTime(oh.openTime)} - {formatTime(oh.closeTime)}</span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden">
        
        {/* Left Side: Image */}
        <div className="w-1/2 relative bg-black group">
          <img src={imageSrc} alt={place.placeName} className="w-full h-full object-cover transition-all duration-300" />
          
          {images.length > 1 && (
            <>
              {/* Arrows */}
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                  ></button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Info */}
        <div className="w-1/2 p-10 flex flex-col relative overflow-y-auto">
          <button type="button" onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-bg-hover text-text-heading bg-bg-surface shadow-sm border border-border-default z-10 transition-colors">
            <XIcon />
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-2 pr-12">
            <h2 className="font-serif text-[32px] font-bold text-text-heading leading-tight">{place.placeName}</h2>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {place.categories?.map((cat) => (
                <span key={cat.categoryId} className="bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                  {cat.categoryName}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <StarIcon />
            <span className="font-bold text-text-heading text-base">{place.ratingValue?.toFixed(1) || "N/A"}</span>
            <span>({place.ratingCount ? `${place.ratingCount.toLocaleString('id-ID')} Ulasan` : "Belum ada ulasan"})</span>
          </div>

          <div className="flex items-start gap-2 text-text-heading text-sm mb-8">
            <MapPinIcon />
            <span>{place.address || "Alamat belum tersedia"}</span>
          </div>

          {/* Estimasi Harga */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-text-heading mb-3 uppercase tracking-wide">Estimasi Harga ({place.priceDescription || "Tiket Masuk"})</h3>
            <div className="bg-bg-soft-blue border border-brand-primary/20 rounded-xl p-4 flex items-center gap-3">
              <TicketIcon />
              <span className="text-text-heading font-medium text-[15px]">
                {place.priceMin != null && place.priceMax != null 
                  ? (place.priceMin === place.priceMax 
                      ? (place.priceMin === 0 ? "Gratis" : `Rp ${place.priceMin.toLocaleString('id-ID')}`) 
                      : `Rp ${place.priceMin.toLocaleString('id-ID')} - ${place.priceMax.toLocaleString('id-ID')}`)
                  : (place.priceMin != null 
                      ? (place.priceMin === 0 ? "Gratis" : `Mulai Rp ${place.priceMin.toLocaleString('id-ID')}`) 
                      : "Harga tidak tersedia")}
              </span>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-text-heading mb-3 uppercase tracking-wide">Jam Operasional</h3>
            <div className="bg-bg-soft-blue border border-border-default rounded-xl p-4">
              {renderOH()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 mb-8">
            {place.websiteUrl && (
              <a href={place.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-bg-soft-blue flex items-center justify-center hover:bg-brand-primary/10 transition cursor-pointer">
                  <GlobeIcon />
                </div>
                <span className="text-xs text-text-muted font-medium">Website</span>
              </a>
            )}
            {place.contactPhoneNumber && (
              <a href={`tel:${place.contactPhoneNumber}`} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-bg-soft-blue flex items-center justify-center hover:bg-brand-primary/10 transition cursor-pointer">
                  <PhoneIcon />
                </div>
                <span className="text-xs text-text-muted font-medium">Call</span>
              </a>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <h3 className="text-xs font-bold text-text-heading mb-3 uppercase tracking-wide">Deskripsi</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {place.shortDescription || "Deskripsi belum tersedia."}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function PlaceModal(props: ModalFormProps) {
  if (props.mode === "view") {
    return <PlaceViewModal {...props} />;
  }
  return <PlaceFormModal {...props} />;
}

// ─── Main Component ─────────────────────────────────────────────────────────────

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=96&auto=format&fit=crop&q=60";
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';

const getImageUrl = (urlOrKey?: string | any | null) => {
  if (!urlOrKey) return FALLBACK_IMAGE;
  const url = typeof urlOrKey === 'string' ? urlOrKey : urlOrKey.imageUrl;
  if (!url || typeof url !== 'string') return FALLBACK_IMAGE;
  if (url.startsWith('http')) return url;
  return `${STORAGE_URL}/${url}`;
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────────

function DeleteModal({
  place,
  onClose,
  onSuccess,
}: {
  place: AdminPlace;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deletePlace(place.placeId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus tempat wisata.");
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
          <h3 className="font-serif text-xl text-text-heading">Hapus Tempat?</h3>
          <p className="text-sm text-text-body">
            Apakah kamu yakin ingin menghapus tempat wisata{" "}
            <span className="font-bold text-text-heading">&quot;{place.placeName}&quot;</span>?
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



export default function PlaceManagement() {
  const [places, setPlaces] = useState<AdminPlace[]>([]);
  const [metadata, setMetadata] = useState<AdminPlacesMetadata | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  const [modal, setModal] = useState<ModalState>({ open: false });
  
  // Filters
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortParam, setSortParam] = useState<string>("createdAtDesc");

  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  
  const ITEMS_PER_PAGE = 12; // Base on schema limit default

  // Fetch initial options
  useEffect(() => {
    getLocationOptions().then(res => {
      if (res.success) setLocations(res.data);
    }).catch(console.error);
    
    getPlaceCategories().then(res => {
      if (res.success) setCategories(res.data);
    }).catch(console.error);
  }, []);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        limit: ITEMS_PER_PAGE,
        sortBy: sortParam,
      };
      if (search) params.search = search;
      if (filterLocation) params.locationId = filterLocation;
      if (filterCategory) params.categories = [filterCategory]; // Categories is array in schema
      if (filterStatus === "active") params.status = "active";
      if (filterStatus === "inactive") params.status = "inactive";

      const res = await getAdminPlaces(params);
      if (res.success) {
        setPlaces(res.data.items);
        setMetadata(res.data.metadata);
      }
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setIsLoading(false);
    }

    getPlacesSummary()
      .then(res => {
        if (res.success) setSummary(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchPlaces();
  }, [page, search, filterLocation, filterCategory, filterStatus, sortParam]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedSearch = searchInput.trim();
      if (search !== trimmedSearch) {
        setSearch(trimmedSearch);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleDelete = (place: AdminPlace) => {
    setModal({ open: true, mode: "delete", place });
  };

  const handleOpenModal = async (mode: "view" | "edit", place: AdminPlace) => {
    try {
      const res = await getAdminPlaceById(place.placeId);
      if (res.success && res.data) {
        const freshPlace = { ...res.data, images: place.images };
        setModal({ open: true, mode, place: freshPlace });
      } else {
        setModal({ open: true, mode, place });
      }
    } catch (err) {
      console.error("Failed to fetch fresh detail:", err);
      setModal({ open: true, mode, place });
    }
  };

  // Stats
  const totalPlaces = summary?.totalPlaces ?? 0;
  const activePlaces = summary?.totalActivePlaces ?? 0;
  const inactivePlaces = summary?.totalInactivePlaces ?? 0;

  const totalPages = metadata?.totalPages ?? 1;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-bg-surface border-b border-border-default shadow-sm h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M14.106 5.553L19.553 3.723V17.383L15.894 20.554L9.894 18.448L4.447 20.278V6.618L8.106 3.447L14.106 5.553Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 5.764V20.764M9 3.236V18.236" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl text-text-heading leading-tight">Place Management</h1>
            <p className="text-sm text-text-muted">Kelola semua data tempat wisata</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
           {/* Notification & settings mock */}
           <button className="p-2 rounded-full hover:bg-bg-hover relative">
              <Bell className="w-5 h-5 text-text-body" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
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
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            label="Total Tempat"
            value={totalPlaces}
            icon={
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <path d="M14.106 5.553L19.553 3.723V17.383L15.894 20.554L9.894 18.448L4.447 20.278V6.618L8.106 3.447L14.106 5.553Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 5.764V20.764M9 3.236V18.236" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Tempat Aktif"
            value={activePlaces}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24">
                <path d="M21.801 10C22.2577 12.2413 21.9322 14.5714 20.8789 16.6018C19.8255 18.6322 18.1079 20.2401 16.0125 21.1573C13.9171 22.0746 11.5706 22.2458 9.3643 21.6424C7.15797 21.039 5.22519 19.6974 3.88828 17.8414C2.55136 15.9854 1.89112 13.7272 2.01766 11.4434C2.14421 9.15953 3.04988 6.98809 4.58365 5.29117C6.11742 3.59425 8.18658 2.47443 10.4461 2.11845C12.7056 1.76248 15.0188 2.19186 17 3.335M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Tempat Non-Aktif"
            value={inactivePlaces}
            icon={
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
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
              placeholder="Cari nama tempat..."
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
              {locations.map(loc => (
                <option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Non-Aktif</option>
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
              <option value="nameAsc">Nama (A-Z)</option>
              <option value="nameDesc">Nama (Z-A)</option>
              <option value="ratingDesc">Rating Tertinggi</option>
              <option value="ratingAsc">Rating Terendah</option>
            </select>
            <ChevronDownIcon />
          </div>

          <button
            onClick={() => setModal({ open: true, mode: "create" })}
            className="bg-brand-primary hover:bg-brand-primary-hover rounded-xl px-6 py-3 flex items-center gap-2 text-white font-bold shadow-sm transition"
          >
            <PlusIcon />
            <span className="text-sm">Tambah Tempat</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          <div className="bg-bg-soft-blue border-b border-border-default px-6 py-5">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
              <div className="col-span-3">Nama Tempat</div>
              <div className="col-span-2">Kategori</div>
              <div className="col-span-2">Lokasi</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Rating</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>
          </div>

          <div className="divide-y divide-border-default">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : places.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                <p className="text-sm font-medium">Tidak ada tempat ditemukan</p>
              </div>
            ) : (
              places.map((place) => (
                <div key={place.placeId} className="px-6 py-5 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-3">
                      <img 
                        src={getImageUrl(place.images?.[0])} 
                        alt={place.placeName} 
                        className="w-16 h-12 rounded-lg object-cover bg-border-default flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                      <span className="font-semibold text-text-heading text-sm line-clamp-2">{place.placeName}</span>
                    </div>
                    
                    <div className="col-span-2 flex flex-wrap gap-1">
                      {place.categories.slice(0, 2).map(cat => (
                        <span key={cat.categoryId} className="bg-brand-primary/10 text-brand-primary text-[11px] font-semibold px-2 py-1 rounded">
                          {cat.categoryName}
                        </span>
                      ))}
                      {place.categories.length > 2 && (
                        <span className="bg-bg-soft-blue text-text-muted text-[11px] font-semibold px-2 py-1 rounded">
                          +{place.categories.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="col-span-2 flex items-center gap-2 text-sm text-text-body">
                       <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                          <path d="M8.40067 14.5327C9.64067 13.462 13.3333 9.99533 13.3333 6.66667C13.3333 5.25218 12.7714 3.89562 11.7712 2.89543C10.771 1.89524 9.41449 1.33333 8 1.33333C6.58551 1.33333 5.22896 1.89524 4.22876 2.89543C3.22857 3.89562 2.66667 5.25218 2.66667 6.66667C2.66667 9.99533 6.35933 13.462 7.59933 14.5327Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-medium line-clamp-1">{place.location?.locationName}</span>
                    </div>

                    <div className="col-span-2">
                      {place.isActive ? (
                        <span className="inline-block bg-success/10 text-success text-[11px] font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Aktif</span>
                      ) : (
                        <span className="inline-block bg-border-default/50 text-text-muted text-[11px] font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Nonaktif</span>
                      )}
                    </div>
                    
                    <div className="col-span-1 flex items-center gap-1">
                      <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 12 11">
                          <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z"/>
                      </svg>
                      <span className="text-sm font-semibold text-text-heading">{place.ratingValue ?? "0"}</span>
                    </div>
                    
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => handleOpenModal("view", place)} className="p-2 rounded hover:bg-brand-primary/10 text-brand-primary transition-colors">
                        <EyeIcon />
                      </button>
                      <button onClick={() => handleOpenModal("edit", place)} className="p-2 rounded hover:bg-brand-primary/10 text-brand-primary transition-colors">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleDelete(place)} className="p-2 rounded hover:bg-error/10 text-error transition-colors">
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
                Menampilkan {places.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}-
                {Math.min(page * ITEMS_PER_PAGE, metadata?.totalItems ?? 0)} dari {metadata?.totalItems ?? 0} Tempat
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

      {modal.open && (modal.mode === "create" || modal.mode === "edit" || modal.mode === "view") && (
        <PlaceModal
          mode={modal.mode as "create" | "edit" | "view"}
          place={modal.place}
          locations={locations}
          categories={categories}
          onClose={() => setModal({ open: false })}
          onSuccess={fetchPlaces}
        />
      )}

      {modal.open && modal.mode === "delete" && modal.place && (
        <DeleteModal
          place={modal.place}
          onClose={() => setModal({ open: false })}
          onSuccess={fetchPlaces}
        />
      )}
    </>
  );
}
