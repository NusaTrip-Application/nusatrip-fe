import api from '@/lib/axios';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalUsers: number;
  totalLocations: number;
  totalPlaces: number;
  totalPublishedItineraries: number;
}

export interface UserGrowthItem {
  month: string;
  year: number;
  count: number;
}

export interface PopularDestination {
  locationId: string;
  locationName: string;
  provinceName: string;
  imageUrl: string | null;
  itineraryCount: number;
  percentage: number;
}

export interface RecentUser {
  userId: string;
  fullName: string;
  email: string;
  profilePhotoUrl: string | null;
  createdAt: string;
  accountStatus?: string;
}

export interface RecentItinerary {
  itineraryId: string;
  title: string;
  bannerImageUrl: string | null;
  locationName: string;
  userFullName: string;
  ratingValue: number;
  savedCount: number;
  createdAt: string;
}

export interface RecentReview {
  reviewId: string;
  rating: number;
  comment: string;
  createdAt: string;
  itineraryTitle: string;
  itineraryBannerUrl?: string | null;
  reviewerFullName: string;
  reviewerPhotoUrl: string | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  userGrowth: UserGrowthItem[];
  popularDestinations: PopularDestination[];
  recentUsers: RecentUser[];
  recentPublishedItineraries: RecentItinerary[];
  recentReviews: RecentReview[];
}

// ─── API ─────────────────────────────────────────────────────────────────────

export async function getAdminDashboard(): Promise<DashboardData> {
  const res = await api.get<{ success: boolean; data: DashboardData }>('/admin/dashboard');
  return res.data.data;
}
