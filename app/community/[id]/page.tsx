import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import CommunityDetail from "@/features/community/CommunityDetail";

export const metadata = {
  title: "Detail Itinerary Komunitas - NusaTrip",
  description: "Lihat detail itinerary, tempat yang dikunjungi, dan ulasan dari komunitas.",
};

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center">
        <Suspense
          fallback={
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-16 text-center text-text-body font-semibold animate-pulse">
              Memuat detail itinerary...
            </div>
          }
        >
          <CommunityDetail itineraryId={id} />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
