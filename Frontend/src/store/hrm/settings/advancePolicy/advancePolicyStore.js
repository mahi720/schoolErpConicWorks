import { create } from "zustand";
import toast from "react-hot-toast";

import { advancePolicyApi } from "../../../../api/HRM/settings/advancePolicy/advancePolicyApi";

export const useAdvancePolicyStore = create((set) => ({
    advancePolicies: [],

    selectedAdvancePolicy: null,

    loading: false,

    submitLoading: false,

    actionLoading: false,

    fetchAdvancePolicies: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await advancePolicyApi.getAll(params);

            set({
                advancePolicies: res.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch advance policies error:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch advance policies",
            );

            set({
                advancePolicies: [],
            });

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchAdvancePolicyBySlug: async (slug) => {
        try {
            set({
                actionLoading: true,

                selectedAdvancePolicy: null,
            });

            const res = await advancePolicyApi.getBySlug(slug);

            set({
                selectedAdvancePolicy: res.data || null,
            });

            return true;
        } catch (error) {
            console.error("Fetch advance policy error:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch advance policy",
            );

            set({
                selectedAdvancePolicy: null,
            });

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    createAdvancePolicy: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await advancePolicyApi.create(payload);

            const created = res.data || null;

            if (created) {
                set((state) => ({
                    advancePolicies: [created, ...state.advancePolicies],
                }));
            }

            toast.success(res.message || "Advance policy created successfully");

            return true;
        } catch (error) {
            console.error("Create advance policy error:", error);

            toast.error(
                error.response?.data?.message || "Failed to create advance policy",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    updateAdvancePolicy: async (slug, payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await advancePolicyApi.update(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    advancePolicies: state.advancePolicies.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvancePolicy:
                        state.selectedAdvancePolicy?.slug === slug
                            ? updated
                            : state.selectedAdvancePolicy,
                }));
            }

            toast.success(res.message || "Advance policy updated successfully");

            return true;
        } catch (error) {
            console.error("Update advance policy error:", error);

            toast.error(
                error.response?.data?.message || "Failed to update advance policy",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    deleteAdvancePolicy: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await advancePolicyApi.delete(slug);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    advancePolicies: state.advancePolicies.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvancePolicy:
                        state.selectedAdvancePolicy?.slug === slug
                            ? updated
                            : state.selectedAdvancePolicy,
                }));
            }

            toast.success(res.message || "Advance policy deleted successfully");

            return true;
        } catch (error) {
            console.error("Delete advance policy error:", error);

            toast.error(
                error.response?.data?.message || "Failed to delete advance policy",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    restoreAdvancePolicy: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await advancePolicyApi.restore(slug);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    advancePolicies: state.advancePolicies.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvancePolicy:
                        state.selectedAdvancePolicy?.slug === slug
                            ? updated
                            : state.selectedAdvancePolicy,
                }));
            }

            toast.success(res.message || "Advance policy restored successfully");

            return true;
        } catch (error) {
            console.error("Restore advance policy error:", error);

            toast.error(
                error.response?.data?.message || "Failed to restore advance policy",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    setSelectedAdvancePolicy: (data) => {
        set({
            selectedAdvancePolicy: data || null,
        });
    },

    clearSelectedAdvancePolicy: () => {
        set({
            selectedAdvancePolicy: null,
        });
    },

    clearAdvancePolicies: () => {
        set({
            advancePolicies: [],

            selectedAdvancePolicy: null,
        });
    },
}));
