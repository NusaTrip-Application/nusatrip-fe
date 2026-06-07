import api from '@/lib/axios';
import axios from 'axios';

export interface PresignedUrlResponse {
  success: boolean;
  message: string;
  data: {
    presignedUrl: string;
    fileKey: string;
  };
}

export const getPresignedUrl = async (mimetype: string, size: number, folder: string): Promise<PresignedUrlResponse> => {
  try {
    const response = await api.post('/media/presigned-url', {
      mimetype,
      size,
      folder
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const uploadFileToS3 = async (presignedUrl: string, file: File) => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error: any) {
    throw error;
  }
};

export const deleteMedia = async (fileKey: string) => {
  try {
    const response = await api.delete('/media', {
      data: { fileKey }
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
