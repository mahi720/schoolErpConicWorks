import { create } from "zustand";
import toast from "react-hot-toast";

import { studentAttendanceApi } from "../../../api/academic/studentAttendance/studentAttendanceApi";

const emptyMonthlyAttendance = {
    attendance: {},
    totalWorkingDays: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLeave: 0,
    totalHalfDay: 0,
    totalHoliday: 0,
    attendancePercentage: 0,
    attendanceDays: [],
};

const emptyLogPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
};

const getResponseData = (
    response,
    fallback = null,
) => {
    return response?.data ?? fallback;
};

const getSuccessMessage = (
    response,
    fallback,
) => {
    return (
        response?.message ||
        response?.data?.message ||
        fallback
    );
};

const getErrorMessage = (
    error,
    fallback,
) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
};

const normalizeAttendanceDay = (
    attendanceDay,
) => {
    if (!attendanceDay) {
        return null;
    }

    return {
        ...attendanceDay,

        daySlug:
            attendanceDay.daySlug ||
            attendanceDay.slug,
    };
};

const updateAttendanceStudentRow = ({
    students,
    academicMappingSlug,
    attendanceDay,
}) => {
    return students.map((student) => {
        if (
            student.academicMappingSlug !==
            academicMappingSlug
        ) {
            return student;
        }

        return {
            ...student,
            attendance:
                normalizeAttendanceDay(
                    attendanceDay,
                ),
        };
    });
};

const updateAttendanceByDaySlug = ({
    students,
    daySlug,
    attendanceDay,
}) => {
    return students.map((student) => {
        const currentDaySlug =
            student.attendance?.daySlug ||
            student.attendance?.slug;

        if (currentDaySlug !== daySlug) {
            return student;
        }

        return {
            ...student,
            attendance:
                normalizeAttendanceDay({
                    ...student.attendance,
                    ...attendanceDay,
                }),
        };
    });
};

