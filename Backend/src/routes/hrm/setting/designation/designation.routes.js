import { Router } from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createDesignationController,
    getDesignationsController,
    getDesignationBySlugController,
    updateDesignationController,
    deleteDesignationController,
    restoreDesignationController,
} from "../../../../controllers/hrm/settings/designation/designation.controller.js";

import {
    createDesignationSchema,
    updateDesignationSchema,
} from "../../../../validations/hrm/settings/designation/designation.validation.js";

const router = Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createDesignationSchema),
    createDesignationController,
);

router.get("/", getDesignationsController);

router.get("/:slug", getDesignationBySlugController);

router.patch(
    "/:slug",
    validate(updateDesignationSchema),
    updateDesignationController,
);

router.delete("/:slug", deleteDesignationController);

router.patch("/:slug/restore", restoreDesignationController);

export default router;