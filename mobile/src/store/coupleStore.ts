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
      const apiResponse = await coupleApi.getStatus();
      console.log("fetchStatus result:", apiResponse);
      
      // Transform API response to match CoupleStatus interface
      // API returns "paired" but we need "isPaired"
      const status = {
        isPaired: apiResponse.paired || apiResponse.isPaired || false,
        coupleId: apiResponse.coupleId || null,
        partnerId: apiResponse.partnerId || null,
        partnerDisplayName: apiResponse.partnerDisplayName || null,
        pairedAt: apiResponse.pairedAt || null,
      };
      
      console.log("Transformed status:", status);
      set({status, isLoading: false});
      return status;
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

