import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

import {
    createHolidayService,
    getHolidaysService,
    getHolidayBySlugService,
    updateHolidayService,
    deleteHolidayService,
    restoreHolidayService,
} from "../../../services/HRM/holiday/holiday.service.js";

export const createHolidayController =
    async (req, res) => {
        try {
            const data =
                await createHolidayService({
                    schoolSlug:
                        req.user.schoolSlug,

                    payload:
                        req.body,
                });

            return successResponse(
                res,
                201,
                "Holiday created successfully",
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

export const getHolidaysController =
    async (req, res) => {
        try {
            const data =
                await getHolidaysService({
                    schoolSlug:
                        req.user.schoolSlug,

                    year:
                        req.query.year ||
                        null,
                });

            return successResponse(
                res,
                200,
                "Holidays fetched successfully",
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

export const getHolidayBySlugController =
    async (req, res) => {
        try {
            const data =
                await getHolidayBySlugService({
                    schoolSlug:
                        req.user.schoolSlug,

                    holidaySlug:
                        req.params
                            .holidaySlug,
                });

            return successResponse(
                res,
                200,
                "Holiday fetched successfully",
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

export const updateHolidayController =
    async (req, res) => {
        try {
            const data =
                await updateHolidayService({
                    schoolSlug:
                        req.user.schoolSlug,

                    holidaySlug:
                        req.params
                            .holidaySlug,

                    payload:
                        req.body,
                });

            return successResponse(
                res,
                200,
                "Holiday updated successfully",
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

export const deleteHolidayController =
    async (req, res) => {
        try {
            const data =
                await deleteHolidayService({
                    schoolSlug:
                        req.user.schoolSlug,

                    holidaySlug:
                        req.params
                            .holidaySlug,
                });

            return successResponse(
                res,
                200,
                "Holiday deleted successfully",
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

export const restoreHolidayController =
    async (req, res) => {
        try {
            const data =
                await restoreHolidayService({
                    schoolSlug:
                        req.user.schoolSlug,

                    holidaySlug:
                        req.params.holidaySlug,
                });

            return successResponse(
                res,
                200,
                "Holiday restored successfully",
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