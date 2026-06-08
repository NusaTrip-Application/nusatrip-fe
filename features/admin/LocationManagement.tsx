"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Settings } from "lucide-react";
import {
  getAdminLocations,
  getProvinces,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationsSummary,
  getAdminLocationById,
  type Location,
  type LocationsMetadata,
  type ProvinceOption,
} from "@/services/locations";
import { getPresignedUrl, uploadFileToS3, deleteMedia } from "@/services/media";

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

const LocationIcon = () => (
  <svg className="w-[22px] h-[22px] text-white" fill="none" viewBox="0 0 22 22">
    <path d="M11.5506 19.9817C13.2556 18.5095 18.333 13.7429 18.333 9.16595C18.333 7.22103 17.5604 5.35577 16.1851 3.9805C14.8098 2.60523 12.9446 1.83262 10.9996 1.83262C9.05472 1.83262 7.18946 2.60523 5.81419 3.9805C4.43893 5.35577 3.66631 7.22103 3.66631 9.16595C3.66631 13.7429 8.74373 18.5095 10.4487 19.9817Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 11.9174C12.5188 11.9174 13.75 10.6862 13.75 9.16738C13.75 7.6486 12.5188 6.41738 11 6.41738C9.48122 6.41738 8.25 7.6486 8.25 9.16738C8.25 10.6862 9.48122 11.9174 11 11.9174Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <Bell className="w-5 h-5 text-text-body" />
);

const SettingsIcon = () => (
  <Settings className="w-5 h-5 text-text-body" />
);

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 18 18">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25ZM15.75 15.75L12.525 12.525" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 18 18">
    <path d="M7.5 15L9.41475 16.4213L10.5 15.75V10.5L16.305 3.5025L15.75 2.25H2.25L1.6935 3.5025L7.11225 9.49425L7.5 10.5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 18 18">
    <path d="M15.75 12L12.75 15L9.75 12M12.75 15V3M2.25 6L5.25 3L8.25 6M5.25 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 18 18">
    <path d="M1.5465 8.739C1.48399 8.90739 1.48399 9.09261 1.5465 9.261C2.15528 10.7371 3.18864 11.9992 4.51558 12.8873C5.84252 13.7754 7.40328 14.2495 9 14.2495C10.5967 14.2495 12.1575 13.7754 13.4844 12.8873C14.8114 11.9992 15.8447 10.7371 16.4535 9.261C16.516 9.09261 16.516 8.90739 16.4535 8.739C15.8447 7.26289 14.8114 6.00078 13.4844 5.11267C12.1575 4.22457 10.5967 3.75046 9 3.75046C7.40328 3.75046 5.84252 4.22457 4.51558 5.11267C3.18864 6.00078 2.15528 7.26289 1.5465 8.739ZM9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 18 18">
    <path d="M15.8805 5.109L12.891 2.11875L2.8815 12.1305L1.51575 16.017L5.24775 15.4935L15.8805 5.109Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 18 18">
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

// ─── Modal Form ─────────────────────────────────────────────────────────────────

interface ModalFormProps {
  mode: "create" | "edit" | "view";
  location?: Location | null;
  provinces: ProvinceOption[];
  onClose: () => void;
  onSuccess: () => void;
}

