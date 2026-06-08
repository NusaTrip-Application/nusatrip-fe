"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, Settings } from "lucide-react";
import {
  getAdminUsers,
  getAdminUserSummary,
  adminCreateUser,
  adminUpdateUser,
  adminChangeUserStatus,
  adminDeleteUser,
  type AdminUser,
  type AdminUsersMetadata,
  type AdminUserSummary,
  type AccountStatus,
  type AdminCreateUserPayload,
} from "@/services/accounts";

// ─── SVG Icons ──────────────────────────────────────────────────────────────────

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-[22px] h-[22px] text-white"} fill="none" viewBox="0 0 22 22">
    <path d="M15.5833 19.25V17.4167C15.5833 16.4442 15.197 15.5116 14.5094 14.8239C13.8218 14.1363 12.8891 13.75 11.9167 13.75H4.58333C3.61087 13.75 2.67824 14.1363 1.99062 14.8239C1.30298 15.5116 0.916664 16.4442 0.916664 17.4167V19.25" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.25 10.0833C10.2751 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39163 10.2751 2.75 8.25 2.75C6.22496 2.75 4.58333 4.39163 4.58333 6.41667C4.58333 8.44171 6.22496 10.0833 8.25 10.0833Z" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.0833 19.25V17.4167C21.0827 16.6005 20.8175 15.8072 20.3284 15.1577C19.8393 14.5083 19.1533 14.0385 18.3742 13.8183" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.6667 2.81836C15.4478 3.03741 16.136 3.50737 16.6265 4.15788C17.1171 4.80839 17.3829 5.60338 17.3829 6.42127C17.3829 7.23916 17.1171 8.03415 16.6265 8.68466C16.136 9.33517 15.4478 9.80513 14.6667 10.0242" stroke="currentColor" strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <Bell className="w-5 h-5 text-text-body" />
);

const SettingsIcon = () => (
  <Settings className="w-5 h-5 text-text-body" />
);

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" fill="none" viewBox="0 0 18 18">
    <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25ZM15.75 15.75L12.525 12.525" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-bg-surface rounded-xl p-6 border border-border-default shadow-sm">
      <div className="mb-4">{icon}</div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="font-serif text-2xl text-text-heading">{value}</p>
    </div>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────────────────

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';

function getAvatarUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STORAGE_URL}/${url}`;
}

function UserAvatar({ user, size = 'md' }: { user: AdminUser; size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-[11px]' : size === 'lg' ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-sm';
  const avatarUrl = getAvatarUrl(user.profilePhotoUrl);
  const initials = user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={user.fullName}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-border-default flex-shrink-0`}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-border-default`}>
      {initials}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AccountStatus }) {
  const map: Record<AccountStatus, { label: string; className: string }> = {
    ACTIVE: { label: 'AKTIF', className: 'bg-success/10 text-success' },
    INACTIVE: { label: 'NONAKTIF', className: 'bg-border-default/60 text-text-muted' },
    BANNED: { label: 'NONAKTIF', className: 'bg-border-default/60 text-text-muted' },
  };
  const { label, className } = map[status] || map.INACTIVE;
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide ${className}`}>
      {label}
    </span>
  );
}

// ─── Table Row Skeleton ──────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <div className="px-6 py-4 animate-pulse">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-soft-blue flex-shrink-0" />
          <div className="h-4 bg-bg-soft-blue rounded w-32" />
        </div>
        <div className="col-span-4"><div className="h-4 bg-bg-soft-blue rounded w-40" /></div>
        <div className="col-span-2"><div className="h-4 bg-bg-soft-blue rounded w-20" /></div>
        <div className="col-span-1"><div className="h-6 bg-bg-soft-blue rounded w-16" /></div>
        <div className="col-span-1 flex justify-end gap-2">
          <div className="w-7 h-7 bg-bg-soft-blue rounded" />
          <div className="w-7 h-7 bg-bg-soft-blue rounded" />
          <div className="w-7 h-7 bg-bg-soft-blue rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── User Modal (View / Create / Edit) ──────────────────────────────────────────

