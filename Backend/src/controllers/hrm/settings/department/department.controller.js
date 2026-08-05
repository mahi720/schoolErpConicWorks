import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createDepartmentService,
    getDepartmentsService,
    getDepartmentBySlugService,
    updateDepartmentService,
    deleteDepartmentService,
    restoreDepartmentService,
} from "../../../../services/hrm/settings/department/department.service.js";

export const createDepartmentController = async (req, res) => {
    try {
        const data = await createDepartmentService({
            schoolSlug: req.user.schoolSlug,
            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Department created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getDepartmentsController = async (req, res) => {
    try {
        const data = await getDepartmentsService({
            schoolSlug: req.user.schoolSlug,
            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Departments fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getDepartmentBySlugController = async (
    req,
    res,
) => {
    try {
        const data = await getDepartmentBySlugService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Department fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateDepartmentController = async (req, res) => {
    try {
        const data = await updateDepartmentService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
            payload: req.body,
        });

        return successResponse(
            res,
            200,
            "Department updated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteDepartmentController = async (req, res) => {
    try {
        const data = await deleteDepartmentService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Department inactivated successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreDepartmentController = async (req, res) => {
    try {
        const data = await restoreDepartmentService({
            schoolSlug: req.user.schoolSlug,
            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Department restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};