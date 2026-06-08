import api from '@/lib/axios';

export interface PlaceCategory {
  categoryId: string;
  categoryName: string;
}

export interface RecommendedPlace {
  placeId: string;
  placeName: string;
  shortDescription: string | null;
  address: string;
  priceMin: number;
  priceMax: number;
  priceDescription: string | null;
  ratingValue: number | null;
  ratingCount: number;
  location: {
    locationId: string;
    locationName: string;
    province: {
      provinceId: string;
      provinceName: string;
    };
  };
  categories: PlaceCategory[];
  image: string | null;
  finalScore?: number;
}

export interface RecommendationsMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RecommendationsResponse {
  success: boolean;
  message: string;
  data: {
    items: RecommendedPlace[];
    metadata: RecommendationsMetadata;
  };
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: PlaceCategory[];
}

export const getPlaceCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await api.get('/places/categories');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getPlaceRecommendations = async (
  locationId: string,
  params?: { page?: number; limit?: number; categoryId?: string }
): Promise<RecommendationsResponse> => {
  try {
    const response = await api.get('/places/recommendations', {
      params: { locationId, ...params },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ─── ADMIN APIs ─────────────────────────────────────────────────────────────

export interface AdminPlace {
  placeId: string;
  placeName: string;
  locationId: string;
  location: {
    locationId: string;
    locationName: string;
    province: {
      provinceId: string;
      provinceName: string;
    };
  };
  categories: PlaceCategory[];
  shortDescription: string | null;
  address: string;
  priceMin: number | null;
  priceMax: number | null;
  priceDescription: string | null;
  websiteUrl: string | null;
  contactPhoneNumber: string | null;
  ratingValue: number | null;
  ratingCount: number;
  operatingHours: { dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"; openTime: string; closeTime: string }[];
  images: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPlacesMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminPlacesResponse {
  success: boolean;
  message: string;
  data: {
    items: AdminPlace[];
    metadata: AdminPlacesMetadata;
  };
}

export interface PlacesSummary {
  totalPlaces: number;
  totalActivePlaces: number;
  totalInactivePlaces: number;
}

export interface PlacesSummaryResponse {
  success: boolean;
  message: string;
  data: PlacesSummary;
}

export interface PlaceDetailResponse {
  success: boolean;
  message: string;
  data: AdminPlace; // Reusing AdminPlace for simplicity as structure is similar
}

export const getPlaceById = async (placeId: string): Promise<PlaceDetailResponse> => {
  try {
    const response = await api.get(`/places/${placeId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export interface PlacePayload {
  locationId: string;
  placeName: string;
  categories: string[]; 
  shortDescription?: string;
  address: string;
  priceMin?: number;
  priceMax?: number;
  priceDescription?: string;
  websiteUrl?: string;
  contactPhoneNumber?: string;
  ratingValue?: number;
  ratingCount?: number;
  operatingHours: { dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"; openTime: string; closeTime: string }[];
  images?: { imageUrl: string; displayOrder?: number }[];
  isActive?: boolean;
}

export const getAdminPlaces = async (params: any): Promise<AdminPlacesResponse> => {
  try {
    const response = await api.get('/admin/places', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAdminPlaceById = async (placeId: string): Promise<PlaceDetailResponse> => {
  try {
    const response = await api.get(`/admin/places/${placeId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const createPlace = async (payload: PlacePayload): Promise<PlaceDetailResponse> => {
  try {
    const response = await api.post('/admin/places', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updatePlace = async (placeId: string, payload: Partial<PlacePayload>): Promise<PlaceDetailResponse> => {
  try {
    const response = await api.patch(`/admin/places/${placeId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deletePlace = async (placeId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/admin/places/${placeId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getPlacesSummary = async (): Promise<PlacesSummaryResponse> => {
  try {
    const response = await api.get('/admin/places/summary');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
