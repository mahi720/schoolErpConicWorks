import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    saveCoScholasticGradesSchema,
    bulkUpdateCoScholasticGradesSchema,
    unlockCoScholasticGradesSchema,
} from "../../../../validations/examManager/markSubmission/coScholasticGradeSubmission/coScholasticGradeSubmission.validation.js";

import {
    getCoScholasticStudentsController,
    saveCoScholasticGradesController,
    bulkUpdateCoScholasticGradesController,
    getCoScholasticSubmissionController,
    lockCoScholasticGradesController,
    unlockCoScholasticGradesController,
    deleteCoScholasticGradesController,
    restoreCoScholasticGradesController,
    getCoScholasticAuditLogsController,
} from "../../../../controllers/examManager/marksSubmission/coScholasticGradeSubmission/coScholasticGradeSubmission.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/students", getCoScholasticStudentsController);
router.post("/save", validate(saveCoScholasticGradesSchema), saveCoScholasticGradesController);
router.get("/audit-logs", getCoScholasticAuditLogsController);
router.get("/:slug", getCoScholasticSubmissionController);
router.patch("/:slug/grades", validate(bulkUpdateCoScholasticGradesSchema), bulkUpdateCoScholasticGradesController);
router.patch("/:slug/lock", lockCoScholasticGradesController);
router.patch("/:slug/unlock", validate(unlockCoScholasticGradesSchema), unlockCoScholasticGradesController);
router.delete("/:slug", deleteCoScholasticGradesController);
router.patch("/:slug/restore", restoreCoScholasticGradesController);

export default router;
