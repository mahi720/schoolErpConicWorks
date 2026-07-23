import {
    createWeeklyPlanService,
    getWeeklyPlansService,
    getWeeklyPlanBySlugService,
    updateWeeklyPlanService,
    deleteWeeklyPlanService,
    restoreWeeklyPlanService,
} from "../../../services/academic/weeklyPlan/weeklyPlan.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

// Create weekly plan
export const createWeeklyPlanController = async (req, res) => {
    try {
        const data = await createWeeklyPlanService({
            schoolSlug: req.user?.schoolSlug,
            userSlug: req.user?.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Weekly plan created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

// Get weekly plans
export const getWeeklyPlansController = async (req, res) => {
    try {
        const data = await getWeeklyPlansService({
            schoolSlug: req.user?.schoolSlug,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Weekly plans fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

// Get weekly plan
export const getWeeklyPlanBySlugController = async (req, res) => {
    try {
        const data = await getWeeklyPlanBySlugService({
            slug: req.params.slug,
            schoolSlug: req.user?.schoolSlug,
        });

        return successResponse(
            res,
            200,
            "Weekly plan fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

// Update weekly plan
export const updateWeeklyPlanController = async (req, res) => {
    try {
        const data = await updateWeeklyPlanService({
            slug: req.params.slug,
            schoolSlug: req.user?.schoolSlug,
            userSlug: req.user?.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Weekly plan updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

// Delete weekly plan
export const deleteWeeklyPlanController = async (req, res) => {
    try {
        const data = await deleteWeeklyPlanService({
            slug: req.params.slug,
            schoolSlug: req.user?.schoolSlug,
        });

        return successResponse(
            res,
            200,
            "Weekly plan deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

// Restore weekly plan
export const restoreWeeklyPlanController = async (req, res) => {
    try {
        const data = await restoreWeeklyPlanService({
            slug: req.params.slug,
            schoolSlug: req.user?.schoolSlug,
        });

        return successResponse(
            res,
            200,
            "Weekly plan restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};