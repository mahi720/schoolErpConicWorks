import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    saveTermExamMarksSchema,
    bulkUpdateTermExamMarksSchema,
    unlockTermExamMarksSchema,
} from "../../../../validations/examManager/markSubmission/termExamMarkSubmission/termExamMarkSubmission.validation.js";

import {
    getTermExamMarkStudentsController,
    saveTermExamMarksController,
    bulkUpdateTermExamMarksController,
    getTermExamSubmissionController,
    lockTermExamMarksController,
    unlockTermExamMarksController,
    deleteTermExamMarksController,
    restoreTermExamMarksController,
    getTermExamMarkAuditLogsController,
} from "../../../../controllers/examManager/marksSubmission/termExamMarkSubmission/termExamMarkSubmission.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/students",
    getTermExamMarkStudentsController,
);

router.post(
    "/save",
    validate(
        saveTermExamMarksSchema,
    ),
    saveTermExamMarksController,
);

router.get(
    "/audit-logs",
    getTermExamMarkAuditLogsController,
);

router.get(
    "/:slug",
    getTermExamSubmissionController,
);

router.patch(
    "/:slug/marks",
    validate(
        bulkUpdateTermExamMarksSchema,
    ),
    bulkUpdateTermExamMarksController,
);

router.patch(
    "/:slug/lock",
    lockTermExamMarksController,
);

router.patch(
    "/:slug/unlock",
    validate(
        unlockTermExamMarksSchema,
    ),
    unlockTermExamMarksController,
);

router.delete(
    "/:slug",
    deleteTermExamMarksController,
);

router.patch(
    "/:slug/restore",
    restoreTermExamMarksController,
);

export default router;