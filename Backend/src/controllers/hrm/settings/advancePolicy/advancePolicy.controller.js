import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createAdvancePolicyService,
    getAdvancePoliciesService,
    getAdvancePolicyBySlugService,
    updateAdvancePolicyService,
    deleteAdvancePolicyService,
    restoreAdvancePolicyService,
} from "../../../../services/HRM/settings/advancePolicy/advancePolicy.service.js";

export const createAdvancePolicyController = async (req, res) => {
    try {
        const data = await createAdvancePolicyService({
            schoolSlug: req.user.schoolSlug,

            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Advance policy created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAdvancePoliciesController = async (req, res) => {
    try {
        const data = await getAdvancePoliciesService({
            schoolSlug: req.user.schoolSlug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Advance policies fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAdvancePolicyBySlugController = async (req, res) => {
    try {
        const data = await getAdvancePolicyBySlugService({
            schoolSlug: req.user.schoolSlug,

            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Advance policy fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const updateAdvancePolicyController = async (req, res) => {
    try {
        const data = await updateAdvancePolicyService({
            schoolSlug: req.user.schoolSlug,

            slug: req.params.slug,

            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Advance policy updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteAdvancePolicyController = async (req, res) => {
    try {
        const data = await deleteAdvancePolicyService({
            schoolSlug: req.user.schoolSlug,

            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Advance policy deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreAdvancePolicyController = async (req, res) => {
    try {
        const data = await restoreAdvancePolicyService({
            schoolSlug: req.user.schoolSlug,

            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Advance policy restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};
