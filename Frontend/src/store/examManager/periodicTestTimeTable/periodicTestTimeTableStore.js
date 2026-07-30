import { create } from "zustand";
import toast from "react-hot-toast";

import { periodicTestApi } from "../../../api/examManager/periodicTestTimeTable/periodicTestTimeTableApi";

const getErrorMessage = (
    error,
    fallbackMessage,
) => {
    return (
        error?.response?.data
            ?.message ||
        error?.message ||
        fallbackMessage
    );
};

const normalizePeriodicTest = (
    item,
) => {
    if (!item) {
        return null;
    }

    return {
        ...item,

        sessionName:
            item.sessionName ||
            item.session?.name ||
            "",

        boardTitle:
            item.boardTitle ||
            item.board?.title ||
            "",

        testTitle:
            item.testTitle ||
            item.title ||
            "",

        testStatus:
            item.testStatus ||
            "scheduled",
    };
};

const normalizePeriodicTestSubjects = (
    subjects = [],
) => {
    if (!Array.isArray(subjects)) {
        return [];
    }

    return subjects.map(
        (subject) => ({
            slug:
                subject.slug ||
                null,

            classSubjectSlug:
                subject.classSubjectSlug ||
                subject.slug ||
                "",

            subjectSlug:
                subject.subjectSlug ||
                subject.classSubject
                    ?.subject?.slug ||
                "",

            subjectTitle:
                subject.subjectTitle ||
                subject.classSubject
                    ?.subject
                    ?.subjectTitle ||
                "",

            subjectType:
                subject.subjectType ||
                subject.classSubject
                    ?.subject
                    ?.subjectType ||
                "",

            subjectOrder:
                subject.subjectOrder ??
                subject.classSubject
                    ?.subject
                    ?.subjectOrder ??
                0,

            studyMode:
                subject.studyMode ||
                subject.studyType ||
                subject.classSubject
                    ?.studyType ||
                "",

            studyType:
                subject.studyType ||
                subject.studyMode ||
                subject.classSubject
                    ?.studyType ||
                "",

            streamSlug:
                subject.streamSlug ||
                subject.stream?.slug ||
                subject.classSubject
                    ?.stream?.slug ||
                null,

            streamTitle:
                typeof subject.stream ===
                    "string"
                    ? subject.stream
                    : subject.streamTitle ||
                    subject.stream
                        ?.streamTitle ||
                    subject.stream
                        ?.title ||
                    subject.classSubject
                        ?.stream
                        ?.streamTitle ||
                    "NA",

            maxMarks:
                subject.maxMarks ??
                "",

            minMarks:
                subject.minMarks ??
                "",

            testDate:
                subject.testDate
                    ? String(
                        subject.testDate,
                    ).slice(0, 10)
                    : "",

            testTime:
                subject.testTime ||
                "",

            duration:
                subject.duration ??
                "",

            questionPaper:
                subject.questionPaper ||
                null,

            status:
                subject.status ||
                "active",

            isActive:
                subject.isActive ??
                true,
        }),
    );
};

