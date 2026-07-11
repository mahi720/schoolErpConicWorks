import { create } from "zustand";
import toast from "react-hot-toast";

import { remarkApi } from "../../../api/master/remark/remarkApi";

export const useRemarkStore = create(
    (set, get) => ({
        remarks: [],
        loading: false,
        submitLoading: false,
        selectedRemark: null,

        fetchRemarks: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await remarkApi.getAll(params);

                set({
                    remarks:
                        res.data?.data || [],
                });

                return true;
            } catch (error) {
                set({
                    remarks: [],
                });

                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch remarks",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        getRemarkBySlug: async (
            slug,
        ) => {
            try {
                set({
                    loading: true,
                });

                const res =
                    await remarkApi.getBySlug(
                        slug,
                    );

                const remark =
                    res.data?.data || null;

                set({
                    selectedRemark: remark,
                });

                return remark;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to fetch remark",
                );

                return null;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        createRemark: async (
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await remarkApi.create(
                        payload,
                    );

                const createdRemark =
                    res.data?.data;

                set({
                    remarks: [
                        createdRemark,
                        ...get().remarks,
                    ],
                });

                toast.success(
                    res.data?.message ||
                    "Remark created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to create remark",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        updateRemark: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await remarkApi.update(
                        slug,
                        payload,
                    );

                const updatedRemark =
                    res.data?.data;

                set({
                    remarks:
                        get().remarks.map(
                            (item) =>
                                item.slug === slug
                                    ? updatedRemark
                                    : item,
                        ),

                    selectedRemark:
                        get().selectedRemark
                            ?.slug === slug
                            ? updatedRemark
                            : get()
                                .selectedRemark,
                });

                toast.success(
                    res.data?.message ||
                    "Remark updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to update remark",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        deleteRemark: async (slug) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await remarkApi.delete(
                        slug,
                    );

                const deletedRemark =
                    res.data?.data;

                set({
                    remarks:
                        get().remarks.map(
                            (item) =>
                                item.slug === slug
                                    ? {
                                        ...item,
                                        ...deletedRemark,
                                        status:
                                            "inactive",
                                        isActive: false,
                                    }
                                    : item,
                        ),
                });

                toast.success(
                    res.data?.message ||
                    "Remark deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to delete remark",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        restoreRemark: async (slug) => {
            try {
                set({
                    submitLoading: true,
                });

                const res =
                    await remarkApi.restore(
                        slug,
                    );

                const restoredRemark =
                    res.data?.data;

                set({
                    remarks:
                        get().remarks.map(
                            (item) =>
                                item.slug === slug
                                    ? restoredRemark
                                    : item,
                        ),
                });

                toast.success(
                    res.data?.message ||
                    "Remark restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                    "Failed to restore remark",
                );

                return false;
            } finally {
                set({
                    submitLoading: false,
                });
            }
        },

        setSelectedRemark: (
            remark,
        ) => {
            set({
                selectedRemark: remark,
            });
        },

        clearSelectedRemark: () => {
            set({
                selectedRemark: null,
            });
        },

        clearRemarks: () => {
            set({
                remarks: [],
                selectedRemark: null,
            });
        },
    }),
);