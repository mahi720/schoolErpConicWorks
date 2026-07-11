import {
    createSubjectMarksConfigService,
    getSubjectMarksConfigsService,
    getSubjectMarksConfigBySlugService,
    updateSubjectMarksConfigService,
    deleteSubjectMarksConfigService,
    restoreSubjectMarksConfigService,
} from "../../../services/master/subjectMarksConfig/subjectMarksConfig.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createSubjectMarksConfig = async (
    req,
    res
) => {
    try {
        const data =
            await createSubjectMarksConfigService(
                req.body,
                req.user
            );

        return successResponse(
            res,
            201,
            "Subject marks configuration created successfully",
            data
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};

export const getSubjectMarksConfigs = async (
    req,
    res
) => {
    try {
        const data =
            await getSubjectMarksConfigsService(
                req.query,
                req.user
            );

        return successResponse(
            res,
            200,
            "Subject marks configurations fetched successfully",
            data
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};

export const getSubjectMarksConfigBySlug = async (
    req,
    res
) => {
    try {
        const data =
            await getSubjectMarksConfigBySlugService(
                req.params.slug,
                req.user
            );

        return successResponse(
            res,
            200,
            "Subject marks configuration fetched successfully",
            data
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message
        );
    }
};

export const updateSubjectMarksConfig = async (
    req,
    res
) => {
    try {
        const data =
            await updateSubjectMarksConfigService(
                req.params.slug,
                req.body,
                req.user
            );

        return successResponse(
            res,
            200,
            "Subject marks configuration updated successfully",
            data
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};

export const deleteSubjectMarksConfig = async (
    req,
    res
) => {
    try {
        const data =
            await deleteSubjectMarksConfigService(
                req.params.slug,
                req.user
            );

        return successResponse(
            res,
            200,
            "Subject marks configuration deleted successfully",
            data
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};

export const restoreSubjectMarksConfig = async (
    req,
    res
) => {
    try {
        const data =
            await restoreSubjectMarksConfigService(
                req.params.slug,
                req.user
            );

        return successResponse(
            res,
            200,
            "Subject marks configuration restored successfully",
            data
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message
        );
    }
};