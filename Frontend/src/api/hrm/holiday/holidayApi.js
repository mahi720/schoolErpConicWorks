import API from "../../axios/axios";

const HOLIDAY_URL =
    "/hrm/holidays";

export const holidayApi = {
    create: async (
        payload,
    ) => {
        const response =
            await API.post(
                HOLIDAY_URL,
                payload,
            );

        return response.data;
    },

    getAll: async (
        params = {},
    ) => {
        const response =
            await API.get(
                HOLIDAY_URL,
                {
                    params,
                },
            );

        return response.data;
    },

    getBySlug: async (
        holidaySlug,
    ) => {
        const response =
            await API.get(
                `${HOLIDAY_URL}/${holidaySlug}`,
            );

        return response.data;
    },

    update: async (
        holidaySlug,
        payload,
    ) => {
        const response =
            await API.patch(
                `${HOLIDAY_URL}/${holidaySlug}`,
                payload,
            );

        return response.data;
    },

    delete: async (
        holidaySlug,
    ) => {
        const response =
            await API.delete(
                `${HOLIDAY_URL}/${holidaySlug}`,
            );

        return response.data;
    },

    restore: async (
        holidaySlug,
    ) => {
        const response =
            await API.patch(
                `${HOLIDAY_URL}/${holidaySlug}/restore`,
            );

        return response.data;
    },
};