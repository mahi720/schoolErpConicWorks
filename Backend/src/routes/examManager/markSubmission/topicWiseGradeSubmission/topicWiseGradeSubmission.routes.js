import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    saveTopicWiseGradesSchema,
    bulkUpdateTopicWiseGradesSchema,
    unlockTopicWiseGradesSchema,
} from "../../../../validations/examManager/markSubmission/topicWiseGradeSubmission/topicWiseGradeSubmission.validation.js";

import {
    getTopicWiseGradeStudentsController,
    saveTopicWiseGradesController,
    bulkUpdateTopicWiseGradesController,
    getTopicWiseGradeSubmissionController,
    lockTopicWiseGradesController,
    unlockTopicWiseGradesController,
    deleteTopicWiseGradesController,
    restoreTopicWiseGradesController,
    getTopicWiseGradeAuditLogsController,
} from "../../../../controllers/examManager/marksSubmission/topicWiseGradeSubmission/topicWiseGradeSubmission.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/students",
    getTopicWiseGradeStudentsController,
);

router.post(
    "/save",
    validate(saveTopicWiseGradesSchema),
    saveTopicWiseGradesController,
);

router.get(
    "/audit-logs",
    getTopicWiseGradeAuditLogsController,
);

router.get(
    "/:slug",
    getTopicWiseGradeSubmissionController,
);

router.patch(
    "/:slug/grades",
    validate(bulkUpdateTopicWiseGradesSchema),
    bulkUpdateTopicWiseGradesController,
);

router.patch(
    "/:slug/lock",
    lockTopicWiseGradesController,
);

router.patch(
    "/:slug/unlock",
    validate(unlockTopicWiseGradesSchema),
    unlockTopicWiseGradesController,
);

router.delete(
    "/:slug",
    deleteTopicWiseGradesController,
);

router.patch(
    "/:slug/restore",
    restoreTopicWiseGradesController,
);

export default router;
