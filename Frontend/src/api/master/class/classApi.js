import API from "../../axios/axios";

export const classApi = {
    getAll: (params) => API.get("/classes", { params }),

    getBySlug: (slug) => API.get(`/classes/${slug}`),

    create: (payload) => API.post("/classes", payload),

    update: (slug, payload) => API.patch(`/classes/${slug}`, payload),

    delete: (slug) => API.delete(`/classes/${slug}`),

    restore: (slug) => API.patch(`/classes/${slug}/restore`),
};