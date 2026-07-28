import API from "../../axios/axios";

const EXAM_TYPE_URL = "/exam-types";

export const examTypeApi = {
    create: async (payload) => {
        const response = await API.post(
            EXAM_TYPE_URL,
            payload,
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(EXAM_TYPE_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${EXAM_TYPE_URL}/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${EXAM_TYPE_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${EXAM_TYPE_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${EXAM_TYPE_URL}/${slug}/restore`,
        );

        return response.data;
    },
};