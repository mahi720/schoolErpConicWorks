import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  getPayBandStructureController,
  savePayBandStructureController,
} from "../../../../controllers/hrm/settings/payBandStructure/payBandStructure.controller.js";
import { savePayBandStructureSchema } from "../../../../validations/hrm/settings/payBandStructure/payBandStructure.validation.js";

const router = Router();

router.get("/:payBandSlug", getPayBandStructureController);
router.put("/:payBandSlug", validate(savePayBandStructureSchema), savePayBandStructureController);

export default router;
