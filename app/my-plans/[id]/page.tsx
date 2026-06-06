"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, MapPin, Plus, Map, Settings, MoreVertical, Star, X, Edit2, Trash2, AlertTriangle, Loader2, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import { getItineraryById, updateItineraryItem, deleteItineraryItem, updateItineraryBudget } from "@/services/plans";

const generateTimeOptions = () => {
  const times = [];
  for (let i = 6; i <= 22; i++) {
    times.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return times;
};

const generateTripDates = (startDate: string, endDate: string) => {
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

const formatTripRange = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return "Tanggal tidak ditentukan";
  const startObj = new Date(startStr);
  const endObj = new Date(endStr);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const startFormatted = startObj.toLocaleDateString('id-ID', options);
  const endFormatted = endObj.toLocaleDateString('id-ID', { ...options, year: 'numeric' });

  return `${startFormatted} - ${endFormatted}`;
};

const parsePriceToNumber = (priceVal: string | number) => {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal || String(priceVal).toLowerCase().includes("free")) return 0;
  const cleanStr = String(priceVal).replace(/[^0-9-]/g, "");
  const priceArray = cleanStr.split("-");

  const maxPrice = priceArray.length > 1 ? parseInt(priceArray[1]) : parseInt(priceArray[0]);

  return isNaN(maxPrice) ? 0 : maxPrice;
};

