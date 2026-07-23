import express from "express";

import {
    createStudent,
    getStudents,
    getStudentBySlug,
    updateStudent,
    deleteStudent,
    restoreStudent,
} from "../../../controllers/academic/addNewStudent/student.controller.js";
import { studentImageUpload } from "../../../middleware/upload/studentImageUpload.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createStudentSchema,
    updateStudentSchema,
} from "../../../validations/academic/addNewStudent/student.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    studentImageUpload.single(
        "profileImage",
    ),
    validate(createStudentSchema),
    createStudent
);

router.get(
    "/",
    getStudents
);

router.get(
    "/:slug",
    getStudentBySlug
);

router.patch(
    "/:slug/restore",
    restoreStudent
);

router.patch(
    "/:slug",
    studentImageUpload.single(
        "profileImage",
    ),
    validate(updateStudentSchema),
    updateStudent
);

router.delete(
    "/:slug",
    deleteStudent
);

export default router;