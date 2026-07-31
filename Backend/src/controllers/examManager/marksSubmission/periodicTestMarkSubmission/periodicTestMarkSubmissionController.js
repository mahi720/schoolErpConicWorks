import {
    getPeriodicTestMarkStudentsService,
    savePeriodicTestMarksService,
    bulkUpdatePeriodicTestMarksService,
    getPeriodicTestSubmissionService,
    lockPeriodicTestMarksService,
    unlockPeriodicTestMarksService,
    deletePeriodicTestMarksService,
    restorePeriodicTestMarksService,
    getPeriodicTestMarkAuditLogsService,
} from "../../../../services/examManager/markSubmission/periodicTestMarkSubmission/periodicTestMarkSubmission.service.js";

import {
    getPeriodicTestRequestMetadata,
    getAuditActorSnapshot,
} from "../../../../utils/periodicTestMarkAuditHelper.js";

import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

const getControllerContext = (req) => {
    return {
        user: req.user,
        actor: getAuditActorSnapshot(
            req.user,
        ),
        requestMetadata:
            getPeriodicTestRequestMetadata(
                req,
            ),
    };
};

const getErrorStatusCode = (
    error,
    fallbackStatusCode = 500,
) => {
    return Number.isInteger(
        error?.statusCode,
    )
        ? error.statusCode
        : fallbackStatusCode;
};

export const getPeriodicTestMarkStudentsController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await getPeriodicTestMarkStudentsService(
                    {
                        ...context,
                        query: req.query,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test students fetched successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Get periodic test students error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to fetch periodic test students",
            );
        }
    };

export const savePeriodicTestMarksController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await savePeriodicTestMarksService(
                    {
                        ...context,
                        payload: req.body,
                    },
                );

            return successResponse(
                res,
                201,
                "Periodic test marks saved successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Save periodic test marks error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to save periodic test marks",
            );
        }
    };

export const bulkUpdatePeriodicTestMarksController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await bulkUpdatePeriodicTestMarksService(
                    {
                        ...context,
                        submissionSlug:
                            req.params.slug,
                        payload: req.body,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test marks updated successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Update periodic test marks error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to update periodic test marks",
            );
        }
    };

export const getPeriodicTestSubmissionController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await getPeriodicTestSubmissionService(
                    {
                        ...context,
                        submissionSlug:
                            req.params.slug,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test mark submission fetched successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Get periodic test submission error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    404,
                ),
                error.message ||
                "Failed to fetch periodic test mark submission",
            );
        }
    };

export const lockPeriodicTestMarksController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await lockPeriodicTestMarksService(
                    {
                        ...context,
                        submissionSlug:
                            req.params.slug,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test marks locked successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Lock periodic test marks error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to lock periodic test marks",
            );
        }
    };

export const unlockPeriodicTestMarksController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await unlockPeriodicTestMarksService(
                    {
                        ...context,
                        submissionSlug:
                            req.params.slug,
                        remarks:
                            req.body.remarks,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test marks unlocked successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Unlock periodic test marks error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to unlock periodic test marks",
            );
        }
    };

export const deletePeriodicTestMarksController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await deletePeriodicTestMarksService(
                    {
                        ...context,
                        submissionSlug:
                            req.params.slug,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test marks deleted successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Delete periodic test marks error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to delete periodic test marks",
            );
        }
    };

export const restorePeriodicTestMarksController =
    async (req, res) => {
        try {
            const context =
                getControllerContext(req);

            const data =
                await restorePeriodicTestMarksService(
                    {
                        ...context,
                        submissionSlug:
                            req.params.slug,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test marks restored successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Restore periodic test marks error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to restore periodic test marks",
            );
        }
    };

export const getPeriodicTestMarkAuditLogsController =
    async (req, res) => {
        try {
            const data =
                await getPeriodicTestMarkAuditLogsService(
                    {
                        user: req.user,
                        query: req.query,
                    },
                );

            return successResponse(
                res,
                200,
                "Periodic test mark audit logs fetched successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Get periodic test mark audit logs error:",
                error,
            );

            return errorResponse(
                res,
                getErrorStatusCode(
                    error,
                    400,
                ),
                error.message ||
                "Failed to fetch periodic test mark audit logs",
            );
        }
    };