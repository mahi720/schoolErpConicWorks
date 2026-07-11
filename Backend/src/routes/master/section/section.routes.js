import express from "express";
import {
    createSection,
    getSections,
    getSectionBySlug,
    updateSection,
    deleteSection,
    restoreSection,
} from "../../../controllers/master/section/sectionController.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";
import {
    createSectionSchema,
    updateSectionSchema,
} from "../../../validations/master/section/section.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createSectionSchema), createSection);
router.get("/", getSections);
router.get("/:slug", getSectionBySlug);
// router.patch("/:slug/restore", validate(updateClassSchema), restoreClass);
router.patch("/:slug/restore", restoreSection);
router.patch("/:slug", validate(updateSectionSchema), updateSection);
router.delete("/:slug", deleteSection);

export default router;