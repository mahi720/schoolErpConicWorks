import express from "express";
import {
    createClass,
    getClasses,
    getClassBySlug,
    updateClass,
    deleteClass,
    restoreClass,
} from "../../../controllers/master/class/classController.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";
import {
    createClassSchema,
    updateClassSchema,
} from "../../../validations/master/class/class.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createClassSchema), createClass);
router.get("/", getClasses);
router.get("/:slug", getClassBySlug);
// router.patch("/:slug/restore", validate(updateClassSchema), restoreClass);
router.patch("/:slug/restore", restoreClass);
router.patch("/:slug", validate(updateClassSchema), updateClass);
router.delete("/:slug", deleteClass);

export default router;