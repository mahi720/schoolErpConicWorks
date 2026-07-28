import API from "../../axios/axios";

const WEEKLY_PLAN_URL = "/weekly-plans";

export const weeklyPlanApi = {
    create: async (payload) => {
        const response = await API.post(
            WEEKLY_PLAN_URL,
            payload,
        );

        return response.data;
    },

    getAll: async (params = {}) => {
        const response = await API.get(
            WEEKLY_PLAN_URL,
            {
                params,
            },
        );

        return response.data;
    },

    getBySlug: async (slug) => {
        if (!slug) {
            throw new Error(
                "Weekly plan slug is required",
            );
        }

        const response = await API.get(
            `${WEEKLY_PLAN_URL}/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        if (!slug) {
            throw new Error(
                "Weekly plan slug is required",
            );
        }

        const response = await API.patch(
            `${WEEKLY_PLAN_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        if (!slug) {
            throw new Error(
                "Weekly plan slug is required",
            );
        }

        const response = await API.delete(
            `${WEEKLY_PLAN_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        if (!slug) {
            throw new Error(
                "Weekly plan slug is required",
            );
        }

        const response = await API.patch(
            `${WEEKLY_PLAN_URL}/${slug}/restore`,
        );

        return response.data;
    },

    deleteLesson: async (
        weeklyPlanSlug,
        lessonSlug,
    ) => {
        if (!weeklyPlanSlug) {
            throw new Error(
                "Weekly plan slug is required",
            );
        }

        if (!lessonSlug) {
            throw new Error(
                "Lesson slug is required",
            );
        }

        const response = await API.delete(
            `${WEEKLY_PLAN_URL}/${weeklyPlanSlug}/lessons/${lessonSlug}`,
        );

        return response.data;
    },
};