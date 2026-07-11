import { create } from "zustand";
import toast from "react-hot-toast";
import { subjectTopicApi } from "../../../api/master/createTopicInSubject/subjectTopicApi";

export const useSubjectTopicStore = create((set, get) => ({
    subjectTopics: [],
    loading: false,
    submitLoading: false,
    selectedSubjectTopic: null,

    fetchSubjectTopics: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await subjectTopicApi.getAll(params);

            set({
                subjectTopics: res.data?.data || [],
            });

            return true;
        } catch (error) {
            set({
                subjectTopics: [],
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch subject topics",
            );

            return false;
        } finally {
            set({ loading: false });
        }
    },

    getSubjectTopicBySlug: async (slug) => {
        try {
            set({ loading: true });

            const res = await subjectTopicApi.getBySlug(slug);

            set({
                selectedSubjectTopic: res.data?.data || null,
            });

            return res.data?.data || null;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch subject topic",
            );

            return null;
        } finally {
            set({ loading: false });
        }
    },

    createSubjectTopic: async (payload) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.create(payload);
            const createdTopic = res.data?.data;

            set({
                subjectTopics: [
                    createdTopic,
                    ...get().subjectTopics,
                ],
            });

            toast.success(
                res.data?.message ||
                "Subject topic created successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create subject topic",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateSubjectTopic: async (slug, payload) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.update(
                slug,
                payload,
            );

            const updatedTopic = res.data?.data;

            set({
                subjectTopics: get().subjectTopics.map((item) =>
                    item.slug === slug ? updatedTopic : item,
                ),

                selectedSubjectTopic:
                    get().selectedSubjectTopic?.slug === slug
                        ? updatedTopic
                        : get().selectedSubjectTopic,
            });

            toast.success(
                res.data?.message ||
                "Subject topic updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update subject topic",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteSubjectTopic: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.delete(slug);
            const deletedTopic = res.data?.data;

            set({
                subjectTopics: get().subjectTopics.map((item) =>
                    item.slug === slug
                        ? {
                            ...item,
                            ...deletedTopic,
                            status: "inactive",
                            isActive: false,
                        }
                        : item,
                ),

                selectedSubjectTopic:
                    get().selectedSubjectTopic?.slug === slug
                        ? deletedTopic
                        : get().selectedSubjectTopic,
            });

            toast.success(
                res.data?.message ||
                "Subject topic deleted successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete subject topic",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreSubjectTopic: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await subjectTopicApi.restore(slug);
            const restoredTopic = res.data?.data;

            set({
                subjectTopics: get().subjectTopics.map((item) =>
                    item.slug === slug ? restoredTopic : item,
                ),

                selectedSubjectTopic:
                    get().selectedSubjectTopic?.slug === slug
                        ? restoredTopic
                        : get().selectedSubjectTopic,
            });

            toast.success(
                res.data?.message ||
                "Subject topic restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore subject topic",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedSubjectTopic: (topic) => {
        set({
            selectedSubjectTopic: topic,
        });
    },

    clearSelectedSubjectTopic: () => {
        set({
            selectedSubjectTopic: null,
        });
    },

    clearSubjectTopics: () => {
        set({
            subjectTopics: [],
            selectedSubjectTopic: null,
        });
    },
}));