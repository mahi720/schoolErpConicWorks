import { create } from "zustand";
import toast from "react-hot-toast";

import { departmentApi } from "../../../../api/hrm/settings/department/departmentApi";

export const useDepartmentStore = create((set, get) => ({
    departments: [],
    selectedDepartment: null,

    loading: false,
    submitLoading: false,

    fetchDepartments: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await departmentApi.getAll(params);

            set({
                departments: response.data || [],
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch departments",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchDepartmentBySlug: async (slug) => {
        try {
            set({
                loading: true,
                selectedDepartment: null,
            });

            const response = await departmentApi.getBySlug(slug);

            set({
                selectedDepartment: response.data || null,
            });

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch department",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createDepartment: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await departmentApi.create(payload);

            toast.success(
                response.message || "Department created successfully",
            );

            await get().fetchDepartments();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create department",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateDepartment: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await departmentApi.update(
                slug,
                payload,
            );

            toast.success(
                response.message || "Department updated successfully",
            );

            await get().fetchDepartments();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update department",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteDepartment: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await departmentApi.delete(slug);

            toast.success(
                response.message ||
                "Department inactivated successfully",
            );

            await get().fetchDepartments();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete department",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreDepartment: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await departmentApi.restore(slug);

            toast.success(
                response.message || "Department restored successfully",
            );

            await get().fetchDepartments();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to restore department",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    setSelectedDepartment: (department) => {
        set({
            selectedDepartment: department,
        });
    },

    clearSelectedDepartment: () => {
        set({
            selectedDepartment: null,
        });
    },
}));