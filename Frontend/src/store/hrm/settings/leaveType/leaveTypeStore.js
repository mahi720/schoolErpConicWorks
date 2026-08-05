import { create } from "zustand";
import toast from "react-hot-toast";

import { leaveTypeApi } from "../../../../api/hrm/settings/leaveType/leaveTypeApi";

export const useLeaveTypeStore = create((set, get) => ({
  leaveTypes: [],
  selectedLeaveType: null,
  loading: false,
  submitLoading: false,

  fetchLeaveTypes: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await leaveTypeApi.getAll(params);
      set({ leaveTypes: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch leave types");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchLeaveTypeBySlug: async (slug) => {
    try {
      set({ loading: true, selectedLeaveType: null });
      const response = await leaveTypeApi.getBySlug(slug);
      set({ selectedLeaveType: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch leave type");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createLeaveType: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await leaveTypeApi.create(payload);
      toast.success(response.message || "Leave type created successfully");
      await get().fetchLeaveTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create leave type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateLeaveType: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await leaveTypeApi.update(slug, payload);
      toast.success(response.message || "Leave type updated successfully");
      await get().fetchLeaveTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update leave type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteLeaveType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await leaveTypeApi.delete(slug);
      toast.success(response.message || "Leave type inactivated successfully");
      await get().fetchLeaveTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete leave type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreLeaveType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await leaveTypeApi.restore(slug);
      toast.success(response.message || "Leave type restored successfully");
      await get().fetchLeaveTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore leave type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedLeaveType: (data) => set({ selectedLeaveType: data }),
  clearSelectedLeaveType: () => set({ selectedLeaveType: null }),
}));
