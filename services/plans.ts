import api from '@/lib/axios';

export interface CreateItineraryPayload {
  title: string;
  locationId: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetPreference: number;
  interestSummary?: string[];
}

export interface ItineraryItem {
  placeId: string;
  visitDate: string;
  visitTime: string;
  notes?: string;
}

export async function getLocationOptions() {
  try {
    const response = await api.get('/locations/options');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getPlaceCategories() {
  try {
    const response = await api.get('/places/categories');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function createItinerary(payload: CreateItineraryPayload) {
  try {
    const response = await api.post('/itineraries', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getMyItineraries(params?: { page?: number; limit?: number }) {
  try {
    const response = await api.get('/itineraries', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getItineraryById(itineraryId: string) {
  try {
    const response = await api.get(`/itineraries/${itineraryId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function updateItinerary(itineraryId: string, payload: Partial<CreateItineraryPayload> & { visibilityStatus?: string }) {
  try {
    const response = await api.patch(`/itineraries/${itineraryId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function deleteItinerary(itineraryId: string) {
  try {
    const response = await api.delete(`/itineraries/${itineraryId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function addItineraryItem(itineraryId: string, payload: ItineraryItem) {
  try {
    const response = await api.post(`/itineraries/${itineraryId}/items`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getRecommendationsByDestination(locationId: string) {
  try {
    const response = await api.get('/places/recommendations', {
      params: { locationId },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function updateItineraryBudget(itineraryId: string, estimatedTotalBudget: number) {
  try {
    const response = await api.patch(`/itineraries/${itineraryId}/budget`, { estimatedTotalBudget });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getCommunityItineraries(params?: { search?: string; sort?: string; page?: number; limit?: number }) {
  try {
    const response = await api.get('/itineraries/community', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function updateItineraryItem(itineraryId: string, itemId: string, payload: Partial<ItineraryItem>) {
  try {
    const response = await api.patch(`/itineraries/${itineraryId}/items/${itemId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function deleteItineraryItem(itineraryId: string, itemId: string) {
  try {
    const response = await api.delete(`/itineraries/${itineraryId}/items/${itemId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getSavedItineraries(params?: { page?: number; limit?: number }) {
  try {
    const response = await api.get('/itineraries/saved', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function toggleSaveItinerary(itineraryId: string) {
  try {
    const response = await api.post(`/itineraries/${itineraryId}/save`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getCommunitySummary(itineraryId: string) {
  try {
    const response = await api.get(`/itineraries/community/${itineraryId}/summary`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getOtherAuthorItineraries(itineraryId: string) {
  try {
    const response = await api.get(`/itineraries/community/${itineraryId}/author-others`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function duplicateItinerary(itineraryId: string) {
  try {
    const response = await api.post(`/itineraries/${itineraryId}/duplicate`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

// ─── Admin Itinerary Types ──────────────────────────────────────────────────────

export type VisibilityStatus = 'PUBLISHED' | 'PRIVATE';

export interface AdminItinerary {
  itineraryId: string;
  userId: string;
  locationId: string;
  title: string;
  description: string | null;
  bannerImageUrl: string | null;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetPreference: number | null;
  visibilityStatus: VisibilityStatus;
  estimatedTotalBudget: number | null;
  createdAt: string;
  updatedAt: string;
  location: {
    locationId: string;
    locationName: string;
    province: {
      provinceId: string;
      provinceName: string;
    };
  };
  user: {
    userId: string;
    fullName: string;
    email: string;
    photoUrl: string | null;
  };
  interestCategories: {
    categoryId: string;
    categoryName: string;
  }[];
  itemCount: number;
}

export interface AdminItinerariesMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminItinerariesResponse {
  success: boolean;
  message: string;
  data: {
    items: AdminItinerary[];
    metadata: AdminItinerariesMetadata;
  };
}

export interface ItinerarySummaryResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    totalPublished: number;
    totalPrivate: number;
  };
}

// ─── Admin Itinerary API Functions ─────────────────────────────────────────────

export async function getAdminItineraries(params?: {
  search?: string;
  status?: VisibilityStatus;
  locationId?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<AdminItinerariesResponse> {
  try {
    const response = await api.get('/admin/itineraries', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getAdminItinerarySummary(): Promise<ItinerarySummaryResponse> {
  try {
    const response = await api.get('/admin/itineraries/summary');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function adminDeleteItinerary(itineraryId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/itineraries/${itineraryId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
