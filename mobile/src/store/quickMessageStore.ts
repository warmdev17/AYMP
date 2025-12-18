import {create} from 'zustand';
import {QuickMessage} from '../types';
import {quickMessageApi} from '../services/api';

interface QuickMessageState {
  messages: QuickMessage[];
  isLoading: boolean;
  fetchMessages: () => Promise<void>;
  createMessage: (content: string) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  sendNotification: (message: string) => Promise<void>;
}

export const useQuickMessageStore = create<QuickMessageState>((set) => ({
  messages: [],
  isLoading: false,

  fetchMessages: async () => {
    try {
      set({isLoading: true});
      const messages = await quickMessageApi.getMessages();
      set({messages, isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  createMessage: async (content: string) => {
    try {
      const message = await quickMessageApi.createMessage(content);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (id: number) => {
    try {
      await quickMessageApi.deleteMessage(id);
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  sendNotification: async (message: string) => {
    try {
      await quickMessageApi.sendNotification(message);
    } catch (error) {
      throw error;
    }
  },
}));

