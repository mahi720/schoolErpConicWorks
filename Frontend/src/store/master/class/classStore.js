import { create } from "zustand";
import { classApi } from "../../../api/master/class/classApi";
import toast from "react-hot-toast";

export const useClassStore = create((set, get) => ({
    classes: [],
    loading: false,
    submitLoading: false,
    selectedClass: null,

    fetchClasses: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await classApi.getAll(params);

            set({
                classes: res.data?.data || [],
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch classes");
        } finally {
            set({ loading: false });
        }
    },

    createClass: async (formData) => {
        try {
            set({ submitLoading: true });

            const res = await classApi.create(formData);

            set({
                classes: [res.data.data, ...get().classes],
            });

            toast.success(res.data?.message || "Class created successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create class");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateClass: async (slug, formData) => {
        try {
            set({ submitLoading: true });

            const res = await classApi.update(slug, formData);

            set({
                classes: get().classes.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Class updated successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update class");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteClass: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await classApi.delete(slug);

            set({
                classes: get().classes.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Class deleted successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete class");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreClass: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await classApi.restore(slug);

            set({
                classes: get().classes.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Class restored successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to restore class");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedClass: (classItem) => {
        set({ selectedClass: classItem });
    },

    clearSelectedClass: () => {
        set({ selectedClass: null });
    },
}));