import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthResponse} from '../types';
import {authApi} from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    displayName: string,
    dateOfBirth: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  login: async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response));
      set({isAuthenticated: true, user: response});
    } catch (error) {
      throw error;
    }
  },

  register: async (
    username: string,
    password: string,
    displayName: string,
    dateOfBirth: string
  ) => {
    try {
      const response = await authApi.register(
        username,
        password,
        displayName,
        dateOfBirth
      );
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response));
      set({isAuthenticated: true, user: response});
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({isAuthenticated: false, user: null});
  },

  loadUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('accessToken');
      if (userStr && token) {
        const user = JSON.parse(userStr);
        set({isAuthenticated: true, user, isLoading: false});
      } else {
        set({isAuthenticated: false, user: null, isLoading: false});
      }
    } catch (error) {
      set({isAuthenticated: false, user: null, isLoading: false});
    }
  },
}));

