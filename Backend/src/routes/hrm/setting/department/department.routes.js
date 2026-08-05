import { Router } from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createDepartmentController,
    getDepartmentsController,
    getDepartmentBySlugController,
    updateDepartmentController,
    deleteDepartmentController,
    restoreDepartmentController,
} from "../../../../controllers/hrm/settings/department/department.controller.js";

import {
    createDepartmentSchema,
    updateDepartmentSchema,
} from "../../../../validations/hrm/settings/department/department.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createDepartmentSchema),
    createDepartmentController,
);

router.get("/", getDepartmentsController);

router.get("/:slug", getDepartmentBySlugController);

router.patch(
    "/:slug",
    validate(updateDepartmentSchema),
    updateDepartmentController,
);

router.delete("/:slug", deleteDepartmentController);

router.patch("/:slug/restore", restoreDepartmentController);

export default router;