"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, List, LayoutGrid, PlusCircle, X, MapPin, Clock, Globe, Phone } from "lucide-react";
import { getRecommendationsByDestination } from "@/services/plans"; 

const filters = ["All Spots", "Nature", "Culinary", "Architecture", "Art & Culture", "Family"];

const mockPlaces = [
  { 
    id: 1, 
    name: "Kawah Putih", 
    category: "NATURE", 
    rating: 4.8, 
    price: "Rp 30.000 - 80.000", 
    img: "https://images.unsplash.com/photo-1583130190518-e397cff177ce?w=500&auto=format&fit=crop&q=60", 
    desc: "Kawah vulkanik yang menakjubkan ini terletak sekitar 50 km di selatan Bandung. Terkenal dengan airnya yang sangat asam yang berubah warna dari kebiruan menjadi putih kehijauan, atau cokelat, tergantung pada konsentrasi belerang.",
    address: "Ciwidey, Bandung, Jawa Barat",
    hours: { weekday: "07:00 - 17:00", weekend: "07:00 - 18:00" },
    website: "https://kawahputih.com",
    phone: "+62 812-3456-7890"
  },
  { 
    id: 2, 
    name: "Floating Market", 
    category: "FAMILY", 
    rating: 4.5, 
    price: "Rp 35.000 - 75.000", 
    img: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=500&auto=format&fit=crop&q=60", 
    desc: "Destinasi unik di mana Anda dapat membeli jajanan tradisional Sunda dari pedagang di atas perahu. Tersedia juga berbagai wahana permainan anak dan taman tematik yang cocok untuk keluarga.",
    address: "Lembang, Kab. Bandung Barat",
    hours: { weekday: "09:00 - 18:00", weekend: "08:00 - 19:00" },
    website: "https://floatingmarket-lembang.com",
    phone: "+62 811-2233-4455"
  },
  { 
    id: 3, 
    name: "Braga Permai", 
    category: "CULINARY", 
    rating: 4.6, 
    price: "Rp 150.000 - 300.000", 
    img: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=500&auto=format&fit=crop&q=60", 
    desc: "Restoran legendaris dengan perpaduan kuliner Belanda-Indonesia yang terletak di jalan ikonik Braga. Menawarkan suasana klasik yang membawa Anda kembali ke era Paris van Java.",
    address: "Jl. Braga No.58, Sumur Bandung",
    hours: { weekday: "08:00 - 22:00", weekend: "08:00 - 23:00" },
    website: "https://bragapermai.com",
    phone: "+62 22-423-2345"
  },
  { 
    id: 4, 
    name: "Tea Plantation", 
    category: "NATURE", 
    rating: 4.9, 
    price: "Free - Rp 10.000", 
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60", 
    desc: "Berjalanlah melintasi pagi yang berkabut di Perkebunan Teh Cukul untuk melihat pemandangan matahari terbit terbaik di Jawa Barat dengan udara yang sangat sejuk.",
    address: "Pangalengan, Bandung Selatan",
    hours: { weekday: "24 Jam", weekend: "24 Jam" },
    website: "https://explorepangalengan.com",
    phone: "+62 855-6677-8899"
  },
  { 
    id: 5, 
    name: "Selasar Sunaryo", 
    category: "ART & CULTURE", 
    rating: 4.7, 
    price: "Rp 25.000 - 50.000", 
    img: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=500&auto=format&fit=crop&q=60", 
    desc: "Ruang seni kontemporer ikonik dan kafe yang menawarkan pemandangan bukit panorama dan kesenian lokal. Cocok untuk bersantai sambil menikmati karya seni.",
    address: "Ciburial, Cimenyan, Bandung",
    hours: { weekday: "10:00 - 17:00", weekend: "10:00 - 18:00" },
    website: "https://selasarsunaryo.com",
    phone: "+62 22-250-7939"
  },
  { 
    id: 6, 
    name: "Selasar Sunaryo", 
    category: "ART & CULTURE", 
    rating: 4.7, 
    price: "Rp 25.000 - 50.000", 
    img: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=500&auto=format&fit=crop&q=60", 
    desc: "Ruang seni kontemporer ikonik dan kafe yang menawarkan pemandangan bukit panorama dan kesenian lokal. Cocok untuk bersantai sambil menikmati karya seni.",
    address: "Ciburial, Cimenyan, Bandung",
    hours: { weekday: "10:00 - 17:00", weekend: "10:00 - 18:00" },
    website: "https://selasarsunaryo.com",
    phone: "+62 22-250-7939"
  },
  { 
    id: 7, 
    name: "Selasar Sunaryo", 
    category: "ART & CULTURE", 
    rating: 4.7, 
    price: "Rp 25.000 - 50.000", 
    img: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=500&auto=format&fit=crop&q=60", 
    desc: "Ruang seni kontemporer ikonik dan kafe yang menawarkan pemandangan bukit panorama dan kesenian lokal. Cocok untuk bersantai sambil menikmati karya seni.",
    address: "Ciburial, Cimenyan, Bandung",
    hours: { weekday: "10:00 - 17:00", weekend: "10:00 - 18:00" },
    website: "https://selasarsunaryo.com",
    phone: "+62 22-250-7939"
  }
];

