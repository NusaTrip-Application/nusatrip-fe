"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { User, Mail, Phone, Lock, Camera, Save, Eye, EyeOff, X, CheckCircle2, AlertCircle } from "lucide-react";
import { getMyProfile, updateMyProfile, loginUser } from "@/services/auth";
import api from "@/lib/axios";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function AvatarUpload({ src, onChange, onError }: { src: string; onChange: (url: string, file?: File) => void; onError: (msg: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      onError("Ukuran foto terlalu besar! Harap pilih foto di bawah 2MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string, file);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative w-[120px] h-[120px]">
        <img src={src} alt="User Avatar" className="w-full h-full rounded-full object-cover ring-4 ring-border-default" />
        <button type="button" onClick={() => fileRef.current?.click()} className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shadow-md hover:bg-brand-primary-hover transition-colors">
          <Camera size={15} className="text-white" />
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif" className="hidden" onChange={handleFile} />
      </div>
      <button type="button" onClick={() => fileRef.current?.click()} className="text-brand-primary text-sm font-semibold hover:text-brand-primary-hover transition-colors">
        Ubah Foto
      </button>
      <p className="text-text-muted text-xs">JPG, PNG atau GIF. Maks 2MB.</p>
    </div>
  );
}

interface InputFieldProps {
  label: string; icon: React.ReactNode; value: string; onChange: (val: string) => void; type?: string; placeholder?: string; autoComplete?: string; disabled?: boolean; error?: string;
}

function InputField({ label, icon, value, onChange, type = "text", placeholder = "", autoComplete, disabled = false, error }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-heading">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>
        <input
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          value={value} placeholder={placeholder} autoComplete={autoComplete} disabled={disabled} onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 ${isPasswordField ? "pr-12" : "pr-4"} py-2.5 bg-bg-soft-gray border rounded-lg text-sm font-medium text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 ${error ? "border-error focus:border-error focus:ring-error" : "border-border-default focus:border-brand-primary focus:ring-brand-primary/20"} disabled:opacity-60 disabled:cursor-not-allowed transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden`}
        />
        {isPasswordField && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body transition-colors">
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  
  const [avatarSrc, setAvatarSrc] = useState("https://ui-avatars.com/api/?name=User&background=F3F3FE&color=5855E9");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    namaLengkap: "", email: "", nomorTelepon: "", socialMediaInstagram: "", passwordLama: "", passwordBaru: "", konfirmasiPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await getMyProfile();
        const apiData = response.data; 
        
        setForm(prev => ({
          ...prev,
          namaLengkap: apiData.fullName || "",
          email: apiData.email || "",
          nomorTelepon: apiData.phoneNumber || "",
          socialMediaInstagram: apiData.instagramUsername || "",
        }));

        setOriginalEmail(apiData.email || "");

        if (apiData.profilePhotoUrl) {
          const finalAvatar = apiData.profilePhotoUrl.startsWith('http') 
            ? apiData.profilePhotoUrl 
            : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${apiData.profilePhotoUrl}`;
          setAvatarSrc(finalAvatar);
        } else {
          setAvatarSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(apiData.fullName || 'User')}&background=F3F3FE&color=5855E9`);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        showToast("Sesi Anda mungkin telah habis. Silakan login kembali.", "error");
        router.push("/login");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const set = (key: keyof ProfileForm) => (val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const verifyOldPassword = async () => {
    if (!form.passwordLama) {
      setErrors(prev => ({ ...prev, passwordLama: "Password lama wajib diisi" }));
      return;
    }
    
    setIsVerifyingPassword(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: originalEmail, password: form.passwordLama })
      });
      
      if (!res.ok) throw new Error("Password lama salah");

      setIsOldPasswordVerified(true);
      setErrors(prev => ({ ...prev, passwordLama: undefined }));
      showToast("Password lama berhasil diverifikasi. Silakan masukkan password baru.", "success");
    } catch (error: any) {
      setIsOldPasswordVerified(false);
      setErrors(prev => ({ ...prev, passwordLama: "Password lama salah" }));
      showToast("Verifikasi gagal: Password lama salah", "error");
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleSave = async () => {
    let newErrors: Partial<Record<keyof ProfileForm, string>> = {};

    if (form.namaLengkap.length < 3) newErrors.namaLengkap = "Nama lengkap minimal 3 karakter";
    if (form.nomorTelepon && !/^[+]?[\d\s-]{9,16}$/.test(form.nomorTelepon)) newErrors.nomorTelepon = "Format nomor telepon tidak valid";
    
    if (form.passwordBaru || form.passwordLama) {
      if (!form.passwordLama) newErrors.passwordLama = "Password lama wajib diisi";
      if (!form.passwordBaru) newErrors.passwordBaru = "Password baru wajib diisi";
      if (form.passwordBaru && form.passwordBaru.length < 8) newErrors.passwordBaru = "Kata sandi minimal 8 karakter";
      if (form.passwordBaru !== form.konfirmasiPassword) newErrors.konfirmasiPassword = "Kata sandi tidak cocok";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Harap periksa kembali form Anda", "error");
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      let finalProfilePhotoUrl = undefined;

      if (avatarFile) {
        const presignedRes = await api.post('/media/presigned-url', {
          filename: avatarFile.name,
          mimetype: avatarFile.type,
          size: avatarFile.size,
          folder: "user"
        });
        
        const uploadData = presignedRes.data?.data || presignedRes.data;
        const uploadUrl = uploadData.uploadUrl || uploadData.presignedUrl || uploadData.url;
        const fileKey = uploadData.tempKey || uploadData.fileKey || uploadData.key || uploadData.path;
        
        if (uploadUrl && fileKey) {
          const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': avatarFile.type
            },
            body: avatarFile
          });

          if (!uploadRes.ok) {
            throw new Error("Gagal mengunggah foto profil ke server penyimpanan.");
          }

          finalProfilePhotoUrl = fileKey;
        } else {
          throw new Error("Gagal mendapatkan URL unggahan yang valid.");
        }
      }

      const payload: any = {
        fullName: form.namaLengkap,
        email: form.email,
        phoneNumber: form.nomorTelepon,
        instagramUsername: form.socialMediaInstagram
      };
      
      if (form.passwordBaru) {
        payload.password = form.passwordBaru;
        payload.oldPassword = form.passwordLama;
      }

      if (finalProfilePhotoUrl) {
        payload.profilePhotoUrl = finalProfilePhotoUrl;
      }

      await updateMyProfile(payload);

      setForm(prev => ({ ...prev, passwordLama: "", passwordBaru: "", konfirmasiPassword: "" }));
      setAvatarFile(null);
      setIsOldPasswordVerified(false);
      showToast("Perubahan profil berhasil disimpan ke server!", "success");
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Save error:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan.";
      showToast("Gagal menyimpan profil: " + (typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage), "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitialLoading) {
    return <div className="min-h-screen flex items-center justify-center font-sans">Memuat profil...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />
      <main className="flex-grow px-4 md:px-8 py-8 md:py-12 max-w-[1100px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-heading tracking-tight">Informasi Pribadi</h1>
          <p className="text-text-body text-sm mt-1">Perbarui detail profil dan preferensi akun Anda di sini.</p>
        </div>

        <div className="bg-bg-surface border border-border-default rounded-xl shadow-sm mb-6 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-[220px] flex-shrink-0 border border-border-default rounded-xl bg-bg-soft-gray/40 flex items-center justify-center">
              <AvatarUpload 
                src={avatarSrc} 
                onChange={(url, file) => {
                  setAvatarSrc(url);
                  if (file) setAvatarFile(file);
                }} 
                onError={(msg) => showToast(msg, "error")} 
              />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Nama Lengkap" icon={<User size={16} />} value={form.namaLengkap} onChange={set("namaLengkap")} placeholder="Masukkan nama lengkap" error={errors.namaLengkap} />
              <InputField label="Alamat Email" icon={<Mail size={16} />} value={form.email} onChange={set("email")} type="email" placeholder="Masukkan alamat email" />
              <InputField label="Nomor Telepon" icon={<Phone size={16} />} value={form.nomorTelepon} onChange={set("nomorTelepon")} placeholder="0812xxxxxxxx" error={errors.nomorTelepon} />
              <InputField label="Social Media (Instagram)" icon={<InstagramIcon size={16} />} value={form.socialMediaInstagram} onChange={set("socialMediaInstagram")} placeholder="username_ig" autoComplete="off" />
            </div>
          </div>
        </div>

        <div className="bg-bg-surface border border-border-default rounded-xl shadow-sm mb-8 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={18} className="text-text-muted" />
            <h2 className="text-lg font-bold text-text-heading">Ubah Password</h2>
          </div>
          <p className="text-text-muted text-sm mb-6 font-medium">
            Biarkan kosong jika Anda tidak ingin mengganti password saat menyimpan perubahan profil.
          </p>

          <div className="flex flex-col sm:flex-row items-end gap-3 mb-5">
            <div className="flex-1 w-full">
              <input type="text" autoComplete="username" className="hidden" />
              <InputField 
                label="Password Lama" 
                icon={isOldPasswordVerified ? <CheckCircle2 size={16} className="text-success" /> : <Lock size={16} />} 
                value={form.passwordLama} 
                onChange={(val) => {
                  set("passwordLama")(val);
                  if (isOldPasswordVerified) setIsOldPasswordVerified(false);
                }} 
                type="password" 
                placeholder="Masukkan password lama" 
                autoComplete="new-password" 
                error={errors.passwordLama}
                disabled={isOldPasswordVerified}
              />
            </div>
            {!isOldPasswordVerified ? (
              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="text-sm font-medium text-transparent select-none hidden sm:block">x</label>
                <button
                  type="button"
                  onClick={verifyOldPassword}
                  disabled={isVerifyingPassword || !form.passwordLama}
                  className="px-5 py-[11px] bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {isVerifyingPassword ? "..." : "Verifikasi"}
                </button>
              </div>
            ) : (
              <div />
            )}
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
              disabled={!isOldPasswordVerified} 
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
              disabled={!isOldPasswordVerified} 
              error={errors.konfirmasiPassword} 
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button type="button" onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70 rounded-lg text-sm font-semibold text-white transition-colors shadow-sm">
            {isSaving ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
            ) : (
              <><Save size={15} /> Simpan Perubahan</>
            )}
          </button>
        </div>
      </main>

      <Footer />
      <MobileNav />

      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border min-w-[300px] max-w-[400px] bg-bg-surface ${toast.type === "success" ? "border-green-200" : toast.type === "error" ? "border-red-200" : "border-blue-200"}`}>
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <CheckCircle2 size={18} className="text-green-500" />
              ) : toast.type === "error" ? (
                <AlertCircle size={18} className="text-error" />
              ) : (
                <AlertCircle size={18} className="text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-[13px] font-bold mb-0.5 ${toast.type === "success" ? "text-green-700" : toast.type === "error" ? "text-red-700" : "text-blue-700"}`}>
                {toast.type === "success" ? "Berhasil" : toast.type === "error" ? "Terjadi Kesalahan" : "Info"}
              </p>
              <p className="text-text-body text-[13px] leading-relaxed pr-2">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="shrink-0 text-text-muted hover:text-text-heading transition-colors bg-bg-soft-gray hover:bg-bg-hover rounded-full p-1 mt-0.5">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}