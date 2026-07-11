import API from "../../axios/axios"

export const schoolApi = {
    getAll: () => API.get("/schools"),

    getBySlug: (slug) => API.get(`/schools/${slug}`),

    getMySchool: () => API.get("/schools/me/info"),

    create: (formData) =>
        API.post("/schools", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    update: (slug, formData) =>
        API.patch(`/schools/${slug}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    updateMySchool: (formData) =>
        API.patch("/schools/me/info", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    delete: (slug) => API.delete(`/schools/${slug}`),

    restore: (slug) =>
        API.patch(`/schools/${slug}/restore`),
};