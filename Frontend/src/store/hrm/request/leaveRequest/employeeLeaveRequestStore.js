import { create } from "zustand";
import toast from "react-hot-toast";

import { employeeLeaveRequestApi } from "../../../../api/hrm/request/leaveRequest/employeeLeaveRequestApi.js";

export const useEmployeeLeaveRequestStore =
    create((set, get) => ({
        leaveRequests: [],

        selectedLeaveRequest: null,

        leaveLogs: [],

        loading: false,

        submitLoading: false,

        detailLoading: false,

        logsLoading: false,

        fetchLeaveRequests: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                });

                const response =
                    await employeeLeaveRequestApi.getAll(
                        params,
                    );

                set({
                    leaveRequests:
                        response.data || [],
                });

                return true;
            } catch (error) {
                set({
                    leaveRequests: [],
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch leave requests",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchLeaveRequestBySlug: async (
            slug,
        ) => {
            try {
                set({
                    detailLoading: true,

                    selectedLeaveRequest:
                        null,
                });

                const response =
                    await employeeLeaveRequestApi.getBySlug(
                        slug,
                    );

                set({
                    selectedLeaveRequest:
                        response.data || null,
                });

                return true;
            } catch (error) {
                set({
                    selectedLeaveRequest:
                        null,
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch leave request",
                );

                return false;
            } finally {
                set({
                    detailLoading: false,
                });
            }
        },

        createLeaveRequest: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.create(
                        payload,
                    );

                const created =
                    response.data || null;

                if (created) {
                    set((state) => ({
                        leaveRequests: [
                            created,
                            ...state.leaveRequests,
                        ],
                    }));
                }

                toast.success(
                    response.message ||
                    "Leave request created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create leave request",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        bulkCreateLeaveRequests: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.bulkCreate(
                        payload,
                    );

                const createdRows =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                if (
                    createdRows.length >
                    0
                ) {
                    set((state) => ({
                        leaveRequests: [
                            ...createdRows,
                            ...state.leaveRequests,
                        ],
                    }));
                }

                toast.success(
                    response.message ||
                    "Leave requests created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create leave requests",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        approveLeaveRequest: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.approve(
                        slug,
                        payload,
                    );

                const updated =
                    response.data || null;

                if (updated) {
                    set((state) => ({
                        leaveRequests:
                            state.leaveRequests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? updated
                                        : item,
                            ),

                        selectedLeaveRequest:
                            state
                                .selectedLeaveRequest
                                ?.slug ===
                                slug
                                ? updated
                                : state.selectedLeaveRequest,
                    }));
                }

                toast.success(
                    response.message ||
                    "Leave request approved successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to approve leave request",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        bulkApproveLeaveRequests: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.bulkApprove(
                        payload,
                    );

                const updatedRows =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                if (
                    updatedRows.length >
                    0
                ) {
                    const updatedMap =
                        new Map(
                            updatedRows.map(
                                (item) => [
                                    item.slug,
                                    item,
                                ],
                            ),
                        );

                    set((state) => ({
                        leaveRequests:
                            state.leaveRequests.map(
                                (item) =>
                                    updatedMap.get(
                                        item.slug,
                                    ) || item,
                            ),
                    }));
                }

                toast.success(
                    response.message ||
                    "Selected leave requests approved successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to approve selected leave requests",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        rejectLeaveRequest: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.reject(
                        slug,
                        payload,
                    );

                const updated =
                    response.data || null;

                if (updated) {
                    set((state) => ({
                        leaveRequests:
                            state.leaveRequests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? updated
                                        : item,
                            ),

                        selectedLeaveRequest:
                            state
                                .selectedLeaveRequest
                                ?.slug ===
                                slug
                                ? updated
                                : state.selectedLeaveRequest,
                    }));
                }

                toast.success(
                    response.message ||
                    "Leave request rejected successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to reject leave request",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        deleteLeaveRequest: async (
            slug,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.delete(
                        slug,
                    );

                const updated =
                    response.data || null;

                if (updated) {
                    set((state) => ({
                        leaveRequests:
                            state.leaveRequests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? updated
                                        : item,
                            ),
                    }));
                }

                toast.success(
                    response.message ||
                    "Leave request deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to delete leave request",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        restoreLeaveRequest: async (
            slug,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const response =
                    await employeeLeaveRequestApi.restore(
                        slug,
                    );

                const updated =
                    response.data || null;

                if (updated) {
                    set((state) => ({
                        leaveRequests:
                            state.leaveRequests.map(
                                (item) =>
                                    item.slug ===
                                        slug
                                        ? updated
                                        : item,
                            ),
                    }));
                }

                toast.success(
                    response.message ||
                    "Leave request restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to restore leave request",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        fetchLeaveRequestLogs: async (
            slug,
        ) => {
            try {
                set({
                    logsLoading: true,

                    leaveLogs: [],
                });

                const response =
                    await employeeLeaveRequestApi.getLogs(
                        slug,
                    );

                set({
                    leaveLogs:
                        response.data || [],
                });

                return true;
            } catch (error) {
                set({
                    leaveLogs: [],
                });

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to fetch leave request logs",
                );

                return false;
            } finally {
                set({
                    logsLoading: false,
                });
            }
        },

        setSelectedLeaveRequest: (
            leaveRequest,
        ) => {
            set({
                selectedLeaveRequest:
                    leaveRequest,
            });
        },

        clearSelectedLeaveRequest: () => {
            set({
                selectedLeaveRequest:
                    null,
            });
        },

        clearLeaveLogs: () => {
            set({
                leaveLogs: [],
            });
        },

        clearLeaveRequests: () => {
            set({
                leaveRequests: [],

                selectedLeaveRequest:
                    null,

                leaveLogs: [],
            });
        },
    }));