export const useStudentAttendanceStore =
    create((set, get) => ({
        attendanceStudents: [],

        monthlyAttendance: {
            ...emptyMonthlyAttendance,
        },

        attendanceLogs: [],

        logPagination: {
            ...emptyLogPagination,
        },

        selectedAttendance: null,

        currentFilters: null,

        loading: false,
        submitLoading: false,
        monthlyLoading: false,
        logsLoading: false,

        actionLoadingSlug: null,

        setSelectedAttendance: (
            attendance,
        ) => {
            set({
                selectedAttendance:
                    attendance,
            });
        },

        clearSelectedAttendance: () => {
            set({
                selectedAttendance: null,
            });
        },

        clearAttendanceStudents: () => {
            set({
                attendanceStudents: [],
                currentFilters: null,
            });
        },

        clearMonthlyAttendance: () => {
            set({
                monthlyAttendance: {
                    ...emptyMonthlyAttendance,
                },
            });
        },

        clearAttendanceLogs: () => {
            set({
                attendanceLogs: [],
                logPagination: {
                    ...emptyLogPagination,
                },
            });
        },

        fetchAttendanceStudents: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                    currentFilters: params,
                });

                const response =
                    await studentAttendanceApi.getStudents(
                        params,
                    );

                const students =
                    getResponseData(
                        response,
                        [],
                    );

                set({
                    attendanceStudents:
                        Array.isArray(students)
                            ? students
                            : [],
                });

                return true;
            } catch (error) {
                set({
                    attendanceStudents: [],
                });

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch attendance students",
                    ),
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        markAttendance: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await studentAttendanceApi.markAttendance(
                        payload,
                    );

                const savedAttendances =
                    getResponseData(
                        response,
                        [],
                    );

                set((state) => {
                    let updatedStudents = [
                        ...state.attendanceStudents,
                    ];

                    if (
                        Array.isArray(
                            savedAttendances,
                        )
                    ) {
                        savedAttendances.forEach(
                            (savedItem) => {
                                updatedStudents =
                                    updateAttendanceStudentRow(
                                        {
                                            students:
                                                updatedStudents,

                                            academicMappingSlug:
                                                savedItem.academicMappingSlug,

                                            attendanceDay:
                                                savedItem.attendance,
                                        },
                                    );
                            },
                        );
                    }

                    return {
                        attendanceStudents:
                            updatedStudents,
                    };
                });

                toast.success(
                    getSuccessMessage(
                        response,
                        "Attendance marked successfully",
                    ),
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to mark attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateAttendance: async (
            daySlug,
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                    actionLoadingSlug:
                        daySlug,
                });

                const response =
                    await studentAttendanceApi.updateAttendance(
                        daySlug,
                        payload,
                    );

                const updatedDay =
                    getResponseData(
                        response,
                        null,
                    );

                if (updatedDay) {
                    set((state) => ({
                        attendanceStudents:
                            updateAttendanceByDaySlug(
                                {
                                    students:
                                        state.attendanceStudents,
                                    daySlug,
                                    attendanceDay:
                                        updatedDay,
                                },
                            ),

                        selectedAttendance:
                            state
                                .selectedAttendance
                                ?.daySlug ===
                                daySlug ||
                                state
                                    .selectedAttendance
                                    ?.slug ===
                                daySlug
                                ? normalizeAttendanceDay(
                                    {
                                        ...state.selectedAttendance,
                                        ...updatedDay,
                                    },
                                )
                                : state.selectedAttendance,
                    }));
                }

                toast.success(
                    getSuccessMessage(
                        response,
                        "Attendance updated successfully",
                    ),
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to update attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                    actionLoadingSlug: null,
                });
            }
        },

        deleteAttendance: async (
            daySlug,
            payload = {},
        ) => {
            try {
                set({
                    submitLoading: true,
                    actionLoadingSlug:
                        daySlug,
                });

                const response =
                    await studentAttendanceApi.deleteAttendance(
                        daySlug,
                        payload,
                    );

                const deletedDay =
                    getResponseData(
                        response,
                        null,
                    );

                if (deletedDay) {
                    set((state) => ({
                        attendanceStudents:
                            updateAttendanceByDaySlug(
                                {
                                    students:
                                        state.attendanceStudents,
                                    daySlug,
                                    attendanceDay:
                                        deletedDay,
                                },
                            ),

                        selectedAttendance:
                            state
                                .selectedAttendance
                                ?.daySlug ===
                                daySlug ||
                                state
                                    .selectedAttendance
                                    ?.slug ===
                                daySlug
                                ? normalizeAttendanceDay(
                                    {
                                        ...state.selectedAttendance,
                                        ...deletedDay,
                                    },
                                )
                                : state.selectedAttendance,
                    }));
                }

                toast.success(
                    getSuccessMessage(
                        response,
                        "Attendance deleted successfully",
                    ),
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to delete attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                    actionLoadingSlug: null,
                });
            }
        },

        restoreAttendance: async (
            daySlug,
            payload = {},
        ) => {
            try {
                set({
                    submitLoading: true,
                    actionLoadingSlug:
                        daySlug,
                });

                const response =
                    await studentAttendanceApi.restoreAttendance(
                        daySlug,
                        payload,
                    );

                const restoredDay =
                    getResponseData(
                        response,
                        null,
                    );

                if (restoredDay) {
                    set((state) => ({
                        attendanceStudents:
                            updateAttendanceByDaySlug(
                                {
                                    students:
                                        state.attendanceStudents,
                                    daySlug,
                                    attendanceDay:
                                        restoredDay,
                                },
                            ),

                        selectedAttendance:
                            state
                                .selectedAttendance
                                ?.daySlug ===
                                daySlug ||
                                state
                                    .selectedAttendance
                                    ?.slug ===
                                daySlug
                                ? normalizeAttendanceDay(
                                    {
                                        ...state.selectedAttendance,
                                        ...restoredDay,
                                    },
                                )
                                : state.selectedAttendance,
                    }));
                }

                toast.success(
                    getSuccessMessage(
                        response,
                        "Attendance restored successfully",
                    ),
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to restore attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                    actionLoadingSlug: null,
                });
            }
        },

        lockAttendance: async (
            daySlug,
            payload = {},
        ) => {
            try {
                set({
                    submitLoading: true,
                    actionLoadingSlug:
                        daySlug,
                });

                const response =
                    await studentAttendanceApi.lockAttendance(
                        daySlug,
                        payload,
                    );

                const lockedDay =
                    getResponseData(
                        response,
                        null,
                    );

                if (lockedDay) {
                    set((state) => ({
                        attendanceStudents:
                            updateAttendanceByDaySlug(
                                {
                                    students:
                                        state.attendanceStudents,
                                    daySlug,
                                    attendanceDay:
                                        lockedDay,
                                },
                            ),

                        selectedAttendance:
                            state
                                .selectedAttendance
                                ?.daySlug ===
                                daySlug ||
                                state
                                    .selectedAttendance
                                    ?.slug ===
                                daySlug
                                ? normalizeAttendanceDay(
                                    {
                                        ...state.selectedAttendance,
                                        ...lockedDay,
                                    },
                                )
                                : state.selectedAttendance,
                    }));
                }

                toast.success(
                    getSuccessMessage(
                        response,
                        "Attendance locked successfully",
                    ),
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to lock attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                    actionLoadingSlug: null,
                });
            }
        },

        unlockAttendance: async (
            daySlug,
            payload = {},
        ) => {
            try {
                set({
                    submitLoading: true,
                    actionLoadingSlug:
                        daySlug,
                });

                const response =
                    await studentAttendanceApi.unlockAttendance(
                        daySlug,
                        payload,
                    );

                const unlockedDay =
                    getResponseData(
                        response,
                        null,
                    );

                if (unlockedDay) {
                    set((state) => ({
                        attendanceStudents:
                            updateAttendanceByDaySlug(
                                {
                                    students:
                                        state.attendanceStudents,
                                    daySlug,
                                    attendanceDay:
                                        unlockedDay,
                                },
                            ),

                        selectedAttendance:
                            state
                                .selectedAttendance
                                ?.daySlug ===
                                daySlug ||
                                state
                                    .selectedAttendance
                                    ?.slug ===
                                daySlug
                                ? normalizeAttendanceDay(
                                    {
                                        ...state.selectedAttendance,
                                        ...unlockedDay,
                                    },
                                )
                                : state.selectedAttendance,
                    }));
                }

                toast.success(
                    getSuccessMessage(
                        response,
                        "Attendance unlocked successfully",
                    ),
                );

                return true;
            } catch (error) {
                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to unlock attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                    actionLoadingSlug: null,
                });
            }
        },

        fetchMonthlyAttendance: async (
            params = {},
        ) => {
            try {
                set({
                    monthlyLoading: true,
                });

                const response =
                    await studentAttendanceApi.getMonthlyAttendance(
                        params,
                    );

                const monthlyAttendance =
                    getResponseData(
                        response,
                        emptyMonthlyAttendance,
                    );

                set({
                    monthlyAttendance: {
                        ...emptyMonthlyAttendance,
                        ...monthlyAttendance,

                        attendance:
                            monthlyAttendance
                                ?.attendance ||
                            {},

                        attendanceDays:
                            monthlyAttendance
                                ?.attendanceDays ||
                            [],
                    },
                });

                return true;
            } catch (error) {
                set({
                    monthlyAttendance: {
                        ...emptyMonthlyAttendance,
                    },
                });

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch monthly attendance",
                    ),
                );

                return false;
            } finally {
                set({
                    monthlyLoading: false,
                });
            }
        },

        fetchAttendanceLogs: async (
            attendanceSlug,
            params = {},
        ) => {
            try {
                set({
                    logsLoading: true,
                });

                const response =
                    await studentAttendanceApi.getAttendanceLogs(
                        attendanceSlug,
                        params,
                    );

                const responseData =
                    getResponseData(
                        response,
                        {},
                    );

                const logs =
                    responseData?.data || [];

                const pagination =
                    responseData?.pagination ||
                    emptyLogPagination;

                set({
                    attendanceLogs:
                        Array.isArray(logs)
                            ? logs
                            : [],

                    logPagination: {
                        ...emptyLogPagination,
                        ...pagination,
                    },
                });

                return true;
            } catch (error) {
                set({
                    attendanceLogs: [],
                    logPagination: {
                        ...emptyLogPagination,
                    },
                });

                toast.error(
                    getErrorMessage(
                        error,
                        "Failed to fetch attendance logs",
                    ),
                );

                return false;
            } finally {
                set({
                    logsLoading: false,
                });
            }
        },

        refreshAttendanceStudents:
            async () => {
                const { currentFilters } =
                    get();

                if (!currentFilters) {
                    return false;
                }

                return get().fetchAttendanceStudents(
                    currentFilters,
                );
            },
    }));