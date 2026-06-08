import api from '@/lib/axios';

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface AdminReview {
  reviewId: string;
  itineraryId: string;
  reviewerUserId: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  itinerary: {
    itineraryId: string;
    title: string;
    visibilityStatus: string;
    userId: string;
    bannerImageUrl?: string | null;
  };
  reviewerUser: {
    userId: string;
    fullName: string;
    profilePhotoUrl: string | null;
  };
  reviewer?: {
    fullName: string;
    profilePhotoUrl?: string | null;
  };
  user?: {
    fullName: string;
    profilePhotoUrl?: string | null;
  };
}

export interface AdminReviewsMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminReviewSummary {
  totalReviews: number;
  totalActiveReviews: number;
  totalInactiveReviews: number;
  averageRating: number;
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

export async function getAdminReviews(params?: {
  search?: string;
  status?: 'active' | 'inactive';
  itineraryId?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; message: string; data: { items: AdminReview[]; metadata: AdminReviewsMetadata } }> {
  try {
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getAdminReviewSummary(): Promise<{ success: boolean; message: string; data: AdminReviewSummary }> {
  try {
    const response = await api.get('/admin/reviews/summary');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function adminDeleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
