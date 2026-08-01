import { create } from "zustand";
import toast from "react-hot-toast";

import { termExamMarkSubmissionApi } from "../../../../api/examManager/markSubmission/termExamMarkSubmission/termExamMarkSubmissionApi";

const initialFilters = {
    academicYear: "",
    board: "",
    termExamTitle: "",
    classTitle: "",
    classSubjectSlug: "",
    subjectTitle: "",
    studyMode: "",
    section: "",
    stream: "",
};

const initialPagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
};

const calculateStudentTotal = (
    student,
) => {
    const components =
        Object.values(
            student.components || {},
        );

    return components.reduce(
        (total, component) => {
            if (
                component.markStatus !==
                "PRESENT"
            ) {
                return total;
            }

            const marks =
                component.obtainedMarks;

            if (
                marks === "" ||
                marks === null ||
                marks === undefined
            ) {
                return total;
            }

            return (
                total +
                Number(marks || 0)
            );
        },
        0,
    );
};

export const useTermExamMarkSubmissionStore =
    create((set, get) => ({
        filters: {
            ...initialFilters,
        },

        configuration: null,
        submission: null,
        selectedSubmission: null,

        students: [],
        auditLogs: [],

        pagination: {
            ...initialPagination,
        },

        loading: false,
        submitLoading: false,
        modalLoading: false,
        lockLoading: false,
        auditLoading: false,
        deleteLoading: false,

        setFilter: (
            field,
            value,
        ) => {
            set((state) => ({
                filters: {
                    ...state.filters,
                    [field]: value,
                },
            }));
        },

        setFilters: (
            values = {},
        ) => {
            set((state) => ({
                filters: {
                    ...state.filters,
                    ...values,
                },
            }));
        },

        resetFilters: () => {
            set({
                filters: {
                    ...initialFilters,
                },

                configuration: null,
                submission: null,
                selectedSubmission: null,
                students: [],
            });
        },

        resetDependentFilters: (
            fields = [],
        ) => {
            set((state) => {
                const nextFilters = {
                    ...state.filters,
                };

                fields.forEach(
                    (field) => {
                        nextFilters[field] =
                            "";
                    },
                );

                return {
                    filters:
                        nextFilters,

                    configuration:
                        null,

                    submission:
                        null,

                    selectedSubmission:
                        null,

                    students: [],
                };
            });
        },

        clearMarkData: () => {
            set({
                configuration: null,
                submission: null,
                selectedSubmission: null,
                students: [],
            });
        },

        setStudents: (
            students = [],
        ) => {
            set({
                students,
            });
        },

        setStudentSelected: (
            studentSlug,
            checked,
        ) => {
            set((state) => ({
                students:
                    state.students.map(
                        (student) =>
                            student.studentSlug ===
                                studentSlug
                                ? {
                                    ...student,
                                    selected:
                                        checked,
                                }
                                : student,
                    ),
            }));
        },

        toggleAllStudents: (
            checked,
        ) => {
            set((state) => ({
                students:
                    state.students.map(
                        (student) => ({
                            ...student,
                            selected:
                                checked,
                        }),
                    ),
            }));
        },

        updateStudentField: (
            studentSlug,
            field,
            value,
        ) => {
            set((state) => ({
                students:
                    state.students.map(
                        (student) => {
                            if (
                                student.studentSlug !==
                                studentSlug
                            ) {
                                return student;
                            }

                            const updatedStudent = {
                                ...student,
                                [field]: value,
                            };

                            if (
                                field ===
                                "markStatus" &&
                                value !==
                                "PRESENT"
                            ) {
                                updatedStudent.components =
                                    Object.fromEntries(
                                        Object.entries(
                                            student.components ||
                                            {},
                                        ).map(
                                            ([
                                                componentKey,
                                                component,
                                            ]) => [
                                                    componentKey,
                                                    {
                                                        ...component,
                                                        obtainedMarks:
                                                            null,
                                                        markStatus:
                                                            value,
                                                    },
                                                ],
                                        ),
                                    );
                            }

                            if (
                                field ===
                                "markStatus" &&
                                value ===
                                "PRESENT"
                            ) {
                                updatedStudent.components =
                                    Object.fromEntries(
                                        Object.entries(
                                            student.components ||
                                            {},
                                        ).map(
                                            ([
                                                componentKey,
                                                component,
                                            ]) => [
                                                    componentKey,
                                                    {
                                                        ...component,
                                                        markStatus:
                                                            "PRESENT",
                                                    },
                                                ],
                                        ),
                                    );
                            }

                            updatedStudent.totalObtainedMarks =
                                calculateStudentTotal(
                                    updatedStudent,
                                );

                            return updatedStudent;
                        },
                    ),
            }));
        },

        updateComponentMark: (
            studentSlug,
            componentKey,
            field,
            value,
        ) => {
            set((state) => ({
                students:
                    state.students.map(
                        (student) => {
                            if (
                                student.studentSlug !==
                                studentSlug
                            ) {
                                return student;
                            }

                            const currentComponent =
                                student
                                    .components?.[
                                componentKey
                                ] || {
                                    componentMarkSlug:
                                        null,
                                    obtainedMarks:
                                        null,
                                    markStatus:
                                        "PRESENT",
                                    remarks:
                                        "",
                                };

                            const updatedComponent = {
                                ...currentComponent,
                                [field]: value,
                            };

                            if (
                                field ===
                                "markStatus" &&
                                value !==
                                "PRESENT"
                            ) {
                                updatedComponent.obtainedMarks =
                                    null;
                            }

                            const updatedStudent = {
                                ...student,

                                components: {
                                    ...student.components,

                                    [componentKey]:
                                        updatedComponent,
                                },
                            };

                            updatedStudent.totalObtainedMarks =
                                calculateStudentTotal(
                                    updatedStudent,
                                );

                            return updatedStudent;
                        },
                    ),
            }));
        },

        updateComponentMarks: (
            studentSlug,
            componentKey,
            obtainedMarks,
        ) => {
            get().updateComponentMark(
                studentSlug,
                componentKey,
                "obtainedMarks",
                obtainedMarks,
            );
        },

        updateComponentStatus: (
            studentSlug,
            componentKey,
            markStatus,
        ) => {
            get().updateComponentMark(
                studentSlug,
                componentKey,
                "markStatus",
                markStatus,
            );
        },

        updateComponentRemarks: (
            studentSlug,
            componentKey,
            remarks,
        ) => {
            get().updateComponentMark(
                studentSlug,
                componentKey,
                "remarks",
                remarks,
            );
        },

        fetchStudents: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                    configuration: null,
                    submission: null,
                    selectedSubmission: null,
                    students: [],
                });

                const res =
                    await termExamMarkSubmissionApi.getStudents(
                        params,
                    );

                const data =
                    res.data || {};

                set({
                    configuration:
                        data.configuration ||
                        null,

                    submission:
                        data.submission ||
                        null,

                    selectedSubmission:
                        data.submission ||
                        null,

                    students:
                        Array.isArray(
                            data.students,
                        )
                            ? data.students
                            : [],
                });

                return true;
            } catch (error) {
                set({
                    configuration: null,
                    submission: null,
                    selectedSubmission: null,
                    students: [],
                });

                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch term exam students",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        saveMarks: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.saveMarks(
                        payload,
                    );

                const submission =
                    res.data || null;

                set({
                    submission,
                    selectedSubmission:
                        submission,
                });

                toast.success(
                    res.message ||
                    "Term exam marks saved successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to save term exam marks",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        bulkUpdateMarks: async (
            submissionSlug,
            payload,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Submission slug is required",
                    );

                    return false;
                }

                set({
                    submitLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.bulkUpdateMarks(
                        submissionSlug,
                        payload,
                    );

                const submission =
                    res.data || null;

                set({
                    submission,
                    selectedSubmission:
                        submission,
                });

                toast.success(
                    res.message ||
                    "Term exam marks updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to update term exam marks",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        fetchSubmission: async (
            submissionSlug,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Submission slug is required",
                    );

                    return false;
                }

                set({
                    modalLoading: true,
                    selectedSubmission: null,
                });

                const res =
                    await termExamMarkSubmissionApi.getSubmission(
                        submissionSlug,
                    );

                set({
                    selectedSubmission:
                        res.data || null,
                });

                return true;
            } catch (error) {
                set({
                    selectedSubmission:
                        null,
                });

                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch term exam submission",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },

        lockMarks: async (
            submissionSlug,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Save marks before locking",
                    );

                    return false;
                }

                set({
                    lockLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.lockMarks(
                        submissionSlug,
                    );

                const updated =
                    res.data || null;

                set((state) => ({
                    submission:
                        state.submission
                            ? {
                                ...state.submission,
                                ...updated,
                            }
                            : updated,

                    selectedSubmission:
                        state.selectedSubmission
                            ? {
                                ...state.selectedSubmission,
                                ...updated,
                            }
                            : updated,
                }));

                toast.success(
                    res.message ||
                    "Term exam marks locked successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to lock term exam marks",
                );

                return false;
            } finally {
                set({
                    lockLoading: false,
                });
            }
        },

        unlockMarks: async (
            submissionSlug,
            payload,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Submission slug is required",
                    );

                    return false;
                }

                set({
                    lockLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.unlockMarks(
                        submissionSlug,
                        payload,
                    );

                const updated =
                    res.data || null;

                set((state) => ({
                    submission:
                        state.submission
                            ? {
                                ...state.submission,
                                ...updated,
                            }
                            : updated,

                    selectedSubmission:
                        state.selectedSubmission
                            ? {
                                ...state.selectedSubmission,
                                ...updated,
                            }
                            : updated,
                }));

                toast.success(
                    res.message ||
                    "Term exam marks unlocked successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to unlock term exam marks",
                );

                return false;
            } finally {
                set({
                    lockLoading: false,
                });
            }
        },

        deleteSubmission: async (
            submissionSlug,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Submission slug is required",
                    );

                    return false;
                }

                set({
                    deleteLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.deleteSubmission(
                        submissionSlug,
                    );

                const deletedSubmission =
                    res.data || null;

                set({
                    submission:
                        deletedSubmission,
                    selectedSubmission:
                        deletedSubmission,
                });

                toast.success(
                    res.message ||
                    "Term exam marks deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to delete term exam marks",
                );

                return false;
            } finally {
                set({
                    deleteLoading: false,
                });
            }
        },

        restoreSubmission: async (
            submissionSlug,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Submission slug is required",
                    );

                    return false;
                }

                set({
                    deleteLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.restoreSubmission(
                        submissionSlug,
                    );

                const restoredSubmission =
                    res.data || null;

                set({
                    submission:
                        restoredSubmission,
                    selectedSubmission:
                        restoredSubmission,
                });

                toast.success(
                    res.message ||
                    "Term exam marks restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to restore term exam marks",
                );

                return false;
            } finally {
                set({
                    deleteLoading: false,
                });
            }
        },

        fetchAuditLogs: async (
            params = {},
        ) => {
            try {
                set({
                    auditLoading: true,
                });

                const res =
                    await termExamMarkSubmissionApi.getAuditLogs(
                        params,
                    );

                const data =
                    res.data || {};

                set({
                    auditLogs:
                        Array.isArray(
                            data.data,
                        )
                            ? data.data
                            : [],

                    pagination: {
                        ...initialPagination,
                        ...(data.pagination ||
                            {}),
                    },
                });

                return true;
            } catch (error) {
                set({
                    auditLogs: [],

                    pagination: {
                        ...initialPagination,
                    },
                });

                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch term exam mark audit logs",
                );

                return false;
            } finally {
                set({
                    auditLoading: false,
                });
            }
        },

        resetStore: () => {
            set({
                filters: {
                    ...initialFilters,
                },

                configuration: null,
                submission: null,
                selectedSubmission: null,

                students: [],
                auditLogs: [],

                pagination: {
                    ...initialPagination,
                },

                loading: false,
                submitLoading: false,
                modalLoading: false,
                lockLoading: false,
                auditLoading: false,
                deleteLoading: false,
            });
        },
    }));