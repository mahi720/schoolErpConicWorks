import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  getLoanSettingController,
  saveLoanSettingController,
} from "../../../../controllers/hrm/settings/loanSetting/loanSetting.controller.js";
import { saveLoanSettingSchema } from "../../../../validations/hrm/settings/loanSetting/loanSetting.validation.js";

const router = Router();

router.get("/", getLoanSettingController);
router.patch("/", validate(saveLoanSettingSchema), saveLoanSettingController);

export default router;
