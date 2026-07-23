import {
    createAcademicCalendarService,
    getAcademicCalendarsService,
    getAcademicCalendarBySlugService,
    updateAcademicCalendarService,
    deleteAcademicCalendarService,
    restoreAcademicCalendarService,
} from "../../../services/academic/academicCalender/academicCalendar.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const createAcademicCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const schoolSlug =
                req.user?.schoolSlug;

            const calendar =
                await createAcademicCalendarService(
                    schoolSlug,
                    req.body,
                );

            return successResponse(
                res,
                201,
                "Academic calendar created successfully",
                calendar,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

/*
|--------------------------------------------------------------------------
| Get all
|--------------------------------------------------------------------------
*/

export const getAcademicCalendarsController =
    async (
        req,
        res,
    ) => {
        try {
            const schoolSlug =
                req.user?.schoolSlug;

            const calendars =
                await getAcademicCalendarsService(
                    schoolSlug,
                    req.query,
                );

            return successResponse(
                res,
                200,
                "Academic calendars fetched successfully",
                calendars,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

/*
|--------------------------------------------------------------------------
| Get by slug
|--------------------------------------------------------------------------
*/

export const getAcademicCalendarBySlugController =
    async (
        req,
        res,
    ) => {
        try {
            const schoolSlug =
                req.user?.schoolSlug;

            const calendar =
                await getAcademicCalendarBySlugService(
                    req.params.slug,
                    schoolSlug,
                );

            return successResponse(
                res,
                200,
                "Academic calendar fetched successfully",
                calendar,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateAcademicCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const schoolSlug =
                req.user?.schoolSlug;

            const calendar =
                await updateAcademicCalendarService(
                    req.params.slug,
                    schoolSlug,
                    req.body,
                );

            return successResponse(
                res,
                200,
                "Academic calendar updated successfully",
                calendar,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteAcademicCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const schoolSlug =
                req.user?.schoolSlug;

            const calendar =
                await deleteAcademicCalendarService(
                    req.params.slug,
                    schoolSlug,
                );

            return successResponse(
                res,
                200,
                "Academic calendar deleted successfully",
                calendar,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreAcademicCalendarController =
    async (
        req,
        res,
    ) => {
        try {
            const schoolSlug =
                req.user?.schoolSlug;

            const calendar =
                await restoreAcademicCalendarService(
                    req.params.slug,
                    schoolSlug,
                );

            return successResponse(
                res,
                200,
                "Academic calendar restored successfully",
                calendar,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
            );
        }
    };