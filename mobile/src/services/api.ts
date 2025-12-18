import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  CoupleStatus,
  TimerData,
  SlideshowImage,
  QuickMessage,
  PairingCode,
} from '../types';

import {API_CONFIG} from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Try to refresh token
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // In a real app, you'd call a refresh endpoint
          // For now, we'll just clear storage and redirect to login
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        } catch (refreshError) {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (
    username: string,
    password: string,
    displayName: string,
    dateOfBirth: string
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      username,
      password,
      displayName,
      dateOfBirth,
    });
    return response.data;
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },
};

export const pairingApi = {
  generateCode: async (): Promise<PairingCode> => {
    const response = await api.post('/pair/code');
    return response.data;
  },

  confirmPairing: async (code: string): Promise<void> => {
    await api.post('/pair/confirm', { code });
  },
};

export const coupleApi = {
  getStatus: async (): Promise<CoupleStatus> => {
    const response = await api.get('/couple/status');
    return response.data;
  },

  getTimer: async (): Promise<TimerData> => {
    const response = await api.get('/couple/timer');
    return response.data;
  },
};

export const slideshowApi = {
  uploadImage: async (uri: string): Promise<SlideshowImage> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await api.post('/slideshow/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSlideshow: async (): Promise<SlideshowImage[]> => {
    const response = await api.get('/slideshow');
    return response.data;
  },

  reorderImages: async (imageIds: number[]): Promise<void> => {
    await api.put('/slideshow/reorder', { imageIds });
  },

  deleteImage: async (id: number): Promise<void> => {
    await api.delete(`/slideshow/${id}`);
  },
};

export const quickMessageApi = {
  getMessages: async (): Promise<QuickMessage[]> => {
    const response = await api.get('/quick-messages');
    return response.data;
  },

  createMessage: async (content: string): Promise<QuickMessage> => {
    const response = await api.post('/quick-messages', { content });
    return response.data;
  },

  deleteMessage: async (id: number): Promise<void> => {
    await api.delete(`/quick-messages/${id}`);
  },

  sendNotification: async (message: string): Promise<void> => {
    await api.post('/notify/quick', { message });
  },
};

export default api;

