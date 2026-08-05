import { create } from "zustand";
import toast from "react-hot-toast";

import { employeeLetterTypeApi } from "../../../../api/hrm/settings/employeeLetterType/employeeLetterTypeApi";

export const useEmployeeLetterTypeStore = create((set, get) => ({
  employeeLetterTypes: [],
  selectedEmployeeLetterType: null,
  loading: false,
  submitLoading: false,

  fetchEmployeeLetterTypes: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await employeeLetterTypeApi.getAll(params);
      set({ employeeLetterTypes: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch employee letter types");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchEmployeeLetterTypeBySlug: async (slug) => {
    try {
      set({ loading: true, selectedEmployeeLetterType: null });
      const response = await employeeLetterTypeApi.getBySlug(slug);
      set({ selectedEmployeeLetterType: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch employee letter type");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createEmployeeLetterType: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await employeeLetterTypeApi.create(payload);
      toast.success(response.message || "Employee letter type created successfully");
      await get().fetchEmployeeLetterTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create employee letter type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateEmployeeLetterType: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await employeeLetterTypeApi.update(slug, payload);
      toast.success(response.message || "Employee letter type updated successfully");
      await get().fetchEmployeeLetterTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update employee letter type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteEmployeeLetterType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await employeeLetterTypeApi.delete(slug);
      toast.success(response.message || "Employee letter type inactivated successfully");
      await get().fetchEmployeeLetterTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete employee letter type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreEmployeeLetterType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await employeeLetterTypeApi.restore(slug);
      toast.success(response.message || "Employee letter type restored successfully");
      await get().fetchEmployeeLetterTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore employee letter type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedEmployeeLetterType: (data) => set({ selectedEmployeeLetterType: data }),
  clearSelectedEmployeeLetterType: () => set({ selectedEmployeeLetterType: null }),
}));
