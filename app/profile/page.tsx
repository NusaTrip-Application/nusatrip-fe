"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Eye,
  EyeOff,
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

interface ProfileForm {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  socialMediaInstagram: string;
  passwordLama: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

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

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto terlalu besar! Harap pilih foto di bawah 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative w-[120px] h-[120px]">
        <img
          src={src}
          alt="User Avatar"
          className="w-full h-full rounded-full object-cover ring-4 ring-border-default"
        />
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
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
}

function InputField({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder = "",
  autoComplete,
  disabled = false,
  error,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-heading">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {icon}
        </span>
        <input
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full pl-10 ${isPasswordField ? "pr-12" : "pr-4"} py-2.5
            bg-bg-soft-gray border rounded-lg
            text-sm font-medium text-text-heading placeholder:text-text-muted
            focus:outline-none focus:ring-2 
            ${error ? "border-error focus:border-error focus:ring-error" : "border-border-default focus:border-border-focus focus:ring-border-focus"}
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all
            [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
          `}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-error text-xs font-medium">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [avatarSrc, setAvatarSrc] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  );

  const [form, setForm] = useState<ProfileForm>({
    namaLengkap: "Andi Wijaya",
    email: "andi.wijaya@traveler.id",
    nomorTelepon: "",
    socialMediaInstagram: "",
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("nusatrip_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setForm(prev => ({
          ...prev,
          namaLengkap: user.namaLengkap || prev.namaLengkap,
          email: user.email || prev.email,
          nomorTelepon: user.nomorTelepon !== undefined ? user.nomorTelepon : prev.nomorTelepon,
          socialMediaInstagram: user.socialMediaInstagram !== undefined ? user.socialMediaInstagram : prev.socialMediaInstagram,
        }));
        if (user.avatarSrc) {
          setAvatarSrc(user.avatarSrc);
        }
        if (user.password) {
          setStoredPassword(user.password);
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof ProfileForm) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    let newErrors: Partial<Record<keyof ProfileForm, string>> = {};

    if (form.namaLengkap.length < 3) {
      newErrors.namaLengkap = "Nama lengkap minimal 3 karakter";
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (form.nomorTelepon) {
      if (!/^[+]?[\d\s-]{9,16}$/.test(form.nomorTelepon)) {
        newErrors.nomorTelepon = "Format nomor telepon tidak valid (9-15 digit)";
      }
    }

    if (form.passwordBaru) {
      if (form.passwordBaru.length < 8) {
        newErrors.passwordBaru = "Kata sandi minimal 8 karakter";
      }
      if (form.passwordBaru !== form.konfirmasiPassword) {
        newErrors.konfirmasiPassword = "Kata sandi tidak cocok";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));

    // Save changes to localStorage
    const newPassword = form.passwordBaru || storedPassword;
    const userData = {
      namaLengkap: form.namaLengkap,
      email: form.email,
      nomorTelepon: form.nomorTelepon,
      socialMediaInstagram: form.socialMediaInstagram,
      avatarSrc: avatarSrc,
      password: newPassword,
    };
    localStorage.setItem("nusatrip_user", JSON.stringify(userData));
    window.dispatchEvent(new Event("user-updated"));
    if (newPassword) {
      setStoredPassword(newPassword);
    }

    setForm(prev => ({
      ...prev,
      passwordLama: "",
      passwordBaru: "",
      konfirmasiPassword: "",
    }));

    setIsSaving(false);
    alert("Perubahan profil berhasil disimpan!");
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow px-4 md:px-8 py-8 md:py-12 max-w-[1100px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-heading tracking-tight">
            Informasi Pribadi
          </h1>
          <p className="text-text-body text-sm mt-1">
            Perbarui detail profil dan preferensi akun Anda di sini.
          </p>
        </div>

        <div className="bg-bg-surface border border-border-default rounded-xl shadow-sm mb-6 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-[220px] flex-shrink-0 border border-border-default rounded-xl bg-bg-soft-gray/40 flex items-center justify-center">
              <AvatarUpload src={avatarSrc} onChange={setAvatarSrc} />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Nama Lengkap"
                icon={<User size={16} />}
                value={form.namaLengkap}
                onChange={set("namaLengkap")}
                placeholder="Masukkan nama lengkap"
                error={errors.namaLengkap}
              />
              <InputField
                label="Alamat Email"
                icon={<Mail size={16} />}
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder="Masukkan email"
                error={errors.email}
              />
              <InputField
                label="Nomor Telepon"
                icon={<Phone size={16} />}
                value={form.nomorTelepon}
                onChange={set("nomorTelepon")}
                placeholder="+62 xxx-xxxx-xxxx"
                error={errors.nomorTelepon}
              />
              <InputField
                label="Social Media (Instagram)"
                icon={<InstagramIcon size={16} />}
                value={form.socialMediaInstagram}
                onChange={set("socialMediaInstagram")}
                placeholder="@username"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="bg-bg-surface border border-border-default rounded-xl shadow-sm mb-8 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={18} className="text-error" />
            <h2 className="text-lg font-bold text-error">
              Ubah Password (Opsional)
            </h2>
          </div>
          <p className="text-error text-sm mb-6 font-medium">
            Hanya isi kolom di bawah ini jika Anda ingin mengganti password.
            Biarkan kosong untuk tetap menggunakan password lama.
            <span className="block mt-1.5 text-text-muted text-xs font-normal">
              *Kolom password baru akan terbuka setelah Anda memasukkan Password Lama dengan benar.
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <input type="text" autoComplete="username" className="hidden" />
            <InputField
              label="Password Lama"
              icon={<Lock size={16} />}
              value={form.passwordLama}
              onChange={set("passwordLama")}
              type="password"
              placeholder="Masukkan password lama"
              autoComplete="new-password"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Password Baru"
              icon={<Lock size={16} />}
              value={form.passwordBaru}
              onChange={set("passwordBaru")}
              type="password"
              placeholder="Masukkan password baru"
              autoComplete="new-password"
              disabled={!form.passwordLama || storedPassword === null || form.passwordLama !== storedPassword}
              error={errors.passwordBaru}
            />
            <InputField
              label="Konfirmasi Password"
              icon={<Lock size={16} />}
              value={form.konfirmasiPassword}
              onChange={set("konfirmasiPassword")}
              type="password"
              placeholder="Konfirmasi password baru"
              autoComplete="new-password"
              disabled={!form.passwordLama || storedPassword === null || form.passwordLama !== storedPassword}
              error={errors.konfirmasiPassword}
            />
          </div>
        </div>
        =
        <div className="flex items-center justify-end">
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
