import API from "../../../axios/axios";

const BASE_URL = "/hrm/settings/pay-bands";

export const payBandApi = {
  create: async (payload) => {
    const response = await API.post(BASE_URL, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    const response = await API.patch(`${BASE_URL}/${slug}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
