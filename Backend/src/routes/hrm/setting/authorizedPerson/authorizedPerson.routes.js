import { Router } from "express";
import { validate } from "../../../../middleware/validate/validate.middleware.js";
import {
  createAuthorizedPersonController,
  getAuthorizedPersonsController,
  getAuthorizedPersonBySlugController,
  updateAuthorizedPersonController,
  deleteAuthorizedPersonController,
  restoreAuthorizedPersonController,
} from "../../../../controllers/hrm/settings/authorizedPerson/authorizedPerson.controller.js";
import {
  createAuthorizedPersonSchema,
  updateAuthorizedPersonSchema,
} from "../../../../validations/hrm/settings/authorizedPerson/authorizedPerson.validation.js";

const router = Router();

router.post("/", validate(createAuthorizedPersonSchema), createAuthorizedPersonController);
router.get("/", getAuthorizedPersonsController);
router.get("/:slug", getAuthorizedPersonBySlugController);
router.patch("/:slug", validate(updateAuthorizedPersonSchema), updateAuthorizedPersonController);
router.delete("/:slug", deleteAuthorizedPersonController);
router.patch("/:slug/restore", restoreAuthorizedPersonController);

export default router;
