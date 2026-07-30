import express from "express";

import {
    createPeriodicTest,
    getPeriodicTests,
    getPeriodicTestBySlug,
    updatePeriodicTest,
    deletePeriodicTest,
    restorePeriodicTest,
    getPeriodicTestTimeTable,
    savePeriodicTestTimeTable,
    deletePeriodicTestTimeTable,
    restorePeriodicTestTimeTable,
} from "../../../controllers/examManager/periodicTestTimeTable/periodicTestTimeTable.controller.js";

import {
    createPeriodicTestSchema,
    updatePeriodicTestSchema,
    savePeriodicTestTimeTableSchema,
} from "../../../validations/examManager/periodicTestTimeTable/periodicTestTimeTable.validation.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(
        createPeriodicTestSchema,
    ),
    createPeriodicTest,
);

router.get(
    "/",
    getPeriodicTests,
);

router.get(
    "/:slug",
    getPeriodicTestBySlug,
);

router.patch(
    "/:slug",
    validate(
        updatePeriodicTestSchema,
    ),
    updatePeriodicTest,
);

router.delete(
    "/:slug",
    deletePeriodicTest,
);

router.patch(
    "/:slug/restore",
    restorePeriodicTest,
);

router.post(
    "/time-tables",
    validate(
        savePeriodicTestTimeTableSchema,
    ),
    savePeriodicTestTimeTable,
);

router.get(
    "/:periodicTestSlug/classes/:classSlug/time-table",
    getPeriodicTestTimeTable,
);

router.delete(
    "/:periodicTestSlug/classes/:classSlug/time-table",
    deletePeriodicTestTimeTable,
);

router.patch(
    "/:periodicTestSlug/classes/:classSlug/time-table/restore",
    restorePeriodicTestTimeTable,
);

export default router;