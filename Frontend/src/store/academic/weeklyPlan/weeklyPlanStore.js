import { create } from "zustand";
import toast from "react-hot-toast";

import { weeklyPlanApi } from "../../../api/academic/weeklyPlan/weeklyPlanApi.js";

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
    );
};

const normalizeOptionalValue = (value) => {
    if (typeof value !== "string") {
        return value ?? null;
    }

    const trimmedValue = value.trim();

    return trimmedValue || null;
};

const normalizeRequiredValue = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

const prepareWeeklyPlanPayload = (payload) => {
    return {
        session: normalizeRequiredValue(
            payload.session,
        ),

        board: normalizeRequiredValue(
            payload.board,
        ),

        classSlug: normalizeRequiredValue(
            payload.classSlug,
        ),

        classTitle: normalizeRequiredValue(
            payload.classTitle,
        ),

        sectionSlug: normalizeRequiredValue(
            payload.sectionSlug,
        ),

        section: normalizeRequiredValue(
            payload.section,
        ),

        classSubjectSlug:
            normalizeRequiredValue(
                payload.classSubjectSlug,
            ),

        subject: normalizeRequiredValue(
            payload.subject,
        ),

        teacherSlug: normalizeOptionalValue(
            payload.teacherSlug,
        ),

        fromDate: payload.fromDate,

        toDate: payload.toDate,

        topic: normalizeRequiredValue(
            payload.topic,
        ),

        subTopic: normalizeOptionalValue(
            payload.subTopic,
        ),

        introductionAids:
            normalizeOptionalValue(
                payload.introductionAids,
            ),

        introductionActivity:
            normalizeOptionalValue(
                payload.introductionActivity,
            ),

        learningObjective:
            normalizeOptionalValue(
                payload.learningObjective,
            ),

        numberOfPeriods: Number(
            payload.numberOfPeriods,
        ),

        lessons: Array.isArray(
            payload.lessons,
        )
            ? payload.lessons.map(
                (lesson, index) => ({
                    lessonOrder: Number(
                        lesson.lessonOrder ||
                        index + 1,
                    ),

                    day:
                        normalizeRequiredValue(
                            lesson.day,
                        ),

                    teachingMethodology:
                        normalizeRequiredValue(
                            lesson.teachingMethodology,
                        ),

                    studentActivities:
                        normalizeRequiredValue(
                            lesson.studentActivities,
                        ),

                    assessment:
                        normalizeRequiredValue(
                            lesson.assessment,
                        ),
                }),
            )
            : [],
    };
};

const splitWeeklyPlans = (
    weeklyPlans = [],
) => {
    return {
        activeWeeklyPlans:
            weeklyPlans.filter(
                (item) =>
                    item?.isActive === true,
            ),

        inactiveWeeklyPlans:
            weeklyPlans.filter(
                (item) =>
                    item?.isActive === false,
            ),
    };
};

