import API from "../../../axios/axios";

const EMPLOYEE_LOAN_URL = "/hrm/loan-requests";

export const employeeLoanApi = {
    getEligibility: async () => {
        const response = await API.get(`${EMPLOYEE_LOAN_URL}/eligibility`);

        return response.data;
    },

    getCurrentUser: async () => {
        const response =
            await API.get(
                "/auth/me",
            );

        return response.data;
    },

    getPlanPreview: async (params = {}) => {
        const response = await API.get(`${EMPLOYEE_LOAN_URL}/plans-preview`, {
            params,
        });

        return response.data;
    },

    create: async (payload) => {
        const response = await API.post(EMPLOYEE_LOAN_URL, payload);

        return response.data;
    },

    getMyLoans: async (params = {}) => {
        const response = await API.get(`${EMPLOYEE_LOAN_URL}/me`, {
            params,
        });

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(EMPLOYEE_LOAN_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(`${EMPLOYEE_LOAN_URL}/${slug}`);

        return response.data;
    },

    approve: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LOAN_URL}/${slug}/approve`,
            payload,
        );

        return response.data;
    },

    reject: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LOAN_URL}/${slug}/reject`,
            payload,
        );

        return response.data;
    },

    cancel: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LOAN_URL}/${slug}/cancel`,
            payload,
        );

        return response.data;
    },

    disburse: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LOAN_URL}/${slug}/disburse`,
            payload,
        );

        return response.data;
    },

    getInstallments: async (slug) => {
        const response = await API.get(`${EMPLOYEE_LOAN_URL}/${slug}/installments`);

        return response.data;
    },

    recoverInstallment: async (loanSlug, installmentSlug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LOAN_URL}/${loanSlug}/installments/${installmentSlug}/recover`,
            payload,
        );

        return response.data;
    },

    getForeclosurePreview: async (slug) => {
        const response = await API.get(
            `${EMPLOYEE_LOAN_URL}/${slug}/foreclosure-preview`,
        );

        return response.data;
    },

    foreclose: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_LOAN_URL}/${slug}/foreclose`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(`${EMPLOYEE_LOAN_URL}/${slug}`);

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(`${EMPLOYEE_LOAN_URL}/${slug}/restore`);

        return response.data;
    },
};
