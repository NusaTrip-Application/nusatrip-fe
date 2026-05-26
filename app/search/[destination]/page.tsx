import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import DestinationDetails from "@/features/search/DestinationDetails";

export const metadata = {
  title: "Detail Destinasi - NusaTrip",
  description:
    "Jelajahi informasi lengkap mengenai tempat wisata populer dan inspirasi perjalanan di NusaTrip.",
};

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 relative bg-bg-main font-sans">
      <Header />

      <main className="flex-grow flex flex-col items-center">
        <Suspense
          fallback={
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-16 text-center text-text-body font-semibold animate-pulse">
              Memuat informasi destinasi...
            </div>
          }
        >
          <DestinationDetails destinationSlug={destination} />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
