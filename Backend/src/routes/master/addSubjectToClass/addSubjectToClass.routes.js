import express from "express";

import {
    createClassSubjects,
    getClassSubjects,
    getClassSubjectBySlug,
    updateClassSubject,
    deleteClassSubject,
    restoreClassSubject,
} from "../../../controllers/master/addSubjectToClass/addSubjectToClassController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createAddSubjectToClassSchema,
    updateAddSubjectToClassSchema,
} from "../../../validations/master/addSubjectToClass/addSubjectToClass.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createAddSubjectToClassSchema),
    createClassSubjects
);

router.get("/", getClassSubjects);

router.get("/:slug", getClassSubjectBySlug);

router.patch("/:slug/restore", restoreClassSubject);

router.patch(
    "/:slug",
    validate(updateAddSubjectToClassSchema),
    updateClassSubject
);

router.delete("/:slug", deleteClassSubject);

export default router;