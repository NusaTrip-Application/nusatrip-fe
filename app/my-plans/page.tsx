import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import CreatePlanForm from "@/features/plans/CreatePlanForm";

export default function MyPlansPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow flex justify-center px-4 py-10 md:py-16">
        <Suspense fallback={<div className="p-8">Memuat formulir...</div>}>
          <CreatePlanForm />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}