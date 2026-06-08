"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown, Search, Loader2 } from "lucide-react";
import { getLocations, getProvinces, type Location, type ProvinceOption } from "@/services/locations";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams ? searchParams.get("q") || "" : "";
  const normalizedQuery = rawQuery.toLowerCase() === "semua" ? "" : rawQuery;

  const [searchQuery, setSearchQuery] = useState(normalizedQuery);
  const [locations, setLocations] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<string>("A-Z");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 6;
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(normalizedQuery);
    setCurrentPage(1);
    setSelectedProvinceIds({});
  }, [normalizedQuery]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await getProvinces();
        if (res.success) setProvinces(res.data);
      } catch {
        // silently fail — provinces are optional UX
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const activeProvinceIds = Object.keys(selectedProvinceIds).filter(
          (id) => selectedProvinceIds[id]
        );
        const params: Parameters<typeof getLocations>[0] = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          provinceId: activeProvinceIds.length === 1 ? activeProvinceIds[0] : undefined,
        };
        const res = await getLocations(params);
        if (res.success) {
          setLocations(res.data.items);
          setTotalCount(res.data.metadata.totalItems);
        }
      } catch {
        setLocations([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [searchQuery, selectedProvinceIds, currentPage]);

  const sortedLocations = useMemo(() => {
    const copy = [...locations];
    if (sortBy === "A-Z") {
      copy.sort((a, b) => a.locationName.localeCompare(b.locationName));
    } else if (sortBy === "Z-A") {
      copy.sort((a, b) => b.locationName.localeCompare(a.locationName));
    }
    return copy;
  }, [locations, sortBy]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handleProvinceToggle = (provinceId: string) => {
    setSelectedProvinceIds((prev) => {
      const next = { ...prev, [provinceId]: !prev[provinceId] };
      if (!next[provinceId]) delete next[provinceId];
      return next;
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      gridTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10 font-sans"
      ref={gridTopRef}
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-[38px] font-serif font-bold text-text-heading leading-tight tracking-wide">
          Menampilkan hasil untuk &apos;{searchQuery || "Semua"}&apos;
        </h1>
        <p className="text-text-body text-sm md:text-base mt-2 font-medium">
          {isLoading ? "Mencari lokasi..." : `Ditemukan ${totalCount} lokasi wisata terbaik untuk perjalanan Anda.`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-[280px] bg-bg-surface border border-border-default rounded-2xl p-6 shadow-sm shrink-0">
          <div className="flex items-center justify-between pb-4 border-b border-border-default mb-5">
            <h2 className="text-lg font-bold text-text-heading tracking-wide">Filter</h2>
            <button
              onClick={() => { setSelectedProvinceIds({}); setCurrentPage(1); }}
              className="text-xs font-semibold text-brand-primary hover:underline hover:text-brand-primary-hover transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col mb-6">
            <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-3.5">PROVINSI</span>
            <div className="flex flex-col gap-3.5 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
              {provinces.map((province) => {
                const isChecked = !!selectedProvinceIds[province.provinceId];
                return (
                  <label key={province.provinceId} className="flex items-center gap-3.5 cursor-pointer select-none group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleProvinceToggle(province.provinceId)}
                        className="peer appearance-none w-[18px] h-[18px] border-2 border-border-strong rounded-md checked:bg-brand-primary checked:border-brand-primary hover:border-brand-primary transition-all duration-200 cursor-pointer"
                      />
                      <svg
                        className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className={`text-[14px] font-medium transition-colors duration-150 ${isChecked ? "text-text-heading font-semibold" : "text-text-body group-hover:text-text-heading"}`}>
                      {province.provinceName}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border-default pt-5 flex flex-col">
            <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-3">URUTKAN</span>
            <div className="relative w-full">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-[#F3F3FE] border border-border-default hover:border-border-strong rounded-lg px-4 py-3 text-[14px] font-semibold text-text-heading cursor-pointer focus:outline-none focus:ring-1 focus:ring-border-focus transition-all"
              >
                <option value="A-Z">Nama A-Z</option>
                <option value="Z-A">Nama Z-A</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-body">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full">
          {isLoading ? (
            <div className="w-full bg-bg-surface border border-border-default rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <Loader2 size={36} className="text-brand-primary animate-spin mb-4" />
              <p className="text-text-body font-medium">Memuat destinasi...</p>
            </div>
          ) : sortedLocations.length === 0 ? (
            <div className="w-full bg-bg-surface border border-border-default rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-bg-soft-blue flex items-center justify-center text-brand-primary mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-heading">Tidak Ada Hasil Ditemukan</h3>
              <p className="text-text-body text-sm mt-2 max-w-sm">
                Kami tidak dapat menemukan lokasi wisata yang sesuai. Coba kata kunci lain atau reset filter.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedProvinceIds({}); setCurrentPage(1); }}
                className="mt-6 bg-brand-primary text-text-light px-5 py-2.5 rounded-lg hover:bg-brand-primary-hover font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Reset Semua Pencarian
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedLocations.map((loc) => (
                  <div
                    key={loc.locationId}
                    className="group bg-bg-surface border border-border-default hover:border-border-strong rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                      <img
                        src={loc.imageUrl || FALLBACK_IMAGE}
                        alt={loc.locationName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                      />
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow min-h-[170px]">
                      <div>
                        <h3 className="text-lg font-semibold text-text-heading mb-1 leading-snug">{loc.locationName}</h3>
                        <span className="text-[11px] font-semibold text-brand-primary tracking-widest uppercase block mb-3">
                          {loc.province.provinceName}
                        </span>
                        {loc.description && (
                          <p className="text-[13.5px] text-text-body leading-relaxed font-medium line-clamp-2">{loc.description}</p>
                        )}
                      </div>
                      <Link
                        href={`/search/${loc.locationId}`}
                        className="text-[13.5px] font-bold text-brand-primary hover:text-brand-primary-hover transition-colors inline-flex items-center gap-1.5 mt-4 group/link"
                      >
                        Lihat Detail
                        <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded-full border border-border-default flex items-center justify-center transition-all ${currentPage === 1 ? "text-text-muted opacity-50 cursor-not-allowed" : "text-text-body hover:bg-bg-hover hover:border-border-strong cursor-pointer"}`}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition-all cursor-pointer ${isActive ? "bg-brand-primary text-text-light" : "border border-border-default text-text-body hover:bg-bg-hover hover:border-border-strong"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded-full border border-border-default flex items-center justify-center transition-all ${currentPage === totalPages ? "text-text-muted opacity-50 cursor-not-allowed" : "text-text-body hover:bg-bg-hover hover:border-border-strong cursor-pointer"}`}
                    aria-label="Next Page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
