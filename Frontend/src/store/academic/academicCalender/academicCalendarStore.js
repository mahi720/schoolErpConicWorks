import { create } from "zustand";
import toast from "react-hot-toast";

import { academicCalendarApi } from "../../../api/academic/academicCalendar/academicCalendarApi";

export const useAcademicCalendarStore = create((set, get) => ({
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    academicCalendars: [],

    inactiveAcademicCalendars: [],

    selectedAcademicCalendar: null,

    loading: false,

    submitLoading: false,

    error: null,

    /*
    |--------------------------------------------------------------------------
    | Fetch active/all academic calendars
    |--------------------------------------------------------------------------
    */

    fetchAcademicCalendars: async (params = {}) => {
        try {
            set({
                loading: true,
                error: null,
            });

            const response =
                await academicCalendarApi.getAll(params);

            const academicCalendars =
                response?.data || [];

            set({
                academicCalendars,
                loading: false,
            });

            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to fetch academic calendars";

            set({
                loading: false,
                error: message,
                academicCalendars: [],
            });

            toast.error(message);

            return false;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Fetch inactive academic calendars
    |--------------------------------------------------------------------------
    */

    fetchInactiveAcademicCalendars: async (
        params = {},
    ) => {
        try {
            set({
                loading: true,
                error: null,
            });

            const response =
                await academicCalendarApi.getAll({
                    ...params,
                    status: "inactive",
                });

            const inactiveAcademicCalendars =
                response?.data || [];

            set({
                inactiveAcademicCalendars,
                loading: false,
            });

            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to fetch inactive academic calendars";

            set({
                loading: false,
                error: message,
                inactiveAcademicCalendars: [],
            });

            toast.error(message);

            return false;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Fetch academic calendar by slug
    |--------------------------------------------------------------------------
    */

    fetchAcademicCalendarBySlug: async (
        slug,
    ) => {
        try {
            set({
                loading: true,
                error: null,
                selectedAcademicCalendar: null,
            });

            const response =
                await academicCalendarApi.getBySlug(
                    slug,
                );

            const academicCalendar =
                response?.data || null;

            set({
                selectedAcademicCalendar:
                    academicCalendar,

                loading: false,
            });

            return academicCalendar;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to fetch academic calendar";

            set({
                loading: false,
                error: message,
                selectedAcademicCalendar: null,
            });

            toast.error(message);

            return null;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Create academic calendar
    |--------------------------------------------------------------------------
    */

    createAcademicCalendar: async (
        payload,
    ) => {
        try {
            set({
                submitLoading: true,
                error: null,
            });

            const response =
                await academicCalendarApi.create(
                    payload,
                );

            const createdAcademicCalendar =
                response?.data;

            if (!createdAcademicCalendar) {
                throw new Error(
                    "Academic calendar data not received",
                );
            }

            set((state) => ({
                academicCalendars: [
                    ...state.academicCalendars,
                    createdAcademicCalendar,
                ],

                submitLoading: false,
            }));

            toast.success(
                response?.message ||
                "Academic calendar created successfully",
            );

            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to create academic calendar";

            set({
                submitLoading: false,
                error: message,
            });

            toast.error(message);

            return false;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Update academic calendar
    |--------------------------------------------------------------------------
    */

    updateAcademicCalendar: async (
        slug,
        payload,
    ) => {
        try {
            set({
                submitLoading: true,
                error: null,
            });

            const response =
                await academicCalendarApi.update(
                    slug,
                    payload,
                );

            const updatedAcademicCalendar =
                response?.data;

            if (!updatedAcademicCalendar) {
                throw new Error(
                    "Updated academic calendar data not received",
                );
            }

            set((state) => ({
                academicCalendars:
                    state.academicCalendars.map(
                        (calendar) =>
                            calendar.slug === slug
                                ? updatedAcademicCalendar
                                : calendar,
                    ),

                inactiveAcademicCalendars:
                    state.inactiveAcademicCalendars.map(
                        (calendar) =>
                            calendar.slug === slug
                                ? updatedAcademicCalendar
                                : calendar,
                    ),

                selectedAcademicCalendar:
                    state.selectedAcademicCalendar
                        ?.slug === slug
                        ? updatedAcademicCalendar
                        : state.selectedAcademicCalendar,

                submitLoading: false,
            }));

            toast.success(
                response?.message ||
                "Academic calendar updated successfully",
            );

            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to update academic calendar";

            set({
                submitLoading: false,
                error: message,
            });

            toast.error(message);

            return false;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Soft delete academic calendar
    |--------------------------------------------------------------------------
    */

    deleteAcademicCalendar: async (
        slug,
    ) => {
        try {
            set({
                submitLoading: true,
                error: null,
            });

            const response =
                await academicCalendarApi.delete(
                    slug,
                );

            const deletedAcademicCalendar =
                response?.data;

            set((state) => ({
                academicCalendars:
                    state.academicCalendars.filter(
                        (calendar) =>
                            calendar.slug !== slug,
                    ),

                inactiveAcademicCalendars:
                    deletedAcademicCalendar
                        ? [
                            deletedAcademicCalendar,
                            ...state.inactiveAcademicCalendars.filter(
                                (calendar) =>
                                    calendar.slug !== slug,
                            ),
                        ]
                        : state.inactiveAcademicCalendars,

                selectedAcademicCalendar:
                    state.selectedAcademicCalendar
                        ?.slug === slug
                        ? null
                        : state.selectedAcademicCalendar,

                submitLoading: false,
            }));

            toast.success(
                response?.message ||
                "Academic calendar deleted successfully",
            );

            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to delete academic calendar";

            set({
                submitLoading: false,
                error: message,
            });

            toast.error(message);

            return false;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Restore academic calendar
    |--------------------------------------------------------------------------
    */

    restoreAcademicCalendar: async (
        slug,
    ) => {
        try {
            set({
                submitLoading: true,
                error: null,
            });

            const response =
                await academicCalendarApi.restore(
                    slug,
                );

            const restoredAcademicCalendar =
                response?.data;

            if (!restoredAcademicCalendar) {
                throw new Error(
                    "Restored academic calendar data not received",
                );
            }

            set((state) => ({
                inactiveAcademicCalendars:
                    state.inactiveAcademicCalendars.filter(
                        (calendar) =>
                            calendar.slug !== slug,
                    ),

                academicCalendars: [
                    restoredAcademicCalendar,
                    ...state.academicCalendars.filter(
                        (calendar) =>
                            calendar.slug !== slug,
                    ),
                ],

                selectedAcademicCalendar:
                    state.selectedAcademicCalendar
                        ?.slug === slug
                        ? restoredAcademicCalendar
                        : state.selectedAcademicCalendar,

                submitLoading: false,
            }));

            toast.success(
                response?.message ||
                "Academic calendar restored successfully",
            );

            return true;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error.message ||
                "Failed to restore academic calendar";

            set({
                submitLoading: false,
                error: message,
            });

            toast.error(message);

            return false;
        }
    },

    /*
    |--------------------------------------------------------------------------
    | Set selected academic calendar
    |--------------------------------------------------------------------------
    */

    setSelectedAcademicCalendar: (
        academicCalendar,
    ) => {
        set({
            selectedAcademicCalendar:
                academicCalendar,
        });
    },

    /*
    |--------------------------------------------------------------------------
    | Clear selected academic calendar
    |--------------------------------------------------------------------------
    */

    clearSelectedAcademicCalendar: () => {
        set({
            selectedAcademicCalendar: null,
        });
    },

    /*
    |--------------------------------------------------------------------------
    | Clear academic calendar lists
    |--------------------------------------------------------------------------
    */

    clearAcademicCalendars: () => {
        set({
            academicCalendars: [],
            inactiveAcademicCalendars: [],
            selectedAcademicCalendar: null,
            error: null,
        });
    },

    /*
    |--------------------------------------------------------------------------
    | Clear error
    |--------------------------------------------------------------------------
    */

    clearError: () => {
        set({
            error: null,
        });
    },
}));