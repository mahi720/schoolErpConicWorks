import {
    deleteStudentAttendanceService,
    getAttendanceLogsService,
    getAttendanceStudentsService,
    getMonthlyAttendanceService,
    lockStudentAttendanceService,
    markStudentAttendanceService,
    restoreStudentAttendanceService,
    unlockStudentAttendanceService,
    updateStudentAttendanceService,
} from "../../../services/academic/studentAttendance/studentAttendanceService.js";

import {
    attendanceLogsQuerySchema,
    attendanceStudentFilterSchema,
    monthlyAttendanceQuerySchema,
} from "../../../validations/academic/studentAttendance/studentAttendanceValidation.js";

import {
    errorResponse,
    successResponse,
} from "../../../utils/apiResponse.js";

const getRequestMeta = (req) => {
    return {
        ipAddress:
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            req.ip ||
            null,

        userAgent: req.headers["user-agent"] || null,
    };
};

const getErrorStatusCode = (error) => {
    return error.statusCode || 400;
};

export const getAttendanceStudentsController = async (req, res) => {
    try {
        const result = attendanceStudentFilterSchema.safeParse(
            req.query,
        );

        if (!result.success) {
            return errorResponse(
                res,
                400,
                "Validation failed",
                result.error.flatten().fieldErrors,
            );
        }

        const students = await getAttendanceStudentsService({
            filters: result.data,
            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Attendance students fetched successfully",
            students,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const markStudentAttendanceController = async (req, res) => {
    try {
        const attendance = await markStudentAttendanceService({
            payload: req.body,
            user: req.user,
            requestMeta: {
                ipAddress:
                    req.ip ||
                    req.socket?.remoteAddress ||
                    null,

                userAgent:
                    req.headers["user-agent"] ||
                    null,
            },
        });

        return successResponse(
            res,
            201,
            "Attendance marked successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const updateStudentAttendanceController = async (
    req,
    res,
) => {
    try {
        const attendance = await updateStudentAttendanceService({
            daySlug: req.params.daySlug,
            payload: req.body,
            user: req.user,
            requestMeta: getRequestMeta(req),
        });

        return successResponse(
            res,
            200,
            "Attendance updated successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const deleteStudentAttendanceController = async (
    req,
    res,
) => {
    try {
        const attendance = await deleteStudentAttendanceService({
            daySlug: req.params.daySlug,
            payload: req.body,
            user: req.user,
            requestMeta: getRequestMeta(req),
        });

        return successResponse(
            res,
            200,
            "Attendance deleted successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const restoreStudentAttendanceController = async (
    req,
    res,
) => {
    try {
        const attendance = await restoreStudentAttendanceService({
            daySlug: req.params.daySlug,
            payload: req.body,
            user: req.user,
            requestMeta: getRequestMeta(req),
        });

        return successResponse(
            res,
            200,
            "Attendance restored successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const lockStudentAttendanceController = async (
    req,
    res,
) => {
    try {
        const attendance = await lockStudentAttendanceService({
            daySlug: req.params.daySlug,
            payload: req.body,
            user: req.user,
            requestMeta: getRequestMeta(req),
        });

        return successResponse(
            res,
            200,
            "Attendance locked successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const unlockStudentAttendanceController = async (
    req,
    res,
) => {
    try {
        const attendance = await unlockStudentAttendanceService({
            daySlug: req.params.daySlug,
            payload: req.body,
            user: req.user,
            requestMeta: getRequestMeta(req),
        });

        return successResponse(
            res,
            200,
            "Attendance unlocked successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const getMonthlyAttendanceController = async (
    req,
    res,
) => {
    try {
        const result = monthlyAttendanceQuerySchema.safeParse(
            req.query,
        );

        if (!result.success) {
            return errorResponse(
                res,
                400,
                "Validation failed",
                result.error.flatten().fieldErrors,
            );
        }

        const attendance = await getMonthlyAttendanceService({
            query: result.data,
            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Monthly attendance fetched successfully",
            attendance,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};

export const getAttendanceLogsController = async (
    req,
    res,
) => {
    try {
        const result = attendanceLogsQuerySchema.safeParse(
            req.query,
        );

        if (!result.success) {
            return errorResponse(
                res,
                400,
                "Validation failed",
                result.error.flatten().fieldErrors,
            );
        }

        const logs = await getAttendanceLogsService({
            attendanceSlug: req.params.attendanceSlug,
            query: result.data,
            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Attendance logs fetched successfully",
            logs,
        );
    } catch (error) {
        return errorResponse(
            res,
            getErrorStatusCode(error),
            error.message,
        );
    }
};