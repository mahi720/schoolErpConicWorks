import API from "../../axios/axios";

export const subjectMarksConfigApi = {
    getAll: (params) =>
        API.get("/subject-marks-configs", {
            params,
        }),

    getBySlug: (slug) =>
        API.get(`/subject-marks-configs/${slug}`),

    create: (payload) =>
        API.post("/subject-marks-configs", payload),

    update: (slug, payload) =>
        API.patch(`/subject-marks-configs/${slug}`, payload),

    delete: (slug) =>
        API.delete(`/subject-marks-configs/${slug}`),

    restore: (slug) =>
        API.patch(`/subject-marks-configs/${slug}/restore`),
};