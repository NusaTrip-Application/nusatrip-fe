import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import RecommendationsList from "@/features/plans/RecommendationsList";

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <Suspense fallback={<div className="p-8 font-medium">Memuat rekomendasi...</div>}>
          <RecommendationsList />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}