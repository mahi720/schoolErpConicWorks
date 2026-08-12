import { create } from "zustand";
import toast from "react-hot-toast";

import { employeeAttendanceApi } from "../../../api/hrm/attendance/employeeAttendanceApi";

export const useEmployeeAttendanceStore = create((set) => ({
    attendanceData: null,

    employees: [],

    summary: {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        holiday: 0,
        notMarked: 0,
    },

    dashboard: null,

    logs: [],

    yearlyReport: null,

    selectedAttendance: null,

    loading: false,

    dashboardLoading: false,

    submitLoading: false,

    lockLoading: false,

    logLoading: false,

    reportLoading: false,

    actionLoadingSlug: null,

    saveLoading: false,

    importLoading: false,
    importResult: null,
    monthlyReport: null,
    monthlyReportLoading: false,
    reconciliationDetail: null,
    reconciliationLoading: false,
    reconciliationLockLoading: false,
    noPunchReport: null,
    noPunchLoading: false,

    fetchAttendances: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await employeeAttendanceApi.getAll(params);

            const data = response.data || null;

            set({
                attendanceData: data,

                employees: data?.employees || [],

                summary: data?.summary || {
                    total: 0,
                    present: 0,
                    absent: 0,
                    leave: 0,
                    holiday: 0,
                    notMarked: 0,
                },
            });

            return true;
        } catch (error) {
            set({
                attendanceData: null,

                employees: [],

                summary: {
                    total: 0,
                    present: 0,
                    absent: 0,
                    leave: 0,
                    holiday: 0,
                    notMarked: 0,
                },
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch employee attendance",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchDashboard: async (params = {}) => {
        try {
            set({
                dashboardLoading: true,
            });

            const response = await employeeAttendanceApi.getDashboard(params);

            set({
                dashboard: response.data || null,
            });

            return true;
        } catch (error) {
            set({
                dashboard: null,
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch attendance dashboard",
            );

            return false;
        } finally {
            set({
                dashboardLoading: false,
            });
        }
    },

    markPresent: async (employeeSlug, payload) => {
        try {
            set({
                submitLoading: true,

                actionLoadingSlug: employeeSlug,
            });

            const response = await employeeAttendanceApi.markPresent(
                employeeSlug,
                payload,
            );

            toast.success(response.message || "Employee marked present successfully");

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to mark employee present",
            );

            return false;
        } finally {
            set({
                submitLoading: false,

                actionLoadingSlug: null,
            });
        }
    },

    markAbsent: async (employeeSlug, payload) => {
        try {
            set({
                submitLoading: true,

                actionLoadingSlug: employeeSlug,
            });

            const response = await employeeAttendanceApi.markAbsent(
                employeeSlug,
                payload,
            );

            toast.success(response.message || "Employee marked absent successfully");

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to mark employee absent",
            );

            return false;
        } finally {
            set({
                submitLoading: false,

                actionLoadingSlug: null,
            });
        }
    },

    updateAttendance: async (attendanceSlug, payload) => {
        try {
            set({
                submitLoading: true,

                actionLoadingSlug: attendanceSlug,
            });

            const response = await employeeAttendanceApi.update(
                attendanceSlug,
                payload,
            );

            toast.success(response.message || "Attendance updated successfully");

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to update attendance",
            );

            return false;
        } finally {
            set({
                submitLoading: false,

                actionLoadingSlug: null,
            });
        }
    },

    lockAttendance: async (payload) => {
        try {
            set({
                lockLoading: true,
            });

            const response = await employeeAttendanceApi.lock(payload);

            toast.success(response.message || "Attendance locked successfully");

            return {
                success: true,

                data: response.data || null,
            };
        } catch (error) {
            const responseData = error?.response?.data;

            toast.error(responseData?.message || "Failed to lock attendance");

            return {
                success: false,

                data: responseData || null,
            };
        } finally {
            set({
                lockLoading: false,
            });
        }
    },

    unlockAttendance: async (payload) => {
        try {
            set({
                lockLoading: true,
            });

            const response = await employeeAttendanceApi.unlock(payload);

            toast.success(response.message || "Attendance unlocked successfully");

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to unlock attendance",
            );

            return false;
        } finally {
            set({
                lockLoading: false,
            });
        }
    },

    fetchLogs: async (params = {}) => {
        try {
            set({
                logLoading: true,
            });

            const response = await employeeAttendanceApi.getLogs(params);

            set({
                logs: response.data || [],
            });

            return true;
        } catch (error) {
            set({
                logs: [],
            });

            toast.error(
                error?.response?.data?.message || "Failed to fetch attendance logs",
            );

            return false;
        } finally {
            set({
                logLoading: false,
            });
        }
    },

    fetchYearlyReport: async (params = {}) => {
        try {
            set({
                reportLoading: true,
            });

            const response = await employeeAttendanceApi.getYearlyReport(params);

            set({
                yearlyReport: response.data || null,
            });

            return true;
        } catch (error) {
            set({
                yearlyReport: null,
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch yearly attendance report",
            );

            return false;
        } finally {
            set({
                reportLoading: false,
            });
        }
    },

    fetchMonthlyReport: async (params = {}) => {
        try {
            set({
                monthlyReportLoading: true,
            });

            const response =
                await employeeAttendanceApi.getMonthlyReport(
                    params,
                );

            set({
                monthlyReport:
                    response.data ||
                    null,
            });

            return true;
        } catch (error) {
            set({
                monthlyReport: null,
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch monthly attendance report",
            );

            return false;
        } finally {
            set({
                monthlyReportLoading: false,
            });
        }
    },

    clearMonthlyReport: () => {
        set({
            monthlyReport: null,
        });
    },

    fetchEmployeeMonthlyReconciliation: async (
        employeeSlug,
        params = {},
    ) => {
        try {
            set({
                reconciliationLoading:
                    true,
            });

            const response =
                await employeeAttendanceApi.getEmployeeMonthlyReconciliation(
                    employeeSlug,
                    params,
                );

            set({
                reconciliationDetail:
                    response.data ||
                    null,
            });

            return true;
        } catch (error) {
            set({
                reconciliationDetail:
                    null,
            });

            toast.error(
                error?.response
                    ?.data
                    ?.message ||
                "Failed to fetch reconciliation report",
            );

            return false;
        } finally {
            set({
                reconciliationLoading:
                    false,
            });
        }
    },

    lockReconciliationAttendance: async (
        attendanceSlug,
    ) => {
        try {
            set({
                reconciliationLockLoading:
                    true,
            });

            const response =
                await employeeAttendanceApi.lockReconciliationAttendance(
                    attendanceSlug,
                );

            toast.success(
                response.message ||
                "Attendance locked successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response
                    ?.data
                    ?.message ||
                "Failed to lock attendance",
            );

            return false;
        } finally {
            set({
                reconciliationLockLoading:
                    false,
            });
        }
    },

    setSelectedAttendance: (attendance) => {
        set({
            selectedAttendance: attendance,
        });
    },

    saveBulkAttendance: async (payload) => {
        try {
            set({
                saveLoading: true,
            });

            const response = await employeeAttendanceApi.bulkSave(payload);

            toast.success(response.message || "Attendance saved successfully");

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to save attendance",
            );

            return false;
        } finally {
            set({
                saveLoading: false,
            });
        }
    },

    clearSelectedAttendance: () => {
        set({
            selectedAttendance: null,
        });
    },

    clearAttendance: () => {
        set({
            attendanceData: null,

            employees: [],

            summary: {
                total: 0,
                present: 0,
                absent: 0,
                leave: 0,
                holiday: 0,
                notMarked: 0,
            },

            selectedAttendance: null,
        });
    },

    importAttendance: async (file) => {
        try {
            set({
                importLoading: true,
                importResult: null,
            });

            const response = await employeeAttendanceApi.importExcel(file);

            const data = response.data || null;

            set({
                importResult: data,
            });

            if (data?.failedCount > 0) {
                toast.success(
                    `${data.successCount || 0} imported, ${data.failedCount || 0} failed`,
                );
            } else {
                toast.success(response.message || "Attendance imported successfully");
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to import attendance",
            );

            return {
                success: false,
                data: null,
            };
        } finally {
            set({
                importLoading: false,
            });
        }
    },

    clearImportResult: () => {
        set({
            importResult: null,
        });
    },

    clearLogs: () => {
        set({
            logs: [],
        });
    },

    clearYearlyReport: () => {
        set({
            yearlyReport: null,
        });
    },

    fetchNoPunchReport: async (
        params = {},
    ) => {
        try {
            set({
                noPunchLoading: true,
            });

            const response =
                await employeeAttendanceApi.getNoPunchReport(
                    params,
                );

            set({
                noPunchReport:
                    response.data || null,
            });

            return true;
        } catch (error) {
            set({
                noPunchReport: null,
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch no punch report",
            );

            return false;
        } finally {
            set({
                noPunchLoading: false,
            });
        }
    },
}));
