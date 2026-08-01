import {
    getTermExamMarkStudentsService,
    saveTermExamMarksService,
    bulkUpdateTermExamMarksService,
    getTermExamSubmissionService,
    lockTermExamMarksService,
    unlockTermExamMarksService,
    deleteTermExamMarksService,
    restoreTermExamMarksService,
    getTermExamMarkAuditLogsService,
} from "../../../../services/examManager/markSubmission/termExamMarkSubmission/termExamMarkSubmission.service.js";

import {
    getTermExamRequestMetadata,
    getTermExamAuditActorSnapshot,
} from "../../../../utils/termExamMarkAuditHelper.js";

import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

const getControllerContext = (
    req,
) => {
    return {
        user: req.user,

        actor:
            getTermExamAuditActorSnapshot(
                req.user,
            ),

        requestMetadata:
            getTermExamRequestMetadata(
                req,
            ),
    };
};

const sendControllerError = ({
    res,
    error,
    fallbackMessage,
    fallbackStatus = 400,
}) => {
    return errorResponse(
        res,
        error.statusCode ||
        fallbackStatus,
        error.message ||
        fallbackMessage,
    );
};

export const getTermExamMarkStudentsController =
    async (req, res) => {
        try {
            const data =
                await getTermExamMarkStudentsService({
                    ...getControllerContext(
                        req,
                    ),

                    query: req.query,
                });

            return successResponse(
                res,
                200,
                "Term exam students fetched successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Get term exam students error:",
                error,
            );

            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to fetch term exam students",
            });
        }
    };

export const saveTermExamMarksController =
    async (req, res) => {
        try {
            const data =
                await saveTermExamMarksService({
                    ...getControllerContext(
                        req,
                    ),

                    payload: req.body,
                });

            return successResponse(
                res,
                200,
                "Term exam marks saved successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Save term exam marks error:",
                error,
            );

            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to save term exam marks",
            });
        }
    };

export const bulkUpdateTermExamMarksController =
    async (req, res) => {
        try {
            const data =
                await bulkUpdateTermExamMarksService({
                    ...getControllerContext(
                        req,
                    ),

                    submissionSlug:
                        req.params.slug,

                    payload: req.body,
                });

            return successResponse(
                res,
                200,
                "Term exam marks updated successfully",
                data,
            );
        } catch (error) {
            console.error(
                "Bulk update term exam marks error:",
                error,
            );

            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to update term exam marks",
            });
        }
    };

export const getTermExamSubmissionController =
    async (req, res) => {
        try {
            const data =
                await getTermExamSubmissionService({
                    user: req.user,

                    submissionSlug:
                        req.params.slug,

                    actor:
                        getTermExamAuditActorSnapshot(
                            req.user,
                        ),

                    requestMetadata:
                        getTermExamRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Term exam mark submission fetched successfully",
                data,
            );
        } catch (error) {
            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to fetch term exam mark submission",
                fallbackStatus: 404,
            });
        }
    };

export const lockTermExamMarksController =
    async (req, res) => {
        try {
            const data =
                await lockTermExamMarksService({
                    ...getControllerContext(
                        req,
                    ),

                    submissionSlug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Term exam marks locked successfully",
                data,
            );
        } catch (error) {
            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to lock term exam marks",
            });
        }
    };

export const unlockTermExamMarksController =
    async (req, res) => {
        try {
            const data =
                await unlockTermExamMarksService({
                    ...getControllerContext(
                        req,
                    ),

                    submissionSlug:
                        req.params.slug,

                    remarks:
                        req.body.remarks,
                });

            return successResponse(
                res,
                200,
                "Term exam marks unlocked successfully",
                data,
            );
        } catch (error) {
            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to unlock term exam marks",
            });
        }
    };

export const deleteTermExamMarksController =
    async (req, res) => {
        try {
            const data =
                await deleteTermExamMarksService({
                    ...getControllerContext(
                        req,
                    ),

                    submissionSlug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Term exam marks deleted successfully",
                data,
            );
        } catch (error) {
            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to delete term exam marks",
            });
        }
    };

export const restoreTermExamMarksController =
    async (req, res) => {
        try {
            const data =
                await restoreTermExamMarksService({
                    ...getControllerContext(
                        req,
                    ),

                    submissionSlug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Term exam marks restored successfully",
                data,
            );
        } catch (error) {
            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to restore term exam marks",
            });
        }
    };

export const getTermExamMarkAuditLogsController =
    async (req, res) => {
        try {
            const data =
                await getTermExamMarkAuditLogsService({
                    user: req.user,
                    query: req.query,
                });

            return successResponse(
                res,
                200,
                "Term exam mark audit logs fetched successfully",
                data,
            );
        } catch (error) {
            return sendControllerError({
                res,
                error,
                fallbackMessage:
                    "Failed to fetch term exam mark audit logs",
            });
        }
    };