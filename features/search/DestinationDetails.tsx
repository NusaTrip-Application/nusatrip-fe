"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Star, Bookmark, ChevronRight, PlusCircle, Check } from "lucide-react";

interface PopularPlace {
  name: string;
  category: string;
  rating: string;
  description: string;
  priceRange: string;
  priceType: string;
  image: string;
}

interface CommunityTrip {
  title: string;
  location: string;
  rating: string;
  reviews: string;
  saved: string;
  author: string;
  avatar: string;
  image: string;
}

interface DestinationData {
  name: string;
  province: string;
  totalPlaces: string;
  bannerImage: string;
  paragraphs: string[];
  popularPlaces: PopularPlace[];
  communityInspirations: CommunityTrip[];
}

const DESTINATION_DATABASE: Record<string, DestinationData> = {
  bandung: {
    name: "Bandung",
    province: "Jawa Barat",
    totalPlaces: "342 Tempat Wisata & Populer",
    bannerImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&auto=format&fit=crop&q=80",
    paragraphs: [
      "Bandung, ibu kota Provinsi Jawa Barat, merupakan kota besar yang terletak di tengah-tengah kawasan gunung berapi dan perkebunan teh. Dikenal dengan arsitektur kolonial dan geliat seni budaya yang hidup, kota ini sering dijuluki sebagai \"Paris van Java\" (Paris-nya Jawa). Letak geografisnya yang berada di dataran tinggi menawarkan iklim yang lebih sejuk dibandingkan kebanyakan kota lain di Indonesia, menjadikannya destinasi liburan akhir pekan favorit bagi warga lokal maupun wisatawan.",
      "Mulai dari Jalan Braga yang bersejarah dengan nuansa khas Eropa hingga keajaiban alam seperti Tangkuban Perahu dan Kawah Putih, Bandung memadukan keseruan wisata kota dengan keindahan alam yang menenangkan. Kota ini juga menjadi surga bagi para pencinta kuliner dan belanja, karena menghadirkan factory outlet kelas dunia serta ragam jajanan kaki lima yang sangat kaya."
    ],
    popularPlaces: [
      {
        name: "Kawah Putih",
        category: "NATURE",
        rating: "4.8",
        description: "Experience the ethereal beauty of this white volcanic crater lake perched atop Mount Patuha.",
        priceRange: "Rp 30.000 - 80.000",
        priceType: "Entrance Fee",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80"
      },
      {
        name: "Floating Market",
        category: "FAMILY",
        rating: "4.5",
        description: "A unique destination where you can buy traditional Sundanese snacks from vendors on boats.",
        priceRange: "Rp 35.000 - 75.000",
        priceType: "Entrance Fee",
        image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=80"
      },
      {
        name: "Braga Permai",
        category: "CULINARY",
        rating: "4.6",
        description: "Savor legendary Dutch-Indonesian fusion in a historic building located at the iconic Braga...",
        priceRange: "Rp 150.000 - 300.000",
        priceType: "Price Range",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
      }
    ],
    communityInspirations: [
      {
        title: "5 Hari 4 Malam di Bandung",
        location: "Bandung, Jawa Barat",
        rating: "4.8",
        reviews: "120",
        saved: "2.5k",
        author: "Sarah Wijaya",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Weekend Seru di Yogyakarta",
        location: "Yogyakarta, DI Yogyakarta",
        rating: "4.6",
        reviews: "82",
        saved: "1.6k",
        author: "Dina Pratama",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Bali 4 Hari 3 Malam - Honeymoon",
        location: "Bali",
        rating: "4.9",
        reviews: "90",
        saved: "3.1k",
        author: "Mega Lestari",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Lombok 3 Hari 2 Malam",
        location: "Lombok, NTB",
        rating: "4.5",
        reviews: "70",
        saved: "1.7k",
        author: "Rizky Mahendra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&auto=format&fit=crop&q=80"
      }
    ]
  },
  yogyakarta: {
    name: "Yogyakarta",
    province: "DI Yogyakarta",
    totalPlaces: "215 Tempat Wisata & Populer",
    bannerImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&auto=format&fit=crop&q=80",
    paragraphs: [
      "Yogyakarta, kota budaya yang kaya akan warisan tradisi dan keindahan alam, merupakan pusat seni klasik Jawa dan kebudayaan seperti batik, balet drama Ramayana, musik instrumen gamelan, pertunjukan wayang, dan puisi. Menjadi destinasi liburan favorit karena suasananya yang hangat dan ramah.",
      "Dari keindahan Candi Prambanan yang megah, Jalan Malioboro yang meriah, hingga pantai-pantai eksotis di Gunungkidul, Yogyakarta menawarkan petualangan lengkap yang memadukan sejarah, seni, kuliner legendaris seperti gudeg, dan bentang alam yang memukau."
    ],
    popularPlaces: [
      {
        name: "Candi Prambanan",
        category: "CULTURE",
        rating: "4.9",
        description: "Explore the stunning 9th-century Hindu temple compound, dedicated to the Trimurti.",
        priceRange: "Rp 50.000 - 350.000",
        priceType: "Entrance Fee",
        image: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=800&auto=format&fit=crop&q=80"
      },
      {
        name: "Jalan Malioboro",
        category: "SHOPPING",
        rating: "4.7",
        description: "Experience the vibrant heart of Yogyakarta with street food, local crafts, and horse carriages.",
        priceRange: "Free",
        priceType: "Public Access",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
      },
      {
        name: "Gudeg Yu Djum",
        category: "CULINARY",
        rating: "4.8",
        description: "Savor the authentic sweet young jackfruit dish cooked with coconut milk and local spices.",
        priceRange: "Rp 25.000 - 80.000",
        priceType: "Price Range",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
      }
    ],
    communityInspirations: [
      {
        title: "Weekend Seru di Yogyakarta",
        location: "Yogyakarta, DI Yogyakarta",
        rating: "4.6",
        reviews: "82",
        saved: "1.6k",
        author: "Dina Pratama",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "5 Hari 4 Malam di Bandung",
        location: "Bandung, Jawa Barat",
        rating: "4.8",
        reviews: "120",
        saved: "2.5k",
        author: "Sarah Wijaya",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Bali 4 Hari 3 Malam - Honeymoon",
        location: "Bali",
        rating: "4.9",
        reviews: "90",
        saved: "3.1k",
        author: "Mega Lestari",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Lombok 3 Hari 2 Malam",
        location: "Lombok, NTB",
        rating: "4.5",
        reviews: "70",
        saved: "1.7k",
        author: "Rizky Mahendra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&auto=format&fit=crop&q=80"
      }
    ]
  },
  bali: {
    name: "Bali",
    province: "Bali",
    totalPlaces: "587 Tempat Wisata & Populer",
    bannerImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&auto=format&fit=crop&q=80",
    paragraphs: [
      "Bali, Pulau Dewata yang terkenal di seluruh penjuru dunia, menyajikan kombinasi menakjubkan antara kebudayaan spiritual Hindu, pura-pura megah di atas tebing, pantai berpasir putih, dan hutan tropis yang rimbun.",
      "Nikmati matahari terbenam yang ikonik di Tanah Lot atau Uluwatu, jelajahi pusat seni dan sawah terasering di Ubud, atau rasakan kemewahan bersantai di beach club kelas dunia di Seminyak dan Canggu."
    ],
    popularPlaces: [
      {
        name: "Pura Luhur Uluwatu",
        category: "CULTURE",
        rating: "4.9",
        description: "Witness spectacular sunsets and traditional Kecak dance performances on a cliff side temple.",
        priceRange: "Rp 50.000 - 150.000",
        priceType: "Entrance Fee",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
      },
      {
        name: "Teras Sawah Tegallalang",
        category: "NATURE",
        rating: "4.7",
        description: "Marvel at the beautiful valley of rice paddies styled in traditional Balinese cooperative irrigation.",
        priceRange: "Rp 15.000 - 25.000",
        priceType: "Entrance Fee",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
      },
      {
        name: "Nusa Penida Kelingking",
        category: "ADVENTURE",
        rating: "4.8",
        description: "Hike down to the famous T-Rex shaped coastal cliff and swim in crystal clear waters.",
        priceRange: "Rp 25.000",
        priceType: "Entrance Fee",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80"
      }
    ],
    communityInspirations: [
      {
        title: "Bali 4 Hari 3 Malam - Honeymoon",
        location: "Bali",
        rating: "4.9",
        reviews: "90",
        saved: "3.1k",
        author: "Mega Lestari",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "5 Hari 4 Malam di Bandung",
        location: "Bandung, Jawa Barat",
        rating: "4.8",
        reviews: "120",
        saved: "2.5k",
        author: "Sarah Wijaya",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Weekend Seru di Yogyakarta",
        location: "Yogyakarta, DI Yogyakarta",
        rating: "4.6",
        reviews: "82",
        saved: "1.6k",
        author: "Dina Pratama",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
      },
      {
        title: "Lombok 3 Hari 2 Malam",
        location: "Lombok, NTB",
        rating: "4.5",
        reviews: "70",
        saved: "1.7k",
        author: "Rizky Mahendra",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&auto=format&fit=crop&q=80"
      }
    ]
  }
};

