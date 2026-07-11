import { create } from "zustand";
import toast from "react-hot-toast";
import { subjectApi } from "../../../api/master/subject/subjectApi";

export const useSubjectStore = create((set, get) => ({
    subjects: [],
    loading: false,
    submitLoading: false,
    selectedSubject: null,

    fetchSubjects: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await subjectApi.getAll(params);

            set({
                subjects: res.data?.data || [],
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch subjects");
        } finally {
            set({ loading: false });
        }
    },

    createSubject: async (formData) => {
        try {
            set({ submitLoading: true });

            const res = await subjectApi.create(formData);

            set({
                subjects: [res.data.data, ...get().subjects],
            });

            toast.success(res.data?.message || "Subject created successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create subject");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateSubject: async (slug, formData) => {
        try {
            set({ submitLoading: true });

            const res = await subjectApi.update(slug, formData);

            set({
                subjects: get().subjects.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Subject updated successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update subject");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteSubject: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await subjectApi.delete(slug);

            set({
                subjects: get().subjects.filter((item) => item.slug !== slug),
            });

            toast.success(res.data?.message || "Subject deleted successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete subject");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreSubject: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await subjectApi.restore(slug);

            set({
                subjects: get().subjects.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Subject restored successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to restore subject");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedSubject: (subject) => {
        set({ selectedSubject: subject });
    },

    clearSelectedSubject: () => {
        set({ selectedSubject: null });
    },
}));