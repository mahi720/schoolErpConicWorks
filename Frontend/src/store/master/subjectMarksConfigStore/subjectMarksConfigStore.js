import { create } from "zustand";
import toast from "react-hot-toast";

import { subjectMarksConfigApi } from "../../../api/master/subjectMarksConfigApi/subjectMarksConfigApi";

export const useSubjectMarksConfigStore = create((set, get) => ({
    marksConfigs: [],
    loading: false,
    submitLoading: false,
    selectedMarksConfig: null,

    fetchMarksConfigs: async (params = {}) => {
        try {
            set({ loading: true });

            const res = await subjectMarksConfigApi.getAll(params);

            set({
                marksConfigs: res.data?.data || [],
            });

            return true;
        } catch (error) {
            set({
                marksConfigs: [],
            });

            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch marks configurations",
            );

            return false;
        } finally {
            set({ loading: false });
        }
    },

    createMarksConfig: async (payload, showToast = true) => {
        try {
            const res = await subjectMarksConfigApi.create(payload);
            const createdConfig = res.data?.data;

            set({
                marksConfigs: [
                    ...get().marksConfigs,
                    createdConfig,
                ],
            });

            if (showToast) {
                toast.success(
                    res.data?.message ||
                    "Marks configuration created successfully",
                );
            }

            return createdConfig;
        } catch (error) {
            if (showToast) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create marks configuration",
                );
            }

            return null;
        }
    },

    updateMarksConfig: async (
        slug,
        payload,
        showToast = true,
    ) => {
        try {
            const res = await subjectMarksConfigApi.update(
                slug,
                payload,
            );

            const updatedConfig = res.data?.data;

            set({
                marksConfigs: get().marksConfigs.map((item) =>
                    item.slug === slug ? updatedConfig : item,
                ),

                selectedMarksConfig:
                    get().selectedMarksConfig?.slug === slug
                        ? updatedConfig
                        : get().selectedMarksConfig,
            });

            if (showToast) {
                toast.success(
                    res.data?.message ||
                    "Marks configuration updated successfully",
                );
            }

            return updatedConfig;
        } catch (error) {
            if (showToast) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update marks configuration",
                );
            }

            return null;
        }
    },

    deleteMarksConfig: async (
        slug,
        showToast = true,
    ) => {
        try {
            const res =
                await subjectMarksConfigApi.delete(slug);

            const deletedConfig = res.data?.data;

            set({
                marksConfigs: get().marksConfigs.filter(
                    (item) => item.slug !== slug,
                ),

                selectedMarksConfig:
                    get().selectedMarksConfig?.slug === slug
                        ? null
                        : get().selectedMarksConfig,
            });

            if (showToast) {
                toast.success(
                    res.data?.message ||
                    "Marks configuration deleted successfully",
                );
            }

            return deletedConfig || true;
        } catch (error) {
            if (showToast) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to delete marks configuration",
                );
            }

            return false;
        }
    },

    restoreMarksConfig: async (slug) => {
        try {
            set({ submitLoading: true });

            const res =
                await subjectMarksConfigApi.restore(slug);

            const restoredConfig = res.data?.data;

            set({
                marksConfigs: get().marksConfigs.some(
                    (item) => item.slug === slug,
                )
                    ? get().marksConfigs.map((item) =>
                        item.slug === slug
                            ? restoredConfig
                            : item,
                    )
                    : [
                        ...get().marksConfigs,
                        restoredConfig,
                    ],
            });

            toast.success(
                res.data?.message ||
                "Marks configuration restored successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to restore marks configuration",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    saveMarksConfigurations: async ({
        addedSubjectToClassSlug,
        rows,
        deletedSlugs = [],
    }) => {
        try {
            set({ submitLoading: true });

            for (const deletedSlug of deletedSlugs) {
                const deleted =
                    await get().deleteMarksConfig(
                        deletedSlug,
                        false,
                    );

                if (!deleted) {
                    throw new Error(
                        "Failed to delete one of the marks configurations",
                    );
                }
            }

            for (const row of rows) {
                const payload = {
                    componentName: row.subject.trim(),
                    totalMarks: Number(row.totalMarks),

                    // Passing marks currently blank रहेगा.
                    passingMarks: null,
                };

                if (row.slug) {
                    const updated =
                        await get().updateMarksConfig(
                            row.slug,
                            payload,
                            false,
                        );

                    if (!updated) {
                        throw new Error(
                            `Failed to update ${row.subject}`,
                        );
                    }
                } else {
                    const created =
                        await get().createMarksConfig(
                            {
                                addedSubjectToClassSlug,
                                ...payload,
                            },
                            false,
                        );

                    if (!created) {
                        throw new Error(
                            `Failed to create ${row.subject}`,
                        );
                    }
                }
            }

            toast.success(
                "Marks configurations saved successfully",
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save marks configurations",
            );

            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedMarksConfig: (config) => {
        set({
            selectedMarksConfig: config,
        });
    },

    clearSelectedMarksConfig: () => {
        set({
            selectedMarksConfig: null,
        });
    },

    clearMarksConfigs: () => {
        set({
            marksConfigs: [],
            selectedMarksConfig: null,
        });
    },
}));