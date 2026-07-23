import API from "../../../api/axios/axios";

const STUDENT_ATTENDANCE_URL = "/student-attendances";

export const studentAttendanceApi = {
    getStudents: async (params = {}) => {
        const response = await API.get(
            `${STUDENT_ATTENDANCE_URL}/students`,
            {
                params,
            },
        );

        return response.data;
    },

    markAttendance: async (payload) => {
        const response = await API.post(
            `${STUDENT_ATTENDANCE_URL}/mark`,
            payload,
        );

        return response.data;
    },

    updateAttendance: async (
        daySlug,
        payload,
    ) => {
        const response = await API.patch(
            `${STUDENT_ATTENDANCE_URL}/${daySlug}`,
            payload,
        );

        return response.data;
    },

    deleteAttendance: async (
        daySlug,
        payload = {},
    ) => {
        const response = await API.delete(
            `${STUDENT_ATTENDANCE_URL}/${daySlug}`,
            {
                data: payload,
            },
        );

        return response.data;
    },

    restoreAttendance: async (
        daySlug,
        payload = {},
    ) => {
        const response = await API.patch(
            `${STUDENT_ATTENDANCE_URL}/${daySlug}/restore`,
            payload,
        );

        return response.data;
    },

    lockAttendance: async (
        daySlug,
        payload = {},
    ) => {
        const response = await API.patch(
            `${STUDENT_ATTENDANCE_URL}/${daySlug}/lock`,
            payload,
        );

        return response.data;
    },

    unlockAttendance: async (
        daySlug,
        payload = {},
    ) => {
        const response = await API.patch(
            `${STUDENT_ATTENDANCE_URL}/${daySlug}/unlock`,
            payload,
        );

        return response.data;
    },

    getMonthlyAttendance: async (
        params = {},
    ) => {
        const response = await API.get(
            `${STUDENT_ATTENDANCE_URL}/monthly`,
            {
                params,
            },
        );

        return response.data;
    },

    getAttendanceLogs: async (
        attendanceSlug,
        params = {},
    ) => {
        const response = await API.get(
            `${STUDENT_ATTENDANCE_URL}/${attendanceSlug}/logs`,
            {
                params,
            },
        );

        return response.data;
    },
};