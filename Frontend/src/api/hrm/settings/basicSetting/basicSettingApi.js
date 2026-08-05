import API from "../../../axios/axios";

const BASIC_SETTING_URL = "/hrm/settings/basic-settings";

export const basicSettingApi = {
    create: async (payload) => {
        const response = await API.post(
            BASIC_SETTING_URL,
            payload,
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(BASIC_SETTING_URL, {
            params,
        });

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `${BASIC_SETTING_URL}/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${BASIC_SETTING_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${BASIC_SETTING_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${BASIC_SETTING_URL}/${slug}/restore`,
        );

        return response.data;
    },
};