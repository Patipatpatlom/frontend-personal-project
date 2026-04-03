import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useDateTime = create((set) => ({
  selectedDate: null,
  setSelectedDate: (newDate) => set({ selectedDate: newDate }),
  selectedTime: null,
  setSelectedTime: (newTime) => set({ selectedTime: newTime }),
  isLoading: false,
  setIsLoading: (val) => set({isLoading:val})
}));

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      login: (data) => set({ user: data }),
    }),
    {
      name: "userState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
