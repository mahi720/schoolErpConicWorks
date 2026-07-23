import express from "express";

import {
    deleteStudentAttendanceController,
    getAttendanceLogsController,
    getAttendanceStudentsController,
    getMonthlyAttendanceController,
    lockStudentAttendanceController,
    markStudentAttendanceController,
    restoreStudentAttendanceController,
    unlockStudentAttendanceController,
    updateStudentAttendanceController,
} from "../../../controllers/academic/studentAttendance/studentAttendanceController.js";

import {
    getDailyAttendanceReportController,
    getMonthlyAttendanceReportController,
    getStudentDayWiseReportController,
} from "../../../controllers/academic/studentAttendance/studentAttendanceReport.controller.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    attendanceActionSchema,
    markStudentAttendanceSchema,
    updateStudentAttendanceSchema,
} from "../../../validations/academic/studentAttendance/studentAttendanceValidation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/students", getAttendanceStudentsController);

router.get("/monthly", getMonthlyAttendanceController);

router.get(
    "/:attendanceSlug/logs",
    getAttendanceLogsController,
);

router.post(
    "/mark",
    validate(markStudentAttendanceSchema),
    markStudentAttendanceController,
);

router.patch(
    "/:daySlug",
    validate(updateStudentAttendanceSchema),
    updateStudentAttendanceController,
);

router.delete(
    "/:daySlug",
    validate(attendanceActionSchema),
    deleteStudentAttendanceController,
);

router.patch(
    "/:daySlug/restore",
    validate(attendanceActionSchema),
    restoreStudentAttendanceController,
);

router.patch(
    "/:daySlug/lock",
    validate(attendanceActionSchema),
    lockStudentAttendanceController,
);

router.patch(
    "/:daySlug/unlock",
    validate(attendanceActionSchema),
    unlockStudentAttendanceController,
);

// reporting

router.get(
    "/reports/daily",
    getDailyAttendanceReportController,
);

router.get(
    "/reports/monthly",
    getMonthlyAttendanceReportController,
);

router.get(
    "/reports/student/:academicMappingSlug",
    getStudentDayWiseReportController,
);

export default router;