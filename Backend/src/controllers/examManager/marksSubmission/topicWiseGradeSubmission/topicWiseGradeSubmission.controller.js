import {
    getTopicWiseGradeStudentsService,
    saveTopicWiseGradesService,
    bulkUpdateTopicWiseGradesService,
    getTopicWiseGradeSubmissionService,
    lockTopicWiseGradesService,
    unlockTopicWiseGradesService,
    deleteTopicWiseGradesService,
    restoreTopicWiseGradesService,
    getTopicWiseGradeAuditLogsService,
} from "../../../../services/examManager/markSubmission/topicWiseGradeSubmission/topicWiseGradeSubmission.service.js";

import {
    getTopicWiseGradeRequestMetadata,
    getTopicWiseGradeAuditActor,
} from "../../../../utils/topicWiseGradeAuditHelper.js";

import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

const getContext = (req) => ({
    user: req.user,
    actor: getTopicWiseGradeAuditActor(req.user),
    requestMetadata: getTopicWiseGradeRequestMetadata(req),
});

const sendError = (res, error, fallbackMessage, fallbackStatus = 400) => {
    return errorResponse(
        res,
        error.statusCode || fallbackStatus,
        error.message || fallbackMessage,
    );
};

export const getTopicWiseGradeStudentsController = async (req, res) => {
    try {
        const data = await getTopicWiseGradeStudentsService({
            ...getContext(req),
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Topic wise grade students fetched successfully",
            data,
        );
    } catch (error) {
        console.error("Get topic wise grade students error:", error);

        return sendError(
            res,
            error,
            "Failed to fetch topic wise grade students",
        );
    }
};

export const saveTopicWiseGradesController = async (req, res) => {
    try {
        const data = await saveTopicWiseGradesService({
            ...getContext(req),
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Topic wise grades saved successfully",
            data,
        );
    } catch (error) {
        console.error("Save topic wise grades error:", error);

        return sendError(
            res,
            error,
            "Failed to save topic wise grades",
        );
    }
};

export const bulkUpdateTopicWiseGradesController = async (req, res) => {
    try {
        const data = await bulkUpdateTopicWiseGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Topic wise grades updated successfully",
            data,
        );
    } catch (error) {
        console.error("Update topic wise grades error:", error);

        return sendError(
            res,
            error,
            "Failed to update topic wise grades",
        );
    }
};

export const getTopicWiseGradeSubmissionController = async (req, res) => {
    try {
        const data = await getTopicWiseGradeSubmissionService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Topic wise grade submission fetched successfully",
            data,
        );
    } catch (error) {
        return sendError(
            res,
            error,
            "Failed to fetch topic wise grade submission",
            404,
        );
    }
};

export const lockTopicWiseGradesController = async (req, res) => {
    try {
        const data = await lockTopicWiseGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Topic wise grades locked successfully",
            data,
        );
    } catch (error) {
        return sendError(res, error, "Failed to lock topic wise grades");
    }
};

export const unlockTopicWiseGradesController = async (req, res) => {
    try {
        const data = await unlockTopicWiseGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
            remarks: req.body.remarks,
        });

        return successResponse(
            res,
            200,
            "Topic wise grades unlocked successfully",
            data,
        );
    } catch (error) {
        return sendError(res, error, "Failed to unlock topic wise grades");
    }
};

export const deleteTopicWiseGradesController = async (req, res) => {
    try {
        const data = await deleteTopicWiseGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Topic wise grades deleted successfully",
            data,
        );
    } catch (error) {
        return sendError(res, error, "Failed to delete topic wise grades");
    }
};

export const restoreTopicWiseGradesController = async (req, res) => {
    try {
        const data = await restoreTopicWiseGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Topic wise grades restored successfully",
            data,
        );
    } catch (error) {
        return sendError(res, error, "Failed to restore topic wise grades");
    }
};

export const getTopicWiseGradeAuditLogsController = async (req, res) => {
    try {
        const data = await getTopicWiseGradeAuditLogsService({
            user: req.user,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Topic wise grade audit logs fetched successfully",
            data,
        );
    } catch (error) {
        return sendError(
            res,
            error,
            "Failed to fetch topic wise grade audit logs",
        );
    }
};
