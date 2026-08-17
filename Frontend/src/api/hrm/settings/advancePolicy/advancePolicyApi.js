import API from "../../../axios/axios";

const ADVANCE_POLICY_URL = "/hrm/advance-policies";

export const advancePolicyApi = {
    create: async (payload) => {
        const response = await API.post(ADVANCE_POLICY_URL, payload);

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(ADVANCE_POLICY_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(`${ADVANCE_POLICY_URL}/${slug}`);

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(`${ADVANCE_POLICY_URL}/${slug}`, payload);

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(`${ADVANCE_POLICY_URL}/${slug}`);

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(`${ADVANCE_POLICY_URL}/${slug}/restore`);

        return response.data;
    },
};
