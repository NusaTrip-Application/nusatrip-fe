"use client";

import React, { useState, useEffect, useRef } from "react";
import { notification } from "@/lib/notification";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, MapPin, Map, Settings, UploadCloud, Info, Trash2, ChevronLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getItineraryById, updateItinerary, deleteItinerary } from "@/services/plans";
import api from "@/lib/axios";

const formatTripRange = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return "Tanggal tidak ditentukan";
  const startObj = new Date(startStr);
  const endObj = new Date(endStr);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${startObj.toLocaleDateString('id-ID', options)} - ${endObj.toLocaleDateString('id-ID', { ...options, year: 'numeric' })}`;
};

export default function SettingsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [tripData, setTripData] = useState<any>({
    title: "Memuat...",
    destination: "Memuat...",
    startDate: "",
    endDate: "",
    pax: 1,
    budget: "",
    isPublic: false,
    bannerImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80"
  });

  const [formData, setFormData] = useState<any>({
    title: "",
    startDate: "",
    endDate: "",
    pax: 1,
    budget: "",
    isPublic: false,
    bannerImage: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        let res = await getItineraryById(id as string);
        const data = res.data || res;
        
        const bannerUrl = data.bannerPhotoUrl || data.bannerImageUrl;
        const finalBannerImage = bannerUrl ? (bannerUrl.startsWith('http') ? bannerUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${bannerUrl}`) : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80";

        const fetchedTripData = {
          title: data.title || "Untitled Plan",
          destination: data.location?.name || data.location?.locationName || "Destinasi",
          startDate: data.startDate ? data.startDate.split('T')[0] : "",
          endDate: data.endDate ? data.endDate.split('T')[0] : "",
          pax: data.travelerCount || 1,
          budget: data.estimatedTotalBudget || data.budgetPreference || 7000000,
          isPublic: data.visibilityStatus === "PUBLISHED",
          bannerImage: finalBannerImage
        };
        
        setTripData(fetchedTripData);
        setFormData(fetchedTripData);
      } catch (error) {
        console.error("Gagal memuat detail rencana:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  const handlePaxChange = (delta: number) => {
    setFormData((prev: any) => ({
      ...prev,
      pax: Math.max(1, prev.pax + delta)
    }));
  };

  const processFile = (file: File) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setFormData((prev: any) => ({ ...prev, bannerImage: result as string }));
          setSelectedFile(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      notification.error("Hanya file JPG dan PNG yang didukung.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const cleanedBudget = String(formData.budget).replace(/[^0-9]/g, "");

      let finalBannerUrl = undefined;
      
      if (selectedFile) {
        try {
          // Request presigned URL from Cloudflare R2 via Backend
          const presignedRes = await api.post('/media/presigned-url', {
            filename: selectedFile.name,
            mimetype: selectedFile.type,
            size: selectedFile.size,
            folder: "itinerary"
          });
          
          const uploadData = presignedRes.data?.data || presignedRes.data;
          const uploadUrl = uploadData.uploadUrl || uploadData.presignedUrl || uploadData.url;
          const fileKey = uploadData.tempKey || uploadData.fileKey || uploadData.key || uploadData.path;
          
          if (uploadUrl) {
            // Upload to Cloudflare R2
            const uploadRes = await fetch(uploadUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': selectedFile.type
              },
              body: selectedFile
            });
            
            if (uploadRes.ok) {
              finalBannerUrl = fileKey;
            } else {
              throw new Error("S3 Upload Failed");
            }
          }
        } catch (uploadError: any) {
          notification.error("Gagal mengunggah foto profil.");
          // Fallback to base64 if S3 fails
          finalBannerUrl = formData.bannerImage;
        }
      } else if (formData.bannerImage !== tripData.bannerImage && formData.bannerImage.startsWith('data:image')) {
        finalBannerUrl = formData.bannerImage;
      }
      
      console.log("FINAL BANNER URL:", finalBannerUrl);
      if (finalBannerUrl && finalBannerUrl.startsWith('data:image')) {
        console.warn("Peringatan: Mengirim gambar base64 karena S3 Upload gagal.");
      }

      await updateItinerary(id as string, {
        title: formData.title,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        travelerCount: formData.pax,
        visibilityStatus: formData.isPublic ? "PUBLISHED" : "PRIVATE",
        budgetPreference: Number(cleanedBudget) || undefined,
        ...(finalBannerUrl && { bannerImageUrl: finalBannerUrl })
      });
      notification.success("Perubahan berhasil disimpan!");
      
      // Re-fetch to update main tripData
      const res = await getItineraryById(id as string);
      const data = res.data || res;
      
      const bannerUrl = data.bannerPhotoUrl || data.bannerImageUrl;
      const finalBannerImage = bannerUrl ? (bannerUrl.startsWith('http') ? bannerUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${bannerUrl}`) : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80";

      const fetchedTripData = {
        title: data.title || "Untitled Plan",
        destination: data.location?.name || data.location?.locationName || "Destinasi",
        startDate: data.startDate ? data.startDate.split('T')[0] : "",
        endDate: data.endDate ? data.endDate.split('T')[0] : "",
        pax: data.travelerCount || 1,
        budget: data.estimatedTotalBudget || data.budgetPreference || 7000000,
        isPublic: data.visibilityStatus === "PUBLIC" || data.visibilityStatus === "PUBLISHED",
        bannerImage: finalBannerImage
      };
      setTripData(fetchedTripData);
      setFormData(fetchedTripData);
      
    } catch (e: any) {
      console.error(e);
      notification.error("Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
      setIsSaving(true);
      await deleteItinerary(id as string);
      router.push("/my-plans");
    } catch (e: any) {
      notification.error(e.message || "Gagal menghapus rencana");
    } finally {
      setIsSaving(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main font-sans flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-primary mb-4" />
          <p className="text-text-muted font-medium">Memuat pengaturan rencana...</p>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main font-sans flex flex-col">
      <Header />

      <div className="flex-grow">

        <div className="relative w-full h-[280px] md:h-[320px]">
          <img src={tripData.bannerImage || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80"} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-10 text-white">
          <div className="text-[12px] md:text-[13px] font-medium mb-2 flex items-center gap-1 opacity-90">
            {/* Mobile View: Back Button Only */}
            <Link href="/my-plans" className="md:hidden flex items-center justify-center p-1 -ml-2 hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft size={28} className="text-white" />
            </Link>

            {/* Desktop View: Full Breadcrumb */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/my-plans" className="hover:underline hover:text-white transition-colors">
                My Plans
              </Link>
              <span className="text-white/70"> &gt; </span>
              <span className="text-white/70 truncate max-w-[300px]">{tripData.title}</span>
            </div>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-serif font-bold leading-tight mb-4">{tripData.title}</h1>
            <div className="flex flex-wrap gap-4 md:gap-6 text-[13px] font-medium">
              <span className="flex items-center gap-1.5"><Calendar size={16} /> {formatTripRange(tripData.startDate, tripData.endDate)}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {tripData.destination}, Indonesia</span>
              <span className="flex items-center gap-1.5"><Users size={16} /> {tripData.pax} Orang</span>
            </div>
          </div>
        </div>

        <main className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8 mb-16">
          <div className="flex flex-col md:flex-row gap-8">

            <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
              <div className="bg-bg-surface border border-border-default rounded-2xl p-3 flex flex-col gap-1 shadow-sm sticky top-24">
                <SidebarItem icon={<Map size={18} />} label="View Itinerary" href={`/my-plans/${id}`} />
                {tripData.isPublic && (
                  <SidebarItem icon={<Users size={18} />} label="Community" href={`/my-plans/${id}/community`} />
                )}
                <SidebarItem icon={<Settings size={18} />} label="Settings" active href={`/my-plans/${id}/settings`} />
              </div>
            </div>

            <div className="flex-grow flex flex-col gap-6">

              <div>
                <h2 className="text-[24px] font-serif font-bold text-text-heading mb-2">Pengaturan Plan</h2>
                <p className="text-[14px] text-text-body font-medium">
                  Kelola detail perjalanan dan preferensi visibilitas untuk rencana liburan Anda.
                </p>
              </div>

              <div className="bg-bg-surface border border-border-default rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-text-heading mb-6">Informasi Dasar</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-medium text-text-heading mb-2">Judul Itinerary</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-border-default rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-bg-main text-text-heading"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[13px] font-medium text-text-heading mb-2">Tanggal Perjalanan</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full border border-border-default rounded-lg px-3 py-2.5 text-[14px] bg-bg-main text-text-heading focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          />
                        </div>
                        <div className="flex items-center text-text-muted">-</div>
                        <div className="relative flex-1">
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full border border-border-default rounded-lg px-3 py-2.5 text-[14px] bg-bg-main text-text-heading focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-heading mb-2">Jumlah Peserta</label>
                      <div className="flex border border-border-default rounded-lg overflow-hidden h-[42px]">
                        <button onClick={() => handlePaxChange(-1)} className="w-10 flex items-center justify-center bg-bg-main hover:bg-bg-hover text-text-muted border-r border-border-default font-medium">-</button>
                        <div className="flex-1 flex items-center justify-center text-[14px] bg-bg-main text-text-heading">{formData.pax}</div>
                        <button onClick={() => handlePaxChange(1)} className="w-10 flex items-center justify-center bg-bg-main hover:bg-bg-hover text-text-muted border-l border-border-default font-medium">+</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-text-heading mb-2">Jumlah Anggaran</label>
                    <div className="flex border border-border-default rounded-lg overflow-hidden h-[42px]">
                      <div className="bg-brand-primary text-white px-4 flex items-center justify-center text-[14px] font-bold">
                        Rp
                      </div>
                      <input
                        type="text"
                        value={formData.budget ? Number(String(formData.budget).replace(/[^0-9]/g, "")).toLocaleString("id-ID") : ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setFormData({ ...formData, budget: val });
                        }}
                        placeholder="Contoh: 5.000.000"
                        className="flex-1 px-4 py-2.5 text-[14px] focus:outline-none bg-bg-main text-text-heading"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[13px] font-medium text-text-heading mb-2">Foto Banner Itinerary</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl h-[140px] flex flex-col items-center justify-center text-center px-4 cursor-pointer transition-colors ${isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-border-default bg-bg-main hover:bg-bg-hover'}`}
                      >
                        <UploadCloud size={24} className={`${isDragging ? 'text-brand-primary' : 'text-text-muted'} mb-2`} />
                        <p className="text-[14px] font-medium text-text-heading mb-1">Pilih File atau Drag & Drop</p>
                        <p className="text-[11px] text-text-muted">JPG, PNG up to 5MB</p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/jpeg, image/png"
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-text-heading mb-2">Preview Foto Banner</label>
                      <div className="h-[140px] w-full rounded-xl overflow-hidden border border-border-default bg-bg-surface flex items-center justify-center">
                        <img src={formData.bannerImage || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80"} alt="Preview Banner" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface border border-border-default rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-text-heading mb-1">Visibilitas Plan</h3>
                    <p className="text-[13px] text-text-body md:w-3/4">
                      Atur siapa saja yang dapat melihat rencana perjalanan ini. Plan publik dapat menginspirasi wisatawan lain di komunitas NusaTrip.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                      className={`w-12 h-6 rounded-full flex items-center cursor-pointer px-1 transition-colors ${formData.isPublic ? 'bg-brand-primary' : 'bg-border-default'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="text-[11px] font-medium text-brand-primary">{formData.isPublic ? 'Publik' : 'Privat'}</span>
                  </div>
                </div>

                {formData.isPublic && (
                  <div className="flex items-start gap-3 bg-brand-primary/10 rounded-lg p-4 mt-4">
                    <Info size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <p className="text-[13px] text-brand-primary font-medium">
                      Plan Anda saat ini Publik. Siapapun dengan tautan dapat melihat itinerary ini.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-[18px] font-bold text-red-600 mb-2">Zona Bahaya</h3>
                <p className="text-[13px] text-red-800 mb-6 md:w-3/4">
                  Menghapus rencana perjalanan akan menghilangkan semua data itinerary, reservasi, dan catatan secara permanen.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} /> Hapus Plan Ini
                </button>
              </div>

              {/* 3. Perlebar margin-top agar tombol tidak menempel dengan kartu Zona Bahaya */}
              <div className="flex justify-end items-center gap-4 mt-6">
                <button 
                  onClick={() => setFormData(tripData)}
                  className="px-6 py-2.5 rounded-lg border border-border-default text-text-heading text-[14px] font-bold hover:bg-bg-hover transition-colors bg-bg-surface"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-lg bg-brand-primary text-white text-[14px] font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[18px] font-bold text-text-heading mb-2">Hapus Rencana?</h3>
            <p className="text-[14px] text-text-body mb-6">
              Rencana perjalanan ini akan dihapus secara permanen beserta semua jadwal di dalamnya.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border-default text-[13px] font-bold text-text-heading hover:bg-bg-hover transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeletePlan}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-[13px] font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
}

function SidebarItem({ icon, label, active, href }: { icon: React.ReactNode; label: string; active?: boolean; href?: string }) {
  const Comp = href ? Link : "div";
  return (
    <Comp href={href || "#"} className={`px-4 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-3 transition-colors ${active ? 'bg-brand-primary text-white' : 'bg-transparent text-text-muted hover:bg-bg-hover hover:text-text-heading'}`}>
      {icon}
      {label}
    </Comp>
  );
}