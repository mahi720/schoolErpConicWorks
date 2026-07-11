import { create } from "zustand";
import toast from "react-hot-toast";

import { feeTypeApi } from "../../../api/master/feeType/feeTypeApi";

export const useFeeTypeStore = create((set, get) => ({
    feeTypes: [],
    loading: false,
    submitLoading: false,
    selectedFeeType: null,

    fetchFeeTypes: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await feeTypeApi.getAll(params);

            set({
                feeTypes: res.data?.data || [],
            });

            return true;
        } catch (error) {
            set({
                feeTypes: [],
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch fee types",
            );

            return false;
        } finally {
            set({ loading: false });
        }
    },

    getFeeTypeBySlug: async (slug) => {
        try {
            set({ loading: true });

            const res = await feeTypeApi.getBySlug(slug);
            const feeType = res.data?.data || null;

            set({
                selectedFeeType: feeType,
            });

            return feeType;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch fee type",
            );

            return null;
        } finally {
            set({ loading: false });
        }
    },

    createFeeType: async (payload) => {
        try {
            set({ submitLoading: true });

            const res = await feeTypeApi.create(payload);
            const createdFeeType = res.data?.data;

            set({
                feeTypes: [
                    createdFeeType,
                    ...get().feeTypes,
                ],
            });

            toast.success(
                res.data?.message ||
                "Fee type created successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create fee type",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateFeeType: async (slug, payload) => {
        try {
            set({ submitLoading: true });

            const res = await feeTypeApi.update(
                slug,
                payload,
            );

            const updatedFeeType = res.data?.data;

            set({
                feeTypes: get().feeTypes.map((item) =>
                    item.slug === slug
                        ? updatedFeeType
                        : item,
                ),

                selectedFeeType:
                    get().selectedFeeType?.slug === slug
                        ? updatedFeeType
                        : get().selectedFeeType,
            });

            toast.success(
                res.data?.message ||
                "Fee type updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update fee type",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteFeeType: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await feeTypeApi.delete(slug);
            const deletedFeeType = res.data?.data;

            set({
                feeTypes: get().feeTypes.map((item) =>
                    item.slug === slug
                        ? {
                            ...item,
                            ...deletedFeeType,
                            status: "inactive",
                            isActive: false,
                        }
                        : item,
                ),
            });

            toast.success(
                res.data?.message ||
                "Fee type deleted successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete fee type",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreFeeType: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await feeTypeApi.restore(slug);
            const restoredFeeType = res.data?.data;

            set({
                feeTypes: get().feeTypes.map((item) =>
                    item.slug === slug
                        ? restoredFeeType
                        : item,
                ),
            });

            toast.success(
                res.data?.message ||
                "Fee type restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore fee type",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedFeeType: (feeType) => {
        set({
            selectedFeeType: feeType,
        });
    },

    clearSelectedFeeType: () => {
        set({
            selectedFeeType: null,
        });
    },

    clearFeeTypes: () => {
        set({
            feeTypes: [],
            selectedFeeType: null,
        });
    },
}));