const generateTimeOptions = () => {
  const times = [];
  for (let i = 6; i <= 22; i++) {
    times.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return times;
};


const generateDateOptions = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return [];
  
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    const formattedDate = currentDate.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

const generateTimeOptionsBasedOnHours = (hoursString: string) => {
  if (!hoursString || hoursString === "24 Jam") {
    const times = [];
    for (let i = 0; i <= 23; i++) {
      times.push(`${i.toString().padStart(2, "0")}:00`);
    }
    return times;
  }

  const parts = hoursString.split("-");
  if (parts.length !== 2) return [];

  const startHour = parseInt(parts[0].trim().split(":")[0]);
  const endHour = parseInt(parts[1].trim().split(":")[0]);

  const times = [];
  for (let i = startHour; i <= endHour; i++) {
    times.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return times;
};

export default function RecommendationsList() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "Bandung";

  const startDate = searchParams.get("start") || ""; 
  const endDate = searchParams.get("end") || "";

  const timeOptions = generateTimeOptions();
  const dateOptions = generateDateOptions(startDate, endDate);

  const [activeFilter, setActiveFilter] = useState("All Spots");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [modalType, setModalType] = useState<"detail" | "add" | null>(null);
  const [chosenDate, setChosenDate] = useState<string>("");

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const router = useRouter();
  const tripId = searchParams.get("tripId") || "1";

  const [chosenTime, setChosenTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setIsLoading(true);
        setError(null);
        
        // KODE BACKEND
        // const data = await getRecommendationsByDestination(destination);
        // setPlaces(data);

        // MOCK DATA SIMULASI
        setTimeout(() => {
          setPlaces(mockPlaces);
          setIsLoading(false);
        }, 1000);

      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
        setIsLoading(false);
      } 
      // finally setIsLoading(false)
    }

    fetchPlaces();
  }, [destination]);

  const openDetailModal = (place: any) => {
    setSelectedPlace(place);
    setModalType("detail");
  };

  const openAddModal = (place: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlace(place);
    setModalType("add");
    setNotes("");
    
    const dateOptions = generateDateOptions(startDate, endDate);
    if (dateOptions.length > 0) {
      const firstDate = dateOptions[0];
      setChosenDate(firstDate);
      
      const isWeekend = firstDate.startsWith("Sabtu") || firstDate.startsWith("Minggu");
      const opHours = isWeekend ? place.hours?.weekend : place.hours?.weekday;
      const opts = generateTimeOptionsBasedOnHours(opHours);
      if (opts.length > 0) {
        setChosenTime(opts[0]);
      }
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPlace(null);
  };

  const filteredPlaces = places.filter((place) => {
    if (activeFilter === "All Spots") return true;
    return place.category.toUpperCase() === activeFilter.toUpperCase();
  });

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  
  const currentPlaces = filteredPlaces.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  if (isLoading) {
    return (
      <div className="w-full text-center py-20 font-sans font-medium text-text-body">
        Sedang mencari tempat wisata terbaik di {destination}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-20 font-sans font-medium text-error">
        Gagal memuat data: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="hidden md:flex items-center gap-2 text-[13px] font-medium text-text-muted mb-4">
          <Link href="/my-plans" className="hover:text-brand-primary transition-colors cursor-pointer">
            My Plans
          </Link>
          <ChevronRight size={14} />
          <span className="text-text-body">{destination} Getaway</span>
        </div>

        <div className="flex md:hidden items-center mb-4">
          <Link href="/my-plans" className="flex items-center gap-1 text-text-muted hover:text-brand-primary transition-colors cursor-pointer">
            <ChevronLeft size={20} className="-ml-1" />
            <span className="text-[14px] font-bold">Kembali</span>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-serif font-bold text-text-heading leading-[1.2] mb-2">
              {destination} Rekomendasi
            </h1>
            <p className="text-sm text-text-body font-medium">
              Tempat-tempat pilihan berdasarkan rencana perjalanan Anda ke {destination}.
            </p>
          </div>    
          
          <div className="flex items-center gap-1 bg-bg-surface border border-border-default rounded-lg p-1 shrink-0">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-bg-soft-blue text-brand-primary rounded-md text-[13px] font-bold">
              <List size={16} /> List View
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-text-muted hover:text-text-body rounded-md text-[13px] font-semibold">
              <LayoutGrid size={16} /> Swipe Mode
            </button>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              activeFilter === filter 
                ? "bg-brand-primary text-text-light" 
                : "bg-bg-surface text-text-body hover:bg-bg-hover border border-border-default"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentPlaces.length === 0 ? (
          <div className="col-span-full text-center py-10 text-text-muted font-medium">
            Tidak ada tempat wisata yang ditemukan untuk destinasi {destination}.
          </div>
        ) : (
          currentPlaces.map((place) => (
            <div 
              key={place.id} 
              onClick={() => openDetailModal(place)}
              className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={place.img} alt={place.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-brand-primary text-text-light text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider">
                  {place.category}
                </span>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-bold text-xl text-text-heading leading-tight">{place.name}</h3>
                  <span className="flex items-center gap-1 text-[13px] font-bold text-brand-primary">
                    <Star size={14} className="fill-brand-primary" /> {place.rating}
                  </span>
                </div>
                
                <p className="text-[13px] text-text-body font-medium leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {place.desc}
                </p>
                
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[14px] font-bold text-text-heading">{place.price}</p>
                  </div>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Entrance Fee</span>
                </div>
                
                <button 
                  onClick={(e) => openAddModal(place, e)}
                  className="w-full py-2.5 bg-brand-primary/10 text-brand-primary font-bold text-[13px] rounded-lg hover:bg-brand-primary hover:text-text-light transition-colors flex justify-center items-center gap-2"
                >
                  <PlusCircle size={16} /> Add to Itinerary
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mb-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full text-[13px] font-bold transition-colors ${
                  currentPage === page
                    ? "bg-brand-primary text-text-light"
                    : "border border-border-default text-text-muted hover:bg-bg-hover"
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-text-muted hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

          {modalType === "detail" && selectedPlace && (
            <div className="bg-bg-surface w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={closeModal} className="absolute top-4 right-4 z-10 p-1.5 bg-white/80 backdrop-blur rounded-full text-text-heading hover:bg-white transition-colors">
                <X size={20} />
              </button>
              
              <div className="md:w-1/2 h-64 md:h-auto">
                <img src={selectedPlace.img} alt={selectedPlace.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col max-h-[80vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-serif font-bold text-text-heading">{selectedPlace.name}</h2>
                  <span className="bg-brand-primary text-text-light text-[10px] font-bold px-2 py-0.5 rounded-sm">{selectedPlace.category}</span>
                </div>
                
                <div className="flex items-center gap-4 text-[13px] font-medium text-text-muted mb-6">
                  <span className="flex items-center gap-1 text-brand-warm font-bold"><Star size={14} className="fill-brand-warm" /> {selectedPlace.rating} (1.280 Ulasan)</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {selectedPlace.address}</span>
                </div>

                <div className="bg-bg-main border border-border-default rounded-lg p-4 mb-6 flex items-center gap-3">
                  <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary"><Clock size={18} /></div>
                  <div>
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Estimasi Harga</p>
                    <p className="text-[14px] font-bold text-text-heading">{selectedPlace.price}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Jam Operasional</p>
                  <div className="flex justify-between text-[13px] font-medium text-text-body mb-1">
                    <span>Senin - Jumat</span> 
                    <span className="text-brand-primary font-bold">{selectedPlace.hours?.weekday}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-medium text-text-body">
                    <span>Sabtu - Minggu</span> 
                    <span className="text-brand-primary font-bold">{selectedPlace.hours?.weekend}</span>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <a href={selectedPlace.website} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-text-muted hover:text-brand-primary transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full border border-border-strong flex items-center justify-center"><Globe size={18} /></div>
                    <span className="text-[11px] font-semibold">Website</span>
                  </a>
                  <a href={`tel:${selectedPlace.phone}`} className="flex flex-col items-center gap-1 text-text-muted hover:text-brand-primary transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full border border-border-strong flex items-center justify-center"><Phone size={18} /></div>
                    <span className="text-[11px] font-semibold">Call</span>
                  </a>
                </div>

                <div className="mb-8">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Deskripsi</p>
                  <p className="text-[13px] text-text-body leading-relaxed font-medium">{selectedPlace.desc}</p>
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-border-default">
                  <button onClick={(e) => { closeModal(); openAddModal(selectedPlace, e as any); }} className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-text-light font-bold text-[14px] py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                    <PlusCircle size={18} /> Add to Itinerary
                  </button>
                  <button onClick={closeModal} className="px-6 border border-border-strong text-text-heading font-bold text-[14px] rounded-xl hover:bg-bg-hover transition-colors">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalType === "add" && selectedPlace && (() => {
            const isWeekend = chosenDate.startsWith("Sabtu") || chosenDate.startsWith("Minggu");
            
            const operationalHours = isWeekend 
              ? selectedPlace.hours?.weekend 
              : selectedPlace.hours?.weekday;

            const dynamicTimeOptions = generateTimeOptionsBasedOnHours(operationalHours);

            return (
              <div className="bg-bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-[18px] text-text-heading">Tambah ke Rencana</h3>
                  <button onClick={closeModal} className="text-text-muted hover:text-text-heading transition-colors"><X size={20} /></button>
                </div>

                <div className="flex items-center gap-3 bg-bg-main p-3 rounded-lg border border-border-default mb-5">
                  <img src={selectedPlace.img} alt="" className="w-12 h-12 rounded-md object-cover" />
                  <div>
                    <p className="text-[14px] font-bold text-text-heading">{selectedPlace.name}</p>
                    <p className="text-[11px] font-medium text-text-muted">{selectedPlace.address}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[12px] font-bold text-text-heading mb-1.5">Pilih Hari</label>
                    <select 
                      value={chosenDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setChosenDate(newDate);
                        const isWknd = newDate.startsWith("Sabtu") || newDate.startsWith("Minggu");
                        const opHours = isWknd ? selectedPlace.hours?.weekend : selectedPlace.hours?.weekday;
                        const opts = generateTimeOptionsBasedOnHours(opHours);
                        if (opts.length > 0 && !opts.includes(chosenTime)) {
                          setChosenTime(opts[0]);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none"
                    >
                      {dateOptions.map((date, index) => (
                        <option key={index} value={date}>{date}</option>
                      ))}
                    </select>
                  </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[12px] font-bold text-text-heading">Waktu Kunjungan</label>
                        <span className="text-[10px] font-bold text-brand-primary">Buka: {operationalHours}</span>
                      </div>
                      <select 
                        value={chosenTime}
                        onChange={(e) => setChosenTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none"
                      >
                        {dynamicTimeOptions.map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] font-bold text-text-heading mb-1.5">Catatan</label>
                      <input 
                        type="text"
                        placeholder="Pergi ke sini karena..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none"
                      />
                    </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-2.5 border border-border-strong text-text-heading font-bold text-[14px] rounded-xl hover:bg-bg-hover transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const newActivity = {
                        id: Date.now(),
                        date: chosenDate,
                        time: chosenTime,
                        title: selectedPlace.name,
                        subtitle: selectedPlace.address,
                        category: selectedPlace.category,
                        rating: selectedPlace.rating,
                        img: selectedPlace.img,
                        notes: notes || "Mulai hari dengan aktivitas seru!",
                        price: selectedPlace.price
                      };

                      const existingData = localStorage.getItem(`itinerary_${tripId}`);
                      const itineraryList = existingData ? JSON.parse(existingData) : [];

                      const isConflict = itineraryList.some((item: any) => 
                        item.date === chosenDate && item.time === chosenTime
                      );

                      if (isConflict) {
                        alert("Sudah ada jadwal di jam tersebut pada hari ini. Silakan pilih jam lain.");
                        return;
                      }

                      itineraryList.push(newActivity);
                      localStorage.setItem(`itinerary_${tripId}`, JSON.stringify(itineraryList));

                      closeModal();

                      router.push(`/my-plans/${tripId}`);
                    }} 
                    className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-text-light font-bold text-[14px] py-2.5 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}