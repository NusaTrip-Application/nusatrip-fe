// app/profile/page.tsx
// ============================================================
// NusaTrip - User Profile Page (Informasi Pribadi)
// Stack: Next.js + TypeScript + Tailwind CSS v4
// ============================================================

"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  X,
} from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================
// TYPES
// ============================================================
interface ProfileForm {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  socialMediaInstagram: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function AvatarUpload({
  src,
  onChange,
}: {
  src: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Avatar circle */}
      <div className="relative w-[120px] h-[120px]">
        <img
          src={src}
          alt="User Avatar"
          className="w-full h-full rounded-full object-cover ring-4 ring-border-default"
        />
        {/* Camera badge */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shadow-md hover:bg-brand-primary-hover transition-colors"
        >
          <Camera size={15} className="text-white" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {/* Change photo link */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="text-brand-primary text-sm font-semibold hover:text-brand-primary-hover transition-colors"
      >
        Ubah Foto
      </button>
      <p className="text-text-muted text-xs">JPG, PNG atau GIF. Maks 2MB.</p>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}

function InputField({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-heading">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full pl-10 pr-4 py-2.5
            bg-bg-soft-gray border border-border-default rounded-lg
            text-sm font-medium text-text-heading placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus
            transition-all
          "
        />
      </div>
    </div>
  );
}

// ============================================================
// MAIN PROFILE PAGE
// ============================================================
export default function ProfilePage() {
  const [avatarSrc, setAvatarSrc] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  );

  const [form, setForm] = useState<ProfileForm>({
    namaLengkap: "Andi Wijaya",
    email: "andi.wijaya@traveler.id",
    nomorTelepon: "+62 812-3456-7890",
    socialMediaInstagram: "+62 812-3456-7890",
    passwordBaru: "••••••••••••••",
    konfirmasiPassword: "••••••••••••••",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof ProfileForm) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setForm({
      namaLengkap: "Andi Wijaya",
      email: "andi.wijaya@traveler.id",
      nomorTelepon: "+62 812-3456-7890",
      socialMediaInstagram: "+62 812-3456-7890",
      passwordBaru: "••••••••••••••",
      konfirmasiPassword: "••••••••••••••",
    });
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow px-4 md:px-8 py-8 md:py-12 max-w-[1100px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-heading tracking-tight">
            Informasi Pribadi
          </h1>
          <p className="text-text-body text-sm mt-1">
            Perbarui detail profil dan preferensi akun Anda di sini.
          </p>
        </div>

        {/* ── Card 1: Personal Info ── */}
        <div className="bg-bg-surface border border-border-default rounded-xl shadow-sm mb-6 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Avatar */}
            <div className="md:w-[220px] flex-shrink-0 border border-border-default rounded-xl bg-bg-soft-gray/40 flex items-center justify-center">
              <AvatarUpload src={avatarSrc} onChange={setAvatarSrc} />
            </div>

            {/* Right: Form fields */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Nama Lengkap"
                icon={<User size={16} />}
                value={form.namaLengkap}
                onChange={set("namaLengkap")}
                placeholder="Masukkan nama lengkap"
              />
              <InputField
                label="Alamat Email"
                icon={<Mail size={16} />}
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder="Masukkan email"
              />
              <InputField
                label="Nomor Telepon"
                icon={<Phone size={16} />}
                value={form.nomorTelepon}
                onChange={set("nomorTelepon")}
                type="tel"
                placeholder="+62 xxx-xxxx-xxxx"
              />
              <InputField
                label="Social Media (Instagram)"
                icon={<InstagramIcon size={16} />}
                value={form.socialMediaInstagram}
                onChange={set("socialMediaInstagram")}
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        {/* ── Card 2: Change Password ── */}
        <div className="bg-bg-surface border border-border-default rounded-xl shadow-sm mb-8 p-6 md:p-8">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-1">
            <Lock size={18} className="text-error" />
            <h2 className="text-lg font-bold text-error">
              Ubah Password (Opsional)
            </h2>
          </div>
          <p className="text-error text-sm mb-6 font-medium">
            Hanya isi kolom di bawah ini jika Anda ingin mengganti password.
            Biarkan kosong untuk tetap menggunakan password lama.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Password Baru"
              icon={<Lock size={16} />}
              value={form.passwordBaru}
              onChange={set("passwordBaru")}
              type="password"
              placeholder="Masukkan password baru"
            />
            <InputField
              label="Konfirmasi Password"
              icon={<Lock size={16} />}
              value={form.konfirmasiPassword}
              onChange={set("konfirmasiPassword")}
              type="password"
              placeholder="Konfirmasi password baru"
            />
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="
              flex items-center gap-2 px-6 py-2.5
              border border-border-strong rounded-lg
              text-sm font-semibold text-text-heading
              hover:bg-bg-hover transition-colors
            "
          >
            <X size={15} />
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="
              flex items-center gap-2 px-6 py-2.5
              bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70
              rounded-lg text-sm font-semibold text-white
              transition-colors shadow-sm
            "
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : saved ? (
              <>✓ Tersimpan!</>
            ) : (
              <>
                <Save size={15} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
