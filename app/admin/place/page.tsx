import type { Metadata } from "next";
import PlaceManagement from "@/features/admin/PlaceManagement";

export const metadata: Metadata = {
  title: "Place Management – Admin NusaTrip",
  description: "Kelola semua data tempat wisata di NusaTrip",
};

export default function AdminPlacePage() {
  return <PlaceManagement />;
}
