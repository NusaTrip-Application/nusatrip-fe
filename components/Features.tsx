import React from "react";
import { Map, CircleDollarSign, Wrench, Share2 } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-[#F3F3FE] rounded-3xl border border-gray-100 p-8 md:p-10 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        <div className="flex gap-5 items-start">
          <div className="bg-[rgba(37,99,235,0.1)] p-3.5 rounded-full text-[#0D7C4A] shrink-0">
            <Map size={26} className="text-[#2563EB]" />
          </div>
          <div>
            <h4 className="font-bold text-[17px] mb-2 text-gray-900">
              Rencanakan dengan Mudah
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Susun itinerary per hari dan jam dengan praktis.
            </p>
          </div>
        </div>
        <div className="flex gap-5 items-start">
          <div className="bg-[rgba(37,99,235,0.1)] p-3.5 rounded-full text-[#0D7C4A] shrink-0">
            <CircleDollarSign size={26} className="text-[#2563EB]" />
          </div>
          <div>
            <h4 className="font-bold text-[17px] mb-2 text-gray-900">
              Estimasi Budget
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Dapatkan estimasi budget secara otomatis.
            </p>
          </div>
        </div>
        <div className="flex gap-5 items-start">
          <div className="bg-[rgba(37,99,235,0.1)] p-3.5 rounded-full text-[#0D7C4A] shrink-0">
            <Wrench size={26} className="text-[#2563EB]" />
          </div>
          <div>
            <h4 className="font-bold text-[17px] mb-2 text-gray-900">
              Dapatkan Inspirasi
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Lihat itinerary publik dari traveler lain.
            </p>
          </div>
        </div>
        <div className="flex gap-5 items-start">
          <div className="bg-[rgba(37,99,235,0.1)] p-3.5 rounded-full text-[#0D7C4A] shrink-0">
            <Share2 size={26} className="text-[#2563EB]" />
          </div>
          <div>
            <h4 className="font-bold text-[17px] mb-2 text-gray-900">
              Bagikan Pengalaman
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Publikasikan itinerary dan inspirasi ke komunitas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
