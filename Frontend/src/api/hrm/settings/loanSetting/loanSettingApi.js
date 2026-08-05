import API from "../../../axios/axios";

const BASE_URL = "/hrm/settings/loan-setting";

export const loanSettingApi = {
  get: async () => {
    const response = await API.get(BASE_URL);
    return response.data;
  },

  update: async (payload) => {
    const response = await API.patch(BASE_URL, payload);
    return response.data;
  },
};
