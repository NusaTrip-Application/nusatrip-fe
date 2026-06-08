import api from '@/lib/axios';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface AdminUser {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  instagramUsername: string | null;
  profilePhotoUrl: string | null;
  accountStatus: AccountStatus;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUserSummary {
  totalUsers: number;
  totalActiveUsers: number;
  totalInactiveUsers: number;
}

export interface AdminCreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  instagramUsername?: string;
  accountStatus: AccountStatus;
}

export interface AdminUpdateUserPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  instagramUsername?: string;
}

export async function getAdminUsers(params?: {
  search?: string;
  accountStatus?: AccountStatus;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; message: string; data: { items: AdminUser[]; metadata: AdminUsersMetadata } }> {
  try {
    const response = await api.get('/admin/accounts/users', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function getAdminUserById(userId: string): Promise<{ success: boolean; message: string; data: AdminUser }> {
  try {
    const response = await api.get(`/admin/accounts/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function adminCreateUser(payload: AdminCreateUserPayload): Promise<{ success: boolean; message: string; data: AdminUser }> {
  try {
    const response = await api.post('/admin/accounts/users', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function adminUpdateUser(userId: string, payload: AdminUpdateUserPayload): Promise<{ success: boolean; message: string; data: AdminUser }> {
  try {
    const response = await api.patch(`/admin/accounts/users/${userId}`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function adminChangeUserStatus(userId: string, accountStatus: AccountStatus): Promise<{ success: boolean; message: string; data: AdminUser }> {
  try {
    const response = await api.patch(`/admin/accounts/users/${userId}/status`, { accountStatus });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export async function adminDeleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/admin/accounts/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

// Get user summary by computing from the list (no dedicated summary endpoint)
export async function getAdminUserSummary(): Promise<AdminUserSummary> {
  try {
    const [allRes, activeRes, inactiveRes] = await Promise.all([
      api.get('/admin/accounts/users', { params: { limit: 1 } }),
      api.get('/admin/accounts/users', { params: { limit: 1, accountStatus: 'ACTIVE' } }),
      api.get('/admin/accounts/users', { params: { limit: 1, accountStatus: 'INACTIVE' } }),
    ]);
    return {
      totalUsers: allRes.data?.data?.metadata?.totalItems ?? 0,
      totalActiveUsers: activeRes.data?.data?.metadata?.totalItems ?? 0,
      totalInactiveUsers: inactiveRes.data?.data?.metadata?.totalItems ?? 0,
    };
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}
