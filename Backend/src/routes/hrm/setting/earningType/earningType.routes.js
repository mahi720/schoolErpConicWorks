import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createEarningTypeController,
  getEarningTypeListController,
  getEarningTypeBySlugController,
  updateEarningTypeController,
  deleteEarningTypeController,
  restoreEarningTypeController,
} from "../../../../controllers/hrm/settings/earningType/earningType.controller.js";
import {
  createEarningTypeSchema,
  updateEarningTypeSchema,
} from "../../../../validations/hrm/settings/earningType/earningType.validation.js";

const router = Router();

router.post("/", validate(createEarningTypeSchema), createEarningTypeController);
router.get("/", getEarningTypeListController);
router.get("/:slug", getEarningTypeBySlugController);
router.patch("/:slug", validate(updateEarningTypeSchema), updateEarningTypeController);
router.delete("/:slug", deleteEarningTypeController);
router.patch("/:slug/restore", restoreEarningTypeController);

export default router;
