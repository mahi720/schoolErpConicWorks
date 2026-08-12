import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

import {
    getEmployeeAttendancesService,
    getAttendanceDashboardService,
    markEmployeePresentService,
    markEmployeeAbsentService,
    updateEmployeeAttendanceService,
    lockEmployeeAttendanceService,
    unlockEmployeeAttendanceService,
    getEmployeeAttendanceLogsService,
    getYearlyAttendanceReportService,
    bulkSaveEmployeeAttendanceService,
    importEmployeeAttendanceService,
    getMonthlyAttendanceReportService,

    getEmployeeMonthlyReconciliationService,
    lockReconciliationAttendanceService,
    getNoPunchReportService,
} from "../../../services/HRM/attendance/employeeAttendance.service.js";

const getRequestMetadata =
    (req) => {
        const forwardedFor =
            req.headers[
            "x-forwarded-for"
            ];

        const ipAddress =
            typeof forwardedFor ===
                "string"
                ? forwardedFor
                    .split(",")[0]
                    .trim()
                : req.ip ||
                req.socket
                    ?.remoteAddress ||
                null;

        return {
            ipAddress,

            userAgent:
                req.headers[
                "user-agent"
                ] ||
                null,
        };
    };

export const getEmployeeAttendancesController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEmployeeAttendancesService({
                    schoolSlug:
                        req.user.schoolSlug,

                    date:
                        req.query.date,
                });

            return successResponse(
                res,
                200,
                "Employee attendance fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const getAttendanceDashboardController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getAttendanceDashboardService({
                    schoolSlug:
                        req.user.schoolSlug,

                    date:
                        req.query.date,
                });

            return successResponse(
                res,
                200,
                "Attendance dashboard fetched successfully",
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

export const markEmployeePresentController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await markEmployeePresentService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params
                            .employeeSlug,

                    payload:
                        req.body,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Employee marked present successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const markEmployeeAbsentController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await markEmployeeAbsentService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params
                            .employeeSlug,

                    payload:
                        req.body,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Employee marked absent successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const updateEmployeeAttendanceController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await updateEmployeeAttendanceService({
                    schoolSlug:
                        req.user.schoolSlug,

                    attendanceSlug:
                        req.params
                            .attendanceSlug,

                    payload:
                        req.body,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Attendance updated successfully",
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

export const lockEmployeeAttendanceController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await lockEmployeeAttendanceService({
                    schoolSlug:
                        req.user.schoolSlug,

                    payload:
                        req.body,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Attendance locked successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const unlockEmployeeAttendanceController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await unlockEmployeeAttendanceService({
                    schoolSlug:
                        req.user.schoolSlug,

                    payload:
                        req.body,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Attendance unlocked successfully",
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

export const getEmployeeAttendanceLogsController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEmployeeAttendanceLogsService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.query
                            .employeeSlug,

                    date:
                        req.query.date,
                });

            return successResponse(
                res,
                200,
                "Attendance logs fetched successfully",
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

export const getYearlyAttendanceReportController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getYearlyAttendanceReportService({
                    schoolSlug:
                        req.user.schoolSlug,

                    sessionSlug:
                        req.query.sessionSlug,
                });

            return successResponse(
                res,
                200,
                "Yearly attendance report fetched successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const getMonthlyAttendanceReportController =
    async (req, res) => {
        try {
            const data =
                await getMonthlyAttendanceReportService({
                    schoolSlug:
                        req.user.schoolSlug,

                    year:
                        req.query.year,

                    month:
                        req.query.month,
                });

            return successResponse(
                res,
                200,
                "Monthly attendance report fetched successfully",
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

export const getEmployeeMonthlyReconciliationController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEmployeeMonthlyReconciliationService({
                    schoolSlug:
                        req.user.schoolSlug,

                    employeeSlug:
                        req.params.employeeSlug,

                    year:
                        req.query.year,

                    month:
                        req.query.month,
                });

            return successResponse(
                res,
                200,
                "Employee reconciliation fetched successfully",
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

export const lockReconciliationAttendanceController =
    async (
        req,
        res,
    ) => {
        try {
            await lockReconciliationAttendanceService({
                schoolSlug:
                    req.user.schoolSlug,

                attendanceSlug:
                    req.params.attendanceSlug,

                user:
                    req.user,

                metadata:
                    getRequestMetadata(
                        req,
                    ),
            });

            return successResponse(
                res,
                200,
                "Attendance locked successfully",
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

export const bulkSaveEmployeeAttendanceController =
    async (req, res) => {
        try {
            const data =
                await bulkSaveEmployeeAttendanceService({
                    schoolSlug:
                        req.user.schoolSlug,

                    payload:
                        req.body,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                "Employee attendance saved successfully",
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const importEmployeeAttendanceController =
    async (
        req,
        res,
    ) => {
        try {
            if (!req.file) {
                return errorResponse(
                    res,
                    400,
                    "Excel file is required",
                );
            }

            const data =
                await importEmployeeAttendanceService({
                    schoolSlug:
                        req.user.schoolSlug,

                    fileBuffer:
                        req.file.buffer,

                    user:
                        req.user,

                    metadata:
                        getRequestMetadata(
                            req,
                        ),
                });

            return successResponse(
                res,
                200,
                `${data.successCount} attendance records imported, ${data.failedCount} failed`,
                data,
            );
        } catch (error) {
            return errorResponse(
                res,
                400,
                error.message,
                error.details ||
                null,
            );
        }
    };

export const getNoPunchReportController =
    async (req, res) => {
        try {
            const data =
                await getNoPunchReportService({
                    schoolSlug:
                        req.user.schoolSlug,

                    month:
                        req.query.month,

                    year:
                        req.query.year,
                });

            return successResponse(
                res,
                200,
                "No punch report fetched successfully",
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