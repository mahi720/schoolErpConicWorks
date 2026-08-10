import express from "express";

import {
    authMiddleware,
} from "../../../middleware/auth/auth.middleware.js";

import {
    validate,
} from "../../../middleware/validate/validate.middleware.js";

import {
    createEventCalendarSchema,
    updateEventCalendarSchema,
} from "../../../validations/HRM/eventCalendar/eventCalendar.validation.js";

import {
    createEventCalendarController,
    getEventCalendarsController,
    getEventCalendarBySlugController,
    updateEventCalendarController,
    deleteEventCalendarController,
    restoreEventCalendarController,
} from "../../../controllers/HRM/eventCalendar/eventCalendar.controller.js";

const router =
    express.Router();

router.use(
    authMiddleware,
);

router.post(
    "/",
    validate(
        createEventCalendarSchema,
    ),
    createEventCalendarController,
);

router.get(
    "/",
    getEventCalendarsController,
);

router.get(
    "/:slug",
    getEventCalendarBySlugController,
);

router.patch(
    "/:slug",
    validate(
        updateEventCalendarSchema,
    ),
    updateEventCalendarController,
);

router.delete(
    "/:slug",
    deleteEventCalendarController,
);

router.patch(
    "/:slug/restore",
    restoreEventCalendarController,
);

export default router;