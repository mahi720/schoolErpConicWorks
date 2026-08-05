import { create } from "zustand";
import toast from "react-hot-toast";

import { designationApi } from "../../../../api/hrm/settings/designation/designationApi";

export const useDesignationStore = create((set, get) => ({
    designations: [],
    selectedDesignation: null,

    loading: false,
    submitLoading: false,

    fetchDesignations: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await designationApi.getAll(params);

            set({
                designations: response.data || [],
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch designations",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchDesignationBySlug: async (slug) => {
        try {
            set({
                loading: true,
                selectedDesignation: null,
            });

            const response =
                await designationApi.getBySlug(slug);

            set({
                selectedDesignation: response.data || null,
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch designation",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createDesignation: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response =
                await designationApi.create(payload);

            toast.success(
                response.message ||
                "Designation created successfully",
            );

            await get().fetchDesignations();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create designation",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateDesignation: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await designationApi.update(
                slug,
                payload,
            );

            toast.success(
                response.message ||
                "Designation updated successfully",
            );

            await get().fetchDesignations();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update designation",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteDesignation: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await designationApi.delete(slug);

            toast.success(
                response.message ||
                "Designation inactivated successfully",
            );

            await get().fetchDesignations();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete designation",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreDesignation: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response =
                await designationApi.restore(slug);

            toast.success(
                response.message ||
                "Designation restored successfully",
            );

            await get().fetchDesignations();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to restore designation",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    setSelectedDesignation: (designation) => {
        set({
            selectedDesignation: designation,
        });
    },

    clearSelectedDesignation: () => {
        set({
            selectedDesignation: null,
        });
    },
}));