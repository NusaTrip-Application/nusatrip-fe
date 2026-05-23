import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import MyPlansDashboard from "@/features/plans/MyPlansDashboard";

export default function MyPlansPage() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow flex justify-center px-4 md:px-8 py-8 md:py-12">
        <MyPlansDashboard />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}