const DEFAULT_POPULAR_PLACES: PopularPlace[] = [
  {
    name: "Destinasi Utama Kota",
    category: "CULTURE",
    rating: "4.7",
    description: "Explore the main historical and cultural spot that represents the rich heritage of the area.",
    priceRange: "Rp 25.000 - 50.000",
    priceType: "Entrance Fee",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Taman Alam Terbuka",
    category: "NATURE",
    rating: "4.6",
    description: "Relax in the pristine natural landscape featuring clean air, green trees, and scenic views.",
    priceRange: "Free",
    priceType: "Public Access",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Sentra Kuliner Lokal",
    category: "CULINARY",
    rating: "4.8",
    description: "Savor the unique traditional dishes and snacks crafted with love by local heritage cooks.",
    priceRange: "Rp 30.000 - 100.000",
    priceType: "Price Range",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
  }
];

const DEFAULT_COMMUNITY_INSPIRATIONS: CommunityTrip[] = [
  {
    title: "5 Hari 4 Malam di Bandung",
    location: "Bandung, Jawa Barat",
    rating: "4.8",
    reviews: "120",
    saved: "2.5k",
    author: "Sarah Wijaya",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1559628129-67cf63b72248?w=800&auto=format&fit=crop&q=80"
  },
  {
    title: "Weekend Seru di Yogyakarta",
    location: "Yogyakarta, DI Yogyakarta",
    rating: "4.6",
    reviews: "82",
    saved: "1.6k",
    author: "Dina Pratama",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
  },
  {
    title: "Bali 4 Hari 3 Malam - Honeymoon",
    location: "Bali",
    rating: "4.9",
    reviews: "90",
    saved: "3.1k",
    author: "Mega Lestari",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80"
  },
  {
    title: "Lombok 3 Hari 2 Malam",
    location: "Lombok, NTB",
    rating: "4.5",
    reviews: "70",
    saved: "1.7k",
    author: "Rizky Mahendra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&auto=format&fit=crop&q=80"
  }
];

