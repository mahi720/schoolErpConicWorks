import { create } from "zustand";
import toast from "react-hot-toast";

import { employeeLoanApi } from "../../../../api/hrm/request/loanRequest/employeeLoanApi";

export const useEmployeeLoanStore = create((set) => ({
    eligibility: null,

    planPreview: [],

    myLoans: [],

    employeeLoans: [],

    selectedLoan: null,

    installments: [],

    foreclosurePreview: null,

    loading: false,

    eligibilityLoading: false,

    previewLoading: false,

    submitLoading: false,

    actionLoading: false,

    installmentLoading: false,

    foreclosureLoading: false,

    currentUser: null,

    userLoading: false,

    fetchEligibility: async () => {
        try {
            set({
                eligibilityLoading: true,

                eligibility: null,
            });

            const response = await employeeLoanApi.getEligibility();

            set({
                eligibility: response.data || null,
            });

            return true;
        } catch (error) {
            console.error("Fetch loan eligibility error:", error);

            set({
                eligibility: null,
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch loan eligibility",
            );

            return false;
        } finally {
            set({
                eligibilityLoading: false,
            });
        }
    },

    fetchCurrentUser: async () => {
        try {
            set({
                userLoading: true,
            });

            const response = await employeeLoanApi.getCurrentUser();

            const user = response?.data?.user || null;

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

    fetchPlanPreview: async (loanAmount) => {
        try {
            set({
                previewLoading: true,

                planPreview: [],
            });

            const response = await employeeLoanApi.getPlanPreview({
                loanAmount,
            });

            set({
                planPreview: response.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch loan plan preview error:", error);

            set({
                planPreview: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to calculate loan plans",
            );

            return false;
        } finally {
            set({
                previewLoading: false,
            });
        }
    },

    fetchMyLoans: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await employeeLoanApi.getMyLoans(params);

            set({
                myLoans: response.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch my employee loans error:", error);

            set({
                myLoans: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch loan requests",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchEmployeeLoans: async (params = {}) => {
        try {
            set({
                loading: true,
            });

            const response = await employeeLoanApi.getAll(params);

            set({
                employeeLoans: response.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch employee loans error:", error);

            set({
                employeeLoans: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch employee loans",
            );

            return false;
        } finally {
            set({
                loading: false,
            });
        }
    },

    fetchLoanBySlug: async (slug) => {
        try {
            set({
                actionLoading: true,

                selectedLoan: null,

                installments: [],
            });

            const response = await employeeLoanApi.getBySlug(slug);

            const loan = response.data || null;

            set({
                selectedLoan: loan,

                installments: loan?.installments || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch employee loan error:", error);

            set({
                selectedLoan: null,

                installments: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    createLoan: async (payload) => {
        try {
            set({
                submitLoading: true,
            });

            const response = await employeeLoanApi.create(payload);

            const created = response.data || null;

            if (created) {
                set((state) => ({
                    myLoans: [created, ...state.myLoans],
                }));
            }

            toast.success(response.message || "Loan request created successfully");

            return true;
        } catch (error) {
            console.error("Create employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to create loan request",
            );

            return false;
        } finally {
            set({
                submitLoading: false,
            });
        }
    },

    approveLoan: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.approve(slug, payload);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,
                }));
            }

            toast.success(response.message || "Employee loan approved successfully");

            return true;
        } catch (error) {
            console.error("Approve employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to approve employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    rejectLoan: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.reject(slug, payload);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,
                }));
            }

            toast.success(response.message || "Employee loan rejected successfully");

            return true;
        } catch (error) {
            console.error("Reject employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to reject employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    cancelLoan: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.cancel(slug, payload);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,
                }));
            }

            toast.success(response.message || "Employee loan cancelled successfully");

            return true;
        } catch (error) {
            console.error("Cancel employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to cancel employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    disburseLoan: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.disburse(slug, payload);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,

                    installments: updated.installments || state.installments,
                }));
            }

            toast.success(response.message || "Employee loan disbursed successfully");

            return true;
        } catch (error) {
            console.error("Disburse employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to disburse employee loan",
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

                installments: [],
            });

            const response = await employeeLoanApi.getInstallments(slug);

            set({
                installments: response.data || [],
            });

            return true;
        } catch (error) {
            console.error("Fetch loan installments error:", error);

            set({
                installments: [],
            });

            toast.error(
                error.response?.data?.message || "Failed to fetch loan installments",
            );

            return false;
        } finally {
            set({
                installmentLoading: false,
            });
        }
    },

    recoverInstallment: async (loanSlug, installmentSlug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.recoverInstallment(
                loanSlug,
                installmentSlug,
                payload,
            );

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === loanSlug ? updated : item,
                    ),

                    myLoans: state.myLoans.map((item) =>
                        item.slug === loanSlug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === loanSlug
                            ? updated
                            : state.selectedLoan,

                    installments: updated.installments || state.installments,
                }));
            }

            toast.success(
                response.message || "Loan installment recovered successfully",
            );

            return true;
        } catch (error) {
            console.error("Recover loan installment error:", error);

            toast.error(
                error.response?.data?.message || "Failed to recover loan installment",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    fetchForeclosurePreview: async (slug) => {
        try {
            set({
                foreclosureLoading: true,

                foreclosurePreview: null,
            });

            const response = await employeeLoanApi.getForeclosurePreview(slug);

            set({
                foreclosurePreview: response.data || null,
            });

            return true;
        } catch (error) {
            console.error("Fetch loan foreclosure preview error:", error);

            set({
                foreclosurePreview: null,
            });

            toast.error(
                error.response?.data?.message || "Failed to calculate loan foreclosure",
            );

            return false;
        } finally {
            set({
                foreclosureLoading: false,
            });
        }
    },

    forecloseLoan: async (slug, payload) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.foreclose(slug, payload);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,

                    installments: updated.installments || state.installments,

                    foreclosurePreview: null,
                }));
            }

            toast.success(
                response.message || "Employee loan foreclosed successfully",
            );

            return true;
        } catch (error) {
            console.error("Foreclose employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to foreclose employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    deleteLoan: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.delete(slug);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,
                }));
            }

            toast.success(response.message || "Employee loan deleted successfully");

            return true;
        } catch (error) {
            console.error("Delete employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to delete employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    restoreLoan: async (slug) => {
        try {
            set({
                actionLoading: true,
            });

            const response = await employeeLoanApi.restore(slug);

            const updated = response.data || null;

            if (updated) {
                set((state) => ({
                    myLoans: state.myLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    employeeLoans: state.employeeLoans.map((item) =>
                        item.slug === slug ? updated : item,
                    ),

                    selectedLoan:
                        state.selectedLoan?.slug === slug ? updated : state.selectedLoan,
                }));
            }

            toast.success(response.message || "Employee loan restored successfully");

            return true;
        } catch (error) {
            console.error("Restore employee loan error:", error);

            toast.error(
                error.response?.data?.message || "Failed to restore employee loan",
            );

            return false;
        } finally {
            set({
                actionLoading: false,
            });
        }
    },

    setSelectedLoan: (data) => {
        set({
            selectedLoan: data || null,

            installments: data?.installments || [],
        });
    },

    clearSelectedLoan: () => {
        set({
            selectedLoan: null,

            installments: [],

            foreclosurePreview: null,
        });
    },

    clearPlanPreview: () => {
        set({
            planPreview: [],
        });
    },

    clearForeclosurePreview: () => {
        set({
            foreclosurePreview: null,
        });
    },

    clearEligibility: () => {
        set({
            eligibility: null,
        });
    },

    clearEmployeeLoans: () => {
        set({
            eligibility: null,

            planPreview: [],

            myLoans: [],

            employeeLoans: [],

            selectedLoan: null,

            installments: [],

            foreclosurePreview: null,
        });
    },
}));
