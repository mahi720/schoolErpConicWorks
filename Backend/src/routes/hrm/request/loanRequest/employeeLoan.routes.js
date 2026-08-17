import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createEmployeeLoanSchema,
    approveEmployeeLoanSchema,
    rejectEmployeeLoanSchema,
    cancelEmployeeLoanSchema,
    disburseEmployeeLoanSchema,
    recoverEmployeeLoanInstallmentSchema,
    forecloseEmployeeLoanSchema,
} from "../../../../validations/hrm/request/LoanRequest/employeeLoan.validation.js";

import {
    getMyLoanEligibilityController,
    getLoanPlanPreviewController,
    createEmployeeLoanController,
    getMyEmployeeLoansController,
    getAllEmployeeLoansController,
    getEmployeeLoanBySlugController,
    approveEmployeeLoanController,
    rejectEmployeeLoanController,
    cancelEmployeeLoanController,
    disburseEmployeeLoanController,
    getEmployeeLoanInstallmentsController,
    recoverEmployeeLoanInstallmentController,
    getEmployeeLoanForeclosurePreviewController,
    forecloseEmployeeLoanController,
    deleteEmployeeLoanController,
    restoreEmployeeLoanController,
} from "../../../../controllers/hrm/request/loanRequest/employeeLoan.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/eligibility", getMyLoanEligibilityController);

router.get("/plans-preview", getLoanPlanPreviewController);

router.get("/me", getMyEmployeeLoansController);

router.post(
    "/",
    validate(createEmployeeLoanSchema),
    createEmployeeLoanController,
);

router.get("/", getAllEmployeeLoansController);

router.patch(
    "/:slug/approve",
    validate(approveEmployeeLoanSchema),
    approveEmployeeLoanController,
);

router.patch(
    "/:slug/reject",
    validate(rejectEmployeeLoanSchema),
    rejectEmployeeLoanController,
);

router.patch(
    "/:slug/cancel",
    validate(cancelEmployeeLoanSchema),
    cancelEmployeeLoanController,
);

router.patch(
    "/:slug/disburse",
    validate(disburseEmployeeLoanSchema),
    disburseEmployeeLoanController,
);

router.get("/:slug/installments", getEmployeeLoanInstallmentsController);

router.patch(
    "/:slug/installments/:installmentSlug/recover",
    validate(recoverEmployeeLoanInstallmentSchema),
    recoverEmployeeLoanInstallmentController,
);

router.get(
    "/:slug/foreclosure-preview",
    getEmployeeLoanForeclosurePreviewController,
);

router.patch(
    "/:slug/foreclose",
    validate(forecloseEmployeeLoanSchema),
    forecloseEmployeeLoanController,
);

router.patch("/:slug/restore", restoreEmployeeLoanController);

router.delete("/:slug", deleteEmployeeLoanController);

router.get("/:slug", getEmployeeLoanBySlugController);

export default router;
