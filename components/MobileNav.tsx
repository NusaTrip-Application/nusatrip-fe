import React from 'react';
import { Home as HomeIcon, CalendarDays, Users, User } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] flex justify-around items-center py-3 px-2 z-50 pb-safe">
      <button className="flex flex-col items-center gap-1.5 text-[#0D7C4A] w-1/4">
        <HomeIcon size={22} className="fill-[#0D7C4A]/10" />
        <span className="text-[11px] font-bold">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#0D7C4A] transition-colors w-1/4">
        <CalendarDays size={22} />
        <span className="text-[11px] font-medium">My Plans</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#0D7C4A] transition-colors w-1/4">
        <Users size={22} />
        <span className="text-[11px] font-medium">Community</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#0D7C4A] transition-colors w-1/4">
        <User size={22} />
        <span className="text-[11px] font-medium">Profile</span>
      </button>
    </div>
  );
}
