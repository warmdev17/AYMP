import {create} from 'zustand';
import {CoupleStatus, TimerData} from '../types';
import {coupleApi} from '../services/api';

interface CoupleState {
  status: CoupleStatus | null;
  timer: TimerData | null;
  isLoading: boolean;
  fetchStatus: () => Promise<void>;
  fetchTimer: () => Promise<void>;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  status: null,
  timer: null,
  isLoading: false,

  fetchStatus: async () => {
    try {
      set({isLoading: true});
      const status = await coupleApi.getStatus();
      set({status, isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  fetchTimer: async () => {
    try {
      const timer = await coupleApi.getTimer();
      set({timer});
    } catch (error) {
      throw error;
    }
  },
}));

