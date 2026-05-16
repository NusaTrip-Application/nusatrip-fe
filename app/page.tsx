import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PopularDestinations from "@/components/PopularDestinations";
import TripInspiration from "@/components/TripInspiration";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-[#F8FAFC]">
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
