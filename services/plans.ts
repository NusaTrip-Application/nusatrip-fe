import api from '@/lib/axios';

export async function getLocationOptions() {
  try {
    const response = await api.get('/locations/options');
    return response.data;
  } catch (error) {
    console.error("Error mengambil daftar lokasi:", error);
    throw error;
  }
}

export async function getPlaceCategories() {
  try {
    const response = await api.get('/places/categories');
    return response.data;
  } catch (error) {
    console.error("Error mengambil kategori:", error);
    throw error;
  }
}

export async function createItinerary(payload: {
  title: string;
  locationId: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetPreference: number;
  interestSummary: string[];
}) {
  try {
    const response = await api.post('/itineraries', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getRecommendationsByDestination(locationId: string) {
  try {
    const response = await api.get(`/places/recommendations?locationId=${locationId}`);
    
    return response.data;
  } catch (error) {
    console.error("Error pada getRecommendationsByDestination:", error);
    throw error;
  }
}