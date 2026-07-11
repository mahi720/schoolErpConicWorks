import API from "../../axios/axios";

export const classMappingApi = {
    getAll: (params) => API.get("/class-mappings", { params }),

    save: (payload) => API.post("/class-mappings", payload),
};