type ModalMode = 'view' | 'create' | 'edit';

interface UserModalProps {
  mode: ModalMode;
  user?: AdminUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

function UserModal({ mode, user, onClose, onSuccess }: UserModalProps) {
  const isView = mode === 'view';
  const isCreate = mode === 'create';

  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    password: '',
    confirmPassword: '',
    phoneNumber: user?.phoneNumber ?? '',
    instagramUsername: user?.instagramUsername ?? '',
    accountStatus: (user?.accountStatus ?? 'ACTIVE') as AccountStatus,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const title = isCreate ? 'Tambah User' : isView ? 'Detail User' : 'Edit User';
  const submitLabel = isCreate ? 'Tambah User' : 'Simpan Perubahan';

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (isView) { onClose(); return; }

    if (!form.fullName.trim()) { setError('Nama lengkap wajib diisi.'); return; }
    if (!form.email.trim()) { setError('Email wajib diisi.'); return; }
    
    if (isCreate) {
      if (!form.password || form.password.length < 8) { setError('Password minimal 8 karakter.'); return; }
      if (form.password !== form.confirmPassword) { setError('Password tidak sama.'); return; }
    }

    setLoading(true);
    setError(null);
    try {
      if (isCreate) {
        const payload: AdminCreateUserPayload = {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          accountStatus: form.accountStatus,
          ...(form.phoneNumber && { phoneNumber: form.phoneNumber }),
          ...(form.instagramUsername && { instagramUsername: form.instagramUsername }),
        };
        await adminCreateUser(payload);
      } else if (user) {
        await adminUpdateUser(user.userId, {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          ...(form.phoneNumber && { phoneNumber: form.phoneNumber }),
          ...(form.instagramUsername && { instagramUsername: form.instagramUsername }),
        });
        if (form.accountStatus !== user.accountStatus) {
          await adminChangeUserStatus(user.userId, form.accountStatus);
        }
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (disabled?: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-colors ${
      disabled
        ? 'bg-bg-soft-blue border-border-default text-text-muted cursor-not-allowed'
        : 'bg-bg-surface border-border-default text-text-heading focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
    }`;

  const labelClass = 'block text-sm font-bold text-text-heading mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 py-5 border-b border-border-default flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-heading">{title}</h2>
            {user && (
              <p className="text-[12px] text-text-muted mt-0.5">ID: #{user.userId.substring(0, 8).toUpperCase()}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:bg-bg-hover hover:text-text-heading rounded-xl transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Avatar (view only) */}
          {isView && user && (
            <div className="flex items-center gap-4 p-4 bg-bg-soft-blue rounded-xl border border-border-default mb-2">
              <UserAvatar user={user} size="lg" />
              <div>
                <p className="font-bold text-text-heading text-lg">{user.fullName}</p>
                <p className="text-sm text-text-muted">{user.email}</p>
                <div className="mt-1.5"><StatusBadge status={user.accountStatus} /></div>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className={labelClass}>
              Nama Lengkap {!isView && <span className="text-error">*</span>}
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap user"
              value={form.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              disabled={isView}
              className={inputClass(isView)}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              Email {!isView && <span className="text-error">*</span>}
            </label>
            <input
              type="email"
              placeholder="Masukkan email user"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              disabled={isView}
              className={inputClass(isView)}
            />
          </div>

          {/* Password (create only) */}
          {isCreate && (
            <>
              <div>
                <label className={labelClass}>
                  Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    className={inputClass(false) + ' pr-11'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading">
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18"><path d="M9 3.75C5.25 3.75 2.0625 6.1875 0.75 9.5625C2.0625 12.9375 5.25 15.375 9 15.375C12.75 15.375 15.9375 12.9375 17.25 9.5625C15.9375 6.1875 12.75 3.75 9 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12.1875C10.7607 12.1875 12.1875 10.7607 12.1875 9C12.1875 7.23934 10.7607 5.8125 9 5.8125C7.23934 5.8125 5.8125 7.23934 5.8125 9C5.8125 10.7607 7.23934 12.1875 9 12.1875Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 18 18"><path d="M1.5 1.5L16.5 16.5M7.4325 7.4325C7.16146 7.70351 7.00996 8.07051 7.01013 8.45315C7.01031 8.83579 7.16214 9.20265 7.43342 9.47342C7.7047 9.74419 8.0718 9.89539 8.45444 9.89492C8.83708 9.89445 9.20381 9.74232 9.47426 9.47079M7.22175 3.09825C7.64025 3.03225 8.07 3 8.5 3C12.5 3 16 5.5 17.5 9.5C17.0775 10.5825 16.4625 11.565 15.7 12.3975M14.935 14.9275C13.4167 15.9425 11.6575 16.5 9.89925 16.5C5.89925 16.5 2.39925 14 0.899253 10C1.48975 8.4975 2.38975 7.1725 3.5185 6.09825" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Konfirmasi Password <span className="text-error">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan ulang password"
                  value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  className={inputClass(false)}
                />
              </div>
            </>
          )}

          {/* Phone */}
          <div>
            <label className={labelClass}>Nomor Telepon</label>
            <input
              type="text"
              placeholder="Contoh: 0812-3456-7890"
              value={form.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              disabled={isView}
              className={inputClass(isView)}
            />
          </div>

          {/* Instagram */}
          <div>
            <label className={labelClass}>Instagram</label>
            <input
              type="text"
              placeholder="Contoh: @username"
              value={form.instagramUsername}
              onChange={e => handleChange('instagramUsername', e.target.value)}
              disabled={isView}
              className={inputClass(isView)}
            />
          </div>

          {/* Account Status */}
          <div>
            <label className={labelClass}>
              Status Akun {!isView && <span className="text-error">*</span>}
            </label>
            {isView ? (
              <div className="px-4 py-3 rounded-xl border border-border-default bg-bg-soft-blue">
                <StatusBadge status={user!.accountStatus} />
              </div>
            ) : (
              <div className="relative">
                <select
                  value={form.accountStatus}
                  onChange={e => handleChange('accountStatus', e.target.value as AccountStatus)}
                  className={inputClass(false) + ' appearance-none pr-10'}
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Nonaktif</option>
                </select>
                <ChevronDownIcon />
              </div>
            )}
          </div>

          {/* Created At (view only) */}
          {isView && user && (
            <div className="pt-2 border-t border-border-default flex gap-6 text-xs text-text-muted">
              <span>Bergabung: <span className="font-medium text-text-body">{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-sm text-error flex-shrink-0">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-border-default text-sm font-semibold text-text-body hover:bg-bg-hover transition-colors"
          >
            {isView ? 'Tutup' : 'Batal'}
          </button>
          {!isView && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-primary hover:opacity-90 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────────

function DeleteModal({ user, onClose, onSuccess }: { user: AdminUser; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminDeleteUser(user.userId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus user.');
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
          <h3 className="font-serif text-xl text-text-heading">Hapus User?</h3>
          <p className="text-sm text-text-body">
            Apakah kamu yakin ingin menghapus user{' '}
            <span className="font-bold text-text-heading">&quot;{user.fullName}&quot;</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3 text-sm text-error mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border border-border-default text-sm font-semibold text-text-body hover:bg-bg-hover transition-colors">
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-error hover:opacity-90 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [metadata, setMetadata] = useState<AdminUsersMetadata | null>(null);
  const [summary, setSummary] = useState<AdminUserSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<AccountStatus | ''>('');
  const [sortParam, setSortParam] = useState('createdAtDesc');

  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode; user?: AdminUser | null }>({ open: false, mode: 'view' });
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: ITEMS_PER_PAGE, sortBy: sortParam };
      if (search) params.search = search;
      if (filterStatus) params.accountStatus = filterStatus;

      const res = await getAdminUsers(params);
      if (res.success) {
        setUsers(res.data.items);
        setMetadata(res.data.metadata);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterStatus, sortParam]);

  const fetchSummary = useCallback(async () => {
    try {
      const s = await getAdminUserSummary();
      setSummary(s);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (search !== trimmed) { setSearch(trimmed); setPage(1); }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const totalPages = metadata?.totalPages ?? 1;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const max = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleSuccess = () => { fetchUsers(); fetchSummary(); };

  return (
    <>
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-bg-surface border-b border-border-default shadow-sm h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md">
            <UserGroupIcon />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-text-heading leading-tight">User Management</h1>
            <p className="text-sm text-text-muted">Kelola semua data pengguna sistem</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="p-2 rounded-full hover:bg-bg-hover relative">
            <BellIcon />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-bg-hover">
            <SettingsIcon />
          </button>
          <div className="w-10 h-10 rounded-full bg-border-default overflow-hidden">
            <img src="https://i.pravatar.cc/80?img=12" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <StatCard
            label="Total User"
            value={summary?.totalUsers ?? 0}
            icon={
              <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="User Aktif"
            value={summary?.totalActiveUsers ?? 0}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24">
                <path d="M16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 20C3.85917 18.3624 5.1549 16.9891 6.74615 16.0244C8.33741 15.0596 10.1612 14.5404 12.0198 14.5214C13.8783 14.5025 15.7122 14.9847 17.3222 15.9171C18.9322 16.8494 20.256 18.1975 21.15 19.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4L12 2M20.66 7L22.07 5.59M3.34 7L1.93 5.59M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <StatCard
            label="User Non-Aktif"
            value={summary?.totalInactiveUsers ?? 0}
            icon={
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 8L23 13M23 8L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
            <SearchIcon />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama user..."
              className="w-full bg-bg-soft-blue border border-border-default rounded-xl pl-11 pr-4 py-3 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </form>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as AccountStatus | ""); setPage(1); }}
              className="bg-bg-soft-blue border border-border-default rounded-xl px-4 py-3 pr-10 text-sm text-text-heading font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 appearance-none w-full"
            >
              <option value="">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Nonaktif</option>
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
            </select>
            <ChevronDownIcon />
          </div>

          <button
            onClick={() => setModal({ open: true, mode: 'create' })}
            className="flex items-center gap-2 px-5 py-3 bg-brand-primary hover:opacity-90 text-white rounded-xl text-sm font-bold transition-colors shadow-sm h-full"
          >
            <PlusIcon /> Tambah User
          </button>
        </div>

        {/* Table */}
        <div className="bg-bg-surface rounded-2xl border border-border-default shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-bg-soft-blue border-b border-border-default px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wide">
              <div className="col-span-4">Nama User</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Tanggal Registrasi</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Aksi</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border-default">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="text-sm font-medium">Tidak ada user ditemukan</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.userId} className="px-6 py-4 hover:bg-bg-hover transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <UserAvatar user={user} />
                      <span className="font-semibold text-text-heading text-sm">{user.fullName}</span>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 text-sm text-text-body font-medium truncate">
                      {user.email}
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-sm text-text-body font-medium">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <StatusBadge status={user.accountStatus} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end gap-1">
                      <button
                        onClick={() => setModal({ open: true, mode: 'view', user })}
                        title="Lihat Detail"
                        className="p-1.5 rounded-lg hover:bg-brand-primary/10 text-brand-primary transition-colors"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => setModal({ open: true, mode: 'edit', user })}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setDeleteUser(user)}
                        title="Hapus"
                        className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors"
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
          {totalPages > 0 && (
            <div className="bg-bg-soft-blue border-t border-border-default px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-medium text-text-muted">
                Menampilkan {users.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0}–
                {Math.min(page * ITEMS_PER_PAGE, metadata?.totalItems ?? 0)} dari {metadata?.totalItems ?? 0} User
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-2 h-3" fill="currentColor" viewBox="0 0 8 12"><path d="M7.4 1.4L6 0L0 6L6 12L7.4 10.6L2.8 6L7.4 1.4Z"/></svg>
                </button>

                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition ${page === pageNum ? 'bg-brand-primary text-white' : 'text-text-heading hover:bg-bg-hover'}`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

      {/* Modals */}
      {modal.open && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={() => setModal({ open: false, mode: 'view' })}
          onSuccess={handleSuccess}
        />
      )}

      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
