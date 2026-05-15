import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

export default function PopularDestinations() {
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Destinasi Populer</h2>
        <button className="text-[#0D7C4A] font-semibold flex items-center gap-1.5 hover:underline text-sm md:text-base">
          Lihat semua <ArrowRight size={18} />
        </button>
      </div>

      <div className="flex overflow-x-auto gap-5 pb-4 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { name: 'Bandung', province: 'Jawa Barat', img: 'https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=500&auto=format&fit=crop&q=60' },
          { name: 'Yogyakarta', province: 'DI Yogyakarta', img: 'https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=500&auto=format&fit=crop&q=60' },
          { name: 'Bali', province: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60' },
          { name: 'Malang', province: 'Jawa Timur', img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=500&auto=format&fit=crop&q=60' },
          { name: 'Jakarta', province: 'DKI Jakarta', img: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=500&auto=format&fit=crop&q=60' },
        ].map((dest, i) => (
          <div key={i} className="min-w-[220px] md:min-w-[260px] flex-none snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="overflow-hidden">
              <img src={dest.img} alt={dest.name} className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl mb-1">{dest.name}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 font-medium">
                <MapPin size={16} /> {dest.province}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
