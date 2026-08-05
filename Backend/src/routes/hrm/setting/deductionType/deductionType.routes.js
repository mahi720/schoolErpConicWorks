import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createDeductionTypeController,
  getDeductionTypeListController,
  getDeductionTypeBySlugController,
  updateDeductionTypeController,
  deleteDeductionTypeController,
  restoreDeductionTypeController,
} from "../../../../controllers/hrm/settings/deductionType/deductionType.controller.js";
import {
  createDeductionTypeSchema,
  updateDeductionTypeSchema,
} from "../../../../validations/hrm/settings/deductionType/deductionType.validation.js";

const router = Router();

router.post("/", validate(createDeductionTypeSchema), createDeductionTypeController);
router.get("/", getDeductionTypeListController);
router.get("/:slug", getDeductionTypeBySlugController);
router.patch("/:slug", validate(updateDeductionTypeSchema), updateDeductionTypeController);
router.delete("/:slug", deleteDeductionTypeController);
router.patch("/:slug/restore", restoreDeductionTypeController);

export default router;
