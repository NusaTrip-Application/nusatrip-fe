"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, MapPin, Calendar, User, Leaf, Landmark, Utensils, ShoppingBag, Music, Users, HelpCircle } from "lucide-react";
import { planSchema, PlanFormValues } from "@/lib/validations/plans";
import { getLocationOptions, getPlaceCategories, createItinerary } from "@/services/plans";

const getIconForCategory = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("nature")) return Leaf;
  if (name.includes("culture") || name.includes("history")) return Landmark;
  if (name.includes("food") || name.includes("culinary")) return Utensils;
  if (name.includes("shopping")) return ShoppingBag;
  if (name.includes("entertainment") || name.includes("art")) return Music;
  if (name.includes("family")) return Users;
  return HelpCircle;
};

export default function CreatePlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDestination = searchParams.get("destination") || "";

  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      destination: initialDestination,
      interests: [],
    },
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [locationsRes, categoriesRes] = await Promise.all([
          getLocationOptions(),
          getPlaceCategories()
        ]);
        
        setLocations(locationsRes.data || []);
        setCategories(categoriesRes.data || []);
        
        if (categoriesRes.data && categoriesRes.data.length > 0) {
          const firstCategoryId = categoriesRes.data[0].categoryId;
          setSelectedInterests([firstCategoryId]);
          setValue("interests", [firstCategoryId]);
        }
      } catch (error) {
        console.error("Gagal memuat data form:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchFormData();
  }, [setValue]);

  const toggleInterest = (categoryId: string) => {
    const newInterests = selectedInterests.includes(categoryId)
      ? selectedInterests.filter((id) => id !== categoryId)
      : [...selectedInterests, categoryId];
      
    setSelectedInterests(newInterests);
    setValue("interests", newInterests, { shouldValidate: true });
  };

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    setApiError("");

    try {
      const payload = {
        title: data.title || `Perjalanan Baru`,
        locationId: data.destination,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        travelerCount: Number(data.travelers) || 4,
        budgetPreference: data.budget ? Number(data.budget.toString().replace(/[^0-9]/g, "")) : 2000000,
        interestSummary: selectedInterests
      };

      const response = await createItinerary(payload);

      const newTripId = response.data.itineraryId;

      alert("Setup Rencana Perjalanan berhasil!");

      router.push(`/my-plans/recommendation?tripId=${newTripId}`);
      
    } catch (error: any) {
      setApiError(error.message || "Gagal membuat rencana perjalanan. Periksa kembali isian Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return <div className="text-center py-20 text-text-muted font-medium animate-pulse">Menyiapkan formulir...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto font-sans mb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-[32px] font-serif font-bold text-text-heading mb-3">
          Rencanakan Perjalananmu
        </h1>
        <p className="text-sm text-text-body font-medium">
          Ciptakan momen tak terlupakan dengan rencana perjalanan yang dipersonalisasi sesuai keinginanmu.
        </p>
      </div>

      <div className="bg-bg-surface border border-border-default rounded-2xl p-6 md:p-8 shadow-sm">
        {apiError && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-2">Nama Perjalanan</label>
            <div className="relative">
              <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Contoh: 4 Hari di Bali" 
                {...register("title")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.title ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-brand-primary focus:ring-brand-primary"}`}
              />
            </div>
            {errors.title && <p className="text-error text-xs mt-1.5">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-2">Kemana tujuanmu?</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted z-10" size={18} />
              <select 
                {...register("destination")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium transition-shadow appearance-none cursor-pointer ${errors.destination ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-brand-primary focus:ring-brand-primary"}`}
              >
                <option value="" disabled hidden>Pilih Kota Tujuan</option>
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.locationId}>
                    {loc.locationName}, {loc.provinceName}
                  </option>
                ))}
              </select>
            </div>
            {errors.destination && <p className="text-error text-xs mt-1.5">{errors.destination.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-text-heading mb-2">Kapan perjalanannya?</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text"
                    placeholder="Mulai"
                    onFocus={(e) => (e.target.type = "date")}
                    {...register("startDate", { onBlur: (e) => { if (!e.target.value) e.target.type = "text"; } })}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium text-text-body transition-shadow ${errors.startDate ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-brand-primary focus:ring-brand-primary"}`}
                  />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text"
                    placeholder="Selesai"
                    onFocus={(e) => (e.target.type = "date")}
                    {...register("endDate", { onBlur: (e) => { if (!e.target.value) e.target.type = "text"; } })}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium text-text-body transition-shadow ${errors.endDate ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-brand-primary focus:ring-brand-primary"}`}
                  />
                </div>
              </div>
              {(errors.startDate || errors.endDate) && (
                <p className="text-error text-xs mt-1.5">Tanggal wajib diisi dengan benar.</p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-text-heading mb-2">Jumlah Wisatawan</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="number" 
                  min="1"
                  placeholder="4" 
                  {...register("travelers")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.travelers ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-brand-primary focus:ring-brand-primary"}`}
                />
              </div>
              {errors.travelers && <p className="text-error text-xs mt-1.5">{errors.travelers.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-3">Apa minat perjalananmu?</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const Icon = getIconForCategory(cat.categoryName);
                const isSelected = selectedInterests.includes(cat.categoryId);
                
                return (
                  <button
                    key={cat.categoryId}
                    type="button"
                    onClick={() => toggleInterest(cat.categoryId)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-medium transition-colors ${
                      isSelected 
                        ? "border-brand-primary bg-brand-primary/10 text-brand-primary" 
                        : "border-border-default bg-bg-surface text-text-body hover:bg-bg-soft-gray"
                    }`}
                  >
                    <Icon size={16} className={isSelected ? "text-brand-primary" : "text-text-muted"} />
                    {cat.categoryName}
                  </button>
                );
              })}
            </div>
            {errors.interests && <p className="text-error text-xs mt-1.5">{errors.interests.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-2">Total Estimasi Anggaran (Rp)</label>
            <div className={`flex items-stretch rounded-xl border overflow-hidden transition-shadow ${errors.budget ? "border-border-error focus-within:ring-1 focus-within:ring-border-error" : "border-border-default focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary"}`}>
              <div className="bg-brand-primary text-text-light px-5 flex items-center justify-center font-semibold text-sm">
                Rp
              </div>
              <input 
                type="text" 
                placeholder="Contoh: 5000000"
                {...register("budget")}
                className="flex-1 py-3 px-4 bg-bg-main text-sm font-medium outline-none"
              />
            </div>
            {errors.budget && <p className="text-error text-xs mt-1.5">{errors.budget.message}</p>}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70 text-text-light font-semibold text-[15px] py-3.5 rounded-xl transition-colors shadow-sm"
            >
              {isSubmitting ? "Menyimpan Rencana..." : "Buat Rencana Perjalanan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}