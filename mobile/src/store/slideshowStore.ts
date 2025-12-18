import {create} from 'zustand';
import {SlideshowImage} from '../types';
import {slideshowApi} from '../services/api';

interface SlideshowState {
  images: SlideshowImage[];
  isLoading: boolean;
  fetchImages: () => Promise<void>;
  uploadImage: (uri: string) => Promise<void>;
  reorderImages: (imageIds: number[]) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
}

export const useSlideshowStore = create<SlideshowState>((set) => ({
  images: [],
  isLoading: false,

  fetchImages: async () => {
    try {
      set({isLoading: true});
      const images = await slideshowApi.getSlideshow();
      set({images, isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  uploadImage: async (uri: string) => {
    try {
      const image = await slideshowApi.uploadImage(uri);
      set((state) => ({
        images: [...state.images, image].sort((a, b) => a.orderIndex - b.orderIndex),
      }));
    } catch (error) {
      throw error;
    }
  },

  reorderImages: async (imageIds: number[]) => {
    try {
      await slideshowApi.reorderImages(imageIds);
      await useSlideshowStore.getState().fetchImages();
    } catch (error) {
      throw error;
    }
  },

  deleteImage: async (id: number) => {
    try {
      await slideshowApi.deleteImage(id);
      set((state) => ({
        images: state.images.filter((img) => img.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },
}));

