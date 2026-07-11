import API from "../../axios/axios";

export const feeTypeApi = {
    getAll: (params = {}) =>
        API.get("/fee-types", {
            params,
        }),

    getBySlug: (slug) =>
        API.get(`/fee-types/${slug}`),

    create: (payload) =>
        API.post("/fee-types", payload),

    update: (slug, payload) =>
        API.patch(`/fee-types/${slug}`, payload),

    delete: (slug) =>
        API.delete(`/fee-types/${slug}`),

    restore: (slug) =>
        API.patch(`/fee-types/${slug}/restore`),
};