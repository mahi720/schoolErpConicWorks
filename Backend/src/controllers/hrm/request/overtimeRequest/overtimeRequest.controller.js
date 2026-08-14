import {
    successResponse,
    errorResponse,
} from "../../../../utils/apiResponse.js";

import {
    createOvertimeRequestService,
    getMyOvertimeRequestsService,
    getAllOvertimeRequestsService,
    getOvertimeRequestBySlugService,
    approveOvertimeRequestService,
    rejectOvertimeRequestService,
    deleteOvertimeRequestService,
    restoreOvertimeRequestService,
    getAssignedOvertimeRequestsService
} from "../../../../services/HRM/request/overtimeRequest/overtimeRequest.service.js";

export const createOvertimeRequestController = async (req, res) => {
    try {
        const data = await createOvertimeRequestService({
            schoolSlug: req.user.schoolSlug,

            userSlug: req.user.slug,

            payload: req.body,
        });

        return successResponse(
            res,
            201,
            "Overtime request created successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getMyOvertimeRequestsController = async (req, res) => {
    try {
        const data =
            await getMyOvertimeRequestsService({
                schoolSlug:
                    req.user.schoolSlug,

                user:
                    req.user,

                query:
                    req.query,
            });

        return successResponse(
            res,
            200,
            "Overtime requests fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAllOvertimeRequestsController = async (req, res) => {
    try {
        const data = await getAllOvertimeRequestsService({
            schoolSlug: req.user.schoolSlug,

            query: req.query,
        });

        return successResponse(
            res,
            200,
            "Overtime requests fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getOvertimeRequestBySlugController = async (req, res) => {
    try {
        const data = await getOvertimeRequestBySlugService({
            schoolSlug: req.user.schoolSlug,

            overtimeSlug: req.params.slug,

            userSlug: req.user.slug,
        });

        return successResponse(
            res,
            200,
            "Overtime request fetched successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const approveOvertimeRequestController = async (req, res) => {
    try {
        const data =
            await approveOvertimeRequestService({
                schoolSlug:
                    req.user.schoolSlug,

                overtimeSlug:
                    req.params.slug,

                payload:
                    req.body,

                user:
                    req.user,
            });

        return successResponse(
            res,
            200,
            "Overtime request approved successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const rejectOvertimeRequestController = async (req, res) => {
    try {
        const data =
            await rejectOvertimeRequestService({
                schoolSlug:
                    req.user.schoolSlug,

                overtimeSlug:
                    req.params.slug,

                payload:
                    req.body,

                user:
                    req.user,
            });

        return successResponse(
            res,
            200,
            "Overtime request rejected successfully",
            data,
        );
    } catch (error) {
        console.error(
            "REJECT OVERTIME ERROR:",
            error,
        );

        return errorResponse(
            res,
            400,
            error.message,
        );
    }
};

export const deleteOvertimeRequestController = async (req, res) => {
    try {
        const data = await deleteOvertimeRequestService({
            schoolSlug: req.user.schoolSlug,

            overtimeSlug: req.params.slug,

            userSlug: req.user.slug,
        });

        return successResponse(
            res,
            200,
            "Overtime request deleted successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const restoreOvertimeRequestController = async (req, res) => {
    try {
        const data = await restoreOvertimeRequestService({
            schoolSlug: req.user.schoolSlug,

            overtimeSlug: req.params.slug,
        });

        return successResponse(
            res,
            200,
            "Overtime request restored successfully",
            data,
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getAssignedOvertimeRequestsController =
    async (req, res) => {
        try {
            const data =
                await getAssignedOvertimeRequestsService({
                    schoolSlug:
                        req.user.schoolSlug,

                    user:
                        req.user,

                    query:
                        req.query,
                });

            return successResponse(
                res,
                200,
                "Assigned overtime requests fetched successfully",
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
