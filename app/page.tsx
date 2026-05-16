import React from "react";
import Header from "@/components/Header";
import Hero from "@/features/home/Hero";
import PopularDestinations from "@/features/home/PopularDestinations";
import TripInspiration from "@/features/home/TripInspiration";
import Features from "@/features/home/Features";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-[1400px] px-4 md:px-8 py-8 md:py-12">
          <Hero />
          <PopularDestinations />
          <TripInspiration />
          <Features />
        </div>
      </main>

      <Footer />
      <MobileNav />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .pb-safe {
            padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
          }
        }
      `,
        }}
      />
    </div>
  );
}