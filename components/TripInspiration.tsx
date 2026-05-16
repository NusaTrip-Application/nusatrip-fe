import { ArrowRight, Star, Eye, Bookmark } from "lucide-react";

export default function TripInspiration() {
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">
          Inspirasi Trip dari Komunitas
        </h2>
        <button className="text-[#2563EB] font-semibold flex items-center gap-1.5 hover:underline text-sm md:text-base">
          Lihat semua →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            title: "5 Hari 4 Malam di Bandung",
            loc: "Bandung, Jawa Barat",
            img: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=400&auto=format&fit=crop&q=60",
            author: "Sarah Wijaya",
            rating: "4.8",
            review: "120",
            saved: "2.3K",
          },
          {
            title: "Weekend Seru di Yogyakarta",
            loc: "Yogyakarta, DI Yogyakarta",
            img: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=400&auto=format&fit=crop&q=60",
            author: "Dika Pratama",
            rating: "4.6",
            review: "85",
            saved: "1.6K",
          },
          {
            title: "Bali 4 Hari 3 Malam - Honeymoon",
            loc: "Bali",
            img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop&q=60",
            author: "Mega Lestari",
            rating: "4.9",
            review: "90",
            saved: "3.1K",
          },
          {
            title: "Lombok 3 Hari 2 Malam",
            loc: "Lombok, NTB",
            img: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=400&auto=format&fit=crop&q=60",
            author: "Rizky Mahendra",
            rating: "4.5",
            review: "70",
            saved: "3.1K",
          },
        ].map((trip, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 sm:p-5 flex gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-xl">
                <img
                  src={trip.img}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center py-1">
                <h3 className="font-bold text-[15px] sm:text-[17px] leading-snug mb-1.5">
                  {trip.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3 sm:mb-4 font-medium">
                  {trip.loc}
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-[13px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-slate-600 fill-slate-600" />{" "}
                    {trip.rating}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-slate-600" /> {trip.review}{" "}
                    review
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bookmark size={14} className="text-slate-600" />{" "}
                    {trip.saved} saved
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 p-4 sm:px-5 sm:py-4 flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt={trip.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[14px] sm:text-[15px] font-bold text-gray-800">
                {trip.author}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
