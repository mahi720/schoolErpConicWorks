import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createShiftService,
    getShiftsService,
    getShiftBySlugService,
    updateShiftService,
    deleteShiftService,
    restoreShiftService,
} from "../../../../services/hrm/settings/shift/shift.service.js";

export const createShiftController = async (req, res) => {
    try {
        const data = await createShiftService({
            schoolSlug: req.user.schoolSlug,
            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Shift created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getShiftsController = async (req, res) => {
    try {
        const data = await getShiftsService({
            schoolSlug: req.user.schoolSlug,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Shifts fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getShiftBySlugController = async (req, res) => {
    try {
        const data = await getShiftBySlugService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Shift fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateShiftController = async (req, res) => {
    try {
        const data = await updateShiftService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Shift updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteShiftController = async (req, res) => {
    try {
        const data = await deleteShiftService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Shift inactivated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreShiftController = async (req, res) => {
    try {
        const data = await restoreShiftService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Shift restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};