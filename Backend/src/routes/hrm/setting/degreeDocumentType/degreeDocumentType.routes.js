import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createDegreeDocumentTypeController,
  getDegreeDocumentTypeListController,
  getDegreeDocumentTypeBySlugController,
  updateDegreeDocumentTypeController,
  deleteDegreeDocumentTypeController,
  restoreDegreeDocumentTypeController,
} from "../../../../controllers/hrm/settings/degreeDocumentType/degreeDocumentType.controller.js";
import {
  createDegreeDocumentTypeSchema,
  updateDegreeDocumentTypeSchema,
} from "../../../../validations/hrm/settings/degreeDocumentType/degreeDocumentType.validation.js";

const router = Router();

router.post("/", validate(createDegreeDocumentTypeSchema), createDegreeDocumentTypeController);
router.get("/", getDegreeDocumentTypeListController);
router.get("/:slug", getDegreeDocumentTypeBySlugController);
router.patch("/:slug", validate(updateDegreeDocumentTypeSchema), updateDegreeDocumentTypeController);
router.delete("/:slug", deleteDegreeDocumentTypeController);
router.patch("/:slug/restore", restoreDegreeDocumentTypeController);

export default router;
