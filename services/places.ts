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
