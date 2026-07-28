import {
    createStudentHealthAssessmentService,
    getStudentHealthAssessmentBySlugService,
    getStudentHealthAssessmentByStudentService,
    updateStudentHealthAssessmentService,
    deleteStudentHealthAssessmentService,
    restoreStudentHealthAssessmentService,
} from "../../../services/academic/studentHealthManagement/studentHealthAssessment.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createStudentHealthAssessmentController = async (
    req,
    res,
) => {
    try {
        const data =
            await createStudentHealthAssessmentService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            "Student health assessment created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getStudentHealthAssessmentBySlugController =
    async (req, res) => {
        try {
            const data =
                await getStudentHealthAssessmentBySlugService(
                    req.params.slug,
                    req.user,
                );

            return successResponse(
                res,
                200,
                "Student health assessment fetched successfully",
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

export const getStudentHealthAssessmentByStudentController =
    async (req, res) => {
        try {
            const data =
                await getStudentHealthAssessmentByStudentService(
                    req.query,
                    req.user,
                );

            return successResponse(
                res,
                200,
                data
                    ? "Student health assessment fetched successfully"
                    : "Student health assessment not added yet",
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

export const updateStudentHealthAssessmentController = async (
    req,
    res,
) => {
    try {
        const data =
            await updateStudentHealthAssessmentService(
                req.params.slug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student health assessment updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteStudentHealthAssessmentController = async (
    req,
    res,
) => {
    try {
        const data =
            await deleteStudentHealthAssessmentService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student health assessment deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreStudentHealthAssessmentController = async (
    req,
    res,
) => {
    try {
        const data =
            await restoreStudentHealthAssessmentService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Student health assessment restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};