export const useWeeklyPlanStore = create(
    (set, get) => ({
        weeklyPlans: [],
        activeWeeklyPlans: [],
        inactiveWeeklyPlans: [],

        selectedWeeklyPlan: null,

        /*
         * Weekly Plan modal dropdown options
         */
        weeklyPlanClasses: [],
        weeklyPlanSections: [],
        weeklyPlanSubjects: [],

        /*
         * CRUD loaders
         */
        loading: false,
        submitLoading: false,
        deleteLoading: false,
        restoreLoading: false,

        /*
         * Dropdown option loaders
         */
        classOptionLoading: false,
        sectionOptionLoading: false,
        subjectOptionLoading: false,

        error: null,

        /* ------------------------------------------------------------------ */
        /*                         WEEKLY PLAN CRUD                           */
        /* ------------------------------------------------------------------ */

        fetchWeeklyPlans: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                    error: null,
                });

                const response =
                    await weeklyPlanApi.getAll(
                        params,
                    );

                const weeklyPlans =
                    response?.data || [];

                set({
                    weeklyPlans,
                    ...splitWeeklyPlans(
                        weeklyPlans,
                    ),
                });

                return weeklyPlans;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    weeklyPlans: [],
                    activeWeeklyPlans: [],
                    inactiveWeeklyPlans: [],
                    error: message,
                });

                toast.error(message);

                return [];
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
                    loading: true,
                    error: null,
                    selectedWeeklyPlan: null,
                });

                const response =
                    await weeklyPlanApi.getBySlug(
                        slug,
                    );

                const weeklyPlan =
                    response?.data || null;

                set({
                    selectedWeeklyPlan:
                        weeklyPlan,
                });

                return weeklyPlan;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    selectedWeeklyPlan: null,
                    error: message,
                });

                toast.error(message);

                return null;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        createWeeklyPlan: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                    error: null,
                });

                const preparedPayload =
                    prepareWeeklyPlanPayload(
                        payload,
                    );

                const response =
                    await weeklyPlanApi.create(
                        preparedPayload,
                    );

                const createdPlan =
                    response?.data;

                if (!createdPlan) {
                    throw new Error(
                        "Weekly plan could not be created",
                    );
                }

                set((state) => {
                    const weeklyPlans = [
                        createdPlan,
                        ...state.weeklyPlans,
                    ];

                    return {
                        weeklyPlans,
                        ...splitWeeklyPlans(
                            weeklyPlans,
                        ),
                    };
                });

                toast.success(
                    response?.message ||
                    "Weekly plan created successfully",
                );

                return true;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    error: message,
                });

                toast.error(message);

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
                    error: null,
                });

                const preparedPayload =
                    prepareWeeklyPlanPayload(
                        payload,
                    );

                const response =
                    await weeklyPlanApi.update(
                        slug,
                        preparedPayload,
                    );

                const updatedPlan =
                    response?.data;

                if (!updatedPlan) {
                    throw new Error(
                        "Weekly plan could not be updated",
                    );
                }

                set((state) => {
                    const weeklyPlans =
                        state.weeklyPlans.map(
                            (item) =>
                                item.slug === slug
                                    ? updatedPlan
                                    : item,
                        );

                    return {
                        weeklyPlans,

                        ...splitWeeklyPlans(
                            weeklyPlans,
                        ),

                        selectedWeeklyPlan:
                            state
                                .selectedWeeklyPlan
                                ?.slug === slug
                                ? updatedPlan
                                : state.selectedWeeklyPlan,
                    };
                });

                toast.success(
                    response?.message ||
                    "Weekly plan updated successfully",
                );

                return true;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    error: message,
                });

                toast.error(message);

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
                    deleteLoading: true,
                    error: null,
                });

                const response =
                    await weeklyPlanApi.delete(
                        slug,
                    );

                const deletedPlan =
                    response?.data;

                if (!deletedPlan) {
                    throw new Error(
                        "Weekly plan could not be deleted",
                    );
                }

                set((state) => {
                    const weeklyPlans =
                        state.weeklyPlans.map(
                            (item) =>
                                item.slug === slug
                                    ? deletedPlan
                                    : item,
                        );

                    return {
                        weeklyPlans,

                        ...splitWeeklyPlans(
                            weeklyPlans,
                        ),

                        selectedWeeklyPlan:
                            state
                                .selectedWeeklyPlan
                                ?.slug === slug
                                ? deletedPlan
                                : state.selectedWeeklyPlan,
                    };
                });

                toast.success(
                    response?.message ||
                    "Weekly plan deleted successfully",
                );

                return true;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    error: message,
                });

                toast.error(message);

                return false;
            } finally {
                set({
                    deleteLoading: false,
                });
            }
        },

        restoreWeeklyPlan: async (
            slug,
        ) => {
            try {
                set({
                    restoreLoading: true,
                    error: null,
                });

                const response =
                    await weeklyPlanApi.restore(
                        slug,
                    );

                const restoredPlan =
                    response?.data;

                if (!restoredPlan) {
                    throw new Error(
                        "Weekly plan could not be restored",
                    );
                }

                set((state) => {
                    const weeklyPlans =
                        state.weeklyPlans.map(
                            (item) =>
                                item.slug === slug
                                    ? restoredPlan
                                    : item,
                        );

                    return {
                        weeklyPlans,

                        ...splitWeeklyPlans(
                            weeklyPlans,
                        ),

                        selectedWeeklyPlan:
                            state
                                .selectedWeeklyPlan
                                ?.slug === slug
                                ? restoredPlan
                                : state.selectedWeeklyPlan,
                    };
                });

                toast.success(
                    response?.message ||
                    "Weekly plan restored successfully",
                );

                return true;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    error: message,
                });

                toast.error(message);

                return false;
            } finally {
                set({
                    restoreLoading: false,
                });
            }
        },

        /* ------------------------------------------------------------------ */
        /*                      WEEKLY PLAN OPTIONS                           */
        /* ------------------------------------------------------------------ */

        fetchWeeklyPlanClasses: async ({
            session,
            board,
        }) => {
            const normalizedSession =
                normalizeRequiredValue(
                    session,
                );

            const normalizedBoard =
                normalizeRequiredValue(
                    board,
                );

            if (
                !normalizedSession ||
                !normalizedBoard
            ) {
                set({
                    weeklyPlanClasses: [],
                    weeklyPlanSections: [],
                    weeklyPlanSubjects: [],
                });

                return false;
            }

            try {
                set({
                    classOptionLoading: true,

                    weeklyPlanClasses: [],
                    weeklyPlanSections: [],
                    weeklyPlanSubjects: [],

                    error: null,
                });

                const response =
                    await weeklyPlanApi.getClasses(
                        {
                            session:
                                normalizedSession,

                            board:
                                normalizedBoard,
                        },
                    );

                const classes =
                    response?.data || [];

                set({
                    weeklyPlanClasses:
                        Array.isArray(classes)
                            ? classes
                            : [],
                });

                return true;
            } catch (error) {
                const message =
                    getErrorMessage(error);

                set({
                    weeklyPlanClasses: [],
                    weeklyPlanSections: [],
                    weeklyPlanSubjects: [],
                    error: message,
                });

                toast.error(message);

                return false;
            } finally {
                set({
                    classOptionLoading: false,
                });
            }
        },

        fetchWeeklyPlanSections:
            async (classSlug) => {
                const normalizedClassSlug =
                    normalizeRequiredValue(
                        classSlug,
                    );

                if (
                    !normalizedClassSlug
                ) {
                    set({
                        weeklyPlanSections: [],
                    });

                    return false;
                }

                try {
                    set({
                        sectionOptionLoading:
                            true,

                        weeklyPlanSections: [],

                        error: null,
                    });

                    const response =
                        await weeklyPlanApi.getSections(
                            normalizedClassSlug,
                        );

                    const sections =
                        response?.data || [];

                    set({
                        weeklyPlanSections:
                            Array.isArray(
                                sections,
                            )
                                ? sections
                                : [],
                    });

                    return true;
                } catch (error) {
                    const message =
                        getErrorMessage(error);

                    set({
                        weeklyPlanSections: [],
                        error: message,
                    });

                    toast.error(message);

                    return false;
                } finally {
                    set({
                        sectionOptionLoading:
                            false,
                    });
                }
            },

        fetchWeeklyPlanSubjects:
            async (classSlug) => {
                const normalizedClassSlug =
                    normalizeRequiredValue(
                        classSlug,
                    );

                if (
                    !normalizedClassSlug
                ) {
                    set({
                        weeklyPlanSubjects: [],
                    });

                    return false;
                }

                try {
                    set({
                        subjectOptionLoading:
                            true,

                        weeklyPlanSubjects: [],

                        error: null,
                    });

                    const response =
                        await weeklyPlanApi.getSubjects(
                            normalizedClassSlug,
                        );

                    const subjects =
                        response?.data || [];

                    set({
                        weeklyPlanSubjects:
                            Array.isArray(
                                subjects,
                            )
                                ? subjects
                                : [],
                    });

                    return true;
                } catch (error) {
                    const message =
                        getErrorMessage(error);

                    set({
                        weeklyPlanSubjects: [],
                        error: message,
                    });

                    toast.error(message);

                    return false;
                } finally {
                    set({
                        subjectOptionLoading:
                            false,
                    });
                }
            },

        /* ------------------------------------------------------------------ */
        /*                              CLEAR                                 */
        /* ------------------------------------------------------------------ */

        clearWeeklyPlanClassOptions:
            () => {
                set({
                    weeklyPlanClasses: [],
                    weeklyPlanSections: [],
                    weeklyPlanSubjects: [],

                    classOptionLoading: false,
                    sectionOptionLoading:
                        false,
                    subjectOptionLoading:
                        false,
                });
            },

        clearWeeklyPlanDependentOptions:
            () => {
                set({
                    weeklyPlanSections: [],
                    weeklyPlanSubjects: [],

                    sectionOptionLoading:
                        false,
                    subjectOptionLoading:
                        false,
                });
            },

        clearWeeklyPlanSections: () => {
            set({
                weeklyPlanSections: [],
                sectionOptionLoading: false,
            });
        },

        clearWeeklyPlanSubjects: () => {
            set({
                weeklyPlanSubjects: [],
                subjectOptionLoading: false,
            });
        },

        setSelectedWeeklyPlan: (
            weeklyPlan,
        ) => {
            set({
                selectedWeeklyPlan:
                    weeklyPlan,
            });
        },

        clearSelectedWeeklyPlan: () => {
            set({
                selectedWeeklyPlan: null,
            });
        },

        clearWeeklyPlans: () => {
            set({
                weeklyPlans: [],
                activeWeeklyPlans: [],
                inactiveWeeklyPlans: [],
                selectedWeeklyPlan: null,

                weeklyPlanClasses: [],
                weeklyPlanSections: [],
                weeklyPlanSubjects: [],

                loading: false,
                submitLoading: false,
                deleteLoading: false,
                restoreLoading: false,

                classOptionLoading: false,
                sectionOptionLoading:
                    false,
                subjectOptionLoading:
                    false,

                error: null,
            });
        },

        clearError: () => {
            set({
                error: null,
            });
        },

        getWeeklyPlanBySlugFromState:
            (slug) => {
                return get().weeklyPlans.find(
                    (weeklyPlan) =>
                        weeklyPlan.slug ===
                        slug,
                );
            },
    }),
);