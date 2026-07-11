import { create } from "zustand";
import { sessionApi } from "../../../api/master/session/sessionApi";
import toast from "react-hot-toast";

export const useSessionStore = create((set, get) => ({
    sessions: [],
    loading: false,
    submitLoading: false,
    selectedSession: null,

    fetchSessions: async () => {
        try {
            set({ loading: true });

            const res = await sessionApi.getAll();

            set({
                sessions: res.data?.data || [],
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch sessions");
        } finally {
            set({ loading: false });
        }
    },

    createSession: async (formData) => {
        try {
            set({ submitLoading: true });

            const res = await sessionApi.create(formData);

            set({
                sessions: [res.data.data, ...get().sessions],
            });

            toast.success(res.data?.message || "Session created successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create session");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateSession: async (slug, formData) => {
        try {
            set({ submitLoading: true });

            const res = await sessionApi.update(slug, formData);

            set({
                sessions: get().sessions.map((session) =>
                    session.slug === slug ? res.data.data : session
                ),
            });

            toast.success(res.data?.message || "Session updated successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update session");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteSession: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await sessionApi.delete(slug);

            set({
                sessions: get().sessions.filter((session) => session.slug !== slug),
            });

            toast.success(res.data?.message || "Session deleted successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete session");
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedSession: (session) => {
        set({ selectedSession: session });
    },

    clearSelectedSession: () => {
        set({ selectedSession: null });
    },
}));