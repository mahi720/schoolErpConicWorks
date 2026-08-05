import { create } from "zustand";
import toast from "react-hot-toast";

import { loanSettingApi } from "../../../../api/hrm/settings/loanSetting/loanSettingApi";

export const useLoanSettingStore = create((set) => ({
  loanSetting: null,
  loading: false,
  submitLoading: false,

  fetchLoanSetting: async () => {
    try {
      set({ loading: true });
      const response = await loanSettingApi.get();
      set({ loanSetting: response.data || null });
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch loan setting",
      );
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateLoanSetting: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await loanSettingApi.update(payload);
      set({ loanSetting: response.data || null });
      toast.success(response.message || "Loan setting saved successfully");
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save loan setting",
      );
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  clearLoanSetting: () => set({ loanSetting: null }),
}));
