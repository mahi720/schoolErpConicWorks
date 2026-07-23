import API from "../../axios/axios";

const ATTENDANCE_REPORT_URL =
    "/student-attendances/reports";

export const studentAttendanceReportApi = {
    getDailyReport: async (params = {}) => {
        const response = await API.get(
            `${ATTENDANCE_REPORT_URL}/daily`,
            {
                params,
            },
        );

        return response.data;
    },

    getMonthlyReport: async (params = {}) => {
        const response = await API.get(
            `${ATTENDANCE_REPORT_URL}/monthly`,
            {
                params,
            },
        );

        return response.data;
    },

    getStudentDayWiseReport: async (
        academicMappingSlug,
        params = {},
    ) => {
        const response = await API.get(
            `${ATTENDANCE_REPORT_URL}/student/${academicMappingSlug}`,
            {
                params,
            },
        );

        return response.data;
    },
};