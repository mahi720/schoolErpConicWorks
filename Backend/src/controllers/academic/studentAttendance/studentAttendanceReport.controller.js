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
        const { academicMappingSlug } = req.params;

        // console.log(
        //     "Student day-wise academicMappingSlug:",
        //     academicMappingSlug,
        // );

        if (!academicMappingSlug) {
            return errorResponse(
                res,
                400,
                "Academic mapping slug is required",
            );
        }

        const report =
            await getStudentDayWiseReportService({
                user: req.user,
                academicMappingSlug,
                query: req.query,
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
            400,
            error.message,
        );
    }
};