import API from "../../../axios/axios";

const DESIGNATION_URL = "/hrm/settings/designations";

export const designationApi = {
    create: async (payload) => {
        const response = await API.post(DESIGNATION_URL, payload);

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(DESIGNATION_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${DESIGNATION_URL}/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${DESIGNATION_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${DESIGNATION_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${DESIGNATION_URL}/${slug}/restore`,
        );

        return response.data;
    },
};