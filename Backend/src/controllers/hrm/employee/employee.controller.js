import {
    createEmployeeService,
    getEmployeesService,
    getEmployeeBySlugService,
    updateEmployeeService,
    deleteEmployeeService,
    restoreEmployeeService,
    updateEmployeeLoginSettingService,
    createEmployeeLoginService,
    updateEmployeeLoginAccessService,
    transferEmployeeService
} from "../../../services/HRM/employee/employee.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const createEmployeeController = async (
    req,
    res,
) => {
    try {
        const schoolSlug =
            req.user.schoolSlug;

        const schoolCode =
            req.user.schoolCode;

        const data =
            await createEmployeeService({
                schoolSlug,
                schoolCode,
                payload: req.body,
            });

        return successResponse(
            res,
            201,
            "Employee created successfully",
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

export const getEmployeesController = async (
    req,
    res,
) => {
    try {
        const data =
            await getEmployeesService({
                schoolSlug:
                    req.user.schoolSlug,

                query: req.query,
            });

        return successResponse(
            res,
            200,
            "Employees fetched successfully",
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

export const getEmployeeBySlugController = async (
    req,
    res,
) => {
    try {
        const data =
            await getEmployeeBySlugService({
                schoolSlug:
                    req.user.schoolSlug,

                slug: req.params.slug,
            });

        return successResponse(
            res,
            200,
            "Employee fetched successfully",
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

export const updateEmployeeController = async (
    req,
    res,
) => {
    try {
        const data =
            await updateEmployeeService({
                schoolSlug:
                    req.user.schoolSlug,

                slug: req.params.slug,

                payload: req.body,
            });

        return successResponse(
            res,
            200,
            "Employee updated successfully",
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

export const deleteEmployeeController = async (
    req,
    res,
) => {
    try {
        await deleteEmployeeService({
            schoolSlug:
                req.user.schoolSlug,

            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Employee deleted successfully",
            null,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const restoreEmployeeController = async (
    req,
    res,
) => {
    try {
        await restoreEmployeeService({
            schoolSlug:
                req.user.schoolSlug,

            slug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Employee restored successfully",
            null,
        );
    } catch (error) {
        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const updateEmployeeLoginSettingController =
    async (req, res) => {
        try {
            const data =
                await updateEmployeeLoginSettingService(
                    {
                        schoolSlug:
                            req.user.schoolSlug,

                        slug:
                            req.params.slug,

                        payload:
                            req.body,
                    },
                );

            return successResponse(
                res,
                200,
                "Employee login setting updated successfully",
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

export const createEmployeeLoginController =
    async (req, res) => {
        try {
            const data =
                await createEmployeeLoginService({
                    schoolSlug:
                        req.user.schoolSlug,

                    schoolCode:
                        req.user.schoolCode,

                    slug:
                        req.params.slug,

                    payload:
                        req.body,
                });

            return successResponse(
                res,
                201,
                "Employee login account created successfully",
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

export const updateEmployeeLoginAccessController =
    async (req, res) => {
        try {
            const data =
                await updateEmployeeLoginAccessService(
                    {
                        schoolSlug:
                            req.user.schoolSlug,

                        slug:
                            req.params.slug,

                        isActive:
                            req.body.isActive,
                    },
                );

            return successResponse(
                res,
                200,
                req.body.isActive
                    ? "Employee login enabled successfully"
                    : "Employee login disabled successfully",
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

export const transferEmployeeController = async (
    req,
    res,
) => {
    try {
        const data =
            await transferEmployeeService({
                schoolSlug:
                    req.user.schoolSlug,

                slug:
                    req.params.slug,

                payload:
                    req.body,
            });

        return successResponse(
            res,
            201,
            "Employee transferred successfully",
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