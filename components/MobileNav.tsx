"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, CalendarDays, Users, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-default flex justify-around items-center py-3 px-2 z-50 pb-safe">
      <Link 
        href="/" 
        className={`flex flex-col items-center gap-1.5 w-1/4 transition-colors ${
          pathname === '/' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'
        }`}
      >
        <HomeIcon size={22} className={pathname === '/' ? 'fill-brand-primary/10' : ''} />
        <span className="text-[12px] font-bold">Home</span>
      </Link>
      
      <Link 
        href="/my-plans" 
        className={`flex flex-col items-center gap-1.5 w-1/4 transition-colors ${
          pathname === '/my-plans' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'
        }`}
      >
        <CalendarDays size={22} className={pathname === '/my-plans' ? 'fill-brand-primary/10' : ''} />
        <span className="text-[12px] font-bold">My Plans</span>
      </Link>
      
      <Link 
        href="/community" 
        className={`flex flex-col items-center gap-1.5 w-1/4 transition-colors ${
          pathname === '/community' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'
        }`}
      >
        <Users size={22} className={pathname === '/community' ? 'fill-brand-primary/10' : ''} />
        <span className="text-[12px] font-bold">Community</span>
      </Link>
      
      <Link 
        href="/profile" 
        className={`flex flex-col items-center gap-1.5 w-1/4 transition-colors ${
          pathname === '/profile' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'
        }`}
      >
        <User size={22} className={pathname === '/profile' ? 'fill-brand-primary/10' : ''} />
        <span className="text-[12px] font-bold">Profile</span>
      </Link>
    </div>
  );
}