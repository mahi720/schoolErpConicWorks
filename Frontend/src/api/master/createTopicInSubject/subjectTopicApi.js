import API from "../../axios/axios";

export const subjectTopicApi = {
    getAll: (params) => API.get("/subject-topics", { params }),

    getBySlug: (slug) => API.get(`/subject-topics/${slug}`),

    create: (payload) => API.post("/subject-topics", payload),

    update: (slug, payload) =>
        API.patch(`/subject-topics/${slug}`, payload),

    delete: (slug) => API.delete(`/subject-topics/${slug}`),

    restore: (slug) =>
        API.patch(`/subject-topics/${slug}/restore`),
};