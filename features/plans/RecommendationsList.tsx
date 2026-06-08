"use client";

import React, { useState, useEffect } from "react";
import { notification } from "@/lib/notification";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, List, LayoutGrid, PlusCircle, X, MapPin, Clock, Globe, Phone, Ticket } from "lucide-react";
import { getRecommendationsByDestination, getItineraryById, addItineraryItem } from "@/services/plans"; 
import { getPlaceById } from "@/services/places";

const filters = ["All Spots", "NATURE", "CULTURE_HISTORY", "SHOPPING", "FOOD_DRINKS", "ENTERTAINMENT", "WELLNESS", "FAMILY", "ADVENTURE"];



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
    dates.push({
      label: formattedDate,
      value: currentDate.toISOString().split('T')[0]
    });
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
  const router = useRouter();
  const tripId = searchParams.get("tripId");

  const [destinationName, setDestinationName] = useState<string>("Destinasi");
  const [dateOptions, setDateOptions] = useState<any[]>([]);

  const timeOptions = generateTimeOptions();

  const [activeFilter, setActiveFilter] = useState("All Spots");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [modalType, setModalType] = useState<"detail" | "add" | null>(null);
  const [chosenDate, setChosenDate] = useState<string>("");

  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [chosenTime, setChosenTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const mapPlace = (p: any) => {
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';
    
    let imagesArr: string[] = [];
    if (p.images && Array.isArray(p.images)) {
      imagesArr = p.images.map((img: any) => {
        const url = typeof img === 'string' ? img : img.imageUrl;
        return url ? (url.startsWith('http') ? url : `${storageUrl}/${url.replace(/^\/+/, '')}`) : '';
      }).filter(Boolean);
    } else if (p.image) {
      const url = typeof p.image === 'string' ? p.image : p.image.imageUrl;
      if (url) imagesArr = [url.startsWith('http') ? url : `${storageUrl}/${url.replace(/^\/+/, '')}`];
    } else if (p.coverImage) {
      imagesArr = [p.coverImage];
    } else if (p.img) {
      imagesArr = [p.img];
    }

    if (imagesArr.length === 0) {
      imagesArr = ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80"];
    }

    return {
      id: p.placeId || p.id,
      name: p.placeName || p.name,
      categories: p.categories?.map((c: any) => c.categoryName) || (p.categoryName || p.category ? [p.categoryName || p.category] : ["NATURE"]),
      rating: p.ratingValue || p.rating || 4.5,
      price: (() => {
        if (p.priceMin != null && p.priceMax != null) {
          if (p.priceMin === p.priceMax) {
            return p.priceMin === 0 ? "Gratis" : `Rp ${p.priceMin.toLocaleString('id-ID')}`;
          }
          return `Rp ${p.priceMin.toLocaleString('id-ID')} - ${p.priceMax.toLocaleString('id-ID')}`;
        }
        if (p.priceMin != null) {
          return p.priceMin === 0 ? "Gratis" : `Mulai Rp ${p.priceMin.toLocaleString('id-ID')}`;
        }
        if (p.priceMax != null) {
          return p.priceMax === 0 ? "Gratis" : `Hingga Rp ${p.priceMax.toLocaleString('id-ID')}`;
        }
        if (p.estimatedPrice != null) {
          return p.estimatedPrice === 0 ? "Gratis" : `Rp ${p.estimatedPrice.toLocaleString('id-ID')}`;
        }
        if (typeof p.price === 'number') {
           return p.price === 0 ? "Gratis" : `Rp ${p.price.toLocaleString('id-ID')}`;
        }
        return p.price || "Gratis";
      })(),
      img: imagesArr[0],
      images: imagesArr,
      desc: p.shortDescription || p.description || p.desc || "Tempat wisata menarik untuk dikunjungi.",
      address: p.address || "Indonesia",
      hours: p.operationalHours ? { weekday: p.operationalHours, weekend: p.operationalHours } : (p.hours || { weekday: "08:00 - 17:00", weekend: "08:00 - 18:00" }),
      website: p.website || "#",
      phone: p.phoneNumber || p.phone || "-"
    };
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!tripId) {
          throw new Error("Trip ID tidak ditemukan di URL");
        }

        let itineraryDataRaw = await getItineraryById(tripId);
        const itineraryData = itineraryDataRaw.data || itineraryDataRaw;
        
        const locName = itineraryData.location?.name || itineraryData.location?.locationName || itineraryData.locationId || "Destinasi";
        setDestinationName(locName);
        
        const opts = generateDateOptions(itineraryData.startDate, itineraryData.endDate);
        setDateOptions(opts);

        const recommendations = await getRecommendationsByDestination(itineraryData.locationId);
        
        const recList = Array.isArray(recommendations) 
          ? recommendations 
          : (recommendations.data?.items || recommendations.data || recommendations.places || []);
          
        if (!Array.isArray(recList)) {
          console.error("Format balasan API:", recommendations);
          throw new Error("Gagal membaca daftar tempat dari server");
        }

        setPlaces(recList.map(mapPlace));

      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [tripId]);

  const openDetailModal = async (place: any) => {
    setSelectedPlace(place);
    setModalType("detail");
    setCurrentImageIndex(0);

    try {
      const fullPlace = await getPlaceById(place.id);
      if (fullPlace && fullPlace.data && fullPlace.data.images) {
        const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev';
        const fullImages = fullPlace.data.images.map((img: any) => {
          const url = typeof img === 'string' ? img : img.imageUrl;
          return url ? (url.startsWith('http') ? url : `${storageUrl}/${url.replace(/^\/+/, '')}`) : '';
        }).filter(Boolean);
        
        if (fullImages.length > 0) {
           setSelectedPlace((prev: any) => prev ? {...prev, images: fullImages} : prev);
        }
      }
    } catch (err) {
      console.error("Failed to fetch full place details for images", err);
    }
  };

  const openAddModal = (place: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlace(place);
    setModalType("add");
    setNotes("");
    
    if (dateOptions.length > 0) {
      const firstDate = dateOptions[0];
      setChosenDate(firstDate.value);
      
      const isWeekend = firstDate.label.startsWith("Sabtu") || firstDate.label.startsWith("Minggu");
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
    return place.categories.some((cat: string) => cat.toUpperCase() === activeFilter.toUpperCase());
  });

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  
  const currentPlaces = filteredPlaces.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  if (isLoading) {
    return (
      <div className="w-full text-center py-20 font-sans font-medium text-text-body">
        Sedang mencari tempat wisata terbaik...
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
          <span className="text-text-body">{destinationName} Getaway</span>
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
              {destinationName} Rekomendasi
            </h1>
            <p className="text-sm text-text-body font-medium">
              Tempat-tempat pilihan berdasarkan rencana perjalanan Anda ke {destinationName}.
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
            Tidak ada tempat wisata yang ditemukan untuk destinasi {destinationName}.
          </div>
        ) : (
          currentPlaces.map((place) => (
            <div 
              key={place.id} 
              onClick={() => openDetailModal(place)}
              className="bg-bg-surface border border-border-default rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={place.img} alt={place.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80"; }} />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                  {place.categories.slice(0, 2).map((cat: string, idx: number) => (
                    <span key={idx} className="bg-brand-primary/95 text-text-light text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">
                      {cat}
                    </span>
                  ))}
                  {place.categories.length > 2 && (
                    <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider shadow-sm">
                      +{place.categories.length - 2}
                    </span>
                  )}
                </div>
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
                  <PlusCircle size={16} /> Tambah ke Rencana
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
            <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200 h-[80vh]">
              
              {/* Left Side: Image */}
              <div className="md:w-1/2 relative bg-black group h-64 md:h-full flex-shrink-0">
                <img 
                  src={selectedPlace.images[currentImageIndex] || selectedPlace.img} 
                  alt={selectedPlace.name} 
                  className="w-full h-full object-cover transition-all duration-300" 
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80"; }} 
                />
                
                {selectedPlace.images?.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === 0 ? selectedPlace.images.length - 1 : prev - 1); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === selectedPlace.images.length - 1 ? 0 : prev + 1); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                      {selectedPlace.images.map((_: any, i: number) => (
                        <button 
                          key={i} 
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === currentImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Right Side: Info */}
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col relative overflow-y-auto custom-scrollbar">
                <button onClick={closeModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-bg-hover text-text-heading bg-bg-surface shadow-sm border border-border-default z-10 transition-colors cursor-pointer">
                  <X size={20} />
                </button>

                <div className="flex flex-wrap items-center gap-3 mb-2 pr-12">
                  <h2 className="font-serif text-[32px] font-bold text-text-heading leading-tight">{selectedPlace.name}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedPlace.categories?.map((cat: string, idx: number) => (
                      <span key={idx} className="bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                  <Star size={16} className="fill-brand-warm text-brand-warm" />
                  <span className="font-bold text-text-heading text-base">{selectedPlace.rating}</span>
                  <span>(1.280 Ulasan)</span>
                </div>

                <div className="flex items-start gap-2 text-text-heading text-sm mb-8">
                  <MapPin size={18} className="flex-shrink-0 text-text-muted" />
                  <span>{selectedPlace.address || "Alamat belum tersedia"}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-bold text-text-heading mb-3 uppercase tracking-wide">Estimasi Harga</h3>
                  <div className="bg-bg-soft-blue border border-brand-primary/20 rounded-xl p-4 flex items-center gap-3">
                    <Ticket size={20} className="text-brand-primary" />
                    <span className="text-text-heading font-medium text-[15px]">{selectedPlace.price}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-bold text-text-heading mb-3 uppercase tracking-wide">Jam Operasional</h3>
                  <div className="bg-bg-soft-blue border border-border-default rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-text-muted">Senin - Jumat</span>
                      <span className="text-brand-primary font-medium">{selectedPlace.hours?.weekday}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-text-muted">Sabtu - Minggu</span>
                      <span className="text-brand-primary font-medium">{selectedPlace.hours?.weekend}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mb-8">
                  <a href={selectedPlace.website} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 text-text-muted hover:text-brand-primary transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-border-strong flex items-center justify-center"><Globe size={20} /></div>
                    <span className="text-[11px] font-semibold">Website</span>
                  </a>
                  <a href={`tel:${selectedPlace.phone}`} className="flex flex-col items-center gap-1.5 text-text-muted hover:text-brand-primary transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-border-strong flex items-center justify-center"><Phone size={20} /></div>
                    <span className="text-[11px] font-semibold">Call</span>
                  </a>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-bold text-text-heading mb-3 uppercase tracking-wide">Deskripsi</h3>
                  <p className="text-[14px] text-text-body leading-relaxed">{selectedPlace.desc}</p>
                </div>

                <div className="mt-auto flex gap-3 pt-6 border-t border-border-default">
                  <button onClick={(e) => { closeModal(); openAddModal(selectedPlace, e as any); }} className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[14px] py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm">
                    <PlusCircle size={18} /> Tambah ke Rencana
                  </button>
                  <button onClick={closeModal} className="px-8 border border-border-default text-text-heading font-bold text-[14px] rounded-xl hover:bg-bg-hover transition-colors cursor-pointer">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalType === "add" && selectedPlace && (() => {
            const selectedDateOption = dateOptions.find(d => d.value === chosenDate) || dateOptions[0];
            const isWeekend = selectedDateOption ? (selectedDateOption.label.startsWith("Sabtu") || selectedDateOption.label.startsWith("Minggu")) : false;
            
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
                        const newDateVal = e.target.value;
                        setChosenDate(newDateVal);
                        
                        const selectedOpt = dateOptions.find(d => d.value === newDateVal);
                        const isWknd = selectedOpt ? (selectedOpt.label.startsWith("Sabtu") || selectedOpt.label.startsWith("Minggu")) : false;
                        
                        const opHours = isWknd ? selectedPlace.hours?.weekend : selectedPlace.hours?.weekday;
                        const opts = generateTimeOptionsBasedOnHours(opHours);
                        if (opts.length > 0 && !opts.includes(chosenTime)) {
                          setChosenTime(opts[0]);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none"
                    >
                      {dateOptions.map((dateObj, index) => (
                        <option key={index} value={dateObj.value}>{dateObj.label}</option>
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
                    Batal
                  </button>
                  <button 
                    onClick={async () => {
                      if (!tripId || isAdding) return;
                      setIsAdding(true);
                      try {
                        await addItineraryItem(tripId, {
                          placeId: selectedPlace.id,
                          visitDate: new Date(chosenDate).toISOString(),
                          visitTime: chosenTime,
                          notes: notes || ""
                        });
                        notification.success("Berhasil menambahkan jadwal ke rencana perjalanan!");
                        closeModal();
                        router.push(`/my-plans/${tripId}`);
                      } catch (error: any) {
                        notification.error(error.message || "Gagal menambahkan jadwal. Pastikan jam tidak bentrok.");
                      } finally {
                        setIsAdding(false);
                      }
                    }} 
                    disabled={isAdding}
                    className={`flex-1 font-bold text-[14px] py-2.5 rounded-xl transition-colors ${
                      isAdding 
                        ? "bg-brand-primary/70 cursor-not-allowed text-text-light" 
                        : "bg-brand-primary hover:bg-brand-primary-hover text-text-light"
                    }`}
                  >
                    {isAdding ? "Menambahkan..." : "Tambahkan"}
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