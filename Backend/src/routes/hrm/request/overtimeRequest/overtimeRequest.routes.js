import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createOvertimeRequestSchema,
    approveOvertimeRequestSchema,
    rejectOvertimeRequestSchema,
} from "../../../../validations/HRM/request/overtimeRequest/overtimeRequest.validation.js";

import {
    createOvertimeRequestController,
    getMyOvertimeRequestsController,
    getAllOvertimeRequestsController,
    getOvertimeRequestBySlugController,
    approveOvertimeRequestController,
    rejectOvertimeRequestController,
    deleteOvertimeRequestController,
    restoreOvertimeRequestController,
    getAssignedOvertimeRequestsController,
} from "../../../../controllers/HRM/request/overtimeRequest/overtimeRequest.controller.js";

const router =
    express.Router();

router.use(
    authMiddleware,
);

router.post(
    "/",
    validate(
        createOvertimeRequestSchema,
    ),
    createOvertimeRequestController,
);

router.get(
    "/me",
    getMyOvertimeRequestsController,
);

router.get(
    "/assigned-to-me",
    getAssignedOvertimeRequestsController,
);

router.get(
    "/",
    getAllOvertimeRequestsController,
);

router.patch(
    "/:slug/approve",
    validate(
        approveOvertimeRequestSchema,
    ),
    approveOvertimeRequestController,
);

router.patch(
    "/:slug/reject",
    validate(
        rejectOvertimeRequestSchema,
    ),
    rejectOvertimeRequestController,
);

router.patch(
    "/:slug/restore",
    restoreOvertimeRequestController,
);

router.delete(
    "/:slug",
    deleteOvertimeRequestController,
);

router.get(
    "/:slug",
    getOvertimeRequestBySlugController,
);

export default router;