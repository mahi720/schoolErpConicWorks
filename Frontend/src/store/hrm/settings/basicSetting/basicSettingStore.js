import { create } from "zustand";
import toast from "react-hot-toast";

import { basicSettingApi } from "../../../../api/hrm/settings/basicSetting/basicSettingApi";

export const useBasicSettingStore = create((set, get) => ({
    basicSettings: [],
    selectedBasicSetting: null,

    loading: false,
    submitLoading: false,

    fetchBasicSettings: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await basicSettingApi.getAll(params);

            set({
                basicSettings: response.data || [],
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch basic settings",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchBasicSettingBySlug: async (slug) => {
        try {
            set({
                loading: true,
                selectedBasicSetting: null,
            });

            const response =
                await basicSettingApi.getBySlug(slug);

            set({
                selectedBasicSetting: response.data || null,
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch basic setting",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createBasicSettings: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response =
                await basicSettingApi.create(payload);

            toast.success(
                response.message ||
                "Basic settings saved successfully",
            );

            await get().fetchBasicSettings({
                departmentSlug: payload.departmentSlug,
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save basic settings",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateBasicSetting: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await basicSettingApi.update(
                slug,
                payload,
            );

            toast.success(
                response.message ||
                "Basic setting updated successfully",
            );

            await get().fetchBasicSettings();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update basic setting",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteBasicSetting: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response =
                await basicSettingApi.delete(slug);

            toast.success(
                response.message ||
                "Basic setting inactivated successfully",
            );

            await get().fetchBasicSettings();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete basic setting",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreBasicSetting: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response =
                await basicSettingApi.restore(slug);

            toast.success(
                response.message ||
                "Basic setting restored successfully",
            );

            await get().fetchBasicSettings();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to restore basic setting",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    setSelectedBasicSetting: (setting) => {
        set({
            selectedBasicSetting: setting,
        });
    },

    clearSelectedBasicSetting: () => {
        set({
            selectedBasicSetting: null,
        });
    },
}));