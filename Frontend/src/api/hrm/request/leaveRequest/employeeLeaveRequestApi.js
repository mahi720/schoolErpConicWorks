import API from "../../../../api/axios/axios";

const EMPLOYEE_LEAVE_REQUEST_URL =
    "/hrm/employee-leave-requests";

export const employeeLeaveRequestApi = {
    create: async (payload) => {
        const response = await API.post(
            EMPLOYEE_LEAVE_REQUEST_URL,
            payload,
        );

        return response.data;
    },

    bulkCreate: async (payload) => {
        const response = await API.post(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/bulk`,
            payload,
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(
            EMPLOYEE_LEAVE_REQUEST_URL,
            {
                params,
            },
        );

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/${slug}`,
        );

        return response.data;
    },

    approve: async (
        slug,
        payload,
    ) => {
        const response = await API.patch(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/${slug}/approve`,
            payload,
        );

        return response.data;
    },

    bulkApprove: async (payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/bulk-approve`,
            payload,
        );

        return response.data;
    },

    reject: async (
        slug,
        payload,
    ) => {
        const response = await API.patch(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/${slug}/reject`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/${slug}/restore`,
        );

        return response.data;
    },

    getLogs: async (slug) => {
        const response = await API.get(
            `${EMPLOYEE_LEAVE_REQUEST_URL}/${slug}/logs`,
        );

        return response.data;
    },
};