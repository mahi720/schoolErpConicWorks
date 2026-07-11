import API from "../../axios/axios";

export const subjectTopicApi = {
    getAll: (params) => API.get("/class-subjects", { params }),

    getBySlug: (slug) => API.get(`/class-subjects/${slug}`),

    create: (payload) => API.post("/class-subjects", payload),

    update: (slug, payload) =>
        API.patch(`/class-subjects/${slug}`, payload),

    delete: (slug) => API.delete(`/class-subjects/${slug}`),

    restore: (slug) =>
        API.patch(`/class-subjects/${slug}/restore`),
};