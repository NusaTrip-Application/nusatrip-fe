"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, MapPin, Calendar, User, Leaf, Landmark, Utensils, ShoppingBag, Music, Users } from "lucide-react";
import { planSchema, PlanFormValues } from "@/lib/validations/plans";

const interestOptions = [
  { id: "Nature", label: "Nature", icon: Leaf },
  { id: "Culture", label: "Culture", icon: Landmark },
  { id: "Culinary", label: "Culinary", icon: Utensils },
  { id: "Shopping", label: "Shopping", icon: ShoppingBag },
  { id: "Entertainment", label: "Entertainment", icon: Music },
  { id: "Family", label: "Family", icon: Users },
];

export default function CreatePlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const initialDestination = searchParams.get("destination") || ""; 

  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Nature"]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      destination: initialDestination, 
      interests: ["Nature"],
    },
  });

  const toggleInterest = (interestId: string) => {
    const newInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter((id) => id !== interestId)
      : [...selectedInterests, interestId];
    setSelectedInterests(newInterests);
    setValue("interests", newInterests, { shouldValidate: true });
  };

  const onSubmit = (data: PlanFormValues) => {
    console.log("Data Trip Valid:", data);
    alert("Setup Rencana Perjalanan berhasil!");
    // TODO: Arahkan ke halaman detail trip
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-2">
              Nama Perjalanan
            </label>
            <div className="relative">
              <Pencil className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Contoh: 4 Hari di Bandung" 
                {...register("title")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.title ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
              />
            </div>
            {errors.title && <p className="text-error text-xs mt-1.5">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-2">
              Kemana tujuanmu?
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Contoh: Bandung" 
                {...register("destination")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.destination ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
              />
            </div>
            {errors.destination && <p className="text-error text-xs mt-1.5">{errors.destination.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-text-heading mb-2">
                Kapan perjalanannya?
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text"
                    placeholder="Mulai"
                    onFocus={(e) => (e.target.type = "date")}
                    {...register("startDate", {
                        onBlur: (e) => {
                        if (!e.target.value) e.target.type = "text";
                        }
                    })}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium text-text-body transition-shadow ${errors.startDate ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                    />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text"
                    placeholder="Selesai"
                    onFocus={(e) => (e.target.type = "date")}
                    {...register("endDate", {
                        onBlur: (e) => {
                        if (!e.target.value) e.target.type = "text";
                        }
                    })}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium text-text-body transition-shadow ${errors.endDate ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                    />
                </div>
              </div>
              {(errors.startDate || errors.endDate) && (
                <p className="text-error text-xs mt-1.5">Tanggal wajib diisi dengan benar.</p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-text-heading mb-2">
                Jumlah Wisatawan
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="number" 
                  min="1"
                  placeholder="4" 
                  {...register("travelers")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-bg-main focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.travelers ? "border-border-error focus:ring-border-error" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                />
              </div>
              {errors.travelers && <p className="text-error text-xs mt-1.5">{errors.travelers.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-3">
              Apa minat perjalananmu?
            </label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-medium transition-colors ${
                      isSelected 
                        ? "border-brand-primary bg-bg-soft-blue text-brand-primary" 
                        : "border-border-default bg-bg-surface text-text-body hover:bg-bg-hover"
                    }`}
                  >
                    <Icon size={16} className={isSelected ? "text-brand-primary" : "text-text-muted"} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {errors.interests && <p className="text-error text-xs mt-1.5">{errors.interests.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-heading mb-2">
              Total Estimasi Anggaran
            </label>
            <div className={`flex items-stretch rounded-xl border overflow-hidden transition-shadow ${errors.budget ? "border-border-error focus-within:ring-1 focus-within:ring-border-error" : "border-border-default focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary"}`}>
              <div className="bg-brand-primary text-text-light px-5 flex items-center justify-center font-semibold text-sm">
                Rp
              </div>
              <input 
                type="text" 
                placeholder="Contoh: 5.000.000"
                {...register("budget")}
                className="flex-1 py-3 px-4 bg-bg-main text-sm font-medium outline-none"
              />
            </div>
            {errors.budget && <p className="text-error text-xs mt-1.5">{errors.budget.message}</p>}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-light font-semibold text-[15px] py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Buat Rencana Perjalanan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}