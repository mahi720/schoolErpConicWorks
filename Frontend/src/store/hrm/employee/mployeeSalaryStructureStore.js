import { create } from "zustand";
import toast from "react-hot-toast";

import {
    employeeSalaryStructureApi,
} from "../../../api/HRM/employee/employeeSalaryStructureApi";

export const useEmployeeSalaryStructureStore =
    create((set) => ({
        salaryStructure: null,

        payBands: [],

        payBandPreview: null,

        loading: false,

        payBandLoading: false,

        previewLoading: false,

        submitLoading: false,

        statusLoading: false,

        incrementHistory: [],
        incrementHistoryLoading: false,

        fetchPayBands:
            async () => {
                try {
                    set({
                        payBandLoading:
                            true,
                    });

                    const res =
                        await employeeSalaryStructureApi.getPayBands();

                    set({
                        payBands:
                            res.data ||
                            [],
                    });

                    return true;
                } catch (error) {
                    set({
                        payBands: [],
                    });

                    toast.error(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to fetch pay bands",
                    );

                    return false;
                } finally {
                    set({
                        payBandLoading:
                            false,
                    });
                }
            },

        fetchSalaryStructure:
            async (
                employeeSlug,
            ) => {
                try {
                    set({
                        loading:
                            true,

                        salaryStructure:
                            null,
                    });

                    const res =
                        await employeeSalaryStructureApi.getSalaryStructure(
                            employeeSlug,
                        );

                    set({
                        salaryStructure:
                            res.data ||
                            null,
                    });

                    return true;
                } catch (error) {
                    set({
                        salaryStructure:
                            null,
                    });

                    toast.error(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to fetch salary structure",
                    );

                    return false;
                } finally {
                    set({
                        loading:
                            false,
                    });
                }
            },

        previewPayBand:
            async (
                employeeSlug,
                payBand,
            ) => {
                try {
                    set({
                        previewLoading:
                            true,

                        payBandPreview:
                            null,
                    });

                    const res =
                        await employeeSalaryStructureApi.previewPayBand(
                            employeeSlug,
                            {
                                payBand,
                            },
                        );

                    set({
                        payBandPreview:
                            res.data ||
                            null,
                    });

                    return true;
                } catch (error) {
                    set({
                        payBandPreview:
                            null,
                    });

                    toast.error(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to preview pay band",
                    );

                    return false;
                } finally {
                    set({
                        previewLoading:
                            false,
                    });
                }
            },

        saveSalaryStructure:
            async (
                employeeSlug,
                payload,
            ) => {
                try {
                    set({
                        submitLoading:
                            true,
                    });

                    const res =
                        await employeeSalaryStructureApi.saveSalaryStructure(
                            employeeSlug,
                            payload,
                        );

                    set({
                        salaryStructure:
                            res.data ||
                            null,

                        payBandPreview:
                            null,
                    });

                    toast.success(
                        res.message ||
                        "Salary structure saved successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to save salary structure",
                    );

                    return false;
                } finally {
                    set({
                        submitLoading:
                            false,
                    });
                }
            },

        updateGenerationStatus:
            async (
                employeeSlug,
                stopped,
            ) => {
                try {
                    set({
                        statusLoading:
                            true,
                    });

                    const res =
                        await employeeSalaryStructureApi.updateGenerationStatus(
                            employeeSlug,
                            stopped,
                        );

                    set({
                        salaryStructure:
                            res.data ||
                            null,
                    });

                    toast.success(
                        res.message,
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to update salary status",
                    );

                    return false;
                } finally {
                    set({
                        statusLoading:
                            false,
                    });
                }
            },

        fetchIncrementHistory: async (
            employeeSlug,
        ) => {
            try {
                set({
                    incrementHistoryLoading:
                        true,
                });

                const res =
                    await employeeSalaryStructureApi.getIncrementHistory(
                        employeeSlug,
                    );

                set({
                    incrementHistory:
                        res.data || [],
                });

                return true;
            } catch (error) {
                console.error(
                    "Fetch increment history error:",
                    error,
                );

                set({
                    incrementHistory: [],
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch increment history",
                );

                return false;
            } finally {
                set({
                    incrementHistoryLoading:
                        false,
                });
            }
        },

        clearPayBandPreview:
            () => {
                set({
                    payBandPreview:
                        null,
                });
            },
    }));