import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    saveEmployeePayrollSchema,
    lockEmployeePayrollSchema,
    unlockEmployeePayrollSchema,
    markEmployeePayrollPaidSchema,
} from "../../../validations/HRM/salary/employeePayroll.validation.js";

import {
    getEmployeePayrollsController,
    getEmployeePayrollDetailController,
    saveEmployeePayrollsController,
    lockEmployeePayrollsController,
    unlockEmployeePayrollsController,
    markEmployeePayrollPaidController,
    getEmployeePayrollLogsController,
    getSalaryStatementController,
    getBankStatementController,
} from "../../../controllers/HRM/salary/employeePayroll.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/employees", getEmployeePayrollsController);

router.get("/employees/:employeeSlug", getEmployeePayrollDetailController);

router.get("/salary-statement", getSalaryStatementController);

router.get("/bank-statement", getBankStatementController);

router.post(
    "/save",
    validate(saveEmployeePayrollSchema),
    saveEmployeePayrollsController,
);

router.patch(
    "/lock",
    validate(lockEmployeePayrollSchema),
    lockEmployeePayrollsController,
);

router.patch(
    "/unlock",
    validate(unlockEmployeePayrollSchema),
    unlockEmployeePayrollsController,
);

router.patch(
    "/mark-paid",
    validate(markEmployeePayrollPaidSchema),
    markEmployeePayrollPaidController,
);

router.get("/:payrollSlug/logs", getEmployeePayrollLogsController);

export default router;
