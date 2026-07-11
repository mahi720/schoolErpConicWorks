import express from "express";

import {
    createSchool,
    getSchools,
    getSchoolBySlug,
    getMySchool,
    updateSchool,
    updateMySchool,
    deleteSchool,
    restoreSchool,
} from "../../../controllers/master/school/school.controller.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";
import { uploadSchoolLogo } from "../../../middleware/upload/upload.middleware.js";

import {
    createSchoolSchema,
    updateSchoolSchema,
} from "../../../validations/master/school/school.validation.js";

const router = express.Router();

router.use(authMiddleware);

//   Current logged-in school routes.

router.get("/me/info", getMySchool);

router.patch(
    "/me/info",
    uploadSchoolLogo.single("logo"),
    validate(updateSchoolSchema),
    updateMySchool,
);


//   Super Admin CRUD routes

router.post(
    "/",
    uploadSchoolLogo.single("logo"),
    validate(createSchoolSchema),
    createSchool,
);

router.get("/", getSchools);

router.get("/:slug", getSchoolBySlug);

router.patch(
    "/:slug",
    uploadSchoolLogo.single("logo"),
    validate(updateSchoolSchema),
    updateSchool,
);

router.delete("/:slug", deleteSchool);

router.patch("/:slug/restore", restoreSchool);

export default router;