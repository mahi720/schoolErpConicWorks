import { create } from "zustand";
import toast from "react-hot-toast";

import { employeeAdvanceApi } from "../../../../api/HRM/request/employeeAdvance/employeeAdvanceApi";

export const useEmployeeAdvanceStore = create((set) => ({
    eligibility: null,

    myAdvances: [],

    employeeAdvances: [],

    selectedAdvance: null,

    installments: [],

    loading: false,

    eligibilityLoading: false,

    submitLoading: false,

    actionLoading: false,

    installmentLoading: false,
    currentUser: null,

    userLoading: false,

    fetchEligibility: async () => {
        try {
            set({
                eligibilityLoading: true,

                eligibility: null,
            });

            const res = await employeeAdvanceApi.getEligibility();

            set({
                eligibility: res.data || null,
            });

            return true;
        } catch (error) {
            console.error("Fetch advance eligibility error:", error);

            set({
                eligibility: null,
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch advance eligibility",
            );

            return false;
        } finally {
            set({
                eligibilityLoading: false,
            });
        }
    },

    fetchMyAdvances: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await employeeAdvanceApi.getMyAdvances(params);

            set({
                myAdvances: res.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch my advances error:", error);

            set({
                myAdvances: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch advance requests",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchEmployeeAdvances: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const res = await employeeAdvanceApi.getAll(params);

            set({
                employeeAdvances: res.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch employee advances error:", error);

            set({
                employeeAdvances: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch employee advances",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchAdvanceBySlug: async (slug) => {
        try {
            set({
                actionLoading: true,

                selectedAdvance: null,
            });

            const res = await employeeAdvanceApi.getBySlug(slug);

            set({
                selectedAdvance: res.data || null,

                installments: res.data?.installments || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch employee advance error:", error);

            set({
                selectedAdvance: null,

                installments: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    createAdvance: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const res = await employeeAdvanceApi.create(payload);

            const created = res.data || null;

            if (created) {
                set((state) => ({
                    myAdvances: [created, ...state.myAdvances],
                }));
            }

            toast.success(res.message || "Advance request created successfully");

            return true;
        } catch (error) {
            console.error("Create employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to create advance request",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    approveAdvance: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.approve(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,
                }));
            }

            toast.success(res.message || "Employee advance approved successfully");

            return true;
        } catch (error) {
            console.error("Approve employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to approve employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    rejectAdvance: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.reject(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,
                }));
            }

            toast.success(res.message || "Employee advance rejected successfully");

            return true;
        } catch (error) {
            console.error("Reject employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to reject employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    cancelAdvance: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.cancel(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,
                }));
            }

            toast.success(res.message || "Employee advance cancelled successfully");

            return true;
        } catch (error) {
            console.error("Cancel employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to cancel employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    disburseAdvance: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.disburse(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,

                    installments: updated.installments || state.installments,
                }));
            }

            toast.success(res.message || "Employee advance disbursed successfully");

            return true;
        } catch (error) {
            console.error("Disburse employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to disburse employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    fetchInstallments: async (slug) => {
        try {
            set({
                installmentLoading: true,
            });

            const res = await employeeAdvanceApi.getInstallments(slug);

            set({
                installments: res.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch advance installments error:", error);

            set({
                installments: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch advance installments",
            );

            return false;
        } finally {
            set({
                installmentLoading: false,
            });
        }
    },

    recoverInstallment: async (advanceSlug, installmentSlug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.recoverInstallment(
                advanceSlug,
                installmentSlug,
                payload,
            );

            const updatedAdvance = res.data || null;

            if (updatedAdvance) {
                set((state) => ({
                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === advanceSlug ? updatedAdvance : item,
                    ),

                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === advanceSlug ? updatedAdvance : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === advanceSlug
                            ? updatedAdvance
                            : state.selectedAdvance,

                    installments: updatedAdvance.installments || state.installments,
                }));
            }

            toast.success(
                res.message || "Advance installment recovered successfully",
            );

            return true;
        } catch (error) {
            console.error("Recover advance installment error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to recover advance installment",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    deleteAdvance: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.delete(slug);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,
                }));
            }

            toast.success(res.message || "Employee advance deleted successfully");

            return true;
        } catch (error) {
            console.error("Delete employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to delete employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    restoreAdvance: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.restore(slug);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,
                }));
            }

            toast.success(res.message || "Employee advance restored successfully");

            return true;
        } catch (error) {
            console.error("Restore employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to restore employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    fetchCurrentUser: async () => {
        try {
            set({
                userLoading: true,
            });

            const res = await employeeAdvanceApi.getCurrentUser();

            const user = res?.data?.user || null;

            set({
                currentUser: user,
            });

            return user;
        } catch (error) {
            console.error("Fetch current user error:", error);

            set({
                currentUser: null,
            });

            return null;
        } finally {
            set({
                userLoading: false,
            });
        }
    },

    forecloseAdvance: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const res = await employeeAdvanceApi.foreclose(slug, payload);

            const updated = res.data || null;

            if (updated) {
                set((state) => ({
                    employeeAdvances: state.employeeAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myAdvances: state.myAdvances.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedAdvance:
                        state.selectedAdvance?.slug === slug
                            ? updated
                            : state.selectedAdvance,

                    installments: updated.installments || state.installments,
                }));
            }

            toast.success(res.message || "Employee advance settled successfully");

            return true;
        } catch (error) {
            console.error("Foreclose employee advance error:", error);

            toast.error(
                error.response?.data?.message || "Failed to settle employee advance",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    setSelectedAdvance: (data) => {
        set({
            selectedAdvance: data || null,

            installments: data?.installments || [],
        });
    },

    clearSelectedAdvance: () => {
        set({
            selectedAdvance: null,

            installments: [],
        });
    },

    clearEligibility: () => {
        set({
            eligibility: null,
        });
    },

    clearEmployeeAdvances: () => {
        set({
            eligibility: null,

            myAdvances: [],

            employeeAdvances: [],

            selectedAdvance: null,

            installments: [],
        });
    },
}));