export default function DestinationDetails({ destinationSlug }: { destinationSlug: string }) {
  const normalizedSlug = destinationSlug.toLowerCase().trim();
  const data = DESTINATION_DATABASE[normalizedSlug] || {
    name: destinationSlug.charAt(0).toUpperCase() + destinationSlug.slice(1).replace(/-/g, " "),
    province: "Indonesia",
    totalPlaces: "128 Tempat Wisata & Populer",
    bannerImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    paragraphs: [
      `${destinationSlug.charAt(0).toUpperCase() + destinationSlug.slice(1).replace(/-/g, " ")} adalah destinasi wisata yang menawarkan pesona tersendiri. Dikenal dengan keramahan penduduknya serta kekayaan budayanya yang memukau bagi setiap pengunjung.`,
      "Nikmati keindahan lanskap alam yang asri, dipadukan dengan berbagai destinasi modern dan kuliner lokal khas daerah setempat yang menanti untuk dijelajahi."
    ],
    popularPlaces: DEFAULT_POPULAR_PLACES,
    communityInspirations: DEFAULT_COMMUNITY_INSPIRATIONS
  };

  const [addedItineraries, setAddedItineraries] = useState<Record<string, boolean>>({});
  const [savedCommunity, setSavedCommunity] = useState<Record<number, boolean>>({});
  const toggleSaveCommunity = (idx: number) => setSavedCommunity(prev => ({ ...prev, [idx]: !prev[idx] }));

  const toggleItinerary = (placeName: string) => {
    setAddedItineraries((prev) => ({
      ...prev,
      [placeName]: !prev[placeName]
    }));
  };

  return (
    <div className="w-full font-sans text-text-body bg-bg-main">
      {/* Banner Hero */}
      <div
        className="relative w-full h-[320px] md:h-[420px] bg-cover bg-center flex flex-col justify-end"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)), url(${data.bannerImage})` }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pb-8 md:pb-12 text-white">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-[11px] md:text-[13px] font-semibold text-white/85 uppercase tracking-wider mb-2 md:mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="opacity-80" />
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
            <ChevronRight size={12} className="opacity-80" />
            <span className="text-white font-bold">{data.name}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide drop-shadow-md mb-2 md:mb-3">
            {data.name}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] md:text-[15px] font-semibold text-white/95 mb-5 md:mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-white/80" />
              <span>{data.province}, Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span>{data.totalPlaces}</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs md:text-sm px-5 py-2.5 md:px-6 md:py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
            Mulai Rencanakan Trip
          </button>
        </div>
      </div>

      {/* Description Content */}
      <div className="bg-bg-surface w-full py-8 md:py-12 border-b border-border-default">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-[1020px] flex flex-col gap-5 text-[14px] md:text-[16px] leading-[1.7] text-text-body font-medium">
            {data.paragraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Places Section */}
      <div className="w-full bg-[#F5F6FF] py-10 md:py-14 border-b border-border-default">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-text-heading leading-tight">
                Tempat Populer di {data.name}
              </h2>
              <p className="text-text-body text-[13px] md:text-[15px] mt-1.5 font-medium">
                Destinasi yang paling sering dikunjungi para traveler.
              </p>
            </div>
            <Link
              href={`/search?q=${encodeURIComponent(data.name)}`}
              className="text-brand-primary font-bold flex items-center gap-1.5 hover:text-brand-primary-hover hover:underline text-sm cursor-pointer shrink-0"
            >
              Lihat Semua
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.popularPlaces.map((place, idx) => {
              const isAdded = addedItineraries[place.name];
              return (
                <div
                  key={idx}
                  className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Card Image and Badge */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-4.5 left-4.5 bg-brand-primary/85 text-[10px] md:text-[11px] font-bold text-white px-2.5 py-1 rounded-md tracking-wider">
                      {place.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-grow min-h-[200px]">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-lg font-semibold text-text-heading leading-snug">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[13.5px] font-bold text-[#2563EB] shrink-0">
                          <Star size={15} className="text-[#2563EB] fill-[#2563EB]" />
                          <span>{place.rating}</span>
                        </div>
                      </div>

                      <p className="text-[13px] md:text-[14px] text-text-body leading-relaxed font-normal mb-4 line-clamp-2">
                        {place.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between border-t border-border-default pt-4 mb-4">
                        <span className="text-[13px] md:text-[14px] font-semibold text-text-heading">
                          {place.priceRange}
                        </span>
                        <span className="text-[11px] font-normal text-text-muted uppercase tracking-wider">
                          {place.priceType}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleItinerary(place.name)}
                        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all border ${isAdded
                            ? "bg-bg-soft-green border-brand-accent text-brand-accent hover:bg-brand-accent/10"
                            : "bg-brand-primary border-brand-primary text-white hover:bg-brand-primary-hover shadow-sm"
                          }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            Added to Itinerary
                          </>
                        ) : (
                          <>
                            <PlusCircle size={16} />
                            Add to Itinerary
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Community Inspirations Section */}
      <div className="w-full bg-bg-surface py-10 md:py-14">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-text-heading leading-tight">
              Inspirasi Komunitas
            </h2>
            <Link
              href="/community"
              className="text-brand-primary font-bold flex items-center gap-1.5 hover:text-brand-primary-hover hover:underline text-sm cursor-pointer shrink-0"
            >
              Lihat Semua
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.communityInspirations.map((trip, idx) => (
              <div
                key={idx}
                className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                {/* Image & Save */}
                <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white hover:bg-bg-hover flex items-center justify-center shadow-md transition-colors cursor-pointer border border-border-default"
                    onClick={() => toggleSaveCommunity(idx)}
                  >
                    <Bookmark
                      size={14}
                      className={`transition-colors ${
                        savedCommunity[idx]
                          ? "text-brand-primary fill-brand-primary"
                          : "text-brand-primary fill-transparent hover:fill-brand-primary"
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-grow min-h-[170px]">
                  <div>
                    <h3 className="text-[14px] md:text-[15px] font-semibold text-text-heading leading-snug line-clamp-1 mb-1">
                      {trip.title}
                    </h3>
                    <span className="text-[11px] md:text-[12px] font-normal text-text-body block mb-3">
                      {trip.location}
                    </span>

                    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[11px] md:text-[12px] font-medium mb-4 text-text-body">
                      <div className="flex items-center gap-1 text-[#BC4800] font-bold">
                        <Star size={13} className="text-[#BC4800] fill-[#BC4800]" />
                        <span>{trip.rating}</span>
                        <span className="text-text-muted font-normal">({trip.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark size={13} className="text-text-muted" />
                        <span>{trip.saved} saved</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-default pt-3 mt-auto flex items-center gap-2">
                    <img
                      src={trip.avatar}
                      alt={trip.author}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-border-default"
                    />
                    <span className="text-[11.5px] md:text-[12.5px] font-semibold text-text-heading line-clamp-1">
                      {trip.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
