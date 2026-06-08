import type { Metadata } from "next";
import LocationManagement from "@/features/admin/LocationManagement";

export const metadata: Metadata = {
  title: "Location Management – Admin NusaTrip",
  description: "Kelola semua data lokasi wisata di NusaTrip",
};

export default function AdminLocationPage() {
  return <LocationManagement />;
}
