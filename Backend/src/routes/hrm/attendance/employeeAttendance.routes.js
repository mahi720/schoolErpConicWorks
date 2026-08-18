import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";

import { employeeExcelUpload } from "../../../middleware/excelUpload/employee/employeeExcelUpload.js";

import {
    markEmployeePresentSchema,
    markEmployeeAbsentSchema,
    updateEmployeeAttendanceSchema,
    lockEmployeeAttendanceSchema,
    unlockEmployeeAttendanceSchema,
    bulkSaveEmployeeAttendanceSchema,
} from "../../../validations/HRM/attendance/employeeAttendance.validation.js";

import {
    getEmployeeAttendancesController,
    getAttendanceDashboardController,
    markEmployeePresentController,
    markEmployeeAbsentController,
    updateEmployeeAttendanceController,
    lockEmployeeAttendanceController,
    unlockEmployeeAttendanceController,
    getEmployeeAttendanceLogsController,
    getYearlyAttendanceReportController,
    bulkSaveEmployeeAttendanceController,
    importEmployeeAttendanceController,
    getMonthlyAttendanceReportController,
    lockReconciliationAttendanceController,
    getEmployeeMonthlyReconciliationController,
    getNoPunchReportController,
} from "../../../controllers/HRM/attendance/employeeAttendance.controller.js";

const router = express.Router();

router.use(authMiddleware);

// GET routes
router.get(
    "/employees/:employeeSlug/monthly-reconciliation",
    getEmployeeMonthlyReconciliationController,
);

router.get("/dashboard", getAttendanceDashboardController);

router.get("/no-punch-report", getNoPunchReportController);

router.get("/logs", getEmployeeAttendanceLogsController);

router.get("/yearly-report", getYearlyAttendanceReportController);

router.get("/monthly-report", getMonthlyAttendanceReportController);

router.get("/", getEmployeeAttendancesController);

// POST routes
router.post(
    "/bulk-save",
    validate(bulkSaveEmployeeAttendanceSchema),
    bulkSaveEmployeeAttendanceController,
);

router.post(
    "/import",
    employeeExcelUpload.single("file"),
    importEmployeeAttendanceController,
);

// PATCH specific routes first
router.patch(
    "/employees/:employeeSlug/present",
    validate(markEmployeePresentSchema),
    markEmployeePresentController,
);

router.patch(
    "/employees/:employeeSlug/absent",
    validate(markEmployeeAbsentSchema),
    markEmployeeAbsentController,
);

router.patch(
    "/lock",
    validate(lockEmployeeAttendanceSchema),
    lockEmployeeAttendanceController,
);

router.patch(
    "/unlock",
    validate(unlockEmployeeAttendanceSchema),
    unlockEmployeeAttendanceController,
);

router.patch(
    "/:attendanceSlug/reconciliation-lock",
    lockReconciliationAttendanceController,
);

// Dynamic route always last
router.patch(
    "/:attendanceSlug",
    validate(updateEmployeeAttendanceSchema),
    updateEmployeeAttendanceController,
);

export default router;
