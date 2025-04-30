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
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  loadUserFromStorage: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  loadUserFromStorage: () => {
    const storedUser = getFromLocalStorage("user");
    console.log(storedUser);
    if (storedUser) {
      set({ user: storedUser });
    }
  },
}));
