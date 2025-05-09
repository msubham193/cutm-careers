import { create } from "zustand";
import { getFromLocalStorage } from "../utils/localStorage";

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
  campus?: string; // Optional, as it may not always be present
}

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  loadUserFromStorage: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
  loadUserFromStorage: () => {
    const storedUser = getFromLocalStorage("user") as User;
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      set({ user: storedUser, token: storedToken });
    }
  },
}));
