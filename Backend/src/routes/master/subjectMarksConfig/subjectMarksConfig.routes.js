import express from "express";

import {
    createSubjectMarksConfig,
    getSubjectMarksConfigs,
    getSubjectMarksConfigBySlug,
    updateSubjectMarksConfig,
    deleteSubjectMarksConfig,
    restoreSubjectMarksConfig,
} from "../../../controllers/master/subjectMarksConfig/subjectMarksConfig.controller.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createSubjectMarksConfigSchema,
    updateSubjectMarksConfigSchema,
} from "../../../validations/master/subjectMarksConfig/subjectMarksConfig.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createSubjectMarksConfigSchema),
    createSubjectMarksConfig
);

router.get("/", getSubjectMarksConfigs);

router.get(
    "/:slug",
    getSubjectMarksConfigBySlug
);

router.patch(
    "/:slug/restore",
    restoreSubjectMarksConfig
);

router.patch(
    "/:slug",
    validate(updateSubjectMarksConfigSchema),
    updateSubjectMarksConfig
);

router.delete(
    "/:slug",
    deleteSubjectMarksConfig
);

export default router;