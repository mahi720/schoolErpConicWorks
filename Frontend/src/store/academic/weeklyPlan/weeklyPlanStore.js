import { create } from "zustand";
import toast from "react-hot-toast";

import { weeklyPlanApi } from "../../../api/academic/weeklyPlan/weeklyPlanApi";

const getErrorMessage = (
    error,
    fallbackMessage,
) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        fallbackMessage
    );
};

const getResponseData = (response) => {
    return response?.data || null;
};

export const useWeeklyPlanStore = create(
    (set, get) => ({
        weeklyPlans: [],

        selectedWeeklyPlan: null,

        loading: false,

        detailLoading: false,

        submitLoading: false,

        lessonDeleteLoading: false,

        deletingLessonSlug: null,

        setSelectedWeeklyPlan: (
            weeklyPlan,
        ) => {
            set({
                selectedWeeklyPlan:
                    weeklyPlan || null,
            });
        },

        clearSelectedWeeklyPlan: () => {
            set({
                selectedWeeklyPlan: null,
            });
        },

        fetchWeeklyPlans: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                });

                const response =
                    await weeklyPlanApi.getAll(
                        params,
                    );

                set({
                    weeklyPlans:
                        getResponseData(
                            response,
                        ) || [],
                });

                return true;
            } catch (error) {
                set({
                    weeklyPlans: [],
                });

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch weekly plans",
                    ),
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchWeeklyPlanBySlug: async (
            slug,
        ) => {
            try {
                set({
                    detailLoading: true,
                    selectedWeeklyPlan: null,
                });

                const response =
                    await weeklyPlanApi.getBySlug(
                        slug,
                    );

                const weeklyPlan =
                    getResponseData(
                        response,
                    );

                set({
                    selectedWeeklyPlan:
                        weeklyPlan,
                });

                return weeklyPlan;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch weekly plan",
                    ),
                );

                return null;
            } finally {
                set({
                    detailLoading: false,
                });
            }
        },

        createWeeklyPlan: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await weeklyPlanApi.create(
                        payload,
                    );

                const createdWeeklyPlan =
                    getResponseData(
                        response,
                    );

                if (createdWeeklyPlan) {
                    set((state) => ({
                        weeklyPlans: [
                            createdWeeklyPlan,
                            ...state.weeklyPlans,
                        ],
                    }));
                }

                toast.success(
                    response?.message ||
                    "Weekly plan created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to create weekly plan",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateWeeklyPlan: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await weeklyPlanApi.update(
                        slug,
                        payload,
                    );

                const updatedWeeklyPlan =
                    getResponseData(
                        response,
                    );

                if (updatedWeeklyPlan) {
                    set((state) => ({
                        weeklyPlans:
                            state.weeklyPlans.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? updatedWeeklyPlan
                                        : item,
                            ),

                        selectedWeeklyPlan:
                            updatedWeeklyPlan,
                    }));
                }

                toast.success(
                    response?.message ||
                    "Weekly plan updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update weekly plan",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        deleteWeeklyPlan: async (
            slug,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await weeklyPlanApi.delete(
                        slug,
                    );

                const deletedWeeklyPlan =
                    getResponseData(
                        response,
                    );

                set((state) => ({
                    weeklyPlans:
                        state.weeklyPlans.map(
                            (item) =>
                                item.slug ===
                                    slug
                                    ? {
                                        ...item,
                                        ...(deletedWeeklyPlan ||
                                            {}),
                                        status:
                                            "inactive",
                                        isActive:
                                            false,
                                    }
                                    : item,
                        ),

                    selectedWeeklyPlan:
                        state
                            .selectedWeeklyPlan
                            ?.slug ===
                            slug
                            ? {
                                ...state.selectedWeeklyPlan,
                                ...(deletedWeeklyPlan ||
                                    {}),
                                status:
                                    "inactive",
                                isActive:
                                    false,
                            }
                            : state.selectedWeeklyPlan,
                }));

                toast.success(
                    response?.message ||
                    "Weekly plan deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to delete weekly plan",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        restoreWeeklyPlan: async (
            slug,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await weeklyPlanApi.restore(
                        slug,
                    );

                const restoredWeeklyPlan =
                    getResponseData(
                        response,
                    );

                set((state) => ({
                    weeklyPlans:
                        state.weeklyPlans.map(
                            (item) =>
                                item.slug ===
                                    slug
                                    ? {
                                        ...item,
                                        ...(restoredWeeklyPlan ||
                                            {}),
                                        status:
                                            "active",
                                        isActive:
                                            true,
                                        deletedAt:
                                            null,
                                    }
                                    : item,
                        ),

                    selectedWeeklyPlan:
                        state
                            .selectedWeeklyPlan
                            ?.slug ===
                            slug
                            ? {
                                ...state.selectedWeeklyPlan,
                                ...(restoredWeeklyPlan ||
                                    {}),
                                status:
                                    "active",
                                isActive:
                                    true,
                                deletedAt:
                                    null,
                            }
                            : state.selectedWeeklyPlan,
                }));

                toast.success(
                    response?.message ||
                    "Weekly plan restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to restore weekly plan",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        deleteWeeklyPlanLesson:
            async (
                weeklyPlanSlug,
                lessonSlug,
            ) => {
                try {
                    set({
                        lessonDeleteLoading:
                            true,
                        deletingLessonSlug:
                            lessonSlug,
                    });

                    const response =
                        await weeklyPlanApi.deleteLesson(
                            weeklyPlanSlug,
                            lessonSlug,
                        );

                    const result =
                        getResponseData(
                            response,
                        );

                    const updatedPeriods =
                        result?.numberOfPeriods;

                    set((state) => {
                        const updatePlan = (
                            plan,
                        ) => {
                            if (
                                !plan ||
                                plan.slug !==
                                weeklyPlanSlug
                            ) {
                                return plan;
                            }

                            const updatedLessons =
                                (
                                    plan.lessons ||
                                    []
                                ).filter(
                                    (
                                        lesson,
                                    ) =>
                                        lesson.slug !==
                                        lessonSlug,
                                );

                            return {
                                ...plan,
                                lessons:
                                    updatedLessons,
                                numberOfPeriods:
                                    updatedPeriods ??
                                    updatedLessons.length,
                            };
                        };

                        return {
                            weeklyPlans:
                                state.weeklyPlans.map(
                                    updatePlan,
                                ),

                            selectedWeeklyPlan:
                                updatePlan(
                                    state.selectedWeeklyPlan,
                                ),
                        };
                    });

                    toast.success(
                        response?.message ||
                        "Weekly plan lesson deleted successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to delete weekly plan lesson",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        lessonDeleteLoading:
                            false,
                        deletingLessonSlug:
                            null,
                    });
                }
            },

        removeUnsavedLesson: (
            localLessonId,
        ) => {
            const selectedWeeklyPlan =
                get()
                    .selectedWeeklyPlan;

            if (!selectedWeeklyPlan) {
                return;
            }

            const lessons =
                (
                    selectedWeeklyPlan.lessons ||
                    []
                ).filter(
                    (lesson) =>
                        lesson.localId !==
                        localLessonId,
                );

            set({
                selectedWeeklyPlan: {
                    ...selectedWeeklyPlan,
                    lessons,
                    numberOfPeriods:
                        lessons.length,
                },
            });
        },
    }),
);