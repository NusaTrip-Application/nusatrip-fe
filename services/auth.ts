import api from '@/lib/axios';
import { LoginFormValues } from '@/lib/validations/auth';

export interface UpdateAccountRequest {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  instagramUsername?: string;
  profilePhotoUrl?: string;
}

export const loginUser = async (payload: LoginFormValues) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};

export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/accounts/register', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const getMyProfile = async () => {
  try {
    const response = await api.get('/accounts/me');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const updateMyProfile = async (profileData: UpdateAccountRequest) => {
  try {
    const response = await api.patch('/accounts/me', profileData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};