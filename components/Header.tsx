"use client";

import {
  MapPin,
  Search,
  Bell,
  Menu,
  ChevronDown,
  Settings,
  Bookmark,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { getMyProfile, logoutUser } from "@/services/auth";

function HeaderSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") || "" : "";
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(query.toLowerCase() === "semua" ? "" : query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim() ? inputValue.trim() : "Semua";
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-text-body transition-colors"
        size={18}
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Cari lokasi (kota)..."
        className="pl-10 pr-4 py-2 bg-[#F3F3FE] border border-border-default rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-border-focus w-72 xl:w-96 transition-shadow"
      />
    </form>
  );
}

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  active?: boolean;
}

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const items: DropdownItem[] = [
    {
      icon: <Settings size={16} />,
      label: "Pengaturan",
      href: "/profile",
      active: true,
    },
    {
      icon: <Bookmark size={16} />,
      label: "Saved References",
      href: "/saved-references",
    },
    {
      icon: <LogOut size={16} />,
      label: "Log Out",
      danger: false,
      onClick: async () => {
        try {
          await logoutUser();
        } catch {
        }
        router.push("/login");
        onClose();
      },
    },
  ];

  return (
    <div
      className="
        absolute right-0 top-[calc(100%+10px)] z-50
        w-[190px] bg-bg-surface
        rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        border border-border-default
        overflow-hidden
        animate-in fade-in slide-in-from-top-1 duration-150
      "
    >
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && <div className="h-px bg-border-default mx-3" />}
          {item.href ? (
            <Link
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-2.5 px-4 py-3 text-sm font-semibold
                transition-colors
                ${item.active
                  ? "bg-brand-primary text-white"
                  : "text-text-heading hover:bg-bg-hover"
                }
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className={`
                w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left
                transition-colors
                ${item.danger ? "text-error hover:bg-red-50" : "text-text-heading hover:bg-bg-hover"}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userName, setUserName] = useState("Memuat profil...");
  const [userAvatar, setUserAvatar] = useState(
    "https://ui-avatars.com/api/?name=User&background=F3F3FE&color=5855E9"
  );

useEffect(() => {
    const fetchUserAndStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        setIsLoggedIn(true);

        try {
          const response = await getMyProfile();
          const userData = response.data;

          if (userData.fullName) setUserName(userData.fullName);
          if (userData.profilePhotoUrl) {
            const finalAvatar = userData.profilePhotoUrl.startsWith('http') 
              ? userData.profilePhotoUrl 
              : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${userData.profilePhotoUrl}`;
            setUserAvatar(finalAvatar);
          }

        } catch (error) {
          console.error("Gagal mengambil data profil di Header:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    fetchUserAndStatus();

    window.addEventListener("user-updated", fetchUserAndStatus);
    return () => window.removeEventListener("user-updated", fetchUserAndStatus);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/my-plans", label: "My Plans" },
    { href: "/community", label: "Community" },
  ];

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-bg-surface border-b border-border-default sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-text-body hover:text-text-heading transition-colors">
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center gap-1.5 md:gap-2">
          <MapPin className="text-brand-primary md:w-7 md:h-7" size={24} />
          <span className="text-lg md:text-2xl font-bold text-text-heading tracking-tight">
            NusaTrip
          </span>
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-body">
        {navLinks.map(({ href, label }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`pb-1 transition-colors ${active
                  ? "text-brand-primary border-b-2 border-brand-primary"
                  : "hover:text-brand-primary-hover"
                }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden lg:block">
          <Suspense
            fallback={
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari lokasi (kota)..."
                  className="pl-10 pr-4 py-2 bg-[#F3F3FE] border border-border-default rounded-md text-sm font-medium w-72 xl:w-96"
                  disabled
                />
              </div>
            }
          >
            <HeaderSearchInput />
          </Suspense>
        </div>

        <button className="text-text-body hover:text-brand-primary transition-colors">
          <Bell size={20} />
        </button>

        {isLoggedIn ? (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            >
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover shadow-sm ring-1 ring-border-default"
              />
              <div className="hidden lg:flex items-center gap-1">
                <span className="text-sm font-semibold text-text-heading group-hover:text-brand-primary transition-colors">
                  {userName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {dropdownOpen && (
              <ProfileDropdown onClose={() => setDropdownOpen(false)} />
            )}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-3">
             <Link 
               href="/login" 
               className="px-4 py-2 text-sm font-semibold text-brand-primary border border-brand-primary rounded-md hover:bg-brand-primary/10 transition-colors"
             >
               Masuk
             </Link>
             <Link 
               href="/register" 
               className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-primary-hover transition-colors"
             >
               Daftar
             </Link>
          </div>
        )}
      </div>
    </header>
  );
}
