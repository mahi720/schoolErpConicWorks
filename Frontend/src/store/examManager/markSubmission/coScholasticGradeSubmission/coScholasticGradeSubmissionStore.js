import { create } from "zustand";
import toast from "react-hot-toast";

import { coScholasticGradeSubmissionApi } from "../../../../api/examManager/markSubmission/coScholasticGradeSubmission/coScholasticGradeSubmissionApi";

const initialFilters = {
    academicYear: "",
    board: "",
    termExamSlug: "",
    termExamTitle: "",
    classTitle: "",
    section: "",
    stream: "",
};

const initialPagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
};

export const useCoScholasticGradeSubmissionStore =
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
        deleteLoading: false,
        auditLoading: false,

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

        clearGradeData: () => {
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
                                "overallStatus" &&
                                value !==
                                "ASSESSED"
                            ) {
                                updatedStudent.subjectGrades =
                                    Object.fromEntries(
                                        Object.entries(
                                            student.subjectGrades ||
                                            {},
                                        ).map(
                                            ([
                                                classSubjectSlug,
                                                subjectGrade,
                                            ]) => [
                                                    classSubjectSlug,

                                                    {
                                                        ...subjectGrade,

                                                        grade:
                                                            null,

                                                        assessmentStatus:
                                                            value,
                                                    },
                                                ],
                                        ),
                                    );
                            }

                            if (
                                field ===
                                "overallStatus" &&
                                value ===
                                "ASSESSED"
                            ) {
                                updatedStudent.subjectGrades =
                                    Object.fromEntries(
                                        Object.entries(
                                            student.subjectGrades ||
                                            {},
                                        ).map(
                                            ([
                                                classSubjectSlug,
                                                subjectGrade,
                                            ]) => [
                                                    classSubjectSlug,

                                                    {
                                                        ...subjectGrade,

                                                        assessmentStatus:
                                                            "ASSESSED",
                                                    },
                                                ],
                                        ),
                                    );
                            }

                            return updatedStudent;
                        },
                    ),
            }));
        },

        updateSubjectGradeField: (
            studentSlug,
            classSubjectSlug,
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

                            const currentGrade =
                                student
                                    .subjectGrades?.[
                                classSubjectSlug
                                ] || {
                                    studentSubjectGradeSlug:
                                        null,

                                    grade:
                                        null,

                                    assessmentStatus:
                                        "ASSESSED",

                                    remarks:
                                        "",
                                };

                            const updatedGrade = {
                                ...currentGrade,
                                [field]: value,
                            };

                            if (
                                field ===
                                "assessmentStatus" &&
                                value !==
                                "ASSESSED"
                            ) {
                                updatedGrade.grade =
                                    null;
                            }

                            return {
                                ...student,

                                subjectGrades: {
                                    ...student.subjectGrades,

                                    [classSubjectSlug]:
                                        updatedGrade,
                                },
                            };
                        },
                    ),
            }));
        },

        updateSubjectGrade: (
            studentSlug,
            classSubjectSlug,
            grade,
        ) => {
            get().updateSubjectGradeField(
                studentSlug,
                classSubjectSlug,
                "grade",
                grade,
            );
        },

        updateSubjectAssessmentStatus: (
            studentSlug,
            classSubjectSlug,
            assessmentStatus,
        ) => {
            get().updateSubjectGradeField(
                studentSlug,
                classSubjectSlug,
                "assessmentStatus",
                assessmentStatus,
            );
        },

        updateSubjectRemarks: (
            studentSlug,
            classSubjectSlug,
            remarks,
        ) => {
            get().updateSubjectGradeField(
                studentSlug,
                classSubjectSlug,
                "remarks",
                remarks,
            );
        },

        updateRemarkType: (
            studentSlug,
            remarkType,
        ) => {
            get().updateStudentField(
                studentSlug,
                "remarkType",
                remarkType,
            );
        },

        updateRemark: (
            studentSlug,
            remark,
        ) => {
            get().updateStudentField(
                studentSlug,
                "remark",
                remark,
            );
        },

        updatePresentDays: (
            studentSlug,
            presentDays,
        ) => {
            get().updateStudentField(
                studentSlug,
                "presentDays",
                presentDays,
            );
        },

        updateTotalDays: (
            studentSlug,
            totalDays,
        ) => {
            get().updateStudentField(
                studentSlug,
                "totalDays",
                totalDays,
            );
        },

        updateResult: (
            studentSlug,
            result,
        ) => {
            get().updateStudentField(
                studentSlug,
                "result",
                result,
            );
        },

        fetchStudents: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,

                    configuration:
                        null,

                    submission:
                        null,

                    selectedSubmission:
                        null,

                    students: [],
                });

                const res =
                    await coScholasticGradeSubmissionApi.getStudents(
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
                    configuration:
                        null,

                    submission:
                        null,

                    selectedSubmission:
                        null,

                    students: [],
                });

                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch Co-Scholastic students",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        saveGrades: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.saveGrades(
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
                    "Co-Scholastic grades saved successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to save Co-Scholastic grades",
                );

                return false;
            } finally {
                set({
                    submitLoading:
                        false,
                });
            }
        },

        bulkUpdateGrades: async (
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
                    submitLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.bulkUpdateGrades(
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
                    "Co-Scholastic grades updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to update Co-Scholastic grades",
                );

                return false;
            } finally {
                set({
                    submitLoading:
                        false,
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
                    modalLoading:
                        true,

                    selectedSubmission:
                        null,
                });

                const res =
                    await coScholasticGradeSubmissionApi.getSubmission(
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
                    "Failed to fetch Co-Scholastic grade submission",
                );

                return false;
            } finally {
                set({
                    modalLoading:
                        false,
                });
            }
        },

        lockGrades: async (
            submissionSlug,
        ) => {
            try {
                if (!submissionSlug) {
                    toast.error(
                        "Save grades before locking",
                    );

                    return false;
                }

                set({
                    lockLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.lockGrades(
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
                    "Co-Scholastic grades locked successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to lock Co-Scholastic grades",
                );

                return false;
            } finally {
                set({
                    lockLoading:
                        false,
                });
            }
        },

        unlockGrades: async (
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
                    lockLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.unlockGrades(
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
                    "Co-Scholastic grades unlocked successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to unlock Co-Scholastic grades",
                );

                return false;
            } finally {
                set({
                    lockLoading:
                        false,
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
                    deleteLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.deleteSubmission(
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
                    "Co-Scholastic grades deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to delete Co-Scholastic grades",
                );

                return false;
            } finally {
                set({
                    deleteLoading:
                        false,
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
                    deleteLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.restoreSubmission(
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
                    "Co-Scholastic grades restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to restore Co-Scholastic grades",
                );

                return false;
            } finally {
                set({
                    deleteLoading:
                        false,
                });
            }
        },

        fetchAuditLogs: async (
            params = {},
        ) => {
            try {
                set({
                    auditLoading:
                        true,
                });

                const res =
                    await coScholasticGradeSubmissionApi.getAuditLogs(
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
                    "Failed to fetch Co-Scholastic grade audit logs",
                );

                return false;
            } finally {
                set({
                    auditLoading:
                        false,
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
                deleteLoading: false,
                auditLoading: false,
            });
        },
    }));