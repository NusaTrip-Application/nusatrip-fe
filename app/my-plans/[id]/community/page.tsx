"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, MapPin, Map, Settings, Star, Bookmark, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

const mockReviews = [
  {
    id: 1,
    name: "Siti Aminah",
    time: "2 jam yang lalu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    comment: "Itinerary Bandung Getaway ini sangat membantu! Pemilihan tempat makannya sangat authentic dan tidak terlalu mainstream. Saya paling suka rekomendasi kopi di Lembang-nya."
  },
  {
    id: 2,
    name: "Budi Santoso",
    time: "5 jam yang lalu",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
    comment: "Sangat detail untuk perjalanan keluarga. Mungkin bisa ditambah sedikit opsi tempat parkir di area Braga agar lebih lengkap. Secara keseluruhan sangat bagus!"
  },
  {
    id: 3,
    name: "Indah Permata",
    time: "Kemarin",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    comment: "Terima kasih sudah berbagi rencana ini! Saya simpan untuk liburan akhir tahun nanti bersama teman-teman kantor."
  },
  {
    id: 4,
    name: "Reza Rahadian",
    time: "Kemarin",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    comment: "Susunan jadwalnya masuk akal dan rutenya searah, jadi tidak buang waktu di jalan. Recommended banget buat yang baru pertama kali ke Bandung."
  },
  {
    id: 5,
    name: "Ahmad Fauzi",
    time: "2 hari yang lalu",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    comment: "Cukup bagus untuk referensi, tapi saya mengubah beberapa restoran karena lebih suka makanan pedas. Sisanya oke."
  },
  {
    id: 6,
    name: "Dewi Lestari",
    time: "3 hari yang lalu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    comment: "Bagus banget! Saya ikuti persis seperti yang ditulis dan perjalanannya jadi sangat lancar."
  },
  {
    id: 7,
    name: "Rudi Hermawan",
    time: "1 minggu yang lalu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
    comment: "Sangat membantu buat saya yang baru pertama kali merencanakan liburan sendiri tanpa agen travel."
  },
  {
    id: 8,
    name: "Lina Marlina",
    time: "1 minggu yang lalu",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    comment: "Semua tempatnya asyik, tapi hati-hati macet kalau akhir pekan. Sebaiknya berangkat lebih pagi dari jadwal ini."
  },
  {
    id: 9,
    name: "Agus Prasetyo",
    time: "2 minggu yang lalu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    comment: "Wow, saya tidak menyangka Bandung punya hidden gem sebagus ini. Terima kasih rekomendasinya!"
  },
  {
    id: 10,
    name: "Maya Sari",
    time: "2 minggu yang lalu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    comment: "Rencana perjalanannya sangat estetik dan cocok buat yang suka foto-foto. Super recommended!"
  },
  {
    id: 11,
    name: "Dian Saputra",
    time: "1 bulan yang lalu",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    comment: "Secara keseluruhan memuaskan. Hanya saja ada satu kafe yang ternyata sudah tutup sementara."
  },
  {
    id: 12,
    name: "Nita Gunawan",
    time: "1 bulan yang lalu",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    comment: "Teman-teman sangat senang dengan pilihan tempat nongkrongnya. Terima kasih untuk itinerary yang luar biasa ini!"
  }
];

