export interface Destination {
  id: string;
  name: string;
  province: string;
  image: string;
  description: string;
}

export const INDONESIAN_PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Kepulauan Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "DKI Jakarta",
  "Banten",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua Barat",
  "Papua",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Barat Daya",
];

// dummy data by orang ganteng
export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Bandung",
    province: "Jawa Barat",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60",
    description:
      "Terkenal dengan pura di atas tebing yang megah dan pertunjukan Tari Kecak tradisional...",
  },
  {
    id: "2",
    name: "Bogor",
    province: "Jawa Barat",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=60",
    description:
      "Pusat budaya dan seni di Bali yang menawarkan pemandangan sawah terasering yang indah...",
  },
  {
    id: "3",
    name: "Bekasi",
    province: "Jawa Barat",
    image:
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=60",
    description:
      "Surga tersembunyi dengan pantai-pantai ikonik dan tebing curam yang menakjubkan...",
  },
  {
    id: "4",
    name: "Banjar",
    province: "Jawa Barat",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
    description:
      "Kawasan elit yang menawarkan butik fashion, restoran kelas dunia, dan sunset pantai indah...",
  },
  {
    id: "5",
    name: "Batam",
    province: "Kepulauan Riau",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60",
    description:
      "Nikmati udara sejuk pegunungan dengan pemandangan spektakuler danau kawah yang megah...",
  },
  {
    id: "6",
    name: "Buleleng",
    province: "Bali",
    image:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?w=800&auto=format&fit=crop&q=60",
    description:
      "Destinasi populer bagi peselancar dan pengembara digital dengan suasana santai...",
  },
  {
    id: "7",
    name: "Banyuwangi",
    province: "Jawa Timur",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=60",
    description:
      "Terkenal dengan kawah Ijen yang memukau dan keunikan fenomena api biru (blue fire)...",
  },
  {
    id: "8",
    name: "Balikpapan",
    province: "Kalimantan Timur",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    description:
      "Kota pesisir modern sebagai pintu gerbang utama Kalimantan dengan pantai yang menawan...",
  },
  {
    id: "9",
    name: "Banda Aceh",
    province: "Aceh",
    image:
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=60",
    description:
      "Serambi Mekkah dengan warisan sejarah Masjid Raya Baiturrahman yang megah dan kokoh...",
  },
  {
    id: "10",
    name: "Bandar Lampung",
    province: "Lampung",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=60",
    description:
      "Gerbang Sumatera dengan keindahan Pulau Pahawang dan atraksi lumba-lumba Teluk Kiluan...",
  },
  {
    id: "11",
    name: "Bukittinggi",
    province: "Sumatera Barat",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=60",
    description:
      "Pemandangan Ngarai Sianok yang hijau dan sejarah megah Jam Gadang di pusat kota...",
  },
  {
    id: "12",
    name: "Biak",
    province: "Papua",
    image:
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&auto=format&fit=crop&q=60",
    description:
      "Surga tropis tersembunyi di Indonesia Timur dengan keindahan terumbu karang dan pantai berpasir putih...",
  },
  {
    id: "13",
    name: "Jakarta Selatan",
    province: "DKI Jakarta",
    image:
      "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&auto=format&fit=crop&q=60",
    description:
      "Pusat gaya hidup urban modern dengan deretan mall premium, kafe estetik, dan area perkantoran elit...",
  },
  {
    id: "14",
    name: "Yogyakarta",
    province: "DI Yogyakarta",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&auto=format&fit=crop&q=60",
    description:
      "Kota budaya yang kaya akan warisan tradisi, keramahan lokal, dan keindahan Candi Prambanan...",
  },
  {
    id: "15",
    name: "Malang",
    province: "Jawa Timur",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&auto=format&fit=crop&q=60",
    description:
      "Kota sejuk pegunungan yang dekat dengan keindahan magis kawasan Taman Nasional Bromo Tengger Semeru...",
  },
  {
    id: "16",
    name: "Lombok",
    province: "Nusa Tenggara Barat",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&auto=format&fit=crop&q=60",
    description:
      "Pesona alam tropis Gili Trawangan, Sirkuit Mandalika yang megah, serta keindahan Gunung Rinjani...",
  },
  {
    id: "17",
    name: "Raja Ampat",
    province: "Papua Barat",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=60",
    description:
      "Episentrum keanekaragaman hayati laut dunia dengan pemandangan gugusan pulau karang yang menakjubkan...",
  },
  {
    id: "18",
    name: "Manado",
    province: "Sulawesi Utara",
    image:
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&auto=format&fit=crop&q=60",
    description:
      "Keindahan ekosistem terumbu karang kelas dunia di kawasan Taman Nasional Bunaken...",
  },
  {
    id: "19",
    name: "Labuan Bajo",
    province: "Nusa Tenggara Timur",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=60",
    description:
      "Petualangan melihat komodo purba, mendaki Pulau Padar, dan bersantai di Pantai Pink yang memukau...",
  },
  {
    id: "20",
    name: "Medan",
    province: "Sumatera Utara",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=60",
    description:
      "Surga kuliner nusantara dengan akses mudah menuju kemegahan alam legendaris Danau Toba...",
  },
];
