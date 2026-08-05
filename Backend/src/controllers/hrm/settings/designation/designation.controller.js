import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createDesignationService,
    getDesignationsService,
    getDesignationBySlugService,
    updateDesignationService,
    deleteDesignationService,
    restoreDesignationService,
} from "../../../../services/hrm/settings/designation/designation.service.js";

export const createDesignationController = async (req, res) => {
    try {
        const data = await createDesignationService({
            schoolSlug: req.user.schoolSlug,
            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Designation created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getDesignationsController = async (req, res) => {
    try {
        const data = await getDesignationsService({
            schoolSlug: req.user.schoolSlug,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Designations fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getDesignationBySlugController = async (
    req,
    res,
) => {
    try {
        const data = await getDesignationBySlugService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Designation fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateDesignationController = async (req, res) => {
    try {
        const data = await updateDesignationService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Designation updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteDesignationController = async (req, res) => {
    try {
        const data = await deleteDesignationService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Designation inactivated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreDesignationController = async (req, res) => {
    try {
        const data = await restoreDesignationService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Designation restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};