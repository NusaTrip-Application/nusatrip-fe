"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, List, LayoutGrid, PlusCircle, X, MapPin, Clock, Globe, Phone } from "lucide-react";
import { getRecommendationsByDestination, getItineraryById, addItineraryItem } from "@/services/plans"; 

const filters = ["All Spots", "Nature", "Culinary", "Architecture", "Art & Culture", "Family"];



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

  const mapPlace = (p: any) => ({
    id: p.placeId || p.id,
    name: p.placeName || p.name,
    category: p.categories && p.categories.length > 0 ? p.categories[0].categoryName : (p.categoryName || p.category || "NATURE"),
    rating: p.ratingValue || p.rating || 4.5,
    price: p.priceMax ? `Rp ${p.priceMax.toLocaleString('id-ID')}` : (p.estimatedPrice ? `Rp ${p.estimatedPrice.toLocaleString('id-ID')}` : (p.price || "Free")),
    img: p.image?.imageUrl || p.coverImage || p.img || "https://images.unsplash.com/photo-1583130190518-e397cff177ce?w=500&auto=format&fit=crop&q=60",
    desc: p.shortDescription || p.description || p.desc || "Tempat wisata menarik untuk dikunjungi.",
    address: p.address || "Indonesia",
    hours: p.operationalHours ? { weekday: p.operationalHours, weekend: p.operationalHours } : (p.hours || { weekday: "08:00 - 17:00", weekend: "08:00 - 18:00" }),
    website: p.website || "#",
    phone: p.phoneNumber || p.phone || "-"
  });

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

  const openDetailModal = (place: any) => {
    setSelectedPlace(place);
    setModalType("detail");
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
                    <PlusCircle size={18} /> Tambah ke Rencana
                  </button>
                  <button onClick={closeModal} className="px-6 border border-border-strong text-text-heading font-bold text-[14px] rounded-xl hover:bg-bg-hover transition-colors">
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
                        alert("Berhasil menambahkan jadwal ke rencana perjalanan!");
                        closeModal();
                        router.push(`/my-plans/${tripId}`);
                      } catch (error: any) {
                        alert(error.message || "Gagal menambahkan jadwal. Pastikan jam tidak bentrok.");
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