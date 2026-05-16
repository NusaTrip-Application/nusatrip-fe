import React from 'react';
import { Home as HomeIcon, CalendarDays, Users, User } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-default flex justify-around items-center py-3 px-2 z-50 pb-safe">
      <button className="flex flex-col items-center gap-1.5 text-brand-primary w-1/4">
        <HomeIcon size={22} className="fill-brand-primary/10" />
        <span className="text-[12px] font-bold">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-text-muted hover:text-brand-primary transition-colors w-1/4">
        <CalendarDays size={22} />
        <span className="text-[12px] font-medium">My Plans</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-text-muted hover:text-brand-primary transition-colors w-1/4">
        <Users size={22} />
        <span className="text-[12px] font-medium">Community</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-text-muted hover:text-brand-primary transition-colors w-1/4">
        <User size={22} />
        <span className="text-[12px] font-medium">Profile</span>
      </button>
    </div>
  );
}