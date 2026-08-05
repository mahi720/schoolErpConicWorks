import { create } from "zustand";
import toast from "react-hot-toast";

import { payBandApi } from "../../../../api/hrm/settings/payBand/payBandApi";

export const usePayBandStore = create((set, get) => ({
  payBands: [],
  selectedPayBand: null,
  loading: false,
  submitLoading: false,

  fetchPayBands: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await payBandApi.getAll(params);
      set({ payBands: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pay bands");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchPayBandBySlug: async (slug) => {
    try {
      set({ loading: true, selectedPayBand: null });
      const response = await payBandApi.getBySlug(slug);
      set({ selectedPayBand: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pay band");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createPayBand: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await payBandApi.create(payload);
      toast.success(response.message || "Pay band created successfully");
      await get().fetchPayBands();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create pay band");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updatePayBand: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await payBandApi.update(slug, payload);
      toast.success(response.message || "Pay band updated successfully");
      await get().fetchPayBands();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pay band");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deletePayBand: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await payBandApi.delete(slug);
      toast.success(response.message || "Pay band inactivated successfully");
      await get().fetchPayBands();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete pay band");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restorePayBand: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await payBandApi.restore(slug);
      toast.success(response.message || "Pay band restored successfully");
      await get().fetchPayBands();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore pay band");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedPayBand: (data) => set({ selectedPayBand: data }),
  clearSelectedPayBand: () => set({ selectedPayBand: null }),
}));
