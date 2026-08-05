import { create } from "zustand";
import toast from "react-hot-toast";

import { deductionTypeApi } from "../../../../api/hrm/settings/deductionType/deductionTypeApi";

export const useDeductionTypeStore = create((set, get) => ({
  deductionTypes: [],
  selectedDeductionType: null,
  loading: false,
  submitLoading: false,

  fetchDeductionTypes: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await deductionTypeApi.getAll(params);
      set({ deductionTypes: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch deduction types");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchDeductionTypeBySlug: async (slug) => {
    try {
      set({ loading: true, selectedDeductionType: null });
      const response = await deductionTypeApi.getBySlug(slug);
      set({ selectedDeductionType: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch deduction type");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createDeductionType: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await deductionTypeApi.create(payload);
      toast.success(response.message || "Deduction type created successfully");
      await get().fetchDeductionTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create deduction type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateDeductionType: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await deductionTypeApi.update(slug, payload);
      toast.success(response.message || "Deduction type updated successfully");
      await get().fetchDeductionTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update deduction type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteDeductionType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await deductionTypeApi.delete(slug);
      toast.success(response.message || "Deduction type inactivated successfully");
      await get().fetchDeductionTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete deduction type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreDeductionType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await deductionTypeApi.restore(slug);
      toast.success(response.message || "Deduction type restored successfully");
      await get().fetchDeductionTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore deduction type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedDeductionType: (data) => set({ selectedDeductionType: data }),
  clearSelectedDeductionType: () => set({ selectedDeductionType: null }),
}));
