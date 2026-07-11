import express from "express";

import {
    createPaymentInfo,
    getMyPaymentInfo,
    updateMyPaymentInfo,
    deleteMyPaymentInfo,
    restoreMyPaymentInfo,
} from "../../../controllers/master/paymentInfo/paymentInfoController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createPaymentInfoSchema,
    updatePaymentInfoSchema,
} from "../../../validations/master/paymentInfo/paymentInfo.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createPaymentInfoSchema),
    createPaymentInfo,
);

router.get("/me", getMyPaymentInfo);

router.patch(
    "/me",
    validate(updatePaymentInfoSchema),
    updateMyPaymentInfo,
);

router.delete("/me", deleteMyPaymentInfo);

router.patch(
    "/me/restore",
    restoreMyPaymentInfo,
);

export default router;