import { create } from "zustand";

interface LoadingStoreType {
  loadingCount: number;
  loadingMessage: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  handleLoadingMessage: (message: string) => void;
}

const useLoadingStore = create<LoadingStoreType>((set) => ({
  loadingCount: 0,
  loadingMessage: "",
  startLoading: (message?: string) => {
    set((state) => ({
      loadingCount: state.loadingCount + 1,
      loadingMessage: message || state.loadingMessage,
    }));
  },
  stopLoading: () => {
    set((state) => ({
      loadingCount: Math.max(state.loadingCount - 1, 0),
    }));
  },
  handleLoadingMessage: (message: string) => {
    set({ loadingMessage: message });
  },
}));

export default useLoadingStore;
