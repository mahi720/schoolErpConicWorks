import API from "../../../axios/axios";

const BASE_URL = "/hrm/settings/pay-band-structures";

export const payBandStructureApi = {
  getByPayBandSlug: async (payBandSlug) => {
    const response = await API.get(`${BASE_URL}/${payBandSlug}`);
    return response.data;
  },

  save: async (payBandSlug, payload) => {
    const response = await API.patch(`${BASE_URL}/${payBandSlug}`, payload);
    return response.data;
  },
};
