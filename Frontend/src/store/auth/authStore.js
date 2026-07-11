import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isAuthLoading: true,

    setAuth: ({ user, accessToken }) =>
        set({
            user,
            accessToken,
            isAuthenticated: true,
            isAuthLoading: false,
        }),

    clearAuth: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isAuthLoading: false,
        }),

    setAuthLoading: (value) => set({ isAuthLoading: value }),
}));