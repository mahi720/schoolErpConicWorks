import API from "../../axios/axios";

const STUDENT_PROMOTION_URL = "/student-promotions";

export const studentPromotionApi = {
    create: async (payload) => {
        const response = await API.post(STUDENT_PROMOTION_URL, payload);

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(STUDENT_PROMOTION_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${STUDENT_PROMOTION_URL}/${slug}`,
        );

        return response.data;
    },

    getBatch: async (batchSlug) => {
        const response = await API.get(
            `${STUDENT_PROMOTION_URL}/batch/${batchSlug}`,
        );

        return response.data;
    },

    rollbackBatch: async (batchSlug, payload) => {
        const response = await API.patch(
            `${STUDENT_PROMOTION_URL}/batch/${batchSlug}/rollback`,
            payload,
        );

        return response.data;
    },
};