import express from "express";

import {
    getEmployeeSalaryStructureController,
    getEmployeePayBandOptionsController,
    previewEmployeePayBandController,
    saveEmployeeSalaryStructureController,
    updateSalaryGenerationStatusController,
    getEmployeeSalaryIncrementHistoryController,
} from "../../../controllers/HRM/employee/employeeSalaryStructure.controller.js";

import {
    previewEmployeePayBandSchema,
    saveEmployeeSalaryStructureSchema,
    updateSalaryGenerationStatusSchema,
} from "../../../validations/HRM/employee/employeeSalaryStructure.validation.js";

import {
    validate
} from "../../../middleware/validate/validate.middleware.js";

import {
    authMiddleware,
} from "../../../middleware/auth/auth.middleware.js";

const router =
    express.Router();

router.use(
    authMiddleware,
);

router.get(
    "/pay-bands",
    getEmployeePayBandOptionsController,
);

router.get(
    "/:employeeSlug/salary-structure",
    getEmployeeSalaryStructureController,
);

// Sirf preview.
// Is route se DB me kuch save nahi hoga.
router.post(
    "/:employeeSlug/salary-structure/pay-band-preview",
    validate(
        previewEmployeePayBandSchema,
    ),
    previewEmployeePayBandController,
);

// Main Save button.
router.put(
    "/:employeeSlug/salary-structure",
    validate(
        saveEmployeeSalaryStructureSchema,
    ),
    saveEmployeeSalaryStructureController,
);

router.patch(
    "/:employeeSlug/salary-structure/generation-status",
    validate(
        updateSalaryGenerationStatusSchema,
    ),
    updateSalaryGenerationStatusController,
);

router.get(
    "/:employeeSlug/salary-structure/increments",
    getEmployeeSalaryIncrementHistoryController,
);

export default router;