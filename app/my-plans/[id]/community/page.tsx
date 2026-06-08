"use client";



import React, { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { Calendar, Users, MapPin, Map, Settings, Star, Bookmark, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

import MobileNav from "@/components/MobileNav";

import { getItineraryById, getCommunitySummary } from "@/services/plans";

import { getReviewsByItineraryId } from "@/services/reviews";



const formatTripRange = (startStr: string, endStr: string) => {

  if (!startStr || !endStr) return "Tanggal tidak ditentukan";

  const startObj = new Date(startStr);

  const endObj = new Date(endStr);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

  return `${startObj.toLocaleDateString('id-ID', options)} - ${endObj.toLocaleDateString('id-ID', { ...options, year: 'numeric' })}`;

};



export default function CommunityPage() {

  const { id } = useParams();

  const router = useRouter();



  const [tripData, setTripData] = useState<any>({

    title: "Memuat Rencana Perjalanan...",

    destination: "Memuat...",

    startDate: "2026-05-20",

    endDate: "2026-05-24",

    pax: 1

  });



  const [isLoading, setIsLoading] = useState(true);

  const [reviews, setReviews] = useState<any[]>([]);

  const [summary, setSummary] = useState<any>({ averageRating: 0, totalReviews: 0, totalSaves: 0, totalComments: 0 });



  const [activeSort, setActiveSort] = useState("Terbaru");

  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 4;



  const sortedReviews = [...reviews].sort((a, b) => {

    if (activeSort === "Terbaru") {

      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;

      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;

      return dateB - dateA;

    }

    return a.id - b.id;

  });



  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const startIndex = (currentPage - 1) * reviewsPerPage;

  const currentReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage);



  const averageRating = summary.averageRating ? summary.averageRating.toFixed(1) : "0.0";

  const totalReviews = summary.totalReviews || 0;



  useEffect(() => {

    const fetchItinerary = async () => {

      const token = localStorage.getItem("token");

      if (!token) {

        router.push("/login");

        return;

      }



      try {

        setIsLoading(true);

        let res = await getItineraryById(id as string);

        const data = res.data || res;



        setTripData({

          title: data.title || "Untitled Plan",

          destination: data.location?.name || data.location?.locationName || "Destinasi",

          startDate: data.startDate,

          endDate: data.endDate,

          pax: data.travelerCount || 1,

          savedCount: data.savedCount || 0,

          isPublic: data.visibilityStatus === "PUBLISHED" || data.visibilityStatus === "PUBLIC",

          bannerImage: (data.bannerPhotoUrl || data.bannerImageUrl) ? ((data.bannerPhotoUrl || data.bannerImageUrl).startsWith('http') ? (data.bannerPhotoUrl || data.bannerImageUrl) : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${data.bannerPhotoUrl || data.bannerImageUrl}`) : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80"

        });



        const [revRes, summaryRes] = await Promise.all([
          getReviewsByItineraryId(id as string),
          getCommunitySummary(id as string).catch(() => ({ data: {} }))
        ]);

        const revData = revRes.data || revRes;

        if (summaryRes && summaryRes.data) {
          setSummary({
            averageRating: summaryRes.data.averageRating || 0,
            totalReviews: summaryRes.data.totalReviews || 0,
            totalSaves: summaryRes.data.totalSaves || summaryRes.data.savedCount || data.savedCount || 0,
            totalComments: summaryRes.data.totalComments || summaryRes.data.totalReviews || 0
          });
        }



        if (Array.isArray(revData)) {

          const parsedReviews = revData.map((r: any, idx: number) => ({

            id: r.reviewId || idx,

            name: r.reviewer?.fullName || "Pengguna Anonim",

            time: r.createdAt ? new Date(r.createdAt).toLocaleDateString('id-ID') : "Baru saja",

            rating: r.ratingValue || 5,

            avatar: r.reviewer?.profilePhotoUrl ? (r.reviewer.profilePhotoUrl.startsWith('http') ? r.reviewer.profilePhotoUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${r.reviewer.profilePhotoUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer?.fullName || r.reviewer?.name || 'User')}&background=F3F3FE&color=5855E9`,

            comment: r.comment || "Tidak ada komentar",

            createdAt: r.createdAt

          }));

          setReviews(parsedReviews);

        } else if (revData?.items && Array.isArray(revData.items)) {

          const parsedReviews = revData.items.map((r: any, idx: number) => ({

            id: r.reviewId || idx,

            name: r.reviewer?.fullName || "Pengguna Anonim",

            time: r.createdAt ? new Date(r.createdAt).toLocaleDateString('id-ID') : "Baru saja",

            rating: r.ratingValue || 5,

            avatar: r.reviewer?.profilePhotoUrl ? (r.reviewer.profilePhotoUrl.startsWith('http') ? r.reviewer.profilePhotoUrl : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${r.reviewer.profilePhotoUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer?.fullName || r.reviewer?.name || 'User')}&background=F3F3FE&color=5855E9`,

            comment: r.comment || "Tidak ada komentar",

            createdAt: r.createdAt

          }));

          setReviews(parsedReviews);

        }

      } catch (error) {

        console.error("Gagal memuat detail rencana atau ulasan:", error);

      } finally {

        setIsLoading(false);

      }

    };



    fetchItinerary();

  }, [id]);



  if (isLoading) {

    return (

      <div className="min-h-screen bg-bg-main font-sans flex flex-col">

        <Header />

        <div className="flex-grow flex flex-col items-center justify-center">

          <Loader2 size={32} className="animate-spin text-brand-primary mb-4" />

          <p className="text-text-muted font-medium">Memuat data komunitas...</p>

        </div>

        <MobileNav />

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-bg-main font-sans flex flex-col pb-20 md:pb-0">

      <Header />



      <div className="relative w-full h-[280px] md:h-[320px]">

        <img src={tripData.bannerImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-10 text-white">

          <div className="text-[12px] md:text-[13px] font-medium mb-2 flex items-center gap-1 opacity-90">

            <Link href="/my-plans" className="md:hidden flex items-center justify-center p-1 -ml-2 hover:bg-white/20 rounded-full transition-colors">

              <ChevronLeft size={28} className="text-white" />

            </Link>



            <div className="hidden md:flex items-center gap-1">

              <Link href="/my-plans" className="hover:underline hover:text-white transition-colors">

                My Plans

              </Link>

              <span className="text-white/70"> &gt; </span>

              <span className="text-white/70 truncate max-w-[300px]">{tripData.title}</span>

            </div>

          </div>

          <h1 className="text-[32px] md:text-[40px] font-serif font-bold leading-tight mb-4">{tripData.title}</h1>

          <div className="flex flex-wrap gap-4 md:gap-6 text-[13px] font-medium">

            <span className="flex items-center gap-1.5"><Calendar size={16} /> {formatTripRange(tripData.startDate, tripData.endDate)}</span>

            <span className="flex items-center gap-1.5"><MapPin size={16} /> {tripData.destination}, Indonesia</span>

            <span className="flex items-center gap-1.5"><Users size={16} /> {tripData.pax} Orang</span>

          </div>

        </div>

      </div>



      <main className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8 mb-28 md:mb-16">

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

                  <h3 className="text-[32px] font-serif font-bold text-text-heading leading-none">{averageRating}</h3>

                  <span className="text-[16px] font-bold text-text-muted">/ 5.0</span>

                </div>

                <p className="text-[12px] font-medium text-text-muted">Dari {totalReviews} ulasan wisatawan</p>

              </div>



              <div className="border border-border-default rounded-xl p-5 hover:shadow-sm transition-shadow">

                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">

                  <Bookmark size={16} className="fill-brand-primary" />

                </div>

                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Disimpan</p>

                <div className="flex items-baseline gap-1 mb-1">

                  <h3 className="text-[32px] font-serif font-bold text-text-heading leading-none">{summary.totalSaves || tripData.savedCount || 0}</h3>

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

                  <h3 className="text-[32px] font-serif font-bold text-text-heading leading-none">{totalReviews}</h3>

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
                  {sortedReviews.length === 0 ? (
                    "Belum ada ulasan"
                  ) : (
                    `Menampilkan ${startIndex + 1}-${Math.min(startIndex + reviewsPerPage, sortedReviews.length)} dari ${sortedReviews.length} ulasan`
                  )}
                </span>
                {totalPages > 1 && (
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
                )}
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