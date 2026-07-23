import express from "express";

import {
    getAcademicMappingSetupController,
    getUnmappedStudentsController,
    createStudentAcademicMappingController,
    getMappedStudentsController,
    getStudentAcademicMappingBySlugController,
    updateStudentAcademicMappingController,
    deleteStudentAcademicMappingController,
    restoreStudentAcademicMappingController,
} from "../../../controllers/academic/studentAcademicMapping/studentAcademicMapping.controller.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createStudentAcademicMappingSchema,
    updateStudentAcademicMappingSchema,
} from "../../../validations/academic/studentAcademicMapping/studentAcademicMapping.validation.js";

const router = express.Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Static Routes
|--------------------------------------------------------------------------
|
| Static routes ko /:slug se pehle rakhna zaroori hai.
|
*/

router.get(
    "/setup",
    getAcademicMappingSetupController,
);

router.get(
    "/unmapped-students",
    getUnmappedStudentsController,
);

router.get(
    "/mapped-students",
    getMappedStudentsController,
);

router.post(
    "/",
    validate(createStudentAcademicMappingSchema),
    createStudentAcademicMappingController,
);

/*
|--------------------------------------------------------------------------
| Dynamic Routes
|--------------------------------------------------------------------------
*/

router.patch(
    "/:slug/restore",
    restoreStudentAcademicMappingController,
);

router.get(
    "/:slug",
    getStudentAcademicMappingBySlugController,
);

router.patch(
    "/:slug",
    validate(updateStudentAcademicMappingSchema),
    updateStudentAcademicMappingController,
);

router.delete(
    "/:slug",
    deleteStudentAcademicMappingController,
);

export default router;