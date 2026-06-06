import api from '@/lib/axios';
import { LoginFormValues } from '@/lib/validations/auth';

export const loginUser = async (payload: LoginFormValues) => {
  try {
    const response = await api.post('/auth/login', payload);
    
    return response.data; 
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const registerUser = async (userData: { fullName: string; email: string; password: string }) => {
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

export const updateMyProfile = async (profileData: {
  fullName: string;
  phoneNumber: string;
  instagramUsername: string;
}) => {
  try {
    const response = await api.patch('/accounts/me', profileData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};