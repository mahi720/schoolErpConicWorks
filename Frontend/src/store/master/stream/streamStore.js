import { create } from "zustand";
import { streamApi } from "../../../api/master/stream/streamApi";
import toast from "react-hot-toast";

export const useStreamStore = create((set, get) => ({
    streams: [],
    loading: false,
    submitLoading: false,
    selectedStream: null,

    fetchStreams: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await streamApi.getAll(params);

            set({
                streams: res.data?.data || [],
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch streams");
        } finally {
            set({ loading: false });
        }
    },

    createStream: async (formData) => {
        try {
            set({ submitLoading: true });

            const res = await streamApi.create(formData);

            set({
                streams: [res.data.data, ...get().streams],
            });

            toast.success(res.data?.message || "Stream created successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create stream");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateStream: async (slug, formData) => {
        try {
            set({ submitLoading: true });

            const res = await streamApi.update(slug, formData);

            set({
                streams: get().streams.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Stream updated successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update stream");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteStream: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await streamApi.delete(slug);

            set({
                streams: get().streams.filter((item) => item.slug !== slug),
            });

            toast.success(res.data?.message || "Stream deleted successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete stream");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    restoreStream: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await streamApi.restore(slug);

            set({
                streams: get().streams.map((item) =>
                    item.slug === slug ? res.data.data : item
                ),
            });

            toast.success(res.data?.message || "Stream restored successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to restore stream");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedStream: (streamItem) => {
        set({ selectedStream: streamItem });
    },

    clearSelectedStream: () => {
        set({ selectedStream: null });
    },
}));