import API from "../../axios/axios";

const STUDENT_HEALTH_MANAGEMENT_URL =
    "/student-health-management";

export const studentHealthManagementApi = {
    getStudents: async (params = {}) => {
        const response = await API.get(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/students`,
            {
                params,
            },
        );

        return response.data;
    },

    getSessions: async () => {
        const response = await API.get("/master/sessions");

        return response.data;
    },

    getBoards: async () => {
        const response = await API.get("/boards");

        return response.data;
    },

    getClasses: async (params = {}) => {
        const response = await API.get("/classes", {
            params,
        });

        return response.data;
    },

    getClassMappings: async (params = {}) => {
        const response = await API.get(
            "/class-mappings",
            {
                params,
            },
        );

        return response.data;
    },

    getHealthAssessmentByStudent: async (params = {}) => {
        const response = await API.get(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/health-assessments/student`,
            {
                params,
            },
        );

        return response.data;
    },

    createHealthAssessment: async (payload) => {
        const response = await API.post(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/health-assessments`,
            payload,
        );

        return response.data;
    },

    updateHealthAssessment: async (slug, payload) => {
        const response = await API.patch(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/health-assessments/${slug}`,
            payload,
        );

        return response.data;
    },

    deleteHealthAssessment: async (slug) => {
        const response = await API.delete(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/health-assessments/${slug}`,
        );

        return response.data;
    },

    restoreHealthAssessment: async (slug) => {
        const response = await API.patch(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/health-assessments/${slug}/restore`,
        );

        return response.data;
    },

    getOtherInformationByStudent: async (studentSlug) => {
        const response = await API.get(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/other-information/student/${studentSlug}`,
        );

        return response.data;
    },

    createOtherInformation: async (payload) => {
        const response = await API.post(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/other-information`,
            payload,
        );

        return response.data;
    },

    updateOtherInformation: async (slug, payload) => {
        const response = await API.patch(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/other-information/${slug}`,
            payload,
        );

        return response.data;
    },

    deleteOtherInformation: async (slug) => {
        const response = await API.delete(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/other-information/${slug}`,
        );

        return response.data;
    },

    restoreOtherInformation: async (slug) => {
        const response = await API.patch(
            `${STUDENT_HEALTH_MANAGEMENT_URL}/other-information/${slug}/restore`,
        );

        return response.data;
    },
};