import API from "../../axios/axios";

export const streamApi = {
    getAll: (params) => API.get("/streams", { params }),

    getBySlug: (slug) => API.get(`/streams/${slug}`),

    create: (payload) => API.post("/streams", payload),

    update: (slug, payload) => API.patch(`/streams/${slug}`, payload),

    delete: (slug) => API.delete(`/streams/${slug}`),

    restore: (slug) => API.patch(`/streams/${slug}/restore`),
};