import express from "express";

import {
    authMiddleware,
} from "../../../middleware/auth/auth.middleware.js";

import {
    validate,
} from "../../../middleware/validate/validate.middleware.js";

import {
    createHolidaySchema,
    updateHolidaySchema,
} from "../../../validations/HRM/holiday/holiday.validation.js";

import {
    createHolidayController,
    getHolidaysController,
    getHolidayBySlugController,
    updateHolidayController,
    deleteHolidayController,
    restoreHolidayController,
} from "../../../controllers/HRM/holiday/holiday.controller.js";

const router =
    express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(
        createHolidaySchema,
    ),
    createHolidayController,
);

router.get(
    "/",
    getHolidaysController,
);

router.get(
    "/:holidaySlug",
    getHolidayBySlugController,
);

router.patch(
    "/:holidaySlug",
    validate(
        updateHolidaySchema,
    ),
    updateHolidayController,
);

router.delete(
    "/:holidaySlug",
    deleteHolidayController,
);

router.patch(
    "/:holidaySlug/restore",
    restoreHolidayController,
);

export default router;