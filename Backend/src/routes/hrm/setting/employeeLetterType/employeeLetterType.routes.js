import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createEmployeeLetterTypeController,
  getEmployeeLetterTypeListController,
  getEmployeeLetterTypeBySlugController,
  updateEmployeeLetterTypeController,
  deleteEmployeeLetterTypeController,
  restoreEmployeeLetterTypeController,
} from "../../../../controllers/hrm/settings/employeeLetterType/employeeLetterType.controller.js";
import {
  createEmployeeLetterTypeSchema,
  updateEmployeeLetterTypeSchema,
} from "../../../../validations/hrm/settings/employeeLetterType/employeeLetterType.validation.js";

const router = Router();

router.post("/", validate(createEmployeeLetterTypeSchema), createEmployeeLetterTypeController);
router.get("/", getEmployeeLetterTypeListController);
router.get("/:slug", getEmployeeLetterTypeBySlugController);
router.patch("/:slug", validate(updateEmployeeLetterTypeSchema), updateEmployeeLetterTypeController);
router.delete("/:slug", deleteEmployeeLetterTypeController);
router.patch("/:slug/restore", restoreEmployeeLetterTypeController);

export default router;
