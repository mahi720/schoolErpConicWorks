import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createExamTypeSchema,
    updateExamTypeSchema,
} from "../../../validations/examManager/examType/examType.validation.js";

import {
    createExamTypeController,
    getExamTypesController,
    getExamTypeBySlugController,
    updateExamTypeController,
    deleteExamTypeController,
    restoreExamTypeController,
} from "../../../controllers/examManager/examType/examType.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createExamTypeSchema),
    createExamTypeController,
);

router.get("/", getExamTypesController);

router.get("/:slug", getExamTypeBySlugController);

router.patch(
    "/:slug",
    validate(updateExamTypeSchema),
    updateExamTypeController,
);

router.delete("/:slug", deleteExamTypeController);

router.patch(
    "/:slug/restore",
    restoreExamTypeController,
);

export default router;