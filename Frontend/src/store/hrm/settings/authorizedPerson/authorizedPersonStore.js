import { create } from "zustand";
import toast from "react-hot-toast";

import { authorizedPersonApi } from "../../../../api/hrm/settings/authorizedPerson/authorizedPersonApi";

export const useAuthorizedPersonStore = create((set, get) => ({
  authorizedPersons: [],
  selectedAuthorizedPerson: null,
  loading: false,
  submitLoading: false,

  fetchAuthorizedPersons: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await authorizedPersonApi.getAll(params);
      set({ authorizedPersons: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch authorized persons");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchAuthorizedPersonBySlug: async (slug) => {
    try {
      set({ loading: true, selectedAuthorizedPerson: null });
      const response = await authorizedPersonApi.getBySlug(slug);
      set({ selectedAuthorizedPerson: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch authorized person");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createAuthorizedPerson: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await authorizedPersonApi.create(payload);
      toast.success(response.message || "Authorized person created successfully");
      await get().fetchAuthorizedPersons();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create authorized person");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateAuthorizedPerson: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await authorizedPersonApi.update(slug, payload);
      toast.success(response.message || "Authorized person updated successfully");
      await get().fetchAuthorizedPersons();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update authorized person");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteAuthorizedPerson: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await authorizedPersonApi.delete(slug);
      toast.success(response.message || "Authorized person inactivated successfully");
      await get().fetchAuthorizedPersons();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete authorized person");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreAuthorizedPerson: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await authorizedPersonApi.restore(slug);
      toast.success(response.message || "Authorized person restored successfully");
      await get().fetchAuthorizedPersons();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore authorized person");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedAuthorizedPerson: (data) => set({ selectedAuthorizedPerson: data }),
  clearSelectedAuthorizedPerson: () => set({ selectedAuthorizedPerson: null }),
}));
