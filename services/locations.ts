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

export const getAdminLocations = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  provinceId?: string;
  status?: "active" | "inactive";
  sortBy?: string;
}): Promise<LocationsResponse> => {
  try {
    const response = await api.get('/admin/locations', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getAdminLocationById = async (locationId: string): Promise<LocationDetailResponse> => {
  try {
    const response = await api.get(`/admin/locations/${locationId}`);
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

export interface LocationPayload {
  locationName: string;
  provinceId: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export const createLocation = async (payload: LocationPayload): Promise<LocationDetailResponse> => {
  try {
    const response = await api.post('/admin/locations', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateLocation = async (locationId: string, payload: Partial<LocationPayload>): Promise<LocationDetailResponse> => {
  try {
    const response = await api.patch(`/admin/locations/${locationId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteLocation = async (locationId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/admin/locations/${locationId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export interface LocationsSummary {
  totalLocations: number;
  totalActiveLocations: number;
  totalInactiveLocations: number;
}

export interface LocationsSummaryResponse {
  success: boolean;
  message: string;
  data: LocationsSummary;
}

export const getLocationsSummary = async (): Promise<LocationsSummaryResponse> => {
  try {
    const response = await api.get('/admin/locations/summary');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
