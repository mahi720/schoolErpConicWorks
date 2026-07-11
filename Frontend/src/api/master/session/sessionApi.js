import API from "../../axios/axios";

export const sessionApi = {
    getAll: () => API.get("/master/sessions"),

    getBySlug: (slug) => API.get(`/master/sessions/${slug}`),

    create: (data) => API.post("/master/sessions", data),

    update: (slug, data) => API.patch(`/master/sessions/${slug}`, data),

    delete: (slug) => API.delete(`/master/sessions/${slug}`),
};