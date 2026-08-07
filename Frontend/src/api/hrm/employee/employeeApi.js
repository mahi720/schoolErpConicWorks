import API from "../../axios/axios";

const EMPLOYEE_URL = "/hrm/employees";

export const employeeApi = {
    create: async (payload) => {
        const response = await API.post(
            EMPLOYEE_URL,
            payload,
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(
            EMPLOYEE_URL,
            {
                params,
            },
        );

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${EMPLOYEE_URL}/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${EMPLOYEE_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${EMPLOYEE_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${EMPLOYEE_URL}/${slug}/restore`,
        );

        return response.data;
    },

    updateLoginSetting: async (
        slug,
        payload,
    ) => {
        const response = await API.patch(
            `${EMPLOYEE_URL}/${slug}/login-setting`,
            payload,
        );

        return response.data;
    },

    createLoginAccount: async (
        slug,
        payload,
    ) => {
        const response = await API.post(
            `${EMPLOYEE_URL}/${slug}/login-account`,
            payload,
        );

        return response.data;
    },

    updateLoginAccess: async (
        slug,
        payload,
    ) => {
        const response = await API.patch(
            `${EMPLOYEE_URL}/${slug}/login-access`,
            payload,
        );

        return response.data;
    },

    transfer: async (
        slug,
        payload,
    ) => {
        const response =
            await API.post(
                `${EMPLOYEE_URL}/${slug}/transfer`,
                payload,
            );

        return response.data;
    },

    importExcel: async (file) => {
        const formData =
            new FormData();

        formData.append(
            "file",
            file,
        );

        const response =
            await API.post(
                `${EMPLOYEE_URL}/import`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                },
            );

        return response.data;
    },
};

