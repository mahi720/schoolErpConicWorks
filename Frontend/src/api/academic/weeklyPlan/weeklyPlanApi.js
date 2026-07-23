import API from "../../../api/axios/axios";

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
        const response = await API.get(
            `${WEEKLY_PLAN_URL}/${slug}`,
        );

        return response.data;
    },

    update: async (slug, payload) => {
        const response = await API.patch(
            `${WEEKLY_PLAN_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    delete: async (slug) => {
        const response = await API.delete(
            `${WEEKLY_PLAN_URL}/${slug}`,
        );

        return response.data;
    },

    restore: async (slug) => {
        const response = await API.patch(
            `${WEEKLY_PLAN_URL}/${slug}/restore`,
        );

        return response.data;
    },

    /*
     * Session + Board ke according mapped classes fetch karega.
     *
     * GET:
     * /weekly-plans/options/classes
     *
     * Query:
     * {
     *   session: "2026-2027",
     *   board: "CBSE"
     * }
     */
    getClasses: async ({
        session,
        board,
    }) => {
        const response = await API.get(
            `${WEEKLY_PLAN_URL}/options/classes`,
            {
                params: {
                    session,
                    board,
                },
            },
        );

        return response.data;
    },

    /*
     * Selected class ki mapped sections fetch karega.
     *
     * GET:
     * /weekly-plans/options/sections
     *
     * Query:
     * {
     *   classSlug: "..."
     * }
     */
    getSections: async (classSlug) => {
        const response = await API.get(
            `${WEEKLY_PLAN_URL}/options/sections`,
            {
                params: {
                    classSlug,
                },
            },
        );

        return response.data;
    },

    /*
     * Selected class ke assigned subjects fetch karega.
     *
     * GET:
     * /weekly-plans/options/subjects
     *
     * Query:
     * {
     *   classSlug: "..."
     * }
     */
    getSubjects: async (classSlug) => {
        const response = await API.get(
            `${WEEKLY_PLAN_URL}/options/subjects`,
            {
                params: {
                    classSlug,
                },
            },
        );

        return response.data;
    },
};