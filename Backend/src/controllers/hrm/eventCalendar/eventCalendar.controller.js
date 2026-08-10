import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

import {
    createEventCalendarService,
    getEventCalendarsService,
    getEventCalendarBySlugService,
    updateEventCalendarService,
    deleteEventCalendarService,
    restoreEventCalendarService,
} from "../../../services/HRM/eventCalendar/eventCalendar.service.js";

export const createEventCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await createEventCalendarService({
                    schoolSlug:
                        req.user.schoolSlug,

                    payload:
                        req.body,
                });

            return successResponse(
                res,
                201,
                "Event created successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const getEventCalendarsController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEventCalendarsService({
                    schoolSlug:
                        req.user.schoolSlug,

                    year:
                        req.query.year,

                    month:
                        req.query.month,
                });

            return successResponse(
                res,
                200,
                "Events fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const getEventCalendarBySlugController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEventCalendarBySlugService({
                    schoolSlug:
                        req.user.schoolSlug,

                    slug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Event fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const updateEventCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await updateEventCalendarService({
                    schoolSlug:
                        req.user.schoolSlug,

                    slug:
                        req.params.slug,

                    payload:
                        req.body,
                });

            return successResponse(
                res,
                200,
                "Event updated successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const deleteEventCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await deleteEventCalendarService({
                    schoolSlug:
                        req.user.schoolSlug,

                    slug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Event deleted successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

export const restoreEventCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await restoreEventCalendarService({
                    schoolSlug:
                        req.user.schoolSlug,

                    slug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Event restored successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };