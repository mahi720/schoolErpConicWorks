import API from "../../../axios/axios";

const DEPARTMENT_URL = "/hrm/settings/departments";

export const departmentApi = {
    create: async (payload) => {
        const response = await API.post(DEPARTMENT_URL, payload);

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(DEPARTMENT_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(`${DEPARTMENT_URL}/${slug}`);

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${DEPARTMENT_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${DEPARTMENT_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${DEPARTMENT_URL}/${slug}/restore`,
        );

        return response.data;
    },
};