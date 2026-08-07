import { create } from "zustand";
import toast from "react-hot-toast";

import { employeeApi } from "../../../api/HRM/employee/employeeApi";

export const useEmployeeStore = create(
    (set, get) => ({
        employees: [],
        selectedEmployee: null,

        loading: false,
        submitLoading: false,
        modalLoading: false,
        importLoading: false,
        importResult: null,

        fetchEmployees: async (params = {}) => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await employeeApi.getAll(params);

                set({
                    employees: res.data || [],
                });

                return true;
            } catch (error) {
                console.error(
                    "Fetch employees error:",
                    error,
                );

                set({
                    employees: [],
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch employees",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchEmployeeBySlug: async (slug) => {
            try {
                set({
                    modalLoading: true,
                    selectedEmployee: null,
                });

                const res =
                    await employeeApi.getBySlug(
                        slug,
                    );

                set({
                    selectedEmployee:
                        res.data || null,
                });

                return true;
            } catch (error) {
                console.error(
                    "Fetch employee error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch employee",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },

        createEmployee: async (payload) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await employeeApi.create(
                        payload,
                    );

                toast.success(
                    res.message ||
                    "Employee created successfully",
                );

                await get().fetchEmployees();

                return true;
            } catch (error) {
                console.error(
                    "Create employee error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create employee",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateEmployee: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await employeeApi.update(
                        slug,
                        payload,
                    );

                toast.success(
                    res.message ||
                    "Employee updated successfully",
                );

                set((state) => ({
                    employees:
                        state.employees.map(
                            (item) =>
                                item.slug === slug
                                    ? res.data
                                    : item,
                        ),

                    selectedEmployee:
                        state.selectedEmployee
                            ?.slug === slug
                            ? res.data
                            : state.selectedEmployee,
                }));

                return true;
            } catch (error) {
                console.error(
                    "Update employee error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update employee",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        deleteEmployee: async (slug) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await employeeApi.delete(slug);

                toast.success(
                    res.message ||
                    "Employee deleted successfully",
                );

                await get().fetchEmployees();

                return true;
            } catch (error) {
                console.error(
                    "Delete employee error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to delete employee",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        restoreEmployee: async (slug) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await employeeApi.restore(
                        slug,
                    );

                toast.success(
                    res.message ||
                    "Employee restored successfully",
                );

                await get().fetchEmployees();

                return true;
            } catch (error) {
                console.error(
                    "Restore employee error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to restore employee",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateLoginSetting: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    modalLoading: true,
                });

                const res =
                    await employeeApi.updateLoginSetting(
                        slug,
                        payload,
                    );

                toast.success(
                    res.message ||
                    "Login setting updated successfully",
                );

                set((state) => ({
                    employees:
                        state.employees.map(
                            (item) =>
                                item.slug === slug
                                    ? res.data
                                    : item,
                        ),

                    selectedEmployee:
                        state.selectedEmployee
                            ?.slug === slug
                            ? res.data
                            : state.selectedEmployee,
                }));

                return true;
            } catch (error) {
                console.error(
                    "Update login setting error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update login setting",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },

        createLoginAccount: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    modalLoading: true,
                });

                const res =
                    await employeeApi.createLoginAccount(
                        slug,
                        payload,
                    );

                toast.success(
                    res.message ||
                    "Employee login account created successfully",
                );

                set((state) => ({
                    employees:
                        state.employees.map(
                            (item) =>
                                item.slug === slug
                                    ? res.data
                                    : item,
                        ),

                    selectedEmployee:
                        state.selectedEmployee
                            ?.slug === slug
                            ? res.data
                            : state.selectedEmployee,
                }));

                return true;
            } catch (error) {
                console.error(
                    "Create employee login error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create login account",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },

        updateLoginAccess: async (
            slug,
            isActive,
        ) => {
            try {
                set({
                    modalLoading: true,
                });

                const res =
                    await employeeApi.updateLoginAccess(
                        slug,
                        {
                            isActive,
                        },
                    );

                toast.success(
                    res.message ||
                    (isActive
                        ? "Employee login enabled successfully"
                        : "Employee login disabled successfully"),
                );

                set((state) => ({
                    employees:
                        state.employees.map(
                            (item) =>
                                item.slug === slug
                                    ? res.data
                                    : item,
                        ),

                    selectedEmployee:
                        state.selectedEmployee
                            ?.slug === slug
                            ? res.data
                            : state.selectedEmployee,
                }));

                return true;
            } catch (error) {
                console.error(
                    "Update employee login access error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update login access",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },

        setSelectedEmployee: (
            employee,
        ) => {
            set({
                selectedEmployee: employee,
            });
        },

        clearSelectedEmployee: () => {
            set({
                selectedEmployee: null,
            });
        },

        clearEmployees: () => {
            set({
                employees: [],
                selectedEmployee: null,
            });
        },

        importEmployees: async (file) => {
            try {
                set({
                    importLoading: true,
                    importResult: null,
                });

                const res =
                    await employeeApi.importExcel(
                        file,
                    );

                set({
                    importResult:
                        res.data || null,
                });

                toast.success(
                    res.message ||
                    "Employees imported successfully",
                );

                await get().fetchEmployees();

                return true;
            } catch (error) {
                console.error(
                    "Import employees error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to import employees",
                );

                return false;
            } finally {
                set({
                    importLoading: false,
                });
            }
        },

        clearImportResult: () => {
            set({
                importResult: null,
            });
        },

        transferEmployee: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    modalLoading: true,
                });

                const res =
                    await employeeApi.transfer(
                        slug,
                        payload,
                    );

                toast.success(
                    res.message ||
                    "Employee transferred successfully",
                );

                await get().fetchEmployees();

                return true;
            } catch (error) {
                console.error(
                    "Transfer employee error:",
                    error,
                );

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to transfer employee",
                );

                return false;
            } finally {
                set({
                    modalLoading: false,
                });
            }
        },
    }),
);