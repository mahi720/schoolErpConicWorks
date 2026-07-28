import { create } from "zustand";
import toast from "react-hot-toast";

import { examTypeApi } from "../../../api/examManager/examType/examTypeApi";

export const useExamTypeStore = create((set, get) => ({
    examTypes: [],
    selectedExamType: null,

    loading: false,
    submitLoading: false,

    fetchExamTypes: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await examTypeApi.getAll(params);

            set({
                examTypes: res.data || [],
            });

            return true;
        } catch (error) {
            set({
                examTypes: [],
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch exam types",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchExamTypeBySlug: async (slug) => {
        try {
            set({
                loading: true,
                selectedExamType: null,
            });

            const res = await examTypeApi.getBySlug(slug);

            set({
                selectedExamType: res.data || null,
            });

            return res.data || null;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch exam type",
            );

            return null;
        } finally {
            set({
                loading: false,
            });
        }
    },

    createExamType: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await examTypeApi.create(payload);

            set((state) => ({
                examTypes: [
                    res.data,
                    ...state.examTypes,
                ],
            }));

            toast.success(
                res.message ||
                "Exam type created successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create exam type",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateExamType: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await examTypeApi.update(
                slug,
                payload,
            );

            set((state) => ({
                examTypes: state.examTypes.map((item) =>
                    item.slug === slug ? res.data : item,
                ),
                selectedExamType:
                    state.selectedExamType?.slug === slug
                        ? res.data
                        : state.selectedExamType,
            }));

            toast.success(
                res.message ||
                "Exam type updated successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update exam type",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteExamType: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await examTypeApi.delete(slug);

            set((state) => ({
                examTypes: state.examTypes.map((item) =>
                    item.slug === slug ? res.data : item,
                ),
            }));

            toast.success(
                res.message ||
                "Exam type deleted successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete exam type",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    restoreExamType: async (slug) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await examTypeApi.restore(slug);

            set((state) => ({
                examTypes: state.examTypes.map((item) =>
                    item.slug === slug ? res.data : item,
                ),
            }));

            toast.success(
                res.message ||
                "Exam type restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore exam type",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    setSelectedExamType: (examType) => {
        set({
            selectedExamType: examType,
        });
    },

    clearSelectedExamType: () => {
        set({
            selectedExamType: null,
        });
    },

    resetExamTypeStore: () => {
        set({
            examTypes: [],
            selectedExamType: null,
            loading: false,
            submitLoading: false,
        });
    },
}));