import API from "../../axios/axios";

const TERM_EXAM_URL = "/term-exams";
const TERM_EXAM_TIME_TABLE_URL = "/term-exam-time-tables";

export const termExamTimeTableApi = {
    createTermExam: async (payload) => {
        const response = await API.post(
            TERM_EXAM_URL,
            payload,
        );

        return response.data;
    },

    getTermExams: async (params = {}) => {
        const response = await API.get(
            TERM_EXAM_URL,
            {
                params,
            },
        );

        return response.data;
    },

    getTermExamBySlug: async (slug) => {
        const response = await API.get(
            `${TERM_EXAM_URL}/${slug}`,
        );

        return response.data;
    },

    updateTermExam: async (slug, payload) => {
        const response = await API.patch(
            `${TERM_EXAM_URL}/${slug}`,
            payload,
        );

        return response.data;
    },

    deleteTermExam: async (slug) => {
        const response = await API.delete(
            `${TERM_EXAM_URL}/${slug}`,
        );

        return response.data;
    },

    restoreTermExam: async (slug) => {
        const response = await API.patch(
            `${TERM_EXAM_URL}/${slug}/restore`,
        );

        return response.data;
    },

    getTermExamTimeTable: async (
        termExamSlug,
        classSlug,
    ) => {
        const response = await API.get(
            `${TERM_EXAM_TIME_TABLE_URL}/${termExamSlug}/classes/${classSlug}`,
        );

        return response.data;
    },

    saveTermExamTimeTable: async (payload) => {
        const response = await API.post(
            TERM_EXAM_TIME_TABLE_URL,
            payload,
        );

        return response.data;
    },

    deleteTermExamTimeTable: async (
        termExamSlug,
        classSlug,
    ) => {
        const response = await API.delete(
            `${TERM_EXAM_TIME_TABLE_URL}/${termExamSlug}/classes/${classSlug}`,
        );

        return response.data;
    },

    restoreTermExamTimeTable: async (
        termExamSlug,
        classSlug,
    ) => {
        const response = await API.patch(
            `${TERM_EXAM_TIME_TABLE_URL}/${termExamSlug}/classes/${classSlug}/restore`,
        );

        return response.data;
    },
};