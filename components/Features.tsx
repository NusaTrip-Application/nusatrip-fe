import React from "react";
import { Map, CircleDollarSign, Wrench, Share2 } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-bg-soft-gray rounded-lg border border-border-default p-8 md:p-10 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        
        <div className="flex gap-5 items-start">
          <div className="bg-brand-primary/10 p-3.5 rounded-full text-brand-primary shrink-0">
            <Map size={26} />
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-text-heading mb-2">
              Rencanakan dengan Mudah
            </h4>
            <p className="text-[14px] text-text-body font-medium leading-[1.5]">
              Susun itinerary per hari dan jam dengan praktis.
            </p>
          </div>
        </div>

        <div className="flex gap-5 items-start">
          <div className="bg-brand-primary/10 p-3.5 rounded-full text-brand-primary shrink-0">
            <CircleDollarSign size={26} />
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-text-heading mb-2">
              Estimasi Budget
            </h4>
            <p className="text-[14px] text-text-body font-medium leading-[1.5]">
              Dapatkan estimasi budget secara otomatis.
            </p>
          </div>
        </div>

        <div className="flex gap-5 items-start">
          <div className="bg-brand-primary/10 p-3.5 rounded-full text-brand-primary shrink-0">
            <Wrench size={26} />
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-text-heading mb-2">
              Dapatkan Inspirasi
            </h4>
            <p className="text-[14px] text-text-body font-medium leading-[1.5]">
              Lihat itinerary publik dari traveler lain.
            </p>
          </div>
        </div>

        <div className="flex gap-5 items-start">
          <div className="bg-brand-primary/10 p-3.5 rounded-full text-brand-primary shrink-0">
            <Share2 size={26} />
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-text-heading mb-2">
              Bagikan Pengalaman
            </h4>
            <p className="text-[14px] text-text-body font-medium leading-[1.5]">
              Publikasikan itinerary dan inspirasi ke komunitas.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}