export const usePeriodicTestStore =
    create((set) => ({
        periodicTests: [],

        selectedPeriodicTest:
            null,

        periodicTestTimeTable:
            null,

        configuration: null,

        selectedClass: null,

        subjects: [],

        publishResult: false,

        loading: false,

        submitLoading: false,

        fetchPeriodicTests:
            async (
                params = {},
            ) => {
                try {
                    set({
                        loading: true,
                    });

                    const res =
                        await periodicTestApi.getPeriodicTests(
                            params,
                        );

                    const periodicTests =
                        Array.isArray(
                            res.data,
                        )
                            ? res.data.map(
                                normalizePeriodicTest,
                            )
                            : [];

                    set({
                        periodicTests,
                    });

                    return true;
                } catch (error) {
                    set({
                        periodicTests: [],
                    });

                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to fetch periodic tests",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

        fetchPeriodicTestBySlug:
            async (slug) => {
                try {
                    set({
                        loading: true,
                        selectedPeriodicTest:
                            null,
                    });

                    const res =
                        await periodicTestApi.getPeriodicTestBySlug(
                            slug,
                        );

                    const periodicTest =
                        normalizePeriodicTest(
                            res.data,
                        );

                    set({
                        selectedPeriodicTest:
                            periodicTest,
                    });

                    return periodicTest;
                } catch (error) {
                    set({
                        selectedPeriodicTest:
                            null,
                    });

                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to fetch periodic test",
                        ),
                    );

                    return null;
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

        createPeriodicTest:
            async (payload) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.createPeriodicTest(
                            payload,
                        );

                    const createdPeriodicTest =
                        normalizePeriodicTest(
                            res.data,
                        );

                    set((state) => ({
                        periodicTests: [
                            createdPeriodicTest,
                            ...state.periodicTests,
                        ],
                    }));

                    toast.success(
                        res.message ||
                        "Periodic test created successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to create periodic test",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        updatePeriodicTest:
            async (
                slug,
                payload,
            ) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.updatePeriodicTest(
                            slug,
                            payload,
                        );

                    const updatedPeriodicTest =
                        normalizePeriodicTest(
                            res.data,
                        );

                    set((state) => ({
                        periodicTests:
                            state.periodicTests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? updatedPeriodicTest
                                        : item,
                            ),

                        selectedPeriodicTest:
                            state
                                .selectedPeriodicTest
                                ?.slug ===
                                slug
                                ? updatedPeriodicTest
                                : state.selectedPeriodicTest,
                    }));

                    toast.success(
                        res.message ||
                        "Periodic test updated successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to update periodic test",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        deletePeriodicTest:
            async (slug) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.deletePeriodicTest(
                            slug,
                        );

                    const deletedPeriodicTest =
                        normalizePeriodicTest(
                            res.data,
                        );

                    set((state) => ({
                        periodicTests:
                            state.periodicTests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? {
                                            ...item,
                                            ...deletedPeriodicTest,
                                            status:
                                                "inactive",
                                            isActive:
                                                false,
                                        }
                                        : item,
                            ),

                        selectedPeriodicTest:
                            state
                                .selectedPeriodicTest
                                ?.slug ===
                                slug
                                ? {
                                    ...state.selectedPeriodicTest,
                                    ...deletedPeriodicTest,
                                    status:
                                        "inactive",
                                    isActive:
                                        false,
                                }
                                : state.selectedPeriodicTest,
                    }));

                    toast.success(
                        res.message ||
                        "Periodic test inactivated successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to inactivate periodic test",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        restorePeriodicTest:
            async (slug) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.restorePeriodicTest(
                            slug,
                        );

                    const restoredPeriodicTest =
                        normalizePeriodicTest(
                            res.data,
                        );

                    set((state) => ({
                        periodicTests:
                            state.periodicTests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? {
                                            ...item,
                                            ...restoredPeriodicTest,
                                            status:
                                                "active",
                                            isActive:
                                                true,
                                            deletedAt:
                                                null,
                                        }
                                        : item,
                            ),

                        selectedPeriodicTest:
                            state
                                .selectedPeriodicTest
                                ?.slug ===
                                slug
                                ? {
                                    ...state.selectedPeriodicTest,
                                    ...restoredPeriodicTest,
                                    status:
                                        "active",
                                    isActive:
                                        true,
                                    deletedAt:
                                        null,
                                }
                                : state.selectedPeriodicTest,
                    }));

                    toast.success(
                        res.message ||
                        "Periodic test restored successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to restore periodic test",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        fetchPeriodicTestTimeTable:
            async (
                periodicTestSlug,
                classSlug,
            ) => {
                try {
                    set({
                        loading: true,
                        periodicTestTimeTable:
                            null,
                        configuration:
                            null,
                    });

                    const res =
                        await periodicTestApi.getPeriodicTestTimeTable(
                            periodicTestSlug,
                            classSlug,
                        );

                    const responseData =
                        res.data ||
                        null;

                    const configuration =
                        responseData
                            ?.configuration ||
                        null;

                    const subjects =
                        normalizePeriodicTestSubjects(
                            configuration
                                ?.subjects ||
                            configuration
                                ?.periodicTestTimeTables ||
                            [],
                        );

                    set({
                        periodicTestTimeTable:
                            responseData,

                        configuration,

                        selectedPeriodicTest:
                            normalizePeriodicTest(
                                responseData
                                    ?.periodicTest,
                            ),

                        selectedClass:
                            responseData
                                ?.class ||
                            null,

                        subjects,

                        publishResult:
                            Boolean(
                                configuration
                                    ?.publishResult,
                            ),
                    });

                    return responseData;
                } catch (error) {
                    set({
                        periodicTestTimeTable:
                            null,
                        configuration:
                            null,
                        subjects: [],
                        publishResult:
                            false,
                    });

                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to fetch periodic test timetable",
                        ),
                    );

                    return null;
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

        savePeriodicTestTimeTable:
            async (payload) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.savePeriodicTestTimeTable(
                            payload,
                        );

                    const configuration =
                        res.data ||
                        null;

                    const savedSubjects =
                        normalizePeriodicTestSubjects(
                            configuration
                                ?.subjects ||
                            configuration
                                ?.periodicTestTimeTables ||
                            [],
                        );

                    set((state) => {
                        const savedSubjectsMap =
                            new Map(
                                savedSubjects.map(
                                    (subject) => [
                                        `${subject.classSubjectSlug}-${subject.streamSlug || "NA"}`,
                                        subject,
                                    ],
                                ),
                            );

                        const mergedSubjects =
                            state.subjects.map(
                                (subject) => {
                                    const key =
                                        `${subject.classSubjectSlug}-${subject.streamSlug || "NA"}`;

                                    return (
                                        savedSubjectsMap.get(
                                            key,
                                        ) ||
                                        subject
                                    );
                                },
                            );

                        const existingKeys =
                            new Set(
                                mergedSubjects.map(
                                    (subject) =>
                                        `${subject.classSubjectSlug}-${subject.streamSlug || "NA"}`,
                                ),
                            );

                        const newSubjects =
                            savedSubjects.filter(
                                (subject) =>
                                    !existingKeys.has(
                                        `${subject.classSubjectSlug}-${subject.streamSlug || "NA"}`,
                                    ),
                            );

                        return {
                            configuration,

                            periodicTestTimeTable:
                            {
                                ...state.periodicTestTimeTable,
                                configuration,
                            },

                            subjects: [
                                ...mergedSubjects,
                                ...newSubjects,
                            ],

                            publishResult:
                                Boolean(
                                    configuration
                                        ?.publishResult,
                                ),
                        };
                    });

                    toast.success(
                        res.message ||
                        "Periodic test timetable saved successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to save periodic test timetable",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        deletePeriodicTestTimeTable:
            async (
                periodicTestSlug,
                classSlug,
            ) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.deletePeriodicTestTimeTable(
                            periodicTestSlug,
                            classSlug,
                        );

                    const deletedAt =
                        res.data
                            ?.deletedAt ||
                        new Date().toISOString();

                    set((state) => ({
                        configuration:
                            state.configuration
                                ? {
                                    ...state.configuration,
                                    status:
                                        "inactive",
                                    isActive:
                                        false,
                                    deletedAt,
                                }
                                : null,

                        periodicTestTimeTable:
                            state.periodicTestTimeTable
                                ? {
                                    ...state.periodicTestTimeTable,
                                    configuration:
                                        state.configuration
                                            ? {
                                                ...state.configuration,
                                                status:
                                                    "inactive",
                                                isActive:
                                                    false,
                                                deletedAt,
                                            }
                                            : null,
                                }
                                : null,

                        subjects:
                            state.subjects.map(
                                (subject) => ({
                                    ...subject,
                                    status:
                                        "inactive",
                                    isActive:
                                        false,
                                    deletedAt,
                                }),
                            ),
                    }));

                    toast.success(
                        res.message ||
                        "Periodic test timetable inactivated successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to inactivate periodic test timetable",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        restorePeriodicTestTimeTable:
            async (
                periodicTestSlug,
                classSlug,
            ) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await periodicTestApi.restorePeriodicTestTimeTable(
                            periodicTestSlug,
                            classSlug,
                        );

                    set((state) => ({
                        configuration:
                            state.configuration
                                ? {
                                    ...state.configuration,
                                    status:
                                        "active",
                                    isActive:
                                        true,
                                    deletedAt:
                                        null,
                                }
                                : null,

                        periodicTestTimeTable:
                            state.periodicTestTimeTable
                                ? {
                                    ...state.periodicTestTimeTable,
                                    configuration:
                                        state.configuration
                                            ? {
                                                ...state.configuration,
                                                status:
                                                    "active",
                                                isActive:
                                                    true,
                                                deletedAt:
                                                    null,
                                            }
                                            : null,
                                }
                                : null,

                        subjects:
                            state.subjects.map(
                                (subject) => ({
                                    ...subject,
                                    status:
                                        "active",
                                    isActive:
                                        true,
                                    deletedAt:
                                        null,
                                }),
                            ),
                    }));

                    toast.success(
                        res.message ||
                        "Periodic test timetable restored successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to restore periodic test timetable",
                        ),
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        setPeriodicTests: (
            periodicTests,
        ) => {
            set({
                periodicTests:
                    Array.isArray(
                        periodicTests,
                    )
                        ? periodicTests.map(
                            normalizePeriodicTest,
                        )
                        : [],
            });
        },

        setSelectedPeriodicTest:
            (
                selectedPeriodicTest,
            ) => {
                set({
                    selectedPeriodicTest:
                        selectedPeriodicTest
                            ? normalizePeriodicTest(
                                selectedPeriodicTest,
                            )
                            : null,
                });
            },

        setSelectedClass: (
            selectedClass,
        ) => {
            set({
                selectedClass:
                    selectedClass ||
                    null,
            });
        },

        setSubjects: (
            subjects,
        ) => {
            set({
                subjects:
                    normalizePeriodicTestSubjects(
                        subjects,
                    ),
            });
        },

        updateSubjectField: (
            index,
            field,
            value,
        ) => {
            set((state) => ({
                subjects:
                    state.subjects.map(
                        (
                            subject,
                            subjectIndex,
                        ) =>
                            subjectIndex ===
                                index
                                ? {
                                    ...subject,
                                    [field]:
                                        value,
                                }
                                : subject,
                    ),
            }));
        },

        updateSubjectBySlug: (
            classSubjectSlug,
            field,
            value,
            streamSlug = null,
        ) => {
            set((state) => ({
                subjects:
                    state.subjects.map(
                        (subject) =>
                            subject.classSubjectSlug ===
                                classSubjectSlug &&
                                (subject.streamSlug ||
                                    null) ===
                                (streamSlug ||
                                    null)
                                ? {
                                    ...subject,
                                    [field]:
                                        value,
                                }
                                : subject,
                    ),
            }));
        },

        setPublishResult: (
            publishResult,
        ) => {
            set({
                publishResult:
                    Boolean(
                        publishResult,
                    ),
            });
        },

        clearSelectedPeriodicTest:
            () => {
                set({
                    selectedPeriodicTest:
                        null,
                });
            },

        clearPeriodicTestTimeTable:
            () => {
                set({
                    periodicTestTimeTable:
                        null,
                    configuration:
                        null,
                    selectedClass:
                        null,
                    subjects: [],
                    publishResult:
                        false,
                });
            },

        resetPeriodicTestStore:
            () => {
                set({
                    periodicTests: [],
                    selectedPeriodicTest:
                        null,
                    periodicTestTimeTable:
                        null,
                    configuration:
                        null,
                    selectedClass:
                        null,
                    subjects: [],
                    publishResult:
                        false,
                    loading: false,
                    submitLoading:
                        false,
                });
            },
    }));