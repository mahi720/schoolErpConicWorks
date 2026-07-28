import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createWeeklyPlanSchema,
    updateWeeklyPlanSchema,
} from "../../../validations/academic/weeklyPlan/weeklyPlan.validation.js";

import {
    createWeeklyPlanController,
    getWeeklyPlansController,
    getWeeklyPlanBySlugController,
    updateWeeklyPlanController,
    deleteWeeklyPlanController,
    restoreWeeklyPlanController,
    deleteWeeklyPlanLessonController,
} from "../../../controllers/academic/weeklyPlan/weeklyPlan.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createWeeklyPlanSchema),
    createWeeklyPlanController,
);

router.get(
    "/",
    getWeeklyPlansController,
);

router.delete(
    "/:weeklyPlanSlug/lessons/:lessonSlug",
    deleteWeeklyPlanLessonController,
);

router.patch(
    "/:slug/restore",
    restoreWeeklyPlanController,
);

router.get(
    "/:slug",
    getWeeklyPlanBySlugController,
);

router.patch(
    "/:slug",
    validate(updateWeeklyPlanSchema),
    updateWeeklyPlanController,
);

router.delete(
    "/:slug",
    deleteWeeklyPlanController,
);

export default router;