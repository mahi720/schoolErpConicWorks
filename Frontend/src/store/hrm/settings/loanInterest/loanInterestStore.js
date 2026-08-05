import { create } from "zustand";
import toast from "react-hot-toast";

import { loanInterestApi } from "../../../../api/hrm/settings/loanInterest/loanInterestApi";

export const useLoanInterestStore = create((set, get) => ({
  loanInterests: [],
  selectedLoanInterest: null,
  loading: false,
  submitLoading: false,

  fetchLoanInterests: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await loanInterestApi.getAll(params);
      set({ loanInterests: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch loan interests");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchLoanInterestBySlug: async (slug) => {
    try {
      set({ loading: true, selectedLoanInterest: null });
      const response = await loanInterestApi.getBySlug(slug);
      set({ selectedLoanInterest: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch loan interest");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createLoanInterest: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await loanInterestApi.create(payload);
      toast.success(response.message || "Loan interest created successfully");
      await get().fetchLoanInterests();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create loan interest");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateLoanInterest: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await loanInterestApi.update(slug, payload);
      toast.success(response.message || "Loan interest updated successfully");
      await get().fetchLoanInterests();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update loan interest");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteLoanInterest: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await loanInterestApi.delete(slug);
      toast.success(response.message || "Loan interest inactivated successfully");
      await get().fetchLoanInterests();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete loan interest");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreLoanInterest: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await loanInterestApi.restore(slug);
      toast.success(response.message || "Loan interest restored successfully");
      await get().fetchLoanInterests();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore loan interest");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedLoanInterest: (data) => set({ selectedLoanInterest: data }),
  clearSelectedLoanInterest: () => set({ selectedLoanInterest: null }),
}));