const formatTripRange = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return "Tanggal tidak ditentukan";
  const startObj = new Date(startStr);
  const endObj = new Date(endStr);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${startObj.toLocaleDateString('id-ID', options)} - ${endObj.toLocaleDateString('id-ID', { ...options, year: 'numeric' })}`;
};

export default function CommunityPage() {
  const { id } = useParams();

  const [tripData, setTripData] = useState<any>({
    title: "Memuat Rencana Perjalanan...",
    destination: "Memuat...",
    startDate: "2026-05-20",
    endDate: "2026-05-24",
    pax: 1
  });

  const [activeSort, setActiveSort] = useState("Terbaru");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  const sortedReviews = [...mockReviews].sort((a, b) => {
    if (activeSort === "Terbaru") return b.id - a.id;
    return a.id - b.id;
  });

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage);

  useEffect(() => {
    const savedPlan = localStorage.getItem(`plan_${id}`);
    if (savedPlan) {
      setTripData(JSON.parse(savedPlan));
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-bg-main font-sans pb-20">
      <Header />

      <div className="relative w-full h-[280px] md:h-[320px]">
        <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80" alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-10 text-white">
          <p className="text-[12px] md:text-[13px] font-medium opacity-80 mb-2">My Plans &gt; {tripData.title}</p>
          <h1 className="text-[32px] md:text-[40px] font-serif font-bold leading-tight mb-4">{tripData.title}</h1>
          <div className="flex flex-wrap gap-4 md:gap-6 text-[13px] font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {formatTripRange(tripData.startDate, tripData.endDate)}</span>
            <span className="flex items-center gap-1.5"><MapPin size={16} /> {tripData.destination}, Indonesia</span>
            <span className="flex items-center gap-1.5"><Users size={16} /> {tripData.pax} Orang</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
            <div className="bg-bg-surface border border-border-default rounded-2xl p-3 flex flex-col gap-1 shadow-sm sticky top-24">
              <SidebarItem icon={<Map size={18} />} label="View Itinerary" href={`/my-plans/${id}`} />
              {tripData.isPublic && (
                <SidebarItem icon={<Users size={18} />} label="Community" active href={`/my-plans/${id}/community`} />
              )}
              <SidebarItem icon={<Settings size={18} />} label="Settings" href={`/my-plans/${id}/settings`} />
            </div>
          </div>

          <div className="flex-grow bg-bg-surface border border-border-default rounded-2xl p-6 md:p-8 shadow-sm">

            <div className="mb-8">
              <h2 className="text-[24px] font-serif font-bold text-text-heading mb-2">Komunitas</h2>
              <p className="text-[14px] text-text-body font-medium leading-relaxed">
                Lihat bagaimana wisatawan lain berinteraksi dengan rencana perjalanan Anda dan pelajari feedback untuk perjalanan yang lebih baik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="border border-border-default rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="w-8 h-8 rounded-full bg-brand-warm/10 text-brand-warm flex items-center justify-center mb-4">
                  <Star size={16} className="fill-brand-warm" />
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Rata-Rata Rating</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <h3 className="text-[32px] font-serif font-bold text-text-heading leading-none">4.8</h3>
                  <span className="text-[16px] font-bold text-text-muted">/ 5.0</span>
                </div>
                <p className="text-[12px] font-medium text-text-muted">Dari 54 ulasan wisatawan</p>
              </div>

              <div className="border border-border-default rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  <Bookmark size={16} className="fill-brand-primary" />
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Disimpan</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <h3 className="text-[32px] font-serif font-bold text-text-heading leading-none">124</h3>
                  <span className="text-[16px] font-bold text-text-heading">kali</span>
                </div>
                <p className="text-[12px] font-medium text-text-muted">Wisatawan menyimpan rencana ini</p>
              </div>

              <div className="border border-border-default rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                  <MessageSquare size={16} className="fill-brand-primary" />
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Komentar</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <h3 className="text-[32px] font-serif font-bold text-text-heading leading-none">12</h3>
                  <span className="text-[16px] font-bold text-text-heading">pesan</span>
                </div>
                <p className="text-[12px] font-medium text-text-muted">Dari wisatawan</p>
              </div>
            </div>

            <div className="border-t border-border-default pt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-serif font-bold text-text-heading">Ulasan Wisatawan</h3>
                <div className="flex items-center border border-border-default rounded-lg p-1">
                  <button
                    onClick={() => setActiveSort("Terbaru")}
                    className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-colors ${activeSort === "Terbaru" ? 'bg-bg-main text-text-heading shadow-sm' : 'text-text-muted hover:text-text-heading'}`}
                  >
                    Terbaru
                  </button>
                  <button
                    onClick={() => setActiveSort("Terlama")}
                    className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-colors ${activeSort === "Terlama" ? 'bg-bg-main text-text-heading shadow-sm' : 'text-text-muted hover:text-text-heading'}`}
                  >
                    Terlama
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {currentReviews.map((review, index) => (
                  <div key={review.id} className={`flex gap-4 ${index !== currentReviews.length - 1 ? 'border-b border-border-default pb-6' : ''}`}>
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[14px] text-text-heading">{review.name}</h4>
                        <span className="text-[12px] font-medium text-text-muted">{review.time}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-brand-warm text-brand-warm" : "fill-border-default text-border-default"} />
                        ))}
                      </div>
                      <p className="text-[13px] text-text-body font-medium leading-relaxed">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
                <span className="text-[12px] font-medium text-text-muted">
                  Menampilkan {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, sortedReviews.length)} dari {sortedReviews.length} ulasan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-md border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-md text-[12px] font-bold ${currentPage === i + 1 ? 'bg-brand-primary text-white' : 'border border-border-default text-text-muted hover:bg-bg-hover'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-md border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

function SidebarItem({ icon, label, active, href }: { icon: React.ReactNode; label: string; active?: boolean; href?: string }) {
  const Comp = href ? Link : "div";
  return (
    <Comp href={href || "#"} className={`px-4 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-3 transition-colors ${active ? 'bg-brand-primary text-white' : 'bg-transparent text-text-muted hover:bg-bg-hover hover:text-text-heading'}`}>
      {icon}
      {label}
    </Comp>
  );
}