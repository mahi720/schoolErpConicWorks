import API from "../../../axios/axios";

const EMPLOYEE_ADVANCE_URL = "/hrm/advance-requests";

export const employeeAdvanceApi = {
    getEligibility: async () => {
        const response = await API.get(`${EMPLOYEE_ADVANCE_URL}/eligibility`);

        return response.data;
    },

    create: async (payload) => {
        const response = await API.post(EMPLOYEE_ADVANCE_URL, payload);

        return response.data;
    },

    getMyAdvances: async (params = {}) => {
        const response = await API.get(`${EMPLOYEE_ADVANCE_URL}/me`, {
            params,
        });

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(EMPLOYEE_ADVANCE_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(`${EMPLOYEE_ADVANCE_URL}/${slug}`);

        return response.data;
    },

    approve: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_ADVANCE_URL}/${slug}/approve`,
            payload,
        );

        return response.data;
    },

    getCurrentUser: async () => {
        const response = await API.get("/auth/me");

        return response.data;
    },

    reject: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_ADVANCE_URL}/${slug}/reject`,
            payload,
        );

        return response.data;
    },

    cancel: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_ADVANCE_URL}/${slug}/cancel`,
            payload,
        );

        return response.data;
    },

    disburse: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_ADVANCE_URL}/${slug}/disburse`,
            payload,
        );

        return response.data;
    },

    getInstallments: async (slug) => {
        const response = await API.get(
            `${EMPLOYEE_ADVANCE_URL}/${slug}/installments`,
        );

        return response.data;
    },

    recoverInstallment: async (advanceSlug, installmentSlug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_ADVANCE_URL}/${advanceSlug}/installments/${installmentSlug}/recover`,
            payload,
        );

        return response.data;
    },

    foreclose: async (
        slug,
        payload,
    ) => {
        const response = await API.patch(
            `${EMPLOYEE_ADVANCE_URL}/${slug}/foreclose`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(`${EMPLOYEE_ADVANCE_URL}/${slug}`);

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(`${EMPLOYEE_ADVANCE_URL}/${slug}/restore`);

        return response.data;
    },
};
