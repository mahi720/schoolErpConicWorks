import { create } from "zustand";
import toast from "react-hot-toast";

import {
    eventCalendarApi,
} from "../../../api/hrm/eventCalendar/eventCalendarApi";

export const useEventCalendarStore =
    create((set) => ({
        events: [],

        selectedEvent: null,

        loading: false,

        modalLoading: false,

        actionLoadingSlug:
            null,

        fetchEvents: async (
            params = {},
        ) => {
            try {
                set({
                    loading: true,
                });

                const response =
                    await eventCalendarApi.getAll(
                        params,
                    );

                set({
                    events:
                        response.data ||
                        [],
                });

                return true;
            } catch (error) {
                set({
                    events: [],
                });

                toast.error(
                    error?.response
                        ?.data
                        ?.message ||
                    "Failed to fetch events",
                );

                return false;
            } finally {
                set({
                    loading: false,
                });
            }
        },

        fetchEventBySlug:
            async (
                slug,
            ) => {
                try {
                    set({
                        modalLoading:
                            true,

                        selectedEvent:
                            null,
                    });

                    const response =
                        await eventCalendarApi.getBySlug(
                            slug,
                        );

                    set({
                        selectedEvent:
                            response.data ||
                            null,
                    });

                    return (
                        response.data ||
                        null
                    );
                } catch (error) {
                    set({
                        selectedEvent:
                            null,
                    });

                    toast.error(
                        error?.response
                            ?.data
                            ?.message ||
                        "Failed to fetch event",
                    );

                    return null;
                } finally {
                    set({
                        modalLoading:
                            false,
                    });
                }
            },

        createEvent: async (
            payload,
        ) => {
            try {
                set({
                    modalLoading:
                        true,
                });

                const response =
                    await eventCalendarApi.create(
                        payload,
                    );

                toast.success(
                    response.message ||
                    "Event created successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response
                        ?.data
                        ?.message ||
                    "Failed to create event",
                );

                return false;
            } finally {
                set({
                    modalLoading:
                        false,
                });
            }
        },

        updateEvent: async (
            slug,
            payload,
        ) => {
            try {
                set({
                    modalLoading:
                        true,
                });

                const response =
                    await eventCalendarApi.update(
                        slug,
                        payload,
                    );

                toast.success(
                    response.message ||
                    "Event updated successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response
                        ?.data
                        ?.message ||
                    "Failed to update event",
                );

                return false;
            } finally {
                set({
                    modalLoading:
                        false,
                });
            }
        },

        deleteEvent: async (
            slug,
        ) => {
            try {
                set({
                    actionLoadingSlug:
                        slug,
                });

                const response =
                    await eventCalendarApi.delete(
                        slug,
                    );

                toast.success(
                    response.message ||
                    "Event deleted successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response
                        ?.data
                        ?.message ||
                    "Failed to delete event",
                );

                return false;
            } finally {
                set({
                    actionLoadingSlug:
                        null,
                });
            }
        },

        restoreEvent: async (
            slug,
        ) => {
            try {
                set({
                    actionLoadingSlug:
                        slug,
                });

                const response =
                    await eventCalendarApi.restore(
                        slug,
                    );

                toast.success(
                    response.message ||
                    "Event restored successfully",
                );

                return true;
            } catch (error) {
                toast.error(
                    error?.response
                        ?.data
                        ?.message ||
                    "Failed to restore event",
                );

                return false;
            } finally {
                set({
                    actionLoadingSlug:
                        null,
                });
            }
        },

        setSelectedEvent:
            (event) =>
                set({
                    selectedEvent:
                        event,
                }),

        clearSelectedEvent:
            () =>
                set({
                    selectedEvent:
                        null,
                }),

        clearEvents: () =>
            set({
                events: [],
                selectedEvent:
                    null,
            }),
    }));