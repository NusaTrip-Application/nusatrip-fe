import api from '@/lib/axios';

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export async function getReviewsByItineraryId(itineraryId: string, params?: { page?: number; limit?: number }) {
  try {
    const response = await api.get(`/itineraries/community/${itineraryId}/reviews`, { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function createReview(itineraryId: string, payload: CreateReviewPayload) {
  try {
    const response = await api.post(`/itineraries/community/${itineraryId}/reviews`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
