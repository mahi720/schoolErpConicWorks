import express from "express";
import {
    createSubject,
    getSubjects,
    getSubjectBySlug,
    updateSubject,
    deleteSubject,
    restoreSubject,
} from "../../../controllers/master/subject/subjectController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createSubjectSchema,
    updateSubjectSchema,
} from "../../../validations/master/subject/subject.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createSubjectSchema), createSubject);
router.get("/", getSubjects);
router.get("/:slug", getSubjectBySlug);
router.patch("/:slug/restore", restoreSubject);
router.patch("/:slug", validate(updateSubjectSchema), updateSubject);
router.delete("/:slug", deleteSubject);

export default router;