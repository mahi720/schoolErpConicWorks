import API from "../../../axios/axios";

const PERIODIC_TEST_MARK_SUBMISSION_URL =
    "/periodic-test-mark-submissions";

export const periodicTestMarkSubmissionApi = {
    getStudents: async (params = {}) => {
        const response = await API.get(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/students`,
            {
                params,
            },
        );

        return response.data;
    },

    saveMarks: async (payload) => {
        const response = await API.post(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/save`,
            payload,
        );

        return response.data;
    },

    getSubmissionBySlug: async (slug) => {
        const response = await API.get(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/${slug}`,
        );

        return response.data;
    },

    updateMarks: async (slug, payload) => {
        const response = await API.patch(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/${slug}/marks`,
            payload,
        );

        return response.data;
    },

    lockMarks: async (slug) => {
        const response = await API.patch(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/${slug}/lock`,
        );

        return response.data;
    },

    unlockMarks: async (slug, payload) => {
        const response = await API.patch(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/${slug}/unlock`,
            payload,
        );

        return response.data;
    },

    deleteSubmission: async (slug) => {
        const response = await API.delete(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/${slug}`,
        );

        return response.data;
    },

    restoreSubmission: async (slug) => {
        const response = await API.patch(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/${slug}/restore`,
        );

        return response.data;
    },

    getAuditLogs: async (params = {}) => {
        const response = await API.get(
            `${PERIODIC_TEST_MARK_SUBMISSION_URL}/audit-logs`,
            {
                params,
            },
        );

        return response.data;
    },
};