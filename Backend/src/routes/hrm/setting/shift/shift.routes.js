import { Router } from "express";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createShiftController,
    getShiftsController,
    getShiftBySlugController,
    updateShiftController,
    deleteShiftController,
    restoreShiftController,
} from "../../../../controllers/hrm/settings/shift/shift.controller.js";

import {
    createShiftSchema,
    updateShiftSchema,
} from "../../../../validations/hrm/settings/shift/shift.validation.js";

const router = Router();

router.post(
    "/",
    validate(createShiftSchema),
    createShiftController,
);

router.get("/", getShiftsController);

router.get("/:slug", getShiftBySlugController);

router.patch(
    "/:slug",
    validate(updateShiftSchema),
    updateShiftController,
);

router.delete("/:slug", deleteShiftController);

router.patch("/:slug/restore", restoreShiftController);

export default router;