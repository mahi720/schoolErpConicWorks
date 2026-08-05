import { create } from "zustand";
import toast from "react-hot-toast";

import { earningTypeApi } from "../../../../api/hrm/settings/earningType/earningTypeApi";

export const useEarningTypeStore = create((set, get) => ({
  earningTypes: [],
  selectedEarningType: null,
  loading: false,
  submitLoading: false,

  fetchEarningTypes: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await earningTypeApi.getAll(params);
      set({ earningTypes: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch earning types");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchEarningTypeBySlug: async (slug) => {
    try {
      set({ loading: true, selectedEarningType: null });
      const response = await earningTypeApi.getBySlug(slug);
      set({ selectedEarningType: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch earning type");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createEarningType: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await earningTypeApi.create(payload);
      toast.success(response.message || "Earning type created successfully");
      await get().fetchEarningTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create earning type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateEarningType: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await earningTypeApi.update(slug, payload);
      toast.success(response.message || "Earning type updated successfully");
      await get().fetchEarningTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update earning type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteEarningType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await earningTypeApi.delete(slug);
      toast.success(response.message || "Earning type inactivated successfully");
      await get().fetchEarningTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete earning type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreEarningType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await earningTypeApi.restore(slug);
      toast.success(response.message || "Earning type restored successfully");
      await get().fetchEarningTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore earning type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedEarningType: (data) => set({ selectedEarningType: data }),
  clearSelectedEarningType: () => set({ selectedEarningType: null }),
}));
