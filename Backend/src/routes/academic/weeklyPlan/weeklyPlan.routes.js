import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import {
    getWeeklyPlanClassesController,
    getWeeklyPlanSectionsController,
    getWeeklyPlanSubjectsController,
} from "../../../controllers/academic/weeklyPlan/weeklyPlanOptions.controller.js";

import {
    createWeeklyPlanController,
    deleteWeeklyPlanController,
    getWeeklyPlanBySlugController,
    getWeeklyPlansController,
    restoreWeeklyPlanController,
    updateWeeklyPlanController,
} from "../../../controllers/academic/weeklyPlan/weeklyPlan.controller.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createWeeklyPlanSchema,
    updateWeeklyPlanSchema,
} from "../../../validations/academic/weeklyPlan/weeklyPlan.validation.js";

const router = express.Router();

router.use(authMiddleware);

/* -------------------------------------------------------------------------- */
/*                          WEEKLY PLAN DROPDOWN OPTIONS                       */
/* -------------------------------------------------------------------------- */

router.get(
    "/options/classes",
    getWeeklyPlanClassesController,
);

router.get(
    "/options/sections",
    getWeeklyPlanSectionsController,
);

router.get(
    "/options/subjects",
    getWeeklyPlanSubjectsController,
);

/* -------------------------------------------------------------------------- */
/*                              WEEKLY PLAN CRUD                              */
/* -------------------------------------------------------------------------- */

router.post(
    "/",
    validate(createWeeklyPlanSchema),
    createWeeklyPlanController,
);

router.get(
    "/",
    getWeeklyPlansController,
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

router.patch(
    "/:slug/restore",
    restoreWeeklyPlanController,
);

export default router;