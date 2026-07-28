import express from "express";

import {
    createStudentPromotionsController,
    getStudentPromotionsController,
    getStudentPromotionBySlugController,
    getPromotionBatchController,
    rollbackPromotionBatchController,
} from "../../../controllers/academic/studentPromotion/studentPromotion.controller.js";

import {
    createStudentPromotionSchema,
    rollbackPromotionBatchSchema,
} from "../../../validations/academic/studentPromotion/studentPromotion.validation.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createStudentPromotionSchema),
    createStudentPromotionsController,
);

router.get(
    "/",
    getStudentPromotionsController,
);

router.get(
    "/batch/:batchSlug",
    getPromotionBatchController,
);

router.patch(
    "/batch/:batchSlug/rollback",
    validate(rollbackPromotionBatchSchema),
    rollbackPromotionBatchController,
);

router.get(
    "/:slug",
    getStudentPromotionBySlugController,
);

export default router;