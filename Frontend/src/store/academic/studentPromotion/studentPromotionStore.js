import { create } from "zustand";
import toast from "react-hot-toast";

import { studentPromotionApi } from "../../../api/academic/studentPromotion/studentPromotionApi";

export const useStudentPromotionStore = create(
    (set, get) => ({
        promotions: [],
        selectedPromotion: null,
        selectedBatch: null,

        loading: false,
        submitLoading: false,
        batchLoading: false,
        rollbackLoading: false,

        fetchPromotions: async (params = {}) => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await studentPromotionApi.getAll(params);

                set({
                    promotions: res.data || [],
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch student promotions",
                );

                set({
                    promotions: [],
                });

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        createPromotions: async (payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await studentPromotionApi.create(payload);

                const createdPromotions =
                    res.data?.promotions || [];

                set((state) => ({
                    promotions: [
                        ...createdPromotions,
                        ...state.promotions,
                    ],
                    selectedBatch: res.data || null,
                }));

                toast.success(
                    res.message ||
                    "Students promoted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to promote students",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        fetchPromotionBySlug: async (slug) => {
            try {
                set({
                    loading: true,
                    selectedPromotion: null,
                });

                const res =
                    await studentPromotionApi.getBySlug(slug);

                set({
                    selectedPromotion: res.data || null,
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch promotion details",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchPromotionBatch: async (batchSlug) => {
            try {
                set({
                    batchLoading: true,
                    selectedBatch: null,
                });

                const res =
                    await studentPromotionApi.getBatch(
                        batchSlug,
                    );

                set({
                    selectedBatch: res.data || null,
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch promotion batch",
                );

                return false;
            } finally {
                set({
                    batchLoading: false,
                });
            }
        },

        rollbackPromotionBatch: async (
            batchSlug,
            payload,
        ) => {
            try {
                set({
                    rollbackLoading: true,
                });

                const res =
                    await studentPromotionApi.rollbackBatch(
                        batchSlug,
                        payload,
                    );

                set((state) => ({
                    promotions: state.promotions.map(
                        (item) =>
                            item.batchSlug === batchSlug
                                ? {
                                    ...item,
                                    promotionStatus:
                                        "ROLLED_BACK",
                                    rolledBackAt:
                                        new Date().toISOString(),
                                    rollbackRemarks:
                                        payload.rollbackRemarks,
                                }
                                : item,
                    ),
                    selectedBatch:
                        state.selectedBatch?.batchSlug ===
                            batchSlug
                            ? {
                                ...state.selectedBatch,
                                promotionStatus:
                                    "ROLLED_BACK",
                                rollbackRemarks:
                                    payload.rollbackRemarks,
                            }
                            : state.selectedBatch,
                }));

                toast.success(
                    res.message ||
                    "Promotion batch rolled back successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to rollback promotion batch",
                );

                return false;
            } finally {
                set({
                    rollbackLoading: false,
                });
            }
        },

        setSelectedPromotion: (promotion) => {
            set({
                selectedPromotion: promotion,
            });
        },

        clearSelectedPromotion: () => {
            set({
                selectedPromotion: null,
            });
        },

        clearSelectedBatch: () => {
            set({
                selectedBatch: null,
            });
        },
    }),
);