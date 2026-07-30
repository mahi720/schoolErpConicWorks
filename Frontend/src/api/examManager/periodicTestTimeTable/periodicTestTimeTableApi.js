import API from "../../axios/axios";

const PERIODIC_TEST_URL =
    "/periodic-tests";

export const periodicTestApi = {
    createPeriodicTest: async (
        payload,
    ) => {
        const response =
            await API.post(
                PERIODIC_TEST_URL,
                payload,
            );

        return response.data;
    },

    getPeriodicTests: async (
        params = {},
    ) => {
        const response =
            await API.get(
                PERIODIC_TEST_URL,
                {
                    params,
                },
            );

        return response.data;
    },

    getPeriodicTestBySlug: async (
        slug,
    ) => {
        const response =
            await API.get(
                `${PERIODIC_TEST_URL}/${slug}`,
            );

        return response.data;
    },

    updatePeriodicTest: async (
        slug,
        payload,
    ) => {
        const response =
            await API.patch(
                `${PERIODIC_TEST_URL}/${slug}`,
                payload,
            );

        return response.data;
    },

    deletePeriodicTest: async (
        slug,
    ) => {
        const response =
            await API.delete(
                `${PERIODIC_TEST_URL}/${slug}`,
            );

        return response.data;
    },

    restorePeriodicTest: async (
        slug,
    ) => {
        const response =
            await API.patch(
                `${PERIODIC_TEST_URL}/${slug}/restore`,
            );

        return response.data;
    },

    savePeriodicTestTimeTable:
        async (payload) => {
            const response =
                await API.post(
                    `${PERIODIC_TEST_URL}/time-tables`,
                    payload,
                );

            return response.data;
        },

    getPeriodicTestTimeTable:
        async (
            periodicTestSlug,
            classSlug,
        ) => {
            const response =
                await API.get(
                    `${PERIODIC_TEST_URL}/${periodicTestSlug}/classes/${classSlug}/time-table`,
                );

            return response.data;
        },

    deletePeriodicTestTimeTable:
        async (
            periodicTestSlug,
            classSlug,
        ) => {
            const response =
                await API.delete(
                    `${PERIODIC_TEST_URL}/${periodicTestSlug}/classes/${classSlug}/time-table`,
                );

            return response.data;
        },

    restorePeriodicTestTimeTable:
        async (
            periodicTestSlug,
            classSlug,
        ) => {
            const response =
                await API.patch(
                    `${PERIODIC_TEST_URL}/${periodicTestSlug}/classes/${classSlug}/time-table/restore`,
                );

            return response.data;
        },
};