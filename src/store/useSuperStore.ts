import { Socket } from "socket.io-client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ListConfig {
  page: number;
  size: number;
}

interface CommonState {
  socket: Socket | null;
  isLoading: boolean;
  error: any;
  count: number;
  listConfig: ListConfig;
  pending: () => void;
  fulfill: () => void;
  reject: (error: any) => void;
  setSocket: (socket: Socket | null) => void;
  setListConfig: (partialListConfig: Partial<ListConfig>) => Promise<void>;
  resetSuperStore: () => void;
}

const initialState: Pick<
  CommonState,
  "socket" | "isLoading" | "error" | "count" | "listConfig"
> = {
  socket: null,
  isLoading: false,
  error: null,
  count: 0,
  listConfig: {
    page: 1,
    size: 10,
  },
};

const useSuperStore = create<CommonState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        pending: () => set({ isLoading: true, error: null }),
        fulfill: () => set({ isLoading: false }),
        reject: (error: any) => set({ isLoading: false, error }),
        setSocket: (socket: Socket | null) => set({ socket }),
        setListConfig: async (partialListConfig: Partial<ListConfig>) => {
          const current = get().listConfig;
          set({ listConfig: { ...current, ...partialListConfig } });
        },
        resetSuperStore: () => set({ ...initialState }),
      }),
      { name: "superStore" }
    )
  )
);

export default useSuperStore;
