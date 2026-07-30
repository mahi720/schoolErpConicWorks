import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createTermExamSchema,
    updateTermExamSchema,
    saveTermExamTimeTableSchema,
} from "../../../validations/examManager/termExamTimeTable/termExamTimeTableValidation.js";

import {
    createTermExamController,
    getTermExamsController,
    getTermExamBySlugController,
    updateTermExamController,
    deleteTermExamController,
    restoreTermExamController,
    getTermExamTimeTableController,
    saveTermExamTimeTableController,
    deleteTermExamTimeTableController,
    restoreTermExamTimeTableController,
} from "../../../controllers/examManager/termExamTimeTable/termExamTimeTableController.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/term-exams",
    validate(
        createTermExamSchema,
    ),
    createTermExamController,
);

router.get(
    "/term-exams",
    getTermExamsController,
);

router.get(
    "/term-exams/:slug",
    getTermExamBySlugController,
);

router.patch(
    "/term-exams/:slug",
    validate(
        updateTermExamSchema,
    ),
    updateTermExamController,
);

router.delete(
    "/term-exams/:slug",
    deleteTermExamController,
);

router.patch(
    "/term-exams/:slug/restore",
    restoreTermExamController,
);

router.post(
    "/term-exam-time-tables",
    validate(
        saveTermExamTimeTableSchema,
    ),
    saveTermExamTimeTableController,
);

router.get(
    "/term-exam-time-tables/:termExamSlug/classes/:classSlug",
    getTermExamTimeTableController,
);

router.delete(
    "/term-exam-time-tables/:termExamSlug/classes/:classSlug",
    deleteTermExamTimeTableController,
);

router.patch(
    "/term-exam-time-tables/:termExamSlug/classes/:classSlug/restore",
    restoreTermExamTimeTableController,
);

export default router;