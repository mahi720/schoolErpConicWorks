import API from "../../axios/axios";

export const academicCalendarApi = {
    create: async (payload) => {
        const response = await API.post(
            "/academic-calendars",
            payload,
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(
            "/academic-calendars",
            {
                params,
            },
        );

        return response.data;
    },

    getBySlug: async (slug) => {
        const response = await API.get(
            `/academic-calendars/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `/academic-calendars/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `/academic-calendars/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `/academic-calendars/${slug}/restore`,
        );

        return response.data;
    },
};