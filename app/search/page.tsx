import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import SearchResults from "@/features/search/SearchResults";

export const metadata = {
  title: "Cari Destinasi Wisata - NusaTrip",
  description:
    "Cari dan temukan destinasi wisata terbaik di seluruh Indonesia dengan NusaTrip.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow flex justify-center py-4 md:py-6">
        <Suspense
          fallback={
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-16 text-center text-text-body font-semibold">
              Memuat hasil pencarian...
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
