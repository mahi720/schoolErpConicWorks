import {
    createTermExamService,
    getTermExamsService,
    getTermExamBySlugService,
    updateTermExamService,
    deleteTermExamService,
    restoreTermExamService,
    getTermExamTimeTableService,
    saveTermExamTimeTableService,
    deleteTermExamTimeTableService,
    restoreTermExamTimeTableService,
} from "../../../services/examManager/termExamTimeTable/termExamTimeTableService.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createTermExamController =
    async (req, res) => {
        try {
            const data =
                await createTermExamService(
                    req.body,
                    req.user,
                );

            return successResponse(
                res,
                201,
                "Term exam created successfully",
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

export const getTermExamsController =
    async (req, res) => {
        try {
            const data =
                await getTermExamsService(
                    req.query,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Term exams fetched successfully",
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

export const getTermExamBySlugController =
    async (req, res) => {
        try {
            const data =
                await getTermExamBySlugService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Term exam fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

export const updateTermExamController =
    async (req, res) => {
        try {
            const data =
                await updateTermExamService(
                    req.params.slug,
                    req.body,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Term exam updated successfully",
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

export const deleteTermExamController =
    async (req, res) => {
        try {
            const data =
                await deleteTermExamService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Term exam inactivated successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

export const restoreTermExamController =
    async (req, res) => {
        try {
            const data =
                await restoreTermExamService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Term exam restored successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

export const getTermExamTimeTableController =
    async (req, res) => {
        try {
            const data =
                await getTermExamTimeTableService({
                    termExamSlug:
                        req.params
                            .termExamSlug,

                    classSlug:
                        req.params
                            .classSlug,

                    user:
                        req.user,
                });

            return successResponse(
                res,
                200,
                "Term exam timetable fetched successfully",
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

export const saveTermExamTimeTableController =
    async (req, res) => {
        try {
            const data =
                await saveTermExamTimeTableService(
                    req.body,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Term exam timetable saved successfully",
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

export const deleteTermExamTimeTableController =
    async (req, res) => {
        try {
            const data =
                await deleteTermExamTimeTableService({
                    termExamSlug:
                        req.params
                            .termExamSlug,

                    classSlug:
                        req.params
                            .classSlug,

                    user:
                        req.user,
                });

            return successResponse(
                res,
                200,
                "Term exam timetable inactivated successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };

export const restoreTermExamTimeTableController =
    async (req, res) => {
        try {
            const data =
                await restoreTermExamTimeTableService({
                    termExamSlug:
                        req.params
                            .termExamSlug,

                    classSlug:
                        req.params
                            .classSlug,

                    user:
                        req.user,
                });

            return successResponse(
                res,
                200,
                "Term exam timetable restored successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                404,
                error.message,
            );
        }
    };