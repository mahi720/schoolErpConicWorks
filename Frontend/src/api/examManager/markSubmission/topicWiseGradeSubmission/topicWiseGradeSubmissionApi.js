import API from "../../../axios/axios";

const TOPIC_WISE_GRADE_SUBMISSION_URL =
    "/topic-wise-grade-submissions";

export const topicWiseGradeSubmissionApi = {
    getStudents: async (params = {}) => {
        const response = await API.get(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/students`,
            {
                params,
            },
        );

        return response.data;
    },

    saveGrades: async (payload) => {
        const response = await API.post(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/save`,
            payload,
        );

        return response.data;
    },

    bulkUpdateGrades: async (
        submissionSlug,
        payload,
    ) => {
        const response = await API.patch(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/${submissionSlug}/grades`,
            payload,
        );

        return response.data;
    },

    getSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.get(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/${submissionSlug}`,
        );

        return response.data;
    },

    lockGrades: async (
        submissionSlug,
    ) => {
        const response = await API.patch(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/${submissionSlug}/lock`,
        );

        return response.data;
    },

    unlockGrades: async (
        submissionSlug,
        payload,
    ) => {
        const response = await API.patch(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/${submissionSlug}/unlock`,
            payload,
        );

        return response.data;
    },

    deleteSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.delete(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/${submissionSlug}`,
        );

        return response.data;
    },

    restoreSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.patch(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/${submissionSlug}/restore`,
        );

        return response.data;
    },

    getAuditLogs: async (
        params = {},
    ) => {
        const response = await API.get(
            `${TOPIC_WISE_GRADE_SUBMISSION_URL}/audit-logs`,
            {
                params,
            },
        );

        return response.data;
    },
};