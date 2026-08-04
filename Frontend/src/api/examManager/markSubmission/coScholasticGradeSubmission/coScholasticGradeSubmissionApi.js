import API from "../../../axios/axios";

const CO_SCHOLASTIC_GRADE_URL =
    "/co-scholastic-grade-submissions";

export const coScholasticGradeSubmissionApi = {
    getStudents: async (params = {}) => {
        const response = await API.get(
            `${CO_SCHOLASTIC_GRADE_URL}/students`,
            {
                params,
            },
        );

        return response.data;
    },

    saveGrades: async (payload) => {
        const response = await API.post(
            `${CO_SCHOLASTIC_GRADE_URL}/save`,
            payload,
        );

        return response.data;
    },

    bulkUpdateGrades: async (
        submissionSlug,
        payload,
    ) => {
        const response = await API.patch(
            `${CO_SCHOLASTIC_GRADE_URL}/${submissionSlug}/grades`,
            payload,
        );

        return response.data;
    },

    getSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.get(
            `${CO_SCHOLASTIC_GRADE_URL}/${submissionSlug}`,
        );

        return response.data;
    },

    lockGrades: async (
        submissionSlug,
    ) => {
        const response = await API.patch(
            `${CO_SCHOLASTIC_GRADE_URL}/${submissionSlug}/lock`,
        );

        return response.data;
    },

    unlockGrades: async (
        submissionSlug,
        payload,
    ) => {
        const response = await API.patch(
            `${CO_SCHOLASTIC_GRADE_URL}/${submissionSlug}/unlock`,
            payload,
        );

        return response.data;
    },

    deleteSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.delete(
            `${CO_SCHOLASTIC_GRADE_URL}/${submissionSlug}`,
        );

        return response.data;
    },

    restoreSubmission: async (
        submissionSlug,
    ) => {
        const response = await API.patch(
            `${CO_SCHOLASTIC_GRADE_URL}/${submissionSlug}/restore`,
        );

        return response.data;
    },

    getAuditLogs: async (
        params = {},
    ) => {
        const response = await API.get(
            `${CO_SCHOLASTIC_GRADE_URL}/audit-logs`,
            {
                params,
            },
        );

        return response.data;
    },
};