import { create } from "zustand";
import { sectionApi } from "../../../api/master/section/sectionApi";
import toast from "react-hot-toast";

export const useSectionStore = create((set, get) => ({
    sections: [],
    loading: false,
    submitLoading: false,
    selectedSection: null,

    fetchSections: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await sectionApi.getAll(params);

            set({
                sections: res.data?.data || [],
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch sections");
        } finally {
            set({ loading: false });
        }
    },

    createSection: async (formData) => {
        try {
            set({ submitLoading: true });

            const res = await sectionApi.create(formData);

            set({
                sections: [res.data.data, ...get().sections],
            });

            toast.success(res.data?.message || "Section created successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create section");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateSection: async (slug, formData) => {
        try {
            set({ submitLoading: true });

            const res = await sectionApi.update(slug, formData);

            set({
                sections: get().sections.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Section updated successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update section");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteSection: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await sectionApi.delete(slug);

            set({
                sections: get().sections.filter((item) => item.slug !== slug),
            });

            toast.success(res.data?.message || "Section deleted successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete section");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreSection: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await sectionApi.restore(slug);

            set({
                sections: get().sections.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Section restored successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to restore section");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedSection: (sectionItem) => {
        set({ selectedSection: sectionItem });
    },

    clearSelectedSection: () => {
        set({ selectedSection: null });
    },
}));