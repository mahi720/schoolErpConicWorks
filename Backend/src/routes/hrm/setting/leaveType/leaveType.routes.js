import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createLeaveTypeController,
  getLeaveTypeListController,
  getLeaveTypeBySlugController,
  updateLeaveTypeController,
  deleteLeaveTypeController,
  restoreLeaveTypeController,
} from "../../../../controllers/hrm/settings/leaveType/leaveType.controller.js";
import {
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
} from "../../../../validations/hrm/settings/leaveType/leaveType.validation.js";

const router = Router();

router.post("/", validate(createLeaveTypeSchema), createLeaveTypeController);
router.get("/", getLeaveTypeListController);
router.get("/:slug", getLeaveTypeBySlugController);
router.patch("/:slug", validate(updateLeaveTypeSchema), updateLeaveTypeController);
router.delete("/:slug", deleteLeaveTypeController);
router.patch("/:slug/restore", restoreLeaveTypeController);

export default router;
