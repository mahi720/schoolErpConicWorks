import express from "express";

import { authMiddleware } from "../../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createAdvancePolicySchema,
    updateAdvancePolicySchema,
} from "../../../../validations/HRM/settings/advancePolicy/advancePolicy.validation.js";

import {
    createAdvancePolicyController,
    getAdvancePoliciesController,
    getAdvancePolicyBySlugController,
    updateAdvancePolicyController,
    deleteAdvancePolicyController,
    restoreAdvancePolicyController,
} from "../../../../controllers/HRM/settings/advancePolicy/advancePolicy.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createAdvancePolicySchema),
    createAdvancePolicyController,
);

router.get("/", getAdvancePoliciesController);

router.patch("/:slug/restore", restoreAdvancePolicyController);

router.get("/:slug", getAdvancePolicyBySlugController);

router.patch(
    "/:slug",
    validate(updateAdvancePolicySchema),
    updateAdvancePolicyController,
);

router.delete("/:slug", deleteAdvancePolicyController);

export default router;
