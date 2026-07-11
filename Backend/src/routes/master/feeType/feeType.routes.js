import express from "express";

import {
    createFeeType,
    getFeeTypes,
    getFeeTypeBySlug,
    updateFeeType,
    deleteFeeType,
    restoreFeeType,
} from "../../../controllers/master/feeType/feesTypeController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createFeeTypeSchema,
    updateFeeTypeSchema,
} from "../../../validations/master/feeType/feeType.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createFeeTypeSchema),
    createFeeType
);

router.get("/", getFeeTypes);

router.get("/:slug", getFeeTypeBySlug);

router.patch(
    "/:slug/restore",
    restoreFeeType
);

router.patch(
    "/:slug",
    validate(updateFeeTypeSchema),
    updateFeeType
);

router.delete("/:slug", deleteFeeType);

export default router;