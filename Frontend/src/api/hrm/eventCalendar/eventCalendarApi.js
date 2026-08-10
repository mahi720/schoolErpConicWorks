import API from "../../axios/axios";

const EVENT_CALENDAR_URL =
    "/hrm/event-calendars";

export const eventCalendarApi = {
    create: async (payload) => {
        const response =
            await API.post(
                EVENT_CALENDAR_URL,
                payload,
            );

        return response.data;
    },

    getAll: async (
        params = {},
    ) => {
        const response =
            await API.get(
                EVENT_CALENDAR_URL,
                {
                    params,
                },
            );

        return response.data;
    },

    getBySlug: async (
        slug,
    ) => {
        const response =
            await API.get(
                `${EVENT_CALENDAR_URL}/${slug}`,
            );

        return response.data;
    },

    update: async (
        slug,
        payload,
    ) => {
        const response =
            await API.patch(
                `${EVENT_CALENDAR_URL}/${slug}`,
                payload,
            );

        return response.data;
    },

    delete: async (
        slug,
    ) => {
        const response =
            await API.delete(
                `${EVENT_CALENDAR_URL}/${slug}`,
            );

        return response.data;
    },

    restore: async (
        slug,
    ) => {
        const response =
            await API.patch(
                `${EVENT_CALENDAR_URL}/${slug}/restore`,
            );

        return response.data;
    },
};