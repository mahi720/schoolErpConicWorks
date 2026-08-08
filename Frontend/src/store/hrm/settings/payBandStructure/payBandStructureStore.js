import { create } from "zustand";
import toast from "react-hot-toast";

import { payBandStructureApi } from "../../../../api/hrm/settings/payBandStructure/payBandStructureApi";

export const usePayBandStructureStore = create((set) => ({
  structures: [],
  selectedPayBandSlug: null,

  loading: false,
  submitLoading: false,

  fetchPayBandStructure: async (payBandSlug) => {
    try {
      set({
        loading: true,
        selectedPayBandSlug: payBandSlug,
        structures: [],
      });

      const response =
        await payBandStructureApi.getByPayBandSlug(
          payBandSlug,
        );

      set({
        structures:
          response.data || [],
      });

      return true;
    } catch (error) {
      set({
        structures: [],
      });

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch pay band structure",
      );

      return false;
    } finally {
      set({
        loading: false,
      });
    }
  },

  savePayBandStructure: async (
    payBandSlug,
    payload,
  ) => {
    try {
      set({
        submitLoading: true,
      });

      const response =
        await payBandStructureApi.save(
          payBandSlug,
          payload,
        );

      set({
        structures:
          response.data || [],

        selectedPayBandSlug:
          payBandSlug,
      });

      toast.success(
        response.message ||
        "Pay band structure saved successfully",
      );

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to save pay band structure",
      );

      return false;
    } finally {
      set({
        submitLoading: false,
      });
    }
  },

  setStructures: (structures) =>
    set({
      structures,
    }),

  clearPayBandStructure: () =>
    set({
      structures: [],
      selectedPayBandSlug: null,
      loading: false,
      submitLoading: false,
    }),
}));