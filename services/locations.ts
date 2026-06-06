import api from '@/lib/axios';

export interface Province {
  provinceId: string;
  provinceName: string;
  isActive?: boolean;
}

export interface Location {
  locationId: string;
  locationName: string;
  provinceId: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  province: Province;
}

export interface LocationsMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LocationsResponse {
  success: boolean;
  message: string;
  data: {
    items: Location[];
    metadata: LocationsMetadata;
  };
}

export interface LocationDetailResponse {
  success: boolean;
  message: string;
  data: Location;
}

export interface LocationOption {
  locationId: string;
  locationName: string;
  provinceName?: string;
}

export interface LocationOptionsResponse {
  success: boolean;
  message: string;
  data: LocationOption[];
}

export interface ProvinceOption {
  provinceId: string;
  provinceName: string;
  order?: number;
}

export interface ProvincesResponse {
  success: boolean;
  message: string;
  data: ProvinceOption[];
}

export const getLocations = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  provinceId?: string;
}): Promise<LocationsResponse> => {
  try {
    const response = await api.get('/locations', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getLocationById = async (locationId: string): Promise<LocationDetailResponse> => {
  try {
    const response = await api.get(`/locations/${locationId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getLocationOptions = async (): Promise<LocationOptionsResponse> => {
  try {
    const response = await api.get('/locations/options');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getProvinces = async (): Promise<ProvincesResponse> => {
  try {
    const response = await api.get('/locations/provinces');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
