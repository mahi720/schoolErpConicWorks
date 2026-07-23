import {
    getDailyAttendanceReportService,
    getMonthlyAttendanceReportService,
    getStudentDayWiseReportService,
} from "../../../services/academic/studentAttendance/studentAttendanceReport.service.js";

import {
    successResponse,
    errorResponse,
} from "../../../utils/apiResponse.js";

export const getDailyAttendanceReportController = async (
    req,
    res,
) => {
    try {
        const report = await getDailyAttendanceReportService({
            query: req.query,
            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Daily attendance report fetched successfully",
            report,
        );
    } catch (error) {
        return errorResponse(
            res,
            error.statusCode || 400,
            error.message,
        );
    }
};

export const getMonthlyAttendanceReportController = async (
    req,
    res,
) => {
    try {
        const report = await getMonthlyAttendanceReportService({
            query: req.query,
            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Monthly attendance report fetched successfully",
            report,
        );
    } catch (error) {
        return errorResponse(
            res,
            error.statusCode || 400,
            error.message,
        );
    }
};

export const getStudentDayWiseReportController = async (
    req,
    res,
) => {
    try {
        const report = await getStudentDayWiseReportService({
            params: req.params,
            query: req.query,
            user: req.user,
        });

        return successResponse(
            res,
            200,
            "Student day-wise attendance report fetched successfully",
            report,
        );
    } catch (error) {
        return errorResponse(
            res,
            error.statusCode || 400,
            error.message,
        );
    }
};