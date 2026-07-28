import { create } from "zustand";
import toast from "react-hot-toast";

import { studentAttendanceReportApi } from "../../../api/academic/studentAttendance/studentAttendanceReportApi";

export const useStudentAttendanceReportStore = create(
    (set) => ({
        dailyReport: null,
        monthlyReport: null,
        studentDayWiseReport: null,

        loading: false,
        modalLoading: false,

        fetchDailyReport: async (params = {}) => {
            try {
                set({
                    loading: true,
                    dailyReport: null,
                });

                const res =
                    await studentAttendanceReportApi.getDailyReport(
                        params,
                    );

                set({
                    dailyReport: res.data || null,
                });

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch daily attendance report",
                );

                set({
                    dailyReport: null,
                });

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchMonthlyReport: async (params = {}) => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await studentAttendanceReportApi.getMonthlyReport(
                        params,
                    );

                set({
                    monthlyReport: res.data || null,
                });

                return true;
            } catch (error) {
                set({
                    monthlyReport: null,
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch monthly report",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchStudentDayWiseReport: async (
            academicMappingSlug,
            params = {},
        ) => {
            try {
                set({
                    modalLoading: true,
                });

                const res =
                    await studentAttendanceReportApi.getStudentDayWiseReport(
                        academicMappingSlug,
                        params,
                    );

                set({
                    studentDayWiseReport: res.data || null,
                });

                return true;
            } catch (error) {
                set({
                    studentDayWiseReport: null,
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch day-wise report",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },

        clearDailyReport: () => {
            set({
                dailyReport: null,
            });
        },

        clearMonthlyReport: () => {
            set({
                monthlyReport: null,
            });
        },

        clearStudentDayWiseReport: () => {
            set({
                studentDayWiseReport: null,
            });
        },
    }),
);