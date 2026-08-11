import API from "../../axios/axios";

const EMPLOYEE_ATTENDANCE_URL =
    "/hrm/employee-attendances";

export const employeeAttendanceApi = {
    getAll: async (
        params = {},
    ) => {
        const response =
            await API.get(
                EMPLOYEE_ATTENDANCE_URL,
                {
                    params,
                },
            );

        return response.data;
    },

    getDashboard: async (
        params = {},
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_ATTENDANCE_URL}/dashboard`,
                {
                    params,
                },
            );

        return response.data;
    },

    markPresent: async (
        employeeSlug,
        payload,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_ATTENDANCE_URL}/employees/${employeeSlug}/present`,
                payload,
            );

        return response.data;
    },

    markAbsent: async (
        employeeSlug,
        payload,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_ATTENDANCE_URL}/employees/${employeeSlug}/absent`,
                payload,
            );

        return response.data;
    },

    update: async (
        attendanceSlug,
        payload,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_ATTENDANCE_URL}/${attendanceSlug}`,
                payload,
            );

        return response.data;
    },

    lock: async (
        payload,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_ATTENDANCE_URL}/lock`,
                payload,
            );

        return response.data;
    },

    unlock: async (
        payload,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_ATTENDANCE_URL}/unlock`,
                payload,
            );

        return response.data;
    },

    getLogs: async (
        params = {},
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_ATTENDANCE_URL}/logs`,
                {
                    params,
                },
            );

        return response.data;
    },

    getYearlyReport: async (
        params = {},
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_ATTENDANCE_URL}/yearly-report`,
                {
                    params,
                },
            );

        return response.data;
    },

    bulkSave: async (
        payload,
    ) => {
        const response =
            await API.post(
                `${EMPLOYEE_ATTENDANCE_URL}/bulk-save`,
                payload,
            );

        return response.data;
    },

    importExcel: async (
        file,
    ) => {
        const formData =
            new FormData();

        formData.append(
            "file",
            file,
        );

        const response =
            await API.post(
                `${EMPLOYEE_ATTENDANCE_URL}/import`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                },
            );

        return response.data;
    },
};