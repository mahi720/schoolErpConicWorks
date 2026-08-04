import {
    getCoScholasticStudentsService,
    saveCoScholasticGradesService,
    bulkUpdateCoScholasticGradesService,
    getCoScholasticSubmissionService,
    lockCoScholasticGradesService,
    unlockCoScholasticGradesService,
    deleteCoScholasticGradesService,
    restoreCoScholasticGradesService,
    getCoScholasticAuditLogsService,
} from "../../../../services/examManager/markSubmission/coScholasticGradeSubmission/coScholasticGradeSubmission.service.js";

import {
    getCoScholasticRequestMetadata,
    getCoScholasticAuditActor,
} from "../../../../utils/coScholasticGradeAuditHelper.js";

import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

const getContext = (req) => ({
    user: req.user,
    actor: getCoScholasticAuditActor(req.user),
    requestMetadata: getCoScholasticRequestMetadata(req),
});

const sendError = ({ res, error, fallbackMessage, fallbackStatus = 400 }) => {
    return errorResponse(
        res,
        error.statusCode || fallbackStatus,
        error.message || fallbackMessage,
    );
};

export const getCoScholasticStudentsController = async (req, res) => {
    try {
        const data = await getCoScholasticStudentsService({
            ...getContext(req),
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic students fetched successfully",
            data,
        );
    } catch (error) {
        console.error("Get Co-Scholastic students error:", error);

        return sendError({
            res,
            error,
            fallbackMessage: "Failed to fetch Co-Scholastic students",
        });
    }
};

export const saveCoScholasticGradesController = async (req, res) => {
    try {
        const data = await saveCoScholasticGradesService({
            ...getContext(req),
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grades saved successfully",
            data,
        );
    } catch (error) {
        console.error("Save Co-Scholastic grades error:", error);

        return sendError({
            res,
            error,
            fallbackMessage: "Failed to save Co-Scholastic grades",
        });
    }
};

export const bulkUpdateCoScholasticGradesController = async (req, res) => {
    try {
        const data = await bulkUpdateCoScholasticGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grades updated successfully",
            data,
        );
    } catch (error) {
        console.error("Update Co-Scholastic grades error:", error);

        return sendError({
            res,
            error,
            fallbackMessage: "Failed to update Co-Scholastic grades",
        });
    }
};

export const getCoScholasticSubmissionController = async (req, res) => {
    try {
        const data = await getCoScholasticSubmissionService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grade submission fetched successfully",
            data,
        );
    } catch (error) {
        return sendError({
            res,
            error,
            fallbackMessage: "Failed to fetch Co-Scholastic grade submission",
            fallbackStatus: 404,
        });
    }
};

export const lockCoScholasticGradesController = async (req, res) => {
    try {
        const data = await lockCoScholasticGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grades locked successfully",
            data,
        );
    } catch (error) {
        return sendError({
            res,
            error,
            fallbackMessage: "Failed to lock Co-Scholastic grades",
        });
    }
};

export const unlockCoScholasticGradesController = async (req, res) => {
    try {
        const data = await unlockCoScholasticGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
            remarks: req.body.remarks,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grades unlocked successfully",
            data,
        );
    } catch (error) {
        return sendError({
            res,
            error,
            fallbackMessage: "Failed to unlock Co-Scholastic grades",
        });
    }
};

export const deleteCoScholasticGradesController = async (req, res) => {
    try {
        const data = await deleteCoScholasticGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grades deleted successfully",
            data,
        );
    } catch (error) {
        return sendError({
            res,
            error,
            fallbackMessage: "Failed to delete Co-Scholastic grades",
        });
    }
};

export const restoreCoScholasticGradesController = async (req, res) => {
    try {
        const data = await restoreCoScholasticGradesService({
            ...getContext(req),
            submissionSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grades restored successfully",
            data,
        );
    } catch (error) {
        return sendError({
            res,
            error,
            fallbackMessage: "Failed to restore Co-Scholastic grades",
        });
    }
};

export const getCoScholasticAuditLogsController = async (req, res) => {
    try {
        const data = await getCoScholasticAuditLogsService({
            user: req.user,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Co-Scholastic grade audit logs fetched successfully",
            data,
        );
    } catch (error) {
        return sendError({
            res,
            error,
            fallbackMessage: "Failed to fetch Co-Scholastic grade audit logs",
        });
    }
};
