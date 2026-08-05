import { create } from "zustand";
import toast from "react-hot-toast";

import { degreeDocumentTypeApi } from "../../../../api/hrm/settings/degreeDocumentType/degreeDocumentTypeApi";

export const useDegreeDocumentTypeStore = create((set, get) => ({
  degreeDocumentTypes: [],
  selectedDegreeDocumentType: null,
  loading: false,
  submitLoading: false,

  fetchDegreeDocumentTypes: async (params = {}) => {
    try {
      set({ loading: true });
      const response = await degreeDocumentTypeApi.getAll(params);
      set({ degreeDocumentTypes: response.data || [] });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch degree document types");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  fetchDegreeDocumentTypeBySlug: async (slug) => {
    try {
      set({ loading: true, selectedDegreeDocumentType: null });
      const response = await degreeDocumentTypeApi.getBySlug(slug);
      set({ selectedDegreeDocumentType: response.data || null });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch degree document type");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createDegreeDocumentType: async (payload) => {
    try {
      set({ submitLoading: true });
      const response = await degreeDocumentTypeApi.create(payload);
      toast.success(response.message || "Degree document type created successfully");
      await get().fetchDegreeDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create degree document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  updateDegreeDocumentType: async (slug, payload) => {
    try {
      set({ submitLoading: true });
      const response = await degreeDocumentTypeApi.update(slug, payload);
      toast.success(response.message || "Degree document type updated successfully");
      await get().fetchDegreeDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update degree document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteDegreeDocumentType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await degreeDocumentTypeApi.delete(slug);
      toast.success(response.message || "Degree document type inactivated successfully");
      await get().fetchDegreeDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete degree document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  restoreDegreeDocumentType: async (slug) => {
    try {
      set({ submitLoading: true });
      const response = await degreeDocumentTypeApi.restore(slug);
      toast.success(response.message || "Degree document type restored successfully");
      await get().fetchDegreeDocumentTypes();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore degree document type");
      return false;
    } finally {
      set({ submitLoading: false });
    }
  },

  setSelectedDegreeDocumentType: (data) => set({ selectedDegreeDocumentType: data }),
  clearSelectedDegreeDocumentType: () => set({ selectedDegreeDocumentType: null }),
}));
