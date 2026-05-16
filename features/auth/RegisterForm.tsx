"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Eye, EyeOff, Mail, Lock, User, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log("Data Register Valid:", data);
    alert("Pendaftaran sukses! Mengarahkan ke halaman Login...");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-bg-main">
      <div className="hidden md:flex w-1/2 relative flex-col justify-center p-12 lg:p-16 text-text-light overflow-hidden bg-black">
        <img 
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&auto=format&fit=crop&q=60" 
          alt="Pemandangan Alam" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="absolute top-12 left-12 lg:top-16 lg:left-16 z-20 flex items-center gap-2.5">
          <MapPin className="text-text-light md:w-7 md:h-7" size={24} />
          <span className="font-bold text-2xl tracking-tight text-text-light">NusaTrip</span>
        </div>
        
        <div className="relative z-10 -mt-10">
          <h1 className="text-[48px] font-serif leading-[1.2] -tracking-[0.02em] mb-4 font-bold drop-shadow-md">
            Jelajahi Keindahan <br /> Indonesia Bersama <br /> NusaTrip.
          </h1>
          <p className="text-base font-semibold leading-[1.5] text-text-light/90 max-w-md drop-shadow-sm">
            Rencanakan itinerary perjalanan Anda dengan lebih mudah, temukan inspirasi destinasi, dan susun trip terbaik di seluruh Indonesia.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col p-8 bg-bg-main h-screen overflow-y-auto">
        <div className="m-auto w-full max-w-[420px] flex-1 flex flex-col justify-center py-8">
          <h2 className="text-[32px] font-bold leading-[1.3] -tracking-[0.01em] text-text-heading mb-1.5">Buat Akun Baru</h2>
          <p className="text-sm font-medium leading-[1.5] text-text-body mb-8">Lengkapi data di bawah ini untuk memulai perjalanan Anda.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium leading-[1.4] text-text-heading uppercase tracking-wide mb-2">Nama Lengkap</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.fullName ? "text-error" : "text-text-muted"}`} size={18} />
                <input 
                  type="text" 
                  placeholder="Contoh: Budi Santoso" 
                  {...register("fullName")}
                  className={`w-full pl-11 pr-4 py-3 rounded-md border bg-bg-surface focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                />
              </div>
              {errors.fullName && <p className="text-error text-xs mt-1.5 font-medium">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium leading-[1.4] text-text-heading uppercase tracking-wide mb-2">Alamat Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? "text-error" : "text-text-muted"}`} size={18} />
                <input 
                  type="email" 
                  placeholder="nama@email.com" 
                  {...register("email")}
                  className={`w-full pl-11 pr-4 py-3 rounded-md border bg-bg-surface focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                />
              </div>
              {errors.email && <p className="text-error text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium leading-[1.4] text-text-heading uppercase tracking-wide mb-2">Kata Sandi</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? "text-error" : "text-text-muted"}`} size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min. 8 karakter" 
                  {...register("password")}
                  className={`w-full pl-11 pr-12 py-3 rounded-md border bg-bg-surface focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium leading-[1.4] text-text-heading uppercase tracking-wide mb-2">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <RefreshCw className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? "text-error" : "text-text-muted"}`} size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Ulangi kata sandi" 
                  {...register("confirmPassword")}
                  className={`w-full pl-11 pr-12 py-3 rounded-md border bg-bg-surface focus:outline-none focus:ring-1 text-sm font-medium transition-shadow ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border-default focus:border-border-focus focus:ring-border-focus"}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-error text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <div className="flex items-start gap-2.5 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  {...register("terms")}
                  className={`mt-0.5 w-4 h-4 rounded-sm border-border-strong text-brand-primary focus:ring-border-focus ${errors.terms ? "border-border-error" : ""}`} 
                />
                <label htmlFor="terms" className="text-[13px] font-medium text-text-body leading-[1.5] cursor-pointer">
                  Saya setuju dengan <Link href="#" className="text-brand-primary font-semibold hover:underline">Syarat & Ketentuan</Link> serta <Link href="#" className="text-brand-primary font-semibold hover:underline">Kebijakan Privasi</Link> NusaTrip.
                </label>
              </div>
              {errors.terms && <p className="text-error text-xs mt-1.5 font-medium">{errors.terms.message}</p>}
            </div>

            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-light font-semibold py-3.5 rounded-md transition-colors mt-2 text-sm shadow-sm">
              Daftar Sekarang
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-border-default flex-1"></div>
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Atau daftar dengan</span>
            <div className="h-px bg-border-default flex-1"></div>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-bg-surface border border-border-default rounded-md hover:bg-bg-hover transition-colors text-sm font-semibold text-text-body shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Google
            </button>
          </div>

          <p className="text-center text-sm font-medium text-text-body">
            Sudah punya akun? <Link href="/login" className="text-brand-primary font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}