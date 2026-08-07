import express from "express";

import {
    createEmployeeController,
    getEmployeesController,
    getEmployeeBySlugController,
    updateEmployeeController,
    deleteEmployeeController,
    restoreEmployeeController,
    updateEmployeeLoginSettingController,
    createEmployeeLoginController,
    updateEmployeeLoginAccessController,
    transferEmployeeController
} from "../../../controllers/HRM/employee/employee.controller.js";

import {
    createEmployeeSchema,
    updateEmployeeSchema,
    updateEmployeeLoginSettingSchema,
    createEmployeeLoginSchema,
    updateEmployeeLoginAccessSchema,
    transferEmployeeSchema
} from "../../../validations/HRM/employee/employee.validation.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import {
    employeeExcelUpload,
} from "../../../middleware/excelUpload/employee/employeeExcelUpload.js";

import {
    importEmployeesController,
} from "../../../controllers/HRM/employee/employeeImportController.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createEmployeeSchema),
    createEmployeeController,
);

router.post(
    "/import",
    employeeExcelUpload.single(
        "file",
    ),
    importEmployeesController,
);

router.get(
    "/",
    getEmployeesController,
);

router.get(
    "/:slug",
    getEmployeeBySlugController,
);

router.patch(
    "/:slug",
    validate(updateEmployeeSchema),
    updateEmployeeController,
);

router.delete(
    "/:slug",
    deleteEmployeeController,
);

router.patch(
    "/:slug/restore",
    restoreEmployeeController,
);

router.patch(
    "/:slug/login-setting",
    validate(
        updateEmployeeLoginSettingSchema,
    ),
    updateEmployeeLoginSettingController,
);

router.post(
    "/:slug/login-account",
    validate(createEmployeeLoginSchema),
    createEmployeeLoginController,
);

router.patch(
    "/:slug/login-access",
    validate(
        updateEmployeeLoginAccessSchema,
    ),
    updateEmployeeLoginAccessController,
);

router.post(
    "/:slug/transfer",
    validate(
        transferEmployeeSchema,
    ),
    transferEmployeeController,
);

export default router;