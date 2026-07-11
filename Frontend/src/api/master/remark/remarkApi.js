import API from "../../axios/axios";

export const remarkApi = {
    getAll: (params = {}) =>
        API.get("/remarks", {
            params,
        }),

    getBySlug: (slug) =>
        API.get(`/remarks/${slug}`),

    create: (payload) =>
        API.post("/remarks", payload),

    update: (slug, payload) =>
        API.patch(`/remarks/${slug}`, payload),

    delete: (slug) =>
        API.delete(`/remarks/${slug}`),

    restore: (slug) =>
        API.patch(`/remarks/${slug}/restore`),
};