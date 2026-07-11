import { create } from "zustand";
import toast from "react-hot-toast";
import { classMappingApi } from "../../../api/master/classMapping/classMappingApi";

export const useClassMappingStore = create((set, get) => ({
    mappings: [],
    loading: false,
    submitLoading: false,

    fetchMappings: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await classMappingApi.getAll(params);

            set({
                mappings: res.data?.data || [],
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch mappings");
        } finally {
            set({ loading: false });
        }
    },

    saveMapping: async (payload) => {
        try {
            set({ submitLoading: true });

            const res = await classMappingApi.save(payload);
            const saved = res.data?.data;

            set({
                mappings: [
                    saved,
                    ...get().mappings.filter((item) => item.slug !== saved.slug),
                ],
            });

            toast.success(res.data?.message || "Mapping saved successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save mapping");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },
}));