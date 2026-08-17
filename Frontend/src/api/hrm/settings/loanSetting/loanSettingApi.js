import API from "../../../axios/axios";

const LOAN_SETTING_URL = "/hrm/settings/loan-setting";

export const loanSettingApi = {
  get: async () => {
    const response = await API.get(LOAN_SETTING_URL);

    return response.data;
  },

  update: async (payload) => {
    const response = await API.patch(LOAN_SETTING_URL, payload);

    return response.data;
  },
};
