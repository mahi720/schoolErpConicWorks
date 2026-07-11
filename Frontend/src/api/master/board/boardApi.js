import API from "../../axios/axios";

export const boardApi = {
    getAll: () => API.get("/boards"),

    getBySlug: (slug) => API.get(`/boards/${slug}`),

    create: (payload) => API.post("/boards", payload),

    update: (slug, payload) => API.patch(`/boards/${slug}`, payload),

    delete: (slug) => API.delete(`/boards/${slug}`),
};