import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

import {
    getEmployeePayrollsService,
    getEmployeePayrollDetailService,
    saveEmployeePayrollsService,
    lockEmployeePayrollsService,
    unlockEmployeePayrollsService,
    markEmployeePayrollsPaidService,
    getPayrollLogsService,
    getSalaryStatementService,
    getBankStatementService,
} from "../../../services/HRM/salary/employeePayroll.service.js";

const getRequestMetadata = (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];

    const ipAddress =
        typeof forwardedFor === "string"
            ? forwardedFor.split(",")[0].trim()
            : req.ip || req.socket?.remoteAddress || null;

    return {
        ipAddress,

        userAgent: req.headers["user-agent"] || null,
    };
};

export const getEmployeePayrollsController = async (req, res) => {
    try {
        const data = await getEmployeePayrollsService({
            schoolSlug: req.user.schoolSlug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Employee salaries fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message, error.details || null);
    }
};

export const getEmployeePayrollDetailController = async (req, res) => {
    try {
        const data = await getEmployeePayrollDetailService({
            schoolSlug: req.user.schoolSlug,

            employeeSlug: req.params.employeeSlug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Employee salary detail fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message, error.details || null);
    }
};

export const saveEmployeePayrollsController = async (req, res) => {
    try {
        const data = await saveEmployeePayrollsService({
            schoolSlug: req.user.schoolSlug,

            payload: req.body,

            user: req.user,

            metadata: getRequestMetadata(req),
        });

        return successResponse(
            res,
            200,
            "Employee salaries saved successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message, error.details || null);
    }
};

export const lockEmployeePayrollsController = async (req, res) => {
    try {
        const data = await lockEmployeePayrollsService({
            schoolSlug: req.user.schoolSlug,

            payload: req.body,

            user: req.user,

            metadata: getRequestMetadata(req),
        });

        return successResponse(
            res,
            200,
            "Employee salaries locked successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message, error.details || null);
    }
};

export const unlockEmployeePayrollsController = async (req, res) => {
    try {
        const data = await unlockEmployeePayrollsService({
            schoolSlug: req.user.schoolSlug,

            payload: req.body,

            user: req.user,

            metadata: getRequestMetadata(req),
        });

        return successResponse(
            res,
            200,
            "Employee salaries unlocked successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message, error.details || null);
    }
};

export const markEmployeePayrollPaidController = async (req, res) => {
    try {
        const data = await markEmployeePayrollsPaidService({
            schoolSlug: req.user.schoolSlug,

            payload: req.body,

            user: req.user,

            metadata: getRequestMetadata(req),
        });

        return successResponse(
            res,
            200,
            "Employee salaries marked paid successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message, error.details || null);
    }
};

export const getEmployeePayrollLogsController = async (req, res) => {
    try {
        const data = await getPayrollLogsService({
            schoolSlug: req.user.schoolSlug,

            payrollSlug: req.params.payrollSlug,
        });

        return successResponse(res, 200, "Salary logs fetched successfully", data);
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getSalaryStatementController = async (req, res) => {
    try {
        const data = await getSalaryStatementService({
            schoolSlug: req.user.schoolSlug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Salary statement fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getBankStatementController = async (req, res) => {
    try {
        const data = await getBankStatementService({
            schoolSlug: req.user.schoolSlug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Bank statement fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};
