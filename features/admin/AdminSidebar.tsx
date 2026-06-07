"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V9.16667C2.5 9.6269 2.8731 10 3.33333 10H7.5C7.96024 10 8.33333 9.6269 8.33333 9.16667V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.6667 2.5H12.5C12.0398 2.5 11.6667 2.8731 11.6667 3.33333V5.83333C11.6667 6.29357 12.0398 6.66667 12.5 6.66667H16.6667C17.1269 6.66667 17.5 6.29357 17.5 5.83333V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.6667 10H12.5C12.0398 10 11.6667 10.3731 11.6667 10.8333V16.6667C11.6667 17.1269 12.0398 17.5 12.5 17.5H16.6667C17.1269 17.5 17.5 17.1269 17.5 16.6667V10.8333C17.5 10.3731 17.1269 10 16.6667 10Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 13.3333H3.33333C2.8731 13.3333 2.5 13.7064 2.5 14.1667V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H7.5C7.96024 17.5 8.33333 17.1269 8.33333 16.6667V14.1667C8.33333 13.7064 7.96024 13.3333 7.5 13.3333Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11595 12.5 3.2681 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16667 3.99238 4.16667 5.83333C4.16667 7.67428 5.65905 9.16667 7.5 9.16667Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlaceIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M11.755 4.6275L16.2942 3.1025V14.4858L13.245 17.1283L8.245 15.3733L3.70583 16.8983V5.515L6.755 2.8725L11.755 4.6275Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M10.5008 18.1658C12.0508 16.8275 16.6667 12.4942 16.6667 8.33333C16.6667 6.56522 15.9643 4.86953 14.714 3.61929C13.4638 2.36905 11.7681 1.66667 10 1.66667C8.23189 1.66667 6.5362 2.36905 5.28595 3.61929C4.03571 4.86953 3.33333 6.56522 3.33333 8.33333C3.33333 12.4942 7.94917 16.8275 9.49917 18.1658Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ItineraryIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M7.5 15.8333H14.5833C15.3569 15.8333 16.0987 15.526 16.6457 14.9791C17.1927 14.4321 17.5 13.6902 17.5 12.9167C17.5 12.1431 17.1927 11.4013 16.6457 10.8543C16.0987 10.3073 15.3569 10 14.5833 10H5.41667C4.64312 10 3.90125 9.69271 3.35427 9.14573C2.80729 8.59875 2.5 7.85688 2.5 7.08333C2.5 6.30979 2.80729 5.56792 3.35427 5.02094C3.90125 4.47396 4.64312 4.16667 5.41667 4.16667H12.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReviewIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
    <path d="M9.60417 1.9125L12.3208 5.81167L17.955 7.40833L15.0867 11.1933L15.3125 17.0417L10.8217 15.485L5.33 17.5083L5.4225 12.7592L1.8 8.1625L6.34917 6.77833L9.60417 1.9125Z" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
    <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8L10.6667 4.66667M14 8H6" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/admin/user", label: "User", icon: <UserIcon /> },
  { href: "/admin/place", label: "Place", icon: <PlaceIcon /> },
  { href: "/admin/location", label: "Location", icon: <LocationIcon /> },
  { href: "/admin/itinerary", label: "Itinerary", icon: <ItineraryIcon /> },
  { href: "/admin/review", label: "Review", icon: <ReviewIcon /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore errors
    }
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-bg-surface border-r border-border-default shadow-sm flex flex-col fixed h-screen z-20">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border-default">
        <h1 className="font-serif text-[26px] text-brand-primary leading-tight">NusaTrip</h1>
        <p className="text-[11px] text-text-muted uppercase font-semibold tracking-wide mt-1">Admin Console</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-bg-soft-blue text-brand-primary font-bold"
                  : "text-text-body hover:bg-bg-hover font-medium"
              }`}
            >
              {icon}
              <span className="text-[15px]">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-border-default p-4">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-border-default border border-border-default overflow-hidden flex-shrink-0">
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-text-heading truncate">Admin</p>
            <p className="text-[11px] font-medium text-text-muted">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-3 bg-error hover:opacity-90 text-white font-bold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
}
