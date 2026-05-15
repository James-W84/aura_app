import create from "zustand";

export interface UserState {
  currentUserId: number;
  setUserId: (userId: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUserId: 1, // Default to dev user for MVP
  setUserId: (userId: number) => {
    set({ currentUserId: userId });
  },
}));
