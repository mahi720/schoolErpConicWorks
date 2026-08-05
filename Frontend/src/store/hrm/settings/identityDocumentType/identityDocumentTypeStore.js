import { create } from "zustand";
import toast from "react-hot-toast";

import { identityDocumentTypeApi } from "../../../../api/hrm/settings/identityDocumentType/identityDocumentTypeApi";

export const useIdentityDocumentTypeStore = create((set, get) => ({
  identityDocumentTypes: [],
  selectedIdentityDocumentType: null,
  loading: false,
  submitLoading: false,

  fetchIdentityDocumentTypes: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await identityDocumentTypeApi.getAll(params);
      set({ identityDocumentTypes: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch identity document types");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchIdentityDocumentTypeBySlug: async (slug) => {
    try {
      set({ loading: true, selectedIdentityDocumentType: null });
      const response = await identityDocumentTypeApi.getBySlug(slug);
      set({ selectedIdentityDocumentType: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch identity document type");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createIdentityDocumentType: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await identityDocumentTypeApi.create(payload);
      toast.success(response.message || "Identity document type created successfully");
      await get().fetchIdentityDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create identity document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateIdentityDocumentType: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await identityDocumentTypeApi.update(slug, payload);
      toast.success(response.message || "Identity document type updated successfully");
      await get().fetchIdentityDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update identity document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteIdentityDocumentType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await identityDocumentTypeApi.delete(slug);
      toast.success(response.message || "Identity document type inactivated successfully");
      await get().fetchIdentityDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete identity document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreIdentityDocumentType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await identityDocumentTypeApi.restore(slug);
      toast.success(response.message || "Identity document type restored successfully");
      await get().fetchIdentityDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore identity document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedIdentityDocumentType: (data) => set({ selectedIdentityDocumentType: data }),
  clearSelectedIdentityDocumentType: () => set({ selectedIdentityDocumentType: null }),
}));
