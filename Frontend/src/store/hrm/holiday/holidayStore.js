import { create } from "zustand";
import toast from "react-hot-toast";

import {
    holidayApi,
} from "../../../api/hrm/holiday/holidayApi";

export const useHolidayStore =
    create((set) => ({
        holidays: [],
        selectedHoliday: null,

        loading: false,
        modalLoading: false,
        actionLoadingSlug:
            null,

        fetchHolidays:
            async (
                params = {},
            ) => {
                try {
                    set({
                        loading:
                            true,
                    });

                    const response =
                        await holidayApi.getAll(
                            params,
                        );

                    set({
                        holidays:
                            response.data ||
                            [],
                    });

                    return true;
                } catch (error) {
                    set({
                        holidays:
                            [],
                    });

                    toast.error(
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to fetch holidays",
                    );

                    return false;
                } finally {
                    set({
                        loading:
                            false,
                    });
                }
            },

        fetchHolidayBySlug:
            async (
                holidaySlug,
            ) => {
                try {
                    set({
                        modalLoading:
                            true,

                        selectedHoliday:
                            null,
                    });

                    const response =
                        await holidayApi.getBySlug(
                            holidaySlug,
                        );

                    set({
                        selectedHoliday:
                            response.data ||
                            null,
                    });

                    return (
                        response.data ||
                        null
                    );
                } catch (error) {
                    toast.error(
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to fetch holiday",
                    );

                    return null;
                } finally {
                    set({
                        modalLoading:
                            false,
                    });
                }
            },

        createHoliday:
            async (
                payload,
            ) => {
                try {
                    set({
                        modalLoading:
                            true,
                    });

                    const response =
                        await holidayApi.create(
                            payload,
                        );

                    toast.success(
                        response.message ||
                        "Holiday created successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to create holiday",
                    );

                    return false;
                } finally {
                    set({
                        modalLoading:
                            false,
                    });
                }
            },

        updateHoliday:
            async (
                holidaySlug,
                payload,
            ) => {
                try {
                    set({
                        modalLoading:
                            true,
                    });

                    const response =
                        await holidayApi.update(
                            holidaySlug,
                            payload,
                        );

                    toast.success(
                        response.message ||
                        "Holiday updated successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to update holiday",
                    );

                    return false;
                } finally {
                    set({
                        modalLoading:
                            false,
                    });
                }
            },

        deleteHoliday:
            async (
                holidaySlug,
            ) => {
                try {
                    set({
                        actionLoadingSlug:
                            holidaySlug,
                    });

                    const response =
                        await holidayApi.delete(
                            holidaySlug,
                        );

                    toast.success(
                        response.message ||
                        "Holiday deleted successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to delete holiday",
                    );

                    return false;
                } finally {
                    set({
                        actionLoadingSlug:
                            null,
                    });
                }
            },

        restoreHoliday:
            async (
                holidaySlug,
            ) => {
                try {
                    set({
                        actionLoadingSlug:
                            holidaySlug,
                    });

                    const response =
                        await holidayApi.restore(
                            holidaySlug,
                        );

                    toast.success(
                        response.message ||
                        "Holiday restored successfully",
                    );

                    return true;
                } catch (error) {
                    toast.error(
                        error
                            ?.response
                            ?.data
                            ?.message ||
                        "Failed to restore holiday",
                    );

                    return false;
                } finally {
                    set({
                        actionLoadingSlug:
                            null,
                    });
                }
            },

        clearSelectedHoliday:
            () =>
                set({
                    selectedHoliday:
                        null,
                }),
    }));