import { create } from "zustand";

interface User {
    id: string,
    name: string,
    email: string,
    image?: string,
    height?: number,
    weight?: number,
    createdAt?: Date 
}

interface UserStore {
    user: User | null,
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null })
}))