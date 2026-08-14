import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createEmployeeLeaveRequestService,
    bulkCreateEmployeeLeaveRequestService,
    getEmployeeLeaveRequestsService,
    getEmployeeLeaveRequestBySlugService,
    approveEmployeeLeaveRequestService,
    bulkApproveEmployeeLeaveRequestService,
    rejectEmployeeLeaveRequestService,
    deleteEmployeeLeaveRequestService,
    restoreEmployeeLeaveRequestService,
    getEmployeeLeaveRequestLogsService,
} from "../../../../services/hrm/request/leaveRequest/employeeLeaveRequest.service.js";

const getRequestMetadata =
    (
        req,
    ) => {
        return {
            ipAddress:
                req.ip ||
                req.headers[
                "x-forwarded-for"
                ] ||
                null,

            userAgent:
                req.headers[
                "user-agent"
                ] ||
                null,
        };
    };

export const createEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await createEmployeeLeaveRequestService({
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
                201,
                "Leave request created successfully",
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

export const bulkCreateEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await bulkCreateEmployeeLeaveRequestService({
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
                201,
                "Multiple leave requests created successfully",
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

export const getEmployeeLeaveRequestsController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEmployeeLeaveRequestsService({
                    schoolSlug:
                        req.user.schoolSlug,

                    query:
                        req.query,
                });

            return successResponse(
                res,
                200,
                "Leave requests fetched successfully",
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

export const getEmployeeLeaveRequestBySlugController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEmployeeLeaveRequestBySlugService({
                    schoolSlug:
                        req.user.schoolSlug,

                    leaveSlug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Leave request fetched successfully",
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

export const approveEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await approveEmployeeLeaveRequestService({
                    schoolSlug:
                        req.user.schoolSlug,

                    leaveSlug:
                        req.params.slug,

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
                "Leave request approved successfully",
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

export const bulkApproveEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await bulkApproveEmployeeLeaveRequestService({
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
                "Selected leave requests approved successfully",
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

export const rejectEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await rejectEmployeeLeaveRequestService({
                    schoolSlug:
                        req.user.schoolSlug,

                    leaveSlug:
                        req.params.slug,

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
                "Leave request rejected successfully",
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

export const deleteEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await deleteEmployeeLeaveRequestService({
                    schoolSlug:
                        req.user.schoolSlug,

                    leaveSlug:
                        req.params.slug,

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
                "Leave request deleted successfully",
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

export const restoreEmployeeLeaveRequestController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await restoreEmployeeLeaveRequestService({
                    schoolSlug:
                        req.user.schoolSlug,

                    leaveSlug:
                        req.params.slug,

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
                "Leave request restored successfully",
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

export const getEmployeeLeaveRequestLogsController =
    async (
        req,
        res,
    ) => {
        try {
            const data =
                await getEmployeeLeaveRequestLogsService({
                    schoolSlug:
                        req.user.schoolSlug,

                    leaveSlug:
                        req.params.slug,
                });

            return successResponse(
                res,
                200,
                "Leave request logs fetched successfully",
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