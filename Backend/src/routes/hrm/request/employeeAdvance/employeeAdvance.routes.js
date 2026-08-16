import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createEmployeeAdvanceSchema,
    approveEmployeeAdvanceSchema,
    rejectEmployeeAdvanceSchema,
    cancelEmployeeAdvanceSchema,
    disburseEmployeeAdvanceSchema,
    recoverAdvanceInstallmentSchema,
    forecloseEmployeeAdvanceSchema,
} from "../../../../validations/HRM/request/employeeAdvance/employeeAdvance.validation.js";

import {
    getMyAdvanceEligibilityController,
    createEmployeeAdvanceController,
    getMyEmployeeAdvancesController,
    getAllEmployeeAdvancesController,
    getEmployeeAdvanceBySlugController,
    approveEmployeeAdvanceController,
    rejectEmployeeAdvanceController,
    cancelEmployeeAdvanceController,
    disburseEmployeeAdvanceController,
    getAdvanceInstallmentsController,
    recoverAdvanceInstallmentController,
    deleteEmployeeAdvanceController,
    restoreEmployeeAdvanceController,
    forecloseEmployeeAdvanceController,
} from "../../../../controllers/HRM/request/employeeAdvance/employeeAdvance.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/eligibility", getMyAdvanceEligibilityController);

router.get("/me", getMyEmployeeAdvancesController);

router.post(
    "/",
    validate(createEmployeeAdvanceSchema),
    createEmployeeAdvanceController,
);

router.get("/", getAllEmployeeAdvancesController);

router.patch(
    "/:slug/approve",
    validate(approveEmployeeAdvanceSchema),
    approveEmployeeAdvanceController,
);

router.patch(
    "/:slug/reject",
    validate(rejectEmployeeAdvanceSchema),
    rejectEmployeeAdvanceController,
);

router.patch(
    "/:slug/foreclose",
    validate(
        forecloseEmployeeAdvanceSchema,
    ),
    forecloseEmployeeAdvanceController,
);

router.patch(
    "/:slug/cancel",
    validate(cancelEmployeeAdvanceSchema),
    cancelEmployeeAdvanceController,
);

router.patch(
    "/:slug/disburse",
    validate(disburseEmployeeAdvanceSchema),
    disburseEmployeeAdvanceController,
);

router.get("/:slug/installments", getAdvanceInstallmentsController);

router.patch(
    "/:slug/installments/:installmentSlug/recover",
    validate(recoverAdvanceInstallmentSchema),
    recoverAdvanceInstallmentController,
);

router.patch("/:slug/restore", restoreEmployeeAdvanceController);

router.delete("/:slug", deleteEmployeeAdvanceController);

router.get("/:slug", getEmployeeAdvanceBySlugController);

export default router;
