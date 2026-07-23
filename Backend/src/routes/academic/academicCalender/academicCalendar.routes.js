import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createAcademicCalendarSchema,
    updateAcademicCalendarSchema,
} from "../../../validations/academic/academicCalendar/academicCalendar.validation.js";

import {
    createAcademicCalendarController,
    getAcademicCalendarsController,
    getAcademicCalendarBySlugController,
    updateAcademicCalendarController,
    deleteAcademicCalendarController,
    restoreAcademicCalendarController,
} from "../../../controllers/academic/academicCalender/academicCalendar.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(
        createAcademicCalendarSchema,
    ),
    createAcademicCalendarController,
);

router.get(
    "/",
    getAcademicCalendarsController,
);

router.patch(
    "/:slug/restore",
    restoreAcademicCalendarController,
);


router.get(
    "/:slug",
    getAcademicCalendarBySlugController,
);

router.patch(
    "/:slug",
    validate(
        updateAcademicCalendarSchema,
    ),
    updateAcademicCalendarController,
);

router.delete(
    "/:slug",
    deleteAcademicCalendarController,
);

export default router;