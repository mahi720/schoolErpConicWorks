import API from "../../../axios/axios";

const TERM_EXAM_MARK_SUBMISSION_URL =
    "/term-exam-mark-submissions";

export const termExamMarkSubmissionApi = {
    getStudents: async (params = {}) => {
        const response = await API.get(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/students`,
            {
                params,
            },
        );

        return response.data;
    },

    saveMarks: async (payload) => {
        const response = await API.post(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/save`,
            payload,
        );

        return response.data;
    },

    bulkUpdateMarks: async (
        submissionSlug,
        payload,
    ) => {
        const response = await API.patch(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/${submissionSlug}/marks`,
            payload,
        );

        return response.data;
    },

    getSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.get(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/${submissionSlug}`,
        );

        return response.data;
    },

    lockMarks: async (
        submissionSlug,
    ) => {
        const response = await API.patch(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/${submissionSlug}/lock`,
        );

        return response.data;
    },

    unlockMarks: async (
        submissionSlug,
        payload,
    ) => {
        const response = await API.patch(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/${submissionSlug}/unlock`,
            payload,
        );

        return response.data;
    },

    deleteSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.delete(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/${submissionSlug}`,
        );

        return response.data;
    },

    restoreSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.patch(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/${submissionSlug}/restore`,
        );

        return response.data;
    },

    getAuditLogs: async (
        params = {},
    ) => {
        const response = await API.get(
            `${TERM_EXAM_MARK_SUBMISSION_URL}/audit-logs`,
            {
                params,
            },
        );

        return response.data;
    },
};