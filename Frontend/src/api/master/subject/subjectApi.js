import API from "../../axios/axios";

export const subjectApi = {
    getAll: (params) => API.get("/subjects", { params }),

    getBySlug: (slug) => API.get(`/subjects/${slug}`),

    create: (payload) => API.post("/subjects", payload),

    update: (slug, payload) => API.patch(`/subjects/${slug}`, payload),

    delete: (slug) => API.delete(`/subjects/${slug}`),

    restore: (slug) => API.patch(`/subjects/${slug}/restore`),
};