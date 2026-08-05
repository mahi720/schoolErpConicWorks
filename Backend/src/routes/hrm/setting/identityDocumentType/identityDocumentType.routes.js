import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createIdentityDocumentTypeController,
  getIdentityDocumentTypeListController,
  getIdentityDocumentTypeBySlugController,
  updateIdentityDocumentTypeController,
  deleteIdentityDocumentTypeController,
  restoreIdentityDocumentTypeController,
} from "../../../../controllers/hrm/settings/identityDocumentType/identityDocumentType.controller.js";
import {
  createIdentityDocumentTypeSchema,
  updateIdentityDocumentTypeSchema,
} from "../../../../validations/hrm/settings/identityDocumentType/identityDocumentType.validation.js";

const router = Router();

router.post("/", validate(createIdentityDocumentTypeSchema), createIdentityDocumentTypeController);
router.get("/", getIdentityDocumentTypeListController);
router.get("/:slug", getIdentityDocumentTypeBySlugController);
router.patch("/:slug", validate(updateIdentityDocumentTypeSchema), updateIdentityDocumentTypeController);
router.delete("/:slug", deleteIdentityDocumentTypeController);
router.patch("/:slug/restore", restoreIdentityDocumentTypeController);

export default router;
