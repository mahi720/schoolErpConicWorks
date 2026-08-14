import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createEmployeeLeaveRequestSchema,
    bulkCreateEmployeeLeaveRequestSchema,
    approveEmployeeLeaveRequestSchema,
    bulkApproveEmployeeLeaveRequestSchema,
    rejectEmployeeLeaveRequestSchema,
} from "../../../../validations/hrm/Request/leaveRequest/employeeLeaveRequest.validation.js";

import {
    createEmployeeLeaveRequestController,
    bulkCreateEmployeeLeaveRequestController,
    getEmployeeLeaveRequestsController,
    getEmployeeLeaveRequestBySlugController,
    approveEmployeeLeaveRequestController,
    bulkApproveEmployeeLeaveRequestController,
    rejectEmployeeLeaveRequestController,
    deleteEmployeeLeaveRequestController,
    restoreEmployeeLeaveRequestController,
    getEmployeeLeaveRequestLogsController,
} from "../../../../controllers/hrm/request/leaveRequest/employeeLeaveRequest.controller.js";

const router =
    express.Router();

router.use(
    authMiddleware,
);

router.post(
    "/",
    validate(
        createEmployeeLeaveRequestSchema,
    ),
    createEmployeeLeaveRequestController,
);

router.post(
    "/bulk",
    validate(
        bulkCreateEmployeeLeaveRequestSchema,
    ),
    bulkCreateEmployeeLeaveRequestController,
);

router.get(
    "/",
    getEmployeeLeaveRequestsController,
);

router.patch(
    "/bulk-approve",
    validate(
        bulkApproveEmployeeLeaveRequestSchema,
    ),
    bulkApproveEmployeeLeaveRequestController,
);

router.get(
    "/:slug/logs",
    getEmployeeLeaveRequestLogsController,
);

router.patch(
    "/:slug/approve",
    validate(
        approveEmployeeLeaveRequestSchema,
    ),
    approveEmployeeLeaveRequestController,
);

router.patch(
    "/:slug/reject",
    validate(
        rejectEmployeeLeaveRequestSchema,
    ),
    rejectEmployeeLeaveRequestController,
);

router.patch(
    "/:slug/restore",
    restoreEmployeeLeaveRequestController,
);

router.delete(
    "/:slug",
    deleteEmployeeLeaveRequestController,
);

router.get(
    "/:slug",
    getEmployeeLeaveRequestBySlugController,
);

export default router;