// store/settingsStore.ts
import { create } from "zustand";

interface SettingsState {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  showProfile: boolean;
  name: string;
  email: string;
  language: string;
  setDarkMode: (val: boolean) => void;
  setEmailNotifications: (val: boolean) => void;
  setPushNotifications: (val: boolean) => void;
  setShowProfile: (val: boolean) => void;
  setName: (val: string) => void;
  setEmail: (val: string) => void;
  setLanguage: (val: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: false,
  emailNotifications: true,
  pushNotifications: true,
  showProfile: true,
  name: "John Doe",
  email: "john@example.com",
  language: "English",
  setDarkMode: (val) => set({ darkMode: val }),
  setEmailNotifications: (val) => set({ emailNotifications: val }),
  setPushNotifications: (val) => set({ pushNotifications: val }),
  setShowProfile: (val) => set({ showProfile: val }),
  setName: (val) => set({ name: val }),
  setEmail: (val) => set({ email: val }),
  setLanguage: (val) => set({ language: val }),
}));
