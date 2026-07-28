import express from "express";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createStudentHealthAssessmentSchema,
    updateStudentHealthAssessmentSchema,
    createStudentOtherInformationSchema,
    updateStudentOtherInformationSchema,
} from "../../../validations/academic/studentHealthManagement/studentHealthManagement.validations.js";

import { getHealthManagementStudentsController } from "../../../controllers/academic/studentHealthManagement/studentHealthStudent.controller.js";

import {
    createStudentHealthAssessmentController,
    getStudentHealthAssessmentBySlugController,
    getStudentHealthAssessmentByStudentController,
    updateStudentHealthAssessmentController,
    deleteStudentHealthAssessmentController,
    restoreStudentHealthAssessmentController,
} from "../../../controllers/academic/studentHealthManagement/studentHealthAssessment.controller.js";

import {
    createStudentOtherInformationController,
    getStudentOtherInformationBySlugController,
    getStudentOtherInformationByStudentController,
    updateStudentOtherInformationController,
    deleteStudentOtherInformationController,
    restoreStudentOtherInformationController,
} from "../../../controllers/academic/studentHealthManagement/studentOtherInformation.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
    "/students",
    getHealthManagementStudentsController,
);

router.post(
    "/health-assessments",
    validate(createStudentHealthAssessmentSchema),
    createStudentHealthAssessmentController,
);

router.get(
    "/health-assessments/student",
    getStudentHealthAssessmentByStudentController,
);

router.get(
    "/health-assessments/:slug",
    getStudentHealthAssessmentBySlugController,
);

router.patch(
    "/health-assessments/:slug",
    validate(updateStudentHealthAssessmentSchema),
    updateStudentHealthAssessmentController,
);

router.delete(
    "/health-assessments/:slug",
    deleteStudentHealthAssessmentController,
);

router.patch(
    "/health-assessments/:slug/restore",
    restoreStudentHealthAssessmentController,
);

router.post(
    "/other-information",
    validate(createStudentOtherInformationSchema),
    createStudentOtherInformationController,
);

router.get(
    "/other-information/student/:studentSlug",
    getStudentOtherInformationByStudentController,
);

router.get(
    "/other-information/:slug",
    getStudentOtherInformationBySlugController,
);

router.patch(
    "/other-information/:slug",
    validate(updateStudentOtherInformationSchema),
    updateStudentOtherInformationController,
);

router.delete(
    "/other-information/:slug",
    deleteStudentOtherInformationController,
);

router.patch(
    "/other-information/:slug/restore",
    restoreStudentOtherInformationController,
);

export default router;