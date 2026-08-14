import { create } from "zustand";
import toast from "react-hot-toast";

import { overtimeRequestApi } from "../../../../api/HRM/request/overtimeRequest/overtimeRequestApi";

export const useOvertimeRequestStore = create((set, get) => ({
    overtimeRequests: [],

    myOvertimeRequests: [],

    selectedOvertimeRequest: null,

    loading: false,

    submitLoading: false,

    actionLoading: false,
    assignedOvertimeRequests: [],

    fetchMyOvertimeRequests: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await overtimeRequestApi.getMyRequests(params);

            set({
                myOvertimeRequests: res.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch my overtime requests error:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch overtime requests",
            );

            set({
                myOvertimeRequests: [],
            });

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchOvertimeRequests: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await overtimeRequestApi.getAll(params);

            set({
                overtimeRequests: res.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch overtime requests error:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch overtime requests",
            );

            set({
                overtimeRequests: [],
            });

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchOvertimeRequestBySlug: async (slug) => {
        try {
            set({
                actionLoading: true,
                selectedOvertimeRequest: null,
            });

            const res = await overtimeRequestApi.getBySlug(slug);

            set({
                selectedOvertimeRequest: res.data || null,
            });

            return true;
        } catch (error) {
            console.error("Fetch overtime request error:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch overtime request",
            );

            set({
                selectedOvertimeRequest: null,
            });

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    createOvertimeRequest: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await overtimeRequestApi.create(payload);

            const created = res.data || null;

            if (created) {
                set((state) => ({
                    myOvertimeRequests: [created, ...state.myOvertimeRequests],
                }));
            }

            toast.success(res.message || "Overtime request created successfully");

            return true;
        } catch (error) {
            console.error("Create overtime request error:", error);

            toast.error(
                error.response?.data?.message || "Failed to create overtime request",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    approveOvertimeRequest: async (slug, payload = {}) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await overtimeRequestApi.approve(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    overtimeRequests: state.overtimeRequests.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myOvertimeRequests: state.myOvertimeRequests.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedOvertimeRequest:
                        state.selectedOvertimeRequest?.slug === slug
                            ? updated
                            : state.selectedOvertimeRequest,

                    assignedOvertimeRequests:
                        state.assignedOvertimeRequests.map(
                            (item) =>
                                item.slug === slug
                                    ? updated
                                    : item,
                        ),
                }));
            }

            toast.success(res.message || "Overtime request approved successfully");

            return true;
        } catch (error) {
            console.error("Approve overtime request error:", error);

            toast.error(
                error.response?.data?.message || "Failed to approve overtime request",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    rejectOvertimeRequest: async (
        slug,
        payload,
    ) => {
        try {
            set({
                actionLoading: true,
            });

            const res =
                await overtimeRequestApi.reject(
                    slug,
                    payload,
                );

            const updated =
                res.data || null;

            if (updated) {
                set((state) => ({
                    assignedOvertimeRequests:
                        state.assignedOvertimeRequests.map(
                            (item) =>
                                item.slug === slug
                                    ? updated
                                    : item,
                        ),

                    myOvertimeRequests:
                        state.myOvertimeRequests.map(
                            (item) =>
                                item.slug === slug
                                    ? updated
                                    : item,
                        ),

                    overtimeRequests:
                        state.overtimeRequests.map(
                            (item) =>
                                item.slug === slug
                                    ? updated
                                    : item,
                        ),

                    selectedOvertimeRequest:
                        state.selectedOvertimeRequest?.slug === slug
                            ? updated
                            : state.selectedOvertimeRequest,
                }));
            }

            toast.success(
                res.message ||
                "Overtime request cancelled successfully",
            );

            return true;
        } catch (error) {
            console.error(
                "Reject overtime request error:",
                error?.response?.data ||
                error,
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to cancel overtime request",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    deleteOvertimeRequest: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await overtimeRequestApi.delete(slug);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    overtimeRequests: state.overtimeRequests.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myOvertimeRequests: state.myOvertimeRequests.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedOvertimeRequest:
                        state.selectedOvertimeRequest?.slug === slug
                            ? updated
                            : state.selectedOvertimeRequest,
                }));
            }

            toast.success(res.message || "Overtime request deleted successfully");

            return true;
        } catch (error) {
            console.error("Delete overtime request error:", error);

            toast.error(
                error.response?.data?.message || "Failed to delete overtime request",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    restoreOvertimeRequest: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await overtimeRequestApi.restore(slug);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    overtimeRequests: state.overtimeRequests.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myOvertimeRequests: state.myOvertimeRequests.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedOvertimeRequest:
                        state.selectedOvertimeRequest?.slug === slug
                            ? updated
                            : state.selectedOvertimeRequest,
                }));
            }

            toast.success(res.message || "Overtime request restored successfully");

            return true;
        } catch (error) {
            console.error("Restore overtime request error:", error);

            toast.error(
                error.response?.data?.message || "Failed to restore overtime request",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    fetchAssignedOvertimeRequests: async (
        params = {},
    ) => {
        try {
            set({
                loading: true,
            });

            const res =
                await overtimeRequestApi.getAssignedToMe(
                    params,
                );

            set({
                assignedOvertimeRequests:
                    res.data || [],
            });

            return true;
        } catch (error) {
            set({
                assignedOvertimeRequests:
                    [],
            });

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch assigned overtime requests",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    setSelectedOvertimeRequest: (data) => {
        set({
            selectedOvertimeRequest: data || null,
        });
    },

    clearSelectedOvertimeRequest: () => {
        set({
            selectedOvertimeRequest: null,
        });
    },

    clearOvertimeRequests: () => {
        set({
            overtimeRequests: [],
            myOvertimeRequests: [],
            assignedOvertimeRequests: [],
            selectedOvertimeRequest: null,
        });
    },
}));
