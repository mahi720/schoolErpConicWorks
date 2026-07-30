import { create } from "zustand";
import toast from "react-hot-toast";

import { termExamTimeTableApi } from "../../../api/examManager/termExamTimeTable/termExamTimeTableApi";

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

const normalizeTermExam = (item) => {
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

        examTypeTitle:
            item.examTypeTitle ||
            item.examType?.examType ||
            "",
    };
};

const normalizeSubjects = (
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

            studyType:
                subject.studyType ||
                subject.studyMode ||
                subject.classSubject
                    ?.studyType ||
                "",

            studyMode:
                subject.studyMode ||
                subject.studyType ||
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

            examDate:
                subject.examDate
                    ? String(
                        subject.examDate,
                    ).slice(0, 10)
                    : "",

            examTime:
                subject.examTime ||
                "",

            duration:
                subject.duration ??
                "",

            questionPaper:
                subject.questionPaper ||
                null,
        }),
    );
};

export const useTermExamTimeTableStore =
    create((set, get) => ({
        termExams: [],
        selectedTermExam: null,

        termExamTimeTable: null,
        configuration: null,

        selectedClass: null,

        subjects: [],
        publishResult: false,

        loading: false,
        submitLoading: false,

        fetchTermExams: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await termExamTimeTableApi.getTermExams(
                        params,
                    );

                const termExams =
                    Array.isArray(
                        res.data,
                    )
                        ? res.data.map(
                            normalizeTermExam,
                        )
                        : [];

                set({
                    termExams,
                });

                return true;
            } catch (error) {
                set({
                    termExams: [],
                });

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch term exams",
                    ),
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchTermExamBySlug:
            async (slug) => {
                try {
                    set({
                        loading: true,
                    });

                    const res =
                        await termExamTimeTableApi.getTermExamBySlug(
                            slug,
                        );

                    const termExam =
                        normalizeTermExam(
                            res.data,
                        );

                    set({
                        selectedTermExam:
                            termExam,
                    });

                    return termExam;
                } catch (error) {
                    set({
                        selectedTermExam:
                            null,
                    });

                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to fetch term exam",
                        ),
                    );

                    return null;
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

        createTermExam: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading:
                        true,
                });

                const res =
                    await termExamTimeTableApi.createTermExam(
                        payload,
                    );

                const createdTermExam =
                    normalizeTermExam(
                        res.data,
                    );

                set((state) => ({
                    termExams: [
                        createdTermExam,
                        ...state.termExams,
                    ],
                }));

                toast.success(
                    res.message ||
                    "Term exam created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to create term exam",
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

        updateTermExam: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    submitLoading:
                        true,
                });

                const res =
                    await termExamTimeTableApi.updateTermExam(
                        slug,
                        payload,
                    );

                const updatedTermExam =
                    normalizeTermExam(
                        res.data,
                    );

                set((state) => ({
                    termExams:
                        state.termExams.map(
                            (item) =>
                                item.slug ===
                                    slug
                                    ? updatedTermExam
                                    : item,
                        ),

                    selectedTermExam:
                        state
                            .selectedTermExam
                            ?.slug === slug
                            ? updatedTermExam
                            : state.selectedTermExam,
                }));

                toast.success(
                    res.message ||
                    "Term exam updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update term exam",
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

        deleteTermExam: async (
            slug,
        ) => {
            try {
                set({
                    submitLoading:
                        true,
                });

                const res =
                    await termExamTimeTableApi.deleteTermExam(
                        slug,
                    );

                const deletedTermExam =
                    normalizeTermExam(
                        res.data,
                    );

                set((state) => ({
                    termExams:
                        state.termExams.map(
                            (item) =>
                                item.slug ===
                                    slug
                                    ? {
                                        ...item,
                                        ...deletedTermExam,
                                        status:
                                            "inactive",
                                        isActive:
                                            false,
                                    }
                                    : item,
                        ),

                    selectedTermExam:
                        state
                            .selectedTermExam
                            ?.slug === slug
                            ? {
                                ...state.selectedTermExam,
                                ...deletedTermExam,
                                status:
                                    "inactive",
                                isActive:
                                    false,
                            }
                            : state.selectedTermExam,
                }));

                toast.success(
                    res.message ||
                    "Term exam inactivated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to inactivate term exam",
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

        restoreTermExam: async (
            slug,
        ) => {
            try {
                set({
                    submitLoading:
                        true,
                });

                const res =
                    await termExamTimeTableApi.restoreTermExam(
                        slug,
                    );

                const restoredTermExam =
                    normalizeTermExam(
                        res.data,
                    );

                set((state) => ({
                    termExams:
                        state.termExams.map(
                            (item) =>
                                item.slug ===
                                    slug
                                    ? {
                                        ...item,
                                        ...restoredTermExam,
                                        status:
                                            "active",
                                        isActive:
                                            true,
                                        deletedAt:
                                            null,
                                    }
                                    : item,
                        ),

                    selectedTermExam:
                        state
                            .selectedTermExam
                            ?.slug === slug
                            ? {
                                ...state.selectedTermExam,
                                ...restoredTermExam,
                                status:
                                    "active",
                                isActive:
                                    true,
                                deletedAt:
                                    null,
                            }
                            : state.selectedTermExam,
                }));

                toast.success(
                    res.message ||
                    "Term exam restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to restore term exam",
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

        fetchTermExamTimeTable:
            async (
                termExamSlug,
                classSlug,
            ) => {
                try {
                    set({
                        loading: true,
                        termExamTimeTable:
                            null,
                        configuration:
                            null,
                    });

                    const res =
                        await termExamTimeTableApi.getTermExamTimeTable(
                            termExamSlug,
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
                        normalizeSubjects(
                            configuration
                                ?.subjects ||
                            configuration
                                ?.timeTables ||
                            [],
                        );

                    set({
                        termExamTimeTable:
                            responseData,

                        configuration,

                        selectedTermExam:
                            normalizeTermExam(
                                responseData
                                    ?.termExam,
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
                        termExamTimeTable:
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
                            "Failed to fetch term exam timetable",
                        ),
                    );

                    return null;
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

        saveTermExamTimeTable:
            async (payload) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await termExamTimeTableApi.saveTermExamTimeTable(
                            payload,
                        );

                    const configuration =
                        res.data ||
                        null;

                    const subjects =
                        normalizeSubjects(
                            configuration
                                ?.subjects ||
                            configuration
                                ?.timeTables ||
                            [],
                        );

                    set((state) => ({
                        configuration,

                        termExamTimeTable:
                        {
                            ...state
                                .termExamTimeTable,
                            configuration,
                        },

                        subjects,

                        publishResult:
                            Boolean(
                                configuration
                                    ?.publishResult,
                            ),
                    }));

                    toast.success(
                        res.message ||
                        "Term exam timetable saved successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to save term exam timetable",
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

        deleteTermExamTimeTable:
            async (
                termExamSlug,
                classSlug,
            ) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await termExamTimeTableApi.deleteTermExamTimeTable(
                            termExamSlug,
                            classSlug,
                        );

                    set((state) => ({
                        configuration:
                            state.configuration
                                ? {
                                    ...state.configuration,
                                    status:
                                        "inactive",
                                    isActive:
                                        false,
                                    deletedAt:
                                        res.data
                                            ?.deletedAt ||
                                        new Date().toISOString(),
                                }
                                : null,

                        termExamTimeTable:
                            state.termExamTimeTable
                                ? {
                                    ...state.termExamTimeTable,
                                    configuration:
                                        state.configuration
                                            ? {
                                                ...state.configuration,
                                                status:
                                                    "inactive",
                                                isActive:
                                                    false,
                                            }
                                            : null,
                                }
                                : null,
                    }));

                    toast.success(
                        res.message ||
                        "Term exam timetable inactivated successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to inactivate term exam timetable",
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

        restoreTermExamTimeTable:
            async (
                termExamSlug,
                classSlug,
            ) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await termExamTimeTableApi.restoreTermExamTimeTable(
                            termExamSlug,
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

                        termExamTimeTable:
                            state.termExamTimeTable
                                ? {
                                    ...state.termExamTimeTable,
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
                    }));

                    toast.success(
                        res.message ||
                        "Term exam timetable restored successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        getErrorMessage(
                            error,
                            "Failed to restore term exam timetable",
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

        setTermExams: (
            termExams,
        ) => {
            set({
                termExams:
                    Array.isArray(
                        termExams,
                    )
                        ? termExams
                        : [],
            });
        },

        setSelectedTermExam: (
            selectedTermExam,
        ) => {
            set({
                selectedTermExam:
                    selectedTermExam
                        ? normalizeTermExam(
                            selectedTermExam,
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
                    normalizeSubjects(
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
        ) => {
            set((state) => ({
                subjects:
                    state.subjects.map(
                        (subject) =>
                            subject.classSubjectSlug ===
                                classSubjectSlug
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

        clearSelectedTermExam:
            () => {
                set({
                    selectedTermExam:
                        null,
                });
            },

        clearTermExamTimeTable:
            () => {
                set({
                    termExamTimeTable:
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

        resetTermExamStore:
            () => {
                set({
                    termExams: [],
                    selectedTermExam:
                        null,
                    termExamTimeTable:
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