export default function ManageTripPage() {
  const { id } = useParams();

  const [tripData, setTripData] = useState<any>({
    title: "Memuat Rencana Perjalanan...",
    destination: "Memuat...",
    startDate: "2026-05-20",
    endDate: "2026-05-21",
    pax: 1,
    budget: 0
  });

  const tripDates = generateTripDates(tripData.startDate, tripData.endDate);
  const [activeDate, setActiveDate] = useState<string>("");

  const [timelineData, setTimelineData] = useState<any[]>([]);

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editBudgetAmount, setEditBudgetAmount] = useState("");
  const [rawData, setRawData] = useState<any>(null);

  const timeOptions = generateTimeOptions();

  const fetchItinerary = async () => {
    try {
      setIsLoading(true);
      let res = await getItineraryById(id as string);
      const data = res.data || res;
      
      const locName = data.location?.name || data.location?.locationName || "Destinasi";
      
      setTripData({
        title: data.title || "Untitled Plan",
        destination: locName,
        startDate: data.startDate,
        endDate: data.endDate,
        pax: data.travelerCount || 1,
        budget: data.estimatedTotalBudget || data.budgetPreference || 7000000,
        isPublic: data.visibilityStatus === "PUBLISHED" || data.visibilityStatus === "PUBLIC",
        bannerImage: (data.bannerPhotoUrl || data.bannerImageUrl) ? ((data.bannerPhotoUrl || data.bannerImageUrl).startsWith('http') ? (data.bannerPhotoUrl || data.bannerImageUrl) : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://pub-22677bc3c0fc46d383a098fbc5cb784e.r2.dev'}/${data.bannerPhotoUrl || data.bannerImageUrl}`) : "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=80"
      });

      const dates = generateTripDates(data.startDate, data.endDate);
      if (dates.length > 0 && !activeDate) {
        setActiveDate(dates[0].value);
      }
      
      let items: any[] = [];
      if (data.itineraryItemsByDay) {
        Object.values(data.itineraryItemsByDay).forEach((dayItems: any) => {
          if (Array.isArray(dayItems)) items.push(...dayItems);
        });
      } else if (data.items || data.itineraryItems) {
        items = data.items || data.itineraryItems || [];
      }
      const parsedItems = items.map((item: any) => ({
        id: item.itineraryItemId || item.id,
        time: item.visitTime || item.time,
        date: item.visitDate ? new Date(item.visitDate).toISOString().split('T')[0] : item.date,
        title: item.place?.placeName || item.place?.name || item.title || "Unknown Place",
        subtitle: item.place?.address || item.subtitle || "",
        category: item.place?.categories?.[0]?.categoryName || item.category || "General",
        rating: item.place?.ratingValue || item.rating || 4.5,
        img: item.place?.image?.imageUrl || item.place?.coverImage || item.img || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&auto=format&fit=crop&q=60",
        notes: item.notes || "",
        price: item.place?.priceMax || item.price || 0
      }));

      parsedItems.sort((a: any, b: any) => a.time.localeCompare(b.time));
      setTimelineData(parsedItems);
    } catch (error) {
      console.error("Gagal memuat detail rencana:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const currentDayTimeline = timelineData.filter((item) => item.date === activeDate);

  const totalSpent = timelineData.reduce((total, item) => {
    const itemPrice = item.price ? parsePriceToNumber(item.price) : 0;
    return total + itemPrice;
  }, 0);

  const remainingBudget = tripData.budget - totalSpent;

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      setIsSaving(true);
      await deleteItineraryItem(id as string, itemToDelete.id);
      await fetchItinerary();
      setItemToDelete(null);
    } catch (e: any) {
      alert(e.message || "Gagal menghapus item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEdit = (item: any) => {
    setItemToEdit(item);
    setEditTime(item.time);
    setEditNotes(item.notes);
    setEditDate(item.date || (tripDates[0] ? tripDates[0].value : ""));
  };

  const handleSaveEdit = async () => {
    if (!itemToEdit) return;
    try {
      setIsSaving(true);
      await updateItineraryItem(id as string, itemToEdit.id, {
        visitTime: editTime,
        notes: editNotes,
        visitDate: new Date(editDate).toISOString()
      });
      await fetchItinerary();
      setItemToEdit(null);
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBudget = async () => {
    try {
      setIsSaving(true);
      const newBudget = parseInt(editBudgetAmount.replace(/[^0-9]/g, "")) || 0;
      await updateItineraryBudget(id as string, newBudget);
      await fetchItinerary();
      setIsEditingBudget(false);
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan budget");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main font-sans flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-primary mb-4" />
          <p className="text-text-muted font-medium">Memuat rencana perjalanan...</p>
        </div>
        {/* MobileNav not strictly required but adding it for consistency if needed, wait, it wasn't there before */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main font-sans pb-20">
      <Header />

      <div className="relative w-full h-[280px] md:h-[320px]">
        <img src={tripData.bannerImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 h-full flex flex-col justify-end pb-10 text-white">
          <div className="text-[12px] md:text-[13px] font-medium mb-2 flex items-center gap-1 opacity-90">
            {/* Mobile View: Back Button Only */}
            <Link href="/my-plans" className="md:hidden flex items-center justify-center p-1 -ml-2 hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft size={28} className="text-white" />
            </Link>

            {/* Desktop View: Full Breadcrumb */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/my-plans" className="hover:underline hover:text-white transition-colors">
                My Plans
              </Link>
              <span className="text-white/70"> &gt; </span>
              <span className="text-white/70 truncate max-w-[300px]">{tripData.title}</span>
            </div>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-serif font-bold leading-tight mb-4">
            {tripData.title}
          </h1>
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
            <div className="bg-bg-surface border border-border-default rounded-2xl p-3 flex flex-col gap-1 shadow-sm">
              <SidebarItem icon={<Map size={18} />} label="View Itinerary" active />
              {tripData.isPublic && (
                <SidebarItem icon={<Users size={18} />} label="Community" href={`/my-plans/${id}/community`} />
              )}
              <SidebarItem icon={<Settings size={18} />} label="Settings" href={`/my-plans/${id}/settings`} />
            </div>

            <div className="bg-brand-primary text-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-[18px]">Trip Budgeting</h3>
                {!isEditingBudget && (
                  <button onClick={() => { setIsEditingBudget(true); setEditBudgetAmount(String(tripData.budget)); }} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
              <div className="mb-4">
                <p className="text-[12px] opacity-80 font-medium mb-1">Jumlah Anggaran</p>
                {isEditingBudget ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="relative flex-grow">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-primary font-bold text-[14px]">Rp</span>
                      <input 
                        type="text" 
                        value={editBudgetAmount ? Number(String(editBudgetAmount).replace(/[^0-9]/g, "")).toLocaleString("id-ID") : ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setEditBudgetAmount(val);
                        }}
                        className="w-full bg-white text-text-heading rounded-lg pl-9 pr-3 py-2 text-[14px] font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="0"
                      />
                    </div>
                    <button 
                      onClick={handleSaveBudget}
                      disabled={isSaving}
                      className="bg-brand-warm text-brand-primary px-3 py-2 rounded-lg text-[13px] font-bold hover:bg-brand-warm/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Simpan"}
                    </button>
                    <button 
                      onClick={() => setIsEditingBudget(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <p className="font-bold text-[16px]">Rp {Number(tripData.budget).toLocaleString("id-ID")}</p>
                )}
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-[12px] opacity-80 font-medium mb-1">Anggaran Tersisa</p>
                <p className={`font-bold text-[16px] ${remainingBudget < 0 ? "text-red-300" : ""}`}>
                  Rp {remainingBudget.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow min-w-0">

            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
              {tripDates.map((dateObj, index) => (
                <button
                  key={dateObj.value}
                  onClick={() => setActiveDate(dateObj.value)}
                  className={`flex flex-col items-center justify-center min-w-[80px] py-2.5 rounded-xl border transition-colors ${activeDate === dateObj.value
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg-surface text-text-heading border-border-default hover:bg-bg-hover'
                    }`}
                >
                  <span className="text-[14px] font-bold">Hari {index + 1}</span>
                  <span className={`text-[11px] font-medium ${activeDate === dateObj.value ? 'text-white/80' : 'text-text-muted'}`}>
                    {dateObj.label.split(',')[1]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[24px] font-serif font-bold text-text-heading">
                Hari {tripDates.findIndex(d => d.value === activeDate) + 1}
              </h2>

              <Link
                href={`/my-plans/recommendation?destination=${tripData.destination}&tripId=${id}&start=${tripData.startDate}&end=${tripData.endDate}`}
                className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-brand-primary-hover transition-colors"
              >
                <Plus size={16} /> Tambah Tempat
              </Link>
            </div>

            <div className="space-y-0">
              {currentDayTimeline.length === 0 ? (
                <div className="text-center py-12 text-text-muted font-medium bg-bg-surface rounded-2xl border border-dashed border-border-default">
                  Belum ada tempat di jadwal hari ini. Klik "Tambah Tempat" untuk memulai!
                </div>
              ) : (
                currentDayTimeline.map((item, index) => (
                  <TimelineItem
                    key={item.id}
                    data={item}
                    isLast={index === currentDayTimeline.length - 1}
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => setItemToDelete(item)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4 text-error">
              <div className="bg-error/10 p-3 rounded-full"><AlertTriangle size={32} /></div>
            </div>
            <h3 className="font-bold text-[18px] text-text-heading text-center mb-2">Hapus Item Jadwal?</h3>
            <p className="text-[13px] text-text-muted text-center mb-6">Anda yakin ingin menghapus <b>{itemToDelete.title}</b> dari rencana?</p>
            <div className="flex gap-3">
              <button onClick={() => setItemToDelete(null)} disabled={isSaving} className="flex-1 py-2.5 border border-border-strong text-text-heading font-bold text-[14px] rounded-xl hover:bg-bg-hover">Batal</button>
              <button onClick={handleDeleteConfirm} disabled={isSaving} className="flex-1 bg-error hover:bg-red-600 text-white font-bold text-[14px] py-2.5 rounded-xl flex justify-center items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToEdit && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-[18px] text-text-heading">Edit Rencana</h3>
              <button onClick={() => setItemToEdit(null)} className="text-text-muted hover:text-text-heading"><X size={20} /></button>
            </div>

            <div className="flex items-center gap-3 bg-bg-main p-3 rounded-lg border border-border-default mb-5">
              <img src={itemToEdit.img} alt="" className="w-12 h-12 rounded-md object-cover" />
              <div>
                <p className="text-[14px] font-bold text-text-heading">{itemToEdit.title}</p>
                <p className="text-[11px] font-medium text-text-muted">{itemToEdit.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[12px] font-bold text-text-heading mb-1.5">Pilih Hari</label>
                <select
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  {tripDates.map((dateObj, idx) => (
                    <option key={idx} value={dateObj.value}>{dateObj.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-text-heading mb-1.5">Waktu Kunjungan</label>
                <select
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none"
                >
                  {timeOptions.map((time, idx) => (
                    <option key={idx} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-text-heading mb-1.5">Catatan</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-surface text-[14px] font-medium focus:ring-1 focus:ring-brand-primary outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setItemToEdit(null)} disabled={isSaving} className="flex-1 py-2.5 border border-border-strong text-text-heading font-bold text-[14px] rounded-xl hover:bg-bg-hover">Batal</button>
              <button onClick={handleSaveEdit} disabled={isSaving} className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-text-light font-bold text-[14px] py-2.5 rounded-xl flex justify-center items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
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

function TimelineItem({ data, isLast, onEdit, onDelete }: { data: any; isLast: boolean; onEdit: () => void; onDelete: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex gap-4 md:gap-6 relative">
      <div className="flex flex-col items-center mt-1">
        <div className="w-4 h-4 rounded-full border-2 border-brand-primary bg-bg-surface z-10 flex-shrink-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
        </div>
        {!isLast && <div className="w-[2px] h-full bg-border-default -mt-2 pb-8"></div>}
      </div>

      <div className="flex-grow pb-10">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-[15px] text-brand-primary">{data.time}</span>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-text-muted hover:text-text-heading rounded-md hover:bg-bg-hover"><MoreVertical size={18} /></button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 top-8 w-36 bg-bg-surface border border-border-default shadow-lg rounded-xl overflow-hidden z-20 py-1">
                  <button onClick={() => { onEdit(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-text-heading hover:bg-bg-hover flex items-center gap-2"><Edit2 size={14} /> Edit Data</button>
                  <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-error hover:bg-error/10 flex items-center gap-2"><Trash2 size={14} /> Hapus Item</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative h-40 md:h-48 w-full rounded-2xl overflow-hidden mb-3 shadow-sm group cursor-pointer">
          <img src={data.img} alt={data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-wider">{data.category}</div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <h4 className="font-serif font-bold text-[18px] md:text-[20px] text-white leading-tight mb-1">{data.title}</h4>
              <p className="text-[12px] font-medium text-white/80">{data.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 text-[14px] font-bold text-white bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
              <Star size={14} className="fill-brand-warm text-brand-warm" /> {data.rating}
            </div>
          </div>
        </div>
        <p className="text-[13px] md:text-[14px] text-text-body font-medium leading-relaxed">Notes: {data.notes}</p>
      </div>
    </div>
  );
}