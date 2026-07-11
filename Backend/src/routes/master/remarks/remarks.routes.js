import express from "express";

import {
    createRemark,
    getRemarks,
    getRemarkBySlug,
    updateRemark,
    deleteRemark,
    restoreRemark,
} from "../../../controllers/master/remark/remarkController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createRemarkSchema,
    updateRemarkSchema,
} from "../../../validations/master/remark/remark.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createRemarkSchema),
    createRemark,
);

router.get("/", getRemarks);

router.get("/:slug", getRemarkBySlug);

router.patch(
    "/:slug/restore",
    restoreRemark,
);

router.patch(
    "/:slug",
    validate(updateRemarkSchema),
    updateRemark,
);

router.delete("/:slug", deleteRemark);

export default router;