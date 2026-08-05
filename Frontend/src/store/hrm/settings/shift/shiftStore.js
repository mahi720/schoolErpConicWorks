import { create } from "zustand";
import toast from "react-hot-toast";

import { shiftApi } from "../../../../api/hrm/settings/shift/shiftApi";

export const useShiftStore = create((set, get) => ({
    shifts: [],
    selectedShift: null,

    loading: false,
    submitLoading: false,

    fetchShifts: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await shiftApi.getAll(params);

            set({
                shifts: response.data || [],
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch shifts",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchShiftBySlug: async (slug) => {
        try {
            set({
                loading: true,
                selectedShift: null,
            });

            const response = await shiftApi.getBySlug(slug);

            set({
                selectedShift: response.data || null,
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch shift",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createShift: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await shiftApi.create(payload);

            toast.success(
                response.message || "Shift created successfully",
            );

            await get().fetchShifts();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create shift",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateShift: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await shiftApi.update(
                slug,
                payload,
            );

            toast.success(
                response.message || "Shift updated successfully",
            );

            await get().fetchShifts();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update shift",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteShift: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await shiftApi.delete(slug);

            toast.success(
                response.message ||
                "Shift inactivated successfully",
            );

            await get().fetchShifts();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete shift",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreShift: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await shiftApi.restore(slug);

            toast.success(
                response.message || "Shift restored successfully",
            );

            await get().fetchShifts();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to restore shift",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    setSelectedShift: (shift) => {
        set({
            selectedShift: shift,
        });
    },

    clearSelectedShift: () => {
        set({
            selectedShift: null,
        });
    },
}));