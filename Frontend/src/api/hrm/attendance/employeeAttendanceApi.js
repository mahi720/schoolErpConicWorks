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

    getNoPunchReport: async (
        params = {},
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_ATTENDANCE_URL}/no-punch-report`,
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

    getMonthlyReport: async (params = {}) => {
        const response = await API.get(
            `${EMPLOYEE_ATTENDANCE_URL}/monthly-report`,
            {
                params,
            },
        );

        return response.data;
    },

    getEmployeeMonthlyReconciliation: async (
        employeeSlug,
        params = {},
    ) => {
        const response =
            await API.get(
                `${EMPLOYEE_ATTENDANCE_URL}/employees/${employeeSlug}/monthly-reconciliation`,
                {
                    params,
                },
            );

        return response.data;
    },

    lockReconciliationAttendance: async (
        attendanceSlug,
    ) => {
        const response =
            await API.patch(
                `${EMPLOYEE_ATTENDANCE_URL}/${attendanceSlug}/reconciliation-lock`,
            );

        return response.data;
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