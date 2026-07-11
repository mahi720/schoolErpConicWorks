import { create } from "zustand";
import toast from "react-hot-toast";
import { subjectTopicApi } from "../../../api/master/addSubjectToClass/classSubjectApi";

export const useClassSubjectStore = create((set, get) => ({
    classSubjects: [],
    loading: false,
    submitLoading: false,
    selectedClassSubject: null,

    fetchClassSubjects: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await subjectTopicApi.getAll(params);

            set({
                classSubjects: res.data?.data || [],
            });

            return true;
        } catch (error) {
            set({ classSubjects: [] });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch class subjects",
            );

            return false;
        } finally {
            set({ loading: false });
        }
    },

    createClassSubjects: async (payload) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.create(payload);
            const createdItems = res.data?.data || [];

            set({
                classSubjects: [
                    ...get().classSubjects,
                    ...(Array.isArray(createdItems)
                        ? createdItems
                        : [createdItems]),
                ],
            });

            toast.success(
                res.data?.message ||
                "Subjects assigned to class successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to assign subjects",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateClassSubject: async (slug, payload) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.update(slug, payload);
            const updatedItem = res.data?.data;

            set({
                classSubjects: get().classSubjects.map((item) =>
                    item.slug === slug ? updatedItem : item,
                ),
                selectedClassSubject:
                    get().selectedClassSubject?.slug === slug
                        ? updatedItem
                        : get().selectedClassSubject,
            });

            toast.success(
                res.data?.message ||
                "Class subject updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update class subject",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteClassSubject: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.delete(slug);

            set({
                classSubjects: get().classSubjects.filter(
                    (item) => item.slug !== slug,
                ),
                selectedClassSubject:
                    get().selectedClassSubject?.slug === slug
                        ? null
                        : get().selectedClassSubject,
            });

            toast.success(
                res.data?.message ||
                "Class subject deleted successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete class subject",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreClassSubject: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.restore(slug);
            const restoredItem = res.data?.data;

            set({
                classSubjects: get().classSubjects.some(
                    (item) => item.slug === slug,
                )
                    ? get().classSubjects.map((item) =>
                        item.slug === slug ? restoredItem : item,
                    )
                    : [restoredItem, ...get().classSubjects],
            });

            toast.success(
                res.data?.message ||
                "Class subject restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore class subject",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedClassSubject: (item) => {
        set({
            selectedClassSubject: item,
        });
    },

    clearSelectedClassSubject: () => {
        set({
            selectedClassSubject: null,
        });
    },

    clearClassSubjects: () => {
        set({
            classSubjects: [],
            selectedClassSubject: null,
        });
    },
}));