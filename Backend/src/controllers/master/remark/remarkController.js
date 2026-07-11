import {
    createRemarkService,
    getRemarksService,
    getRemarkBySlugService,
    updateRemarkService,
    deleteRemarkService,
    restoreRemarkService,
} from "../../../services/master/remark/remark.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createRemark = async (
    req,
    res,
) => {
    try {
        const data =
            await createRemarkService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            "Remark created successfully",
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

export const getRemarks = async (
    req,
    res,
) => {
    try {
        const data =
            await getRemarksService(
                req.query,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Remarks fetched successfully",
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

export const getRemarkBySlug = async (
    req,
    res,
) => {
    try {
        const data =
            await getRemarkBySlugService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Remark fetched successfully",
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

export const updateRemark = async (
    req,
    res,
) => {
    try {
        const data =
            await updateRemarkService(
                req.params.slug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Remark updated successfully",
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

export const deleteRemark = async (
    req,
    res,
) => {
    try {
        const data =
            await deleteRemarkService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Remark deleted successfully",
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

export const restoreRemark = async (
    req,
    res,
) => {
    try {
        const data =
            await restoreRemarkService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Remark restored successfully",
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