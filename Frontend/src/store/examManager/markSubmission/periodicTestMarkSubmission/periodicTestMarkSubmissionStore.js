import { create } from "zustand";
import toast from "react-hot-toast";

import { periodicTestMarkSubmissionApi } from "../../../../api/examManager/markSubmission/periodicTestMarkSubmission/periodicTestMarkSubmissionApi";

const initialFilters = {
    academicYear: "",
    board: "",
    periodicTestTitle: "",
    classTitle: "",
    classSubjectSlug: "",
    subjectTitle: "",
    studyMode: "",
    section: "",
    stream: "",
};

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

const normalizeStudentMarks = (
    students = [],
) => {
    return students.map((student) => ({
        ...student,
        selected: true,
        obtainedMarks:
            student.obtainedMarks === null ||
                student.obtainedMarks === undefined
                ? ""
                : String(student.obtainedMarks),
        markStatus:
            student.markStatus || "PRESENT",
        remarks: student.remarks || "",
    }));
};

export const usePeriodicTestMarkSubmissionStore =
    create((set, get) => ({
        filters: initialFilters,

        markData: null,
        configuration: null,
        submission: null,
        students: [],

        selectedSubmission: null,

        auditLogs: [],
        auditPagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
        },

        loading: false,
        submitLoading: false,
        lockLoading: false,
        deleteLoading: false,
        auditLoading: false,

        setFilter: (field, value) => {
            set((state) => ({
                filters: {
                    ...state.filters,
                    [field]: value,
                },
            }));
        },

        setFilters: (filters = {}) => {
            set((state) => ({
                filters: {
                    ...state.filters,
                    ...filters,
                },
            }));
        },

        resetDependentFilters: (
            fields = [],
        ) => {
            set((state) => {
                const updatedFilters = {
                    ...state.filters,
                };

                fields.forEach((field) => {
                    updatedFilters[field] = "";
                });

                return {
                    filters: updatedFilters,
                    markData: null,
                    configuration: null,
                    submission: null,
                    students: [],
                };
            });
        },

        resetFilters: () => {
            set({
                filters: initialFilters,
                markData: null,
                configuration: null,
                submission: null,
                students: [],
            });
        },

        setStudents: (students = []) => {
            set({
                students,
            });
        },

        setStudentSelected: (
            studentSlug,
            selected,
        ) => {
            set((state) => ({
                students: state.students.map(
                    (student) =>
                        student.studentSlug ===
                            studentSlug
                            ? {
                                ...student,
                                selected,
                            }
                            : student,
                ),
            }));
        },

        toggleAllStudents: (selected) => {
            set((state) => ({
                students: state.students.map(
                    (student) => ({
                        ...student,
                        selected,
                    }),
                ),
            }));
        },

        updateStudentMark: (
            studentSlug,
            field,
            value,
        ) => {
            set((state) => ({
                students: state.students.map(
                    (student) => {
                        if (
                            student.studentSlug !==
                            studentSlug
                        ) {
                            return student;
                        }

                        if (
                            field === "markStatus" &&
                            value !== "PRESENT"
                        ) {
                            return {
                                ...student,
                                markStatus: value,
                                obtainedMarks: "",
                            };
                        }

                        return {
                            ...student,
                            [field]: value,
                        };
                    },
                ),
            }));
        },

        markStudentPresent: (
            studentSlug,
        ) => {
            set((state) => ({
                students: state.students.map(
                    (student) =>
                        student.studentSlug ===
                            studentSlug
                            ? {
                                ...student,
                                markStatus: "PRESENT",
                            }
                            : student,
                ),
            }));
        },

        markStudentAbsent: (
            studentSlug,
        ) => {
            set((state) => ({
                students: state.students.map(
                    (student) =>
                        student.studentSlug ===
                            studentSlug
                            ? {
                                ...student,
                                markStatus: "ABSENT",
                                obtainedMarks: "",
                            }
                            : student,
                ),
            }));
        },

        clearMarkData: () => {
            set({
                markData: null,
                configuration: null,
                submission: null,
                students: [],
                selectedSubmission: null,
            });
        },

        fetchStudents: async (
            params = null,
        ) => {
            try {
                set({
                    loading: true,
                    markData: null,
                    configuration: null,
                    submission: null,
                    students: [],
                });

                const filters =
                    params || get().filters;

                const cleanParams = {
                    academicYear:
                        filters.academicYear,
                    board: filters.board,
                    periodicTestTitle:
                        filters.periodicTestTitle,
                    classTitle:
                        filters.classTitle,
                    classSubjectSlug:
                        filters.classSubjectSlug,
                    subjectTitle:
                        filters.subjectTitle,
                    ...(filters.studyMode
                        ? {
                            studyMode:
                                filters.studyMode,
                        }
                        : {}),
                    ...(filters.section
                        ? {
                            section:
                                filters.section,
                        }
                        : {}),
                    ...(filters.stream
                        ? {
                            stream:
                                filters.stream,
                        }
                        : {}),
                };

                const response =
                    await periodicTestMarkSubmissionApi.getStudents(
                        cleanParams,
                    );

                const data =
                    response?.data || null;

                set({
                    markData: data,
                    configuration:
                        data?.configuration || null,
                    submission:
                        data?.submission || null,
                    students:
                        normalizeStudentMarks(
                            data?.students || [],
                        ),
                });

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch students",
                    ),
                );

                set({
                    markData: null,
                    configuration: null,
                    submission: null,
                    students: [],
                });

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        saveMarks: async (
            payload = null,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const state = get();

                const selectedStudents =
                    state.students.filter(
                        (student) =>
                            student.selected,
                    );

                if (!selectedStudents.length) {
                    toast.error(
                        "Select at least one student",
                    );

                    return false;
                }

                const requestPayload =
                    payload || {
                        academicYear:
                            state.filters
                                .academicYear,
                        board:
                            state.filters.board,
                        periodicTestTitle:
                            state.filters
                                .periodicTestTitle,
                        classTitle:
                            state.filters
                                .classTitle,
                        classSubjectSlug:
                            state.filters.classSubjectSlug,
                        subjectTitle:
                            state.filters
                                .subjectTitle,
                        ...(state.filters.studyMode
                            ? {
                                studyMode:
                                    state.filters
                                        .studyMode,
                            }
                            : {}),
                        section:
                            state.filters.section ||
                            null,
                        stream:
                            state.filters.stream ||
                            null,
                        students:
                            selectedStudents.map(
                                (student) => ({
                                    studentSlug:
                                        student.studentSlug,
                                    academicMappingSlug:
                                        student.academicMappingSlug,
                                    obtainedMarks:
                                        student.markStatus ===
                                            "PRESENT"
                                            ? Number(
                                                student.obtainedMarks,
                                            )
                                            : null,
                                    markStatus:
                                        student.markStatus,
                                    remarks:
                                        student.remarks?.trim() ||
                                        null,
                                }),
                            ),
                    };

                const response =
                    await periodicTestMarkSubmissionApi.saveMarks(
                        requestPayload,
                    );

                const submissionData =
                    response?.data || null;

                set({
                    selectedSubmission:
                        submissionData,
                    submission:
                        submissionData
                            ? {
                                slug:
                                    submissionData.slug,
                                isLocked:
                                    submissionData.isLocked,
                                lockedAt:
                                    submissionData.lockedAt,
                                submittedAt:
                                    submissionData.submittedAt,
                                status:
                                    submissionData.status,
                                isActive:
                                    submissionData.isActive,
                            }
                            : state.submission,
                    students:
                        submissionData?.studentMarks
                            ? normalizeStudentMarks(
                                submissionData.studentMarks.map(
                                    (item) => ({
                                        studentSlug:
                                            item.studentSlug,
                                        academicMappingSlug:
                                            item.academicMappingSlug,
                                        studentMarkSlug:
                                            item.slug,
                                        admissionNumber:
                                            item.student
                                                ?.admissionNumber,
                                        studentName:
                                            item.student
                                                ?.studentName,
                                        profileImage:
                                            item.student
                                                ?.profileImage,
                                        rollNumber:
                                            item.rollNo,
                                        sectionSlug:
                                            item.academicMapping
                                                ?.sectionSlug,
                                        sectionTitle:
                                            item.academicMapping
                                                ?.section
                                                ?.sectionTitle,
                                        streamSlug:
                                            item.academicMapping
                                                ?.streamSlug,
                                        streamTitle:
                                            item.academicMapping
                                                ?.stream
                                                ?.streamTitle,
                                        obtainedMarks:
                                            item.obtainedMarks,
                                        markStatus:
                                            item.markStatus,
                                        remarks:
                                            item.remarks,
                                    }),
                                ),
                            )
                            : state.students,
                });

                toast.success(
                    response?.message ||
                    "Marks saved successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to save marks",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateMarks: async (
            submissionSlug,
            payload = null,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const state = get();

                const selectedStudents =
                    state.students.filter(
                        (student) =>
                            student.selected &&
                            student.studentMarkSlug,
                    );

                if (!selectedStudents.length) {
                    toast.error(
                        "Select at least one saved student mark",
                    );

                    return false;
                }

                const requestPayload =
                    payload || {
                        students:
                            selectedStudents.map(
                                (student) => ({
                                    studentMarkSlug:
                                        student.studentMarkSlug,
                                    obtainedMarks:
                                        student.markStatus ===
                                            "PRESENT"
                                            ? Number(
                                                student.obtainedMarks,
                                            )
                                            : null,
                                    markStatus:
                                        student.markStatus,
                                    remarks:
                                        student.remarks?.trim() ||
                                        null,
                                }),
                            ),
                    };

                const response =
                    await periodicTestMarkSubmissionApi.updateMarks(
                        submissionSlug,
                        requestPayload,
                    );

                const submissionData =
                    response?.data || null;

                set({
                    selectedSubmission:
                        submissionData,
                    submission:
                        submissionData
                            ? {
                                slug:
                                    submissionData.slug,
                                isLocked:
                                    submissionData.isLocked,
                                lockedAt:
                                    submissionData.lockedAt,
                                submittedAt:
                                    submissionData.submittedAt,
                                status:
                                    submissionData.status,
                                isActive:
                                    submissionData.isActive,
                            }
                            : state.submission,
                });

                toast.success(
                    response?.message ||
                    "Marks updated successfully",
                );

                await get().fetchStudents();

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update marks",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        fetchSubmissionBySlug: async (
            slug,
        ) => {
            try {
                set({
                    loading: true,
                    selectedSubmission: null,
                });

                const response =
                    await periodicTestMarkSubmissionApi.getSubmissionBySlug(
                        slug,
                    );

                set({
                    selectedSubmission:
                        response?.data || null,
                });

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch mark submission",
                    ),
                );

                set({
                    selectedSubmission: null,
                });

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        lockMarks: async (slug) => {
            try {
                set({
                    lockLoading: true,
                });

                const response =
                    await periodicTestMarkSubmissionApi.lockMarks(
                        slug,
                    );

                set((state) => ({
                    submission: {
                        ...state.submission,
                        ...(response?.data || {}),
                    },
                    selectedSubmission:
                        state.selectedSubmission
                            ? {
                                ...state.selectedSubmission,
                                ...(response?.data || {}),
                            }
                            : response?.data || null,
                }));

                toast.success(
                    response?.message ||
                    "Marks locked successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to lock marks",
                    ),
                );

                return false;
            } finally {
                set({
                    lockLoading: false,
                });
            }
        },

        unlockMarks: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    lockLoading: true,
                });

                const response =
                    await periodicTestMarkSubmissionApi.unlockMarks(
                        slug,
                        payload,
                    );

                set((state) => ({
                    submission: {
                        ...state.submission,
                        ...(response?.data || {}),
                    },
                    selectedSubmission:
                        state.selectedSubmission
                            ? {
                                ...state.selectedSubmission,
                                ...(response?.data || {}),
                            }
                            : response?.data || null,
                }));

                toast.success(
                    response?.message ||
                    "Marks unlocked successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to unlock marks",
                    ),
                );

                return false;
            } finally {
                set({
                    lockLoading: false,
                });
            }
        },

        deleteSubmission: async (
            slug,
        ) => {
            try {
                set({
                    deleteLoading: true,
                });

                const response =
                    await periodicTestMarkSubmissionApi.deleteSubmission(
                        slug,
                    );

                set({
                    submission: null,
                    selectedSubmission: null,
                    markData: null,
                    students: [],
                    configuration: null,
                });

                toast.success(
                    response?.message ||
                    "Mark submission deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to delete mark submission",
                    ),
                );

                return false;
            } finally {
                set({
                    deleteLoading: false,
                });
            }
        },

        restoreSubmission: async (
            slug,
        ) => {
            try {
                set({
                    deleteLoading: true,
                });

                const response =
                    await periodicTestMarkSubmissionApi.restoreSubmission(
                        slug,
                    );

                set({
                    selectedSubmission:
                        response?.data || null,
                });

                toast.success(
                    response?.message ||
                    "Mark submission restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to restore mark submission",
                    ),
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

                const response =
                    await periodicTestMarkSubmissionApi.getAuditLogs(
                        params,
                    );

                const responseData =
                    response?.data || {};

                set({
                    auditLogs:
                        responseData.data || [],
                    auditPagination:
                        responseData.pagination || {
                            page: 1,
                            limit: 20,
                            total: 0,
                            totalPages: 0,
                        },
                });

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch audit logs",
                    ),
                );

                set({
                    auditLogs: [],
                    auditPagination: {
                        page: 1,
                        limit: 20,
                        total: 0,
                        totalPages: 0,
                    },
                });

                return false;
            } finally {
                set({
                    auditLoading: false,
                });
            }
        },
    }));