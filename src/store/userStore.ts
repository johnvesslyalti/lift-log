//src/store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  height?: number;
  weight?: number;
  createdAt?: Date;
}

interface UserStore {
  user: User | null;
  setUser: (update: User | ((prev: User | null) => User)) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (update) =>
        set((state) => ({
          user: typeof update === "function" ? update(state.user) : update,
        })),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "liftlog-user",
    }
  )
);
