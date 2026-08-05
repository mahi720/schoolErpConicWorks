import API from "../../../axios/axios";

const SHIFT_URL = "/hrm/settings/shifts";

export const shiftApi = {
    create: async (payload) => {
        const response = await API.post(SHIFT_URL, payload);

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(SHIFT_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(`${SHIFT_URL}/${slug}`);

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${SHIFT_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(`${SHIFT_URL}/${slug}`);

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${SHIFT_URL}/${slug}/restore`,
        );

        return response.data;
    },
};