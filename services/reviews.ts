import api from '@/lib/axios';

export interface CreateReviewPayload {
  itineraryId: string;
  ratingValue: number;
  comment: string;
}

export async function getReviewsByItineraryId(itineraryId: string) {
  try {
    const response = await api.get(`/itineraries/community/${itineraryId}/reviews`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function createReview(payload: CreateReviewPayload) {
  try {
    const response = await api.post('/reviews', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
