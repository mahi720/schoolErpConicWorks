import API from "../../axios/axios";

export const sectionApi = {
    getAll: (params) => API.get("/sections", { params }),

    getBySlug: (slug) => API.get(`/sections/${slug}`),

    create: (payload) => API.post("/sections", payload),

    update: (slug, payload) => API.patch(`/sections/${slug}`, payload),

    delete: (slug) => API.delete(`/sections/${slug}`),

    restore: (slug) => API.patch(`/sections/${slug}/restore`),
};