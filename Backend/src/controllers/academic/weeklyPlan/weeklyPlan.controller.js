import {
    createWeeklyPlanService,
    getWeeklyPlansService,
    getWeeklyPlanBySlugService,
    updateWeeklyPlanService,
    deleteWeeklyPlanService,
    restoreWeeklyPlanService,
    deleteWeeklyPlanLessonService,
} from "../../../services/academic/weeklyPlan/weeklyPlan.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createWeeklyPlanController = async (
    req,
    res,
) => {
    try {
        const weeklyPlan =
            await createWeeklyPlanService(
                req.body,
                req.user,
            );

        return successResponse(
            res,
            201,
            "Weekly plan created successfully",
            weeklyPlan,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getWeeklyPlansController = async (
    req,
    res,
) => {
    try {
        const weeklyPlans =
            await getWeeklyPlansService(
                req.query,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Weekly plans fetched successfully",
            weeklyPlans,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const getWeeklyPlanBySlugController = async (
    req,
    res,
) => {
    try {
        const weeklyPlan =
            await getWeeklyPlanBySlugService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Weekly plan fetched successfully",
            weeklyPlan,
        );
    } catch (error) {
        return errorResponse(
            res,
            404,
            error.message,
        );
    }
};

export const updateWeeklyPlanController = async (
    req,
    res,
) => {
    try {
        const weeklyPlan =
            await updateWeeklyPlanService(
                req.params.slug,
                req.body,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Weekly plan updated successfully",
            weeklyPlan,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const deleteWeeklyPlanController = async (
    req,
    res,
) => {
    try {
        const weeklyPlan =
            await deleteWeeklyPlanService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Weekly plan deleted successfully",
            weeklyPlan,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const restoreWeeklyPlanController = async (
    req,
    res,
) => {
    try {
        const weeklyPlan =
            await restoreWeeklyPlanService(
                req.params.slug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Weekly plan restored successfully",
            weeklyPlan,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const deleteWeeklyPlanLessonController = async (
    req,
    res,
) => {
    try {
        const result =
            await deleteWeeklyPlanLessonService(
                req.params.weeklyPlanSlug,
                req.params.lessonSlug,
                req.user,
            );

        return successResponse(
            res,
            200,
            "Weekly plan lesson deleted successfully",
            result,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};