function LocationModal({ mode, location, provinces, onClose, onSuccess }: ModalFormProps) {
  const [form, setForm] = useState({
    locationName: location?.locationName ?? "",
    provinceId: location?.provinceId ?? "",
    description: location?.description ?? "",
    imageUrl: location?.imageUrl ?? "",
    isActive: location?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(location?.imageUrl ? getImageUrl(location.imageUrl) : null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Ukuran file maksimal 10MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setUploadError(null);
      setIsUploadingImage(true);

      try {
        const presigned = await getPresignedUrl(file.type, file.size, "location");
        const uploadData = (presigned as any).data || presigned;
        const uploadUrl = uploadData.uploadUrl || uploadData.presignedUrl || uploadData.url;
        const fileKey = uploadData.tempKey || uploadData.fileKey || uploadData.key || uploadData.path;

        if (!uploadUrl) throw new Error("URL upload tidak ditemukan");

        await uploadFileToS3(uploadUrl, file);
        setForm((f) => ({ ...f, imageUrl: fileKey }));
      } catch (err: any) {
        console.error("Gagal upload gambar:", err);
        setUploadError("Gagal mengunggah gambar ke server.");
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleDeleteImage = () => {
    if (!form.imageUrl) return;
    // Hanya clear state di UI.
    // Jika itu gambar /temp, biarkan cron job backend yang hapus.
    // Jika itu gambar existing, kita tidak boleh hapus dari S3 sebelum user klik Simpan.
    setForm((f) => ({ ...f, imageUrl: "" }));
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const isReadOnly = mode === "view";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImage) return;

    setLoading(true);
    setError(null);
    try {
      const payload = {
        locationName: form.locationName,
        provinceId: form.provinceId,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        isActive: form.isActive,
      };

      if (mode === "create") {
        await createLocation(payload);
      } else if (mode === "edit" && location) {
        await updateLocation(location.locationId, payload);
        
        // Jika gambar berubah (diubah/dihapus) saat Edit, hit API delete untuk gambar aslinya
        if (location.imageUrl && form.imageUrl !== location.imageUrl) {
          try {
            // Kita tidak perlu menunggu (await) agar proses save terasa lebih cepat bagi user, 
            // atau bisa di-await jika ingin memastikan. Disini kita await tapi tangkap errornya.
            await deleteMedia(location.imageUrl);
          } catch (deleteErr) {
            console.warn("Gagal menghapus gambar lama di S3:", deleteErr);
          }
        }
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop&q=60";

  const titleMap = {
    create: "Tambah Lokasi",
    edit: "Edit Lokasi",
    view: "Detail Lokasi",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-default">
          <h2 className="font-serif text-[26px] font-bold text-text-heading">{titleMap[mode]}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-hover text-text-muted transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {/* Provinsi */}
          <div>
            <label className="block text-sm font-semibold text-text-heading mb-2">
              Provinsi {!isReadOnly && <span className="text-error">*</span>}
            </label>
            {isReadOnly ? (
              <input
                type="text"
                value={location?.province?.provinceName ?? ""}
                readOnly
                className="w-full border border-border-default rounded-xl px-4 py-3 text-sm text-text-heading bg-bg-soft-gray focus:outline-none"
              />
            ) : (
              <select
                value={form.provinceId}
                onChange={(e) => setForm((f) => ({ ...f, provinceId: e.target.value }))}
                required
                className="w-full border border-border-default rounded-xl px-4 py-3 text-sm text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition bg-bg-surface"
              >
                <option value="" disabled>Pilih provinsi lokasi</option>
                {provinces.map((p) => (
                  <option key={p.provinceId} value={p.provinceId}>
                    {p.provinceName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nama Lokasi */}
          <div>
            <label className="block text-sm font-semibold text-text-heading mb-2">
              Nama Lokasi {!isReadOnly && <span className="text-error">*</span>}
            </label>
            <input
              type="text"
              value={form.locationName}
              onChange={(e) => setForm((f) => ({ ...f, locationName: e.target.value }))}
              placeholder="Masukkan nama lokasi"
              readOnly={isReadOnly}
              required={!isReadOnly}
              className="w-full border border-border-default rounded-xl px-4 py-3 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition disabled:bg-bg-soft-gray read-only:bg-bg-soft-gray"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-text-heading mb-2">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Berikan deskripsi singkat tentang lokasi..."
              readOnly={isReadOnly}
              rows={4}
              className="w-full border border-border-default rounded-xl px-4 py-3 text-sm text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition resize-none read-only:bg-bg-soft-gray"
            />
          </div>

          {/* Gambar Area */}
          {isReadOnly ? (
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-2">
                Gambar
              </label>
              <div className="w-full h-[200px] rounded-xl overflow-hidden bg-bg-soft-gray border border-border-default flex items-center justify-center relative">
                {form.imageUrl ? (
                  <img
                    src={getImageUrl(form.imageUrl)}
                    alt="Location"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  />
                ) : (
                  <span className="text-sm text-text-muted">Tidak ada gambar</span>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-heading mb-2">
                  Gambar
                </label>
                <div className={`border border-dashed border-border-strong rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-bg-hover transition-colors h-[140px] relative overflow-hidden group ${isUploadingImage ? 'opacity-60 pointer-events-none' : ''}`}>
                  {isUploadingImage ? (
                    <>
                      <div className="w-6 h-6 border-2 border-brand-primary/40 border-t-brand-primary rounded-full animate-spin mb-2" />
                      <p className="text-[13px] font-medium text-text-body">Mengunggah gambar...</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7 text-text-muted mb-3 group-hover:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-[13px] font-medium text-text-body">Klik untuk upload atau drag & drop</p>
                      <p className="text-[11px] text-text-muted mt-1">PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    disabled={isUploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
                {uploadError && <p className="text-xs text-error mt-2">{uploadError}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-heading mb-2">
                  Preview Gambar
                </label>
                <div className="w-full h-[140px] rounded-xl overflow-hidden bg-bg-soft-gray border border-dashed border-border-strong flex items-center justify-center relative group">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        disabled={isUploadingImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-error hover:bg-error/90 text-white rounded-lg flex items-center justify-center shadow-md transition-all disabled:opacity-50"
                        title="Hapus Gambar"
                      >
                        <TrashIcon />
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-text-muted">Tidak ada preview</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-text-heading mb-2">
              Status {!isReadOnly && <span className="text-error">*</span>}
            </label>
            {isReadOnly ? (
              <input
                type="text"
                value={form.isActive ? "Aktif" : "Non-Aktif"}
                readOnly
                className="w-full border border-border-default rounded-xl px-4 py-3 text-sm text-text-heading bg-bg-soft-gray focus:outline-none"
              />
            ) : (
              <select
                value={form.isActive ? "true" : "false"}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === "true" }))}
                required
                className="w-full border border-border-default rounded-xl px-4 py-3 text-sm text-text-heading bg-bg-surface focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition"
              >
                <option value="" disabled>Pilih status lokasi</option>
                <option value="true">Aktif</option>
                <option value="false">Non-Aktif</option>
              </select>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-5 border-t border-border-default !mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || isUploadingImage}
              className="flex-1 bg-bg-surface hover:bg-bg-hover border border-border-default rounded-xl py-3 px-4 text-sm font-bold text-text-body shadow-sm transition-colors disabled:opacity-60"
            >
              Batal
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                disabled={loading || isUploadingImage}
                className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl py-3 px-4 text-sm font-bold shadow-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {isUploadingImage ? "Mengunggah Gambar..." : (mode === "create" ? "Tambah Lokasi" : "Simpan Perubahan")}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────────

function DeleteModal({
  location,
  onClose,
  onSuccess,
}: {
  location: Location;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteLocation(location.locationId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus lokasi.");
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
          <h3 className="font-serif text-xl text-text-heading">Hapus Lokasi?</h3>
          <p className="text-sm text-text-body">
            Apakah kamu yakin ingin menghapus lokasi{" "}
            <span className="font-bold text-text-heading">&quot;{location.locationName}&quot;</span>?
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

// ─── Table Row Skeleton ─────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <div className="px-6 py-5 animate-pulse">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-border-default" />
          <div className="h-4 bg-border-default rounded w-20" />
        </div>
        <div className="col-span-2">
          <div className="h-4 bg-border-default rounded w-24" />
        </div>
        <div className="col-span-4 space-y-2">
          <div className="h-3 bg-border-default rounded w-full" />
          <div className="h-3 bg-border-default rounded w-3/4" />
        </div>
        <div className="col-span-1">
          <div className="h-6 bg-border-default rounded-lg w-14" />
        </div>
        <div className="col-span-2 flex justify-end gap-2">
          <div className="w-8 h-8 bg-border-default rounded-lg" />
          <div className="w-8 h-8 bg-border-default rounded-lg" />
          <div className="w-8 h-8 bg-border-default rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

type ModalState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit" | "view"; location: Location }
  | { open: true; mode: "delete"; location: Location };

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=96&auto=format&fit=crop&q=60";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';

const getImageUrl = (urlOrKey?: string | null) => {
  if (!urlOrKey) return FALLBACK_IMAGE;
  if (urlOrKey.startsWith('http')) return urlOrKey;
  return `${STORAGE_URL}/${urlOrKey}`;
};

export default function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [metadata, setMetadata] = useState<LocationsMetadata | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false });
  
  const [filterProvince, setFilterProvince] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortParam, setSortParam] = useState<string>("name_asc");

  const ITEMS_PER_PAGE = 5;

  // ── Fetch Provinces ─────────────────────────────────────────────────────────
  useEffect(() => {
    getProvinces()
      .then((res) => { if (res.success) setProvinces(res.data); })
      .catch(console.error);
  }, []);

  // ── Fetch Locations ─────────────────────────────────────────────────────────
  const fetchLocations = async (p = page, q = search, prov = filterProvince, status = filterStatus, sort = sortParam) => {
    setIsLoading(true);
    try {
      let sortBy = "createdAtDesc";
      if (sort === "name_asc") { sortBy = "nameAsc"; }
      else if (sort === "name_desc") { sortBy = "nameDesc"; }
      else if (sort === "latest") { sortBy = "createdAtDesc"; }
      else if (sort === "oldest") { sortBy = "createdAtAsc"; }

      const filterStatusParam = status === "true" ? "active" : status === "false" ? "inactive" : undefined;

      const res = await getAdminLocations({ 
        page: p, 
        limit: ITEMS_PER_PAGE, 
        search: q || undefined,
        provinceId: prov || undefined,
        status: filterStatusParam,
        sortBy
      });
      if (res.success) {
        setLocations(res.data.items);
        setMetadata(res.data.metadata);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      setIsLoading(false);
    }

    // Panggil summary secara independen (tidak memblokir isLoading tabel)
    getLocationsSummary()
      .then((sumRes) => {
        if (sumRes.success) {
          setSummary(sumRes.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching locations summary:", err);
      });
  };

  useEffect(() => {
    fetchLocations(page, search, filterProvince, filterStatus, sortParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, filterProvince, filterStatus, sortParam]);

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

  const handleOpenModal = async (mode: "view" | "edit", location: Location) => {
    try {
      const res = await getAdminLocationById(location.locationId);
      if (res.success && res.data) {
        setModal({ open: true, mode, location: res.data });
      } else {
        setModal({ open: true, mode, location });
      }
    } catch (err) {
      console.error("Failed to fetch fresh detail:", err);
      setModal({ open: true, mode, location });
    }
  };

  // Stats
  const totalLokasi = summary?.totalLocations ?? 0;
  const lokasíAktif = summary?.totalActiveLocations ?? 0;
  const lokasiNonAktif = summary?.totalInactiveLocations ?? 0;

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
      {/* ── Top Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-bg-surface border-b border-border-default shadow-sm h-20 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center">
            <LocationIcon />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-text-heading leading-tight">Location Management</h1>
            <p className="text-sm text-text-muted">Kelola semua data lokasi wisata</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-bg-hover relative transition-colors">
            <BellIcon />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-bg-hover transition-colors">
            <SettingsIcon />
          </button>
          <div className="w-10 h-10 rounded-full bg-border-default border border-border-default overflow-hidden">
            <img src="https://i.pravatar.cc/80?img=12" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* ── Content Area ────────────────────────────────────────────────────────── */}
      <div className="p-8 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            label="Total Lokasi"
            value={totalLokasi}
            icon={
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <path d="M12.6006 21.7982C14.4606 20.1922 19.9996 14.9922 19.9996 9.99922C19.9996 7.87749 19.1568 5.84266 17.6565 4.34236C16.1562 2.84207 14.1213 1.99922 11.9996 1.99922C9.87788 1.99922 7.84305 2.84207 6.34276 4.34236C4.84246 5.84266 3.99961 7.87749 3.99961 9.99922C3.99961 14.9922 9.53861 20.1922 11.3986 21.7982Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13.0008C13.6569 13.0008 15 11.6576 15 10.0008C15 8.34393 13.6569 7.00078 12 7.00078C10.3431 7.00078 9 8.34393 9 10.0008C9 11.6576 10.3431 13.0008 12 13.0008Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Lokasi Aktif"
            value={isLoading ? "—" : lokasíAktif}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24">
                <path d="M21.801 10C22.2577 12.2413 21.9322 14.5714 20.8789 16.6018C19.8255 18.6322 18.1079 20.2401 16.0125 21.1573C13.9171 22.0746 11.5706 22.2458 9.3643 21.6424C7.15797 21.039 5.22519 19.6974 3.88828 17.8414C2.55136 15.9854 1.89112 13.7272 2.01766 11.4434C2.14421 9.15953 3.04988 6.98809 4.58365 5.29117C6.11742 3.59425 8.18658 2.47443 10.4461 2.11845C12.7056 1.76248 15.0188 2.19186 17 3.335M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="Lokasi Non-Aktif"
            value={isLoading ? "—" : lokasiNonAktif}
            icon={
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>

        {/* Search, Filter, Sort, Add */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <SearchIcon />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama tempat..."
              className="w-full bg-bg-soft-blue border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-heading placeholder:text-text-muted font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </form>

          <select
            value={filterProvince}
            onChange={(e) => { setFilterProvince(e.target.value); setPage(1); }}
            className="bg-bg-soft-blue border border-border-default rounded-xl pl-4 pr-10 py-3 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="" className="bg-bg-surface">Semua Provinsi</option>
            {provinces.map((prov) => (
              <option key={prov.provinceId} value={prov.provinceId} className="bg-bg-surface">
                {prov.provinceName}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-bg-soft-blue border border-border-default rounded-xl pl-4 pr-10 py-3 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="" className="bg-bg-surface">Semua Status</option>
            <option value="true" className="bg-bg-surface">Aktif</option>
            <option value="false" className="bg-bg-surface">Non-Aktif</option>
          </select>

          <select
            value={sortParam}
            onChange={(e) => { setSortParam(e.target.value); setPage(1); }}
            className="bg-bg-soft-blue border border-border-default rounded-xl pl-4 pr-10 py-3 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-colors cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="name_asc" className="bg-bg-surface">Nama (A-Z)</option>
            <option value="name_desc" className="bg-bg-surface">Nama (Z-A)</option>
            <option value="latest" className="bg-bg-surface">Terbaru</option>
            <option value="oldest" className="bg-bg-surface">Terlama</option>
          </select>

          <button
            onClick={() => setModal({ open: true, mode: "create" })}
            className="bg-brand-primary hover:bg-brand-primary-hover rounded-xl px-5 py-3 flex items-center gap-2 text-white font-bold shadow-sm transition-colors text-sm"
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 22 22">
              <path d="M11.5506 19.9817C13.2556 18.5095 18.333 13.7429 18.333 9.16595C18.333 7.22103 17.5604 5.35577 16.1851 3.9805C14.8098 2.60523 12.9446 1.83262 10.9996 1.83262C9.05472 1.83262 7.18946 2.60523 5.81419 3.9805C4.43893 5.35577 3.66631 7.22103 3.66631 9.16595C3.66631 13.7429 8.74373 18.5095 10.4487 19.9817ZM11 11.9174C12.5188 11.9174 13.75 10.6862 13.75 9.16738C13.75 7.6486 12.5188 6.41738 11 6.41738C9.48122 6.41738 8.25 7.6486 8.25 9.16738C8.25 10.6862 9.48122 11.9174 11 11.9174Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tambah Lokasi
          </button>
        </div>

        {/* Table */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-bg-soft-blue border-b border-border-default px-6 py-5">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
              <div className="col-span-3">Nama Lokasi</div>
              <div className="col-span-2">Provinsi</div>
              <div className="col-span-4">Deskripsi Singkat</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border-default">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : locations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24">
                  <path d="M12.6006 21.7982C14.4606 20.1922 19.9996 14.9922 19.9996 9.99922C19.9996 7.87749 19.1568 5.84266 17.6565 4.34236C16.1562 2.84207 14.1213 1.99922 11.9996 1.99922C9.87788 1.99922 7.84305 2.84207 6.34276 4.34236C4.84246 5.84266 3.99961 7.87749 3.99961 9.99922C3.99961 14.9922 9.53861 20.1922 11.3986 21.7982Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-sm font-medium">Tidak ada lokasi ditemukan</p>
              </div>
            ) : (
              locations.map((loc) => (
                <div
                  key={loc.locationId}
                  className="px-6 py-5 hover:bg-bg-hover transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Name + Image */}
                    <div className="col-span-3 flex items-center gap-3">
                      <img
                        src={getImageUrl(loc.imageUrl)}
                        alt={loc.locationName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                      <span className="font-semibold text-text-heading text-sm leading-snug">{loc.locationName}</span>
                    </div>

                    {/* Province */}
                    <div className="col-span-2 text-sm text-text-body">{loc.province?.provinceName ?? "-"}</div>

                    {/* Description */}
                    <div className="col-span-4 text-sm text-text-muted line-clamp-2 leading-relaxed">
                      {loc.description ?? <span className="italic">Tidak ada deskripsi</span>}
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-lg uppercase whitespace-nowrap ${
                          loc.isActive
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {loc.isActive ? "Aktif" : "Non-Aktif"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal("view", loc)}
                        className="p-2 rounded-lg hover:bg-bg-soft-blue text-brand-primary transition-colors"
                        title="Lihat Detail"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => handleOpenModal("edit", loc)}
                        className="p-2 rounded-lg hover:bg-bg-soft-blue text-brand-primary transition-colors"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setModal({ open: true, mode: "delete", location: loc })}
                        className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
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
          <div className="bg-bg-soft-blue border-t border-border-default px-6 py-4 flex items-center justify-between">
            <p className="text-xs font-medium text-text-muted">
              {metadata
                ? `Menampilkan ${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, metadata.totalItems)} dari ${metadata.totalItems} Lokasi`
                : "Memuat..."}
            </p>
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-white disabled:opacity-30 transition-colors"
              >
                <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12">
                  <path d="M7.4 1.4L6 0L0 6L6 12L7.4 10.6L2.8 6L7.4 1.4Z"/>
                </svg>
              </button>

              {/* Pages */}
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    p === page
                      ? "bg-brand-primary text-white"
                      : "text-text-heading hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-heading hover:bg-white disabled:opacity-30 transition-colors"
              >
                <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12">
                  <path d="M0.6 10.6L2 12L8 6L2 0L0.6 1.4L5.2 6L0.6 10.6Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────────── */}
      {modal.open && modal.mode === "delete" && (
        <DeleteModal
          location={modal.location}
          onClose={() => setModal({ open: false })}
          onSuccess={() => fetchLocations(page, search)}
        />
      )}

      {modal.open && (modal.mode === "create" || modal.mode === "edit" || modal.mode === "view") && (
        <LocationModal
          mode={modal.mode}
          location={modal.mode !== "create" ? modal.location : null}
          provinces={provinces}
          onClose={() => setModal({ open: false })}
          onSuccess={() => fetchLocations(page, search)}
        />
      )}
    </>
  );
}
