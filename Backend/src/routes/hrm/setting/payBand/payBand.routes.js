import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import { hrmPayBandUpload } from "../../../../middleware/upload/hrmPayBandUpload.js";
import {
  createPayBandController,
  getPayBandsController,
  getPayBandBySlugController,
  updatePayBandController,
  deletePayBandController,
  restorePayBandController,
} from "../../../../controllers/hrm/settings/payBand/payBand.controller.js";
import {
  createPayBandSchema,
  updatePayBandSchema,
} from "../../../../validations/hrm/settings/payBand/payBand.validation.js";

const router = Router();

router.post("/", hrmPayBandUpload.single("image"), validate(createPayBandSchema), createPayBandController);
router.get("/", getPayBandsController);
router.get("/:slug", getPayBandBySlugController);
router.patch("/:slug", hrmPayBandUpload.single("image"), validate(updatePayBandSchema), updatePayBandController);
router.delete("/:slug", deletePayBandController);
router.patch("/:slug/restore", restorePayBandController);

export default router;
