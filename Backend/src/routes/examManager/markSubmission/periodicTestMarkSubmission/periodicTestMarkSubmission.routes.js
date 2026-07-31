import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    periodicTestMarkFilterSchema,
    savePeriodicTestMarksSchema,
    bulkUpdatePeriodicTestMarksSchema,
    unlockPeriodicTestMarksSchema,
} from "../../../../validations/examManager/markSubmission/periodicTestMarkSubmission/periodicTestMarkSubmission.validation.js";

import {
    getPeriodicTestMarkStudentsController,
    savePeriodicTestMarksController,
    bulkUpdatePeriodicTestMarksController,
    getPeriodicTestSubmissionController,
    lockPeriodicTestMarksController,
    unlockPeriodicTestMarksController,
    deletePeriodicTestMarksController,
    restorePeriodicTestMarksController,
    getPeriodicTestMarkAuditLogsController,
} from "../../../../controllers/examManager/marksSubmission/periodicTestMarkSubmission/periodicTestMarkSubmissionController.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/students",
    getPeriodicTestMarkStudentsController,
);

router.get(
    "/audit-logs",
    getPeriodicTestMarkAuditLogsController,
);

router.post(
    "/save",
    validate(savePeriodicTestMarksSchema),
    savePeriodicTestMarksController,
);

router.get(
    "/:slug",
    getPeriodicTestSubmissionController,
);

router.patch(
    "/:slug/marks",
    validate(
        bulkUpdatePeriodicTestMarksSchema,
    ),
    bulkUpdatePeriodicTestMarksController,
);

router.patch(
    "/:slug/lock",
    lockPeriodicTestMarksController,
);

router.patch(
    "/:slug/unlock",
    validate(
        unlockPeriodicTestMarksSchema,
    ),
    unlockPeriodicTestMarksController,
);

router.delete(
    "/:slug",
    deletePeriodicTestMarksController,
);

router.patch(
    "/:slug/restore",
    restorePeriodicTestMarksController,
);

export default router;