import API from "../../../axios/axios";

const BASE_URL = "/hrm/settings/earning-types";

export const earningTypeApi = {
  create: async (payload) => {
    const response = await API.post(BASE_URL, payload);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await API.get(BASE_URL, { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await API.get(`${BASE_URL}/${slug}`);
    return response.data;
  },

  update: async (slug, payload) => {
    const response = await API.patch(`${BASE_URL}/${slug}`, payload);
    return response.data;
  },

  delete: async (slug) => {
    const response = await API.delete(`${BASE_URL}/${slug}`);
    return response.data;
  },

  restore: async (slug) => {
    const response = await API.patch(`${BASE_URL}/${slug}/restore`);
    return response.data;
  },
};
