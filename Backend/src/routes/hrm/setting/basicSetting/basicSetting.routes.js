import { Router } from "express";

import { validate } from "../../../../middleware/validate/validate.middleware.js";

import {
    createBasicSettingsController,
    getBasicSettingsController,
    getBasicSettingBySlugController,
    updateBasicSettingController,
    deleteBasicSettingController,
    restoreBasicSettingController,
} from "../../../../controllers/hrm/settings/basicSetting/basicSetting.controller.js";

import {
    createBasicSettingSchema,
    updateBasicSettingSchema,
} from "../../../../validations/hrm/settings/basicSetting/basicSetting.validation.js";

const router = Router();

router.post(
    "/",
    validate(createBasicSettingSchema),
    createBasicSettingsController,
);

router.get("/", getBasicSettingsController);

router.get("/:slug", getBasicSettingBySlugController);

router.patch(
    "/:slug",
    validate(updateBasicSettingSchema),
    updateBasicSettingController,
);

router.delete("/:slug", deleteBasicSettingController);

router.patch(
    "/:slug/restore",
    restoreBasicSettingController,
);

export default router;