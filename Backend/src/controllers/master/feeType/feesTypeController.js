import {
    createFeeTypeService,
    getFeeTypesService,
    getFeeTypeBySlugService,
    updateFeeTypeService,
    deleteFeeTypeService,
    restoreFeeTypeService,
} from "../../../services/master/feeType/feeType.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createFeeType = async (
    req,
    res
) => {
    try {
        const data = await createFeeTypeService(
            req.body,
            req.user
        );

        return successResponse(
            res,
            201,
            "Fee type created successfully",
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

export const getFeeTypes = async (
    req,
    res
) => {
    try {
        const data = await getFeeTypesService(
            req.query,
            req.user
        );

        return successResponse(
            res,
            200,
            "Fee types fetched successfully",
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

export const getFeeTypeBySlug = async (
    req,
    res
) => {
    try {
        const data =
            await getFeeTypeBySlugService(
                req.params.slug,
                req.user
            );

        return successResponse(
            res,
            200,
            "Fee type fetched successfully",
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

export const updateFeeType = async (
    req,
    res
) => {
    try {
        const data = await updateFeeTypeService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(
            res,
            200,
            "Fee type updated successfully",
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

export const deleteFeeType = async (
    req,
    res
) => {
    try {
        const data = await deleteFeeTypeService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Fee type deleted successfully",
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

export const restoreFeeType = async (
    req,
    res
) => {
    try {
        const data = await restoreFeeTypeService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Fee type restored successfully",
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