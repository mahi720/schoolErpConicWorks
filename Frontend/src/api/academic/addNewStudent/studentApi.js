import API from "../../axios/axios";

export const studentApi = {
    getAll: (params) =>
        API.get("/students", { params }),

    getBySlug: (slug) =>
        API.get(`/students/${slug}`),

    create: (payload) =>
        API.post("/students", payload),

    update: (slug, payload) =>
        API.patch(`/students/${slug}`, payload),

    delete: (slug) =>
        API.delete(`/students/${slug}`),

    restore: (slug) =>
        API.patch(`/students/${slug}/restore`),
};