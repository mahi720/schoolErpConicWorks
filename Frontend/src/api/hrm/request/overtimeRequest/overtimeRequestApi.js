import API from "../../../axios/axios";

const OVERTIME_REQUEST_URL =
    "/hrm/overtime-requests";

export const overtimeRequestApi = {
    create: async (payload) => {
        const response = await API.post(
            OVERTIME_REQUEST_URL,
            payload,
        );

        return response.data;
    },

    getMyRequests: async (params = {}) => {
        const response = await API.get(
            `${OVERTIME_REQUEST_URL}/me`,
            {
                params,
            },
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(
            OVERTIME_REQUEST_URL,
            {
                params,
            },
        );

        return response.data;
    },

    getAssignedToMe: async (
        params = {},
    ) => {
        const response = await API.get(
            `${OVERTIME_REQUEST_URL}/assigned-to-me`,
            {
                params,
            },
        );

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${OVERTIME_REQUEST_URL}/${slug}`,
        );

        return response.data;
    },

    approve: async (
        slug,
        payload,
    ) => {
        const response = await API.patch(
            `${OVERTIME_REQUEST_URL}/${slug}/approve`,
            payload,
        );

        return response.data;
    },

    reject: async (slug, payload) => {
        const response = await API.patch(
            `${OVERTIME_REQUEST_URL}/${slug}/reject`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${OVERTIME_REQUEST_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${OVERTIME_REQUEST_URL}/${slug}/restore`,
        );

        return response.data;
    },
};