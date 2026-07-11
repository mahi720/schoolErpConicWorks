import express from "express";

import {
    createSubjectTopic,
    getSubjectTopics,
    getSubjectTopicBySlug,
    updateSubjectTopic,
    deleteSubjectTopic,
    restoreSubjectTopic,
} from "../../../controllers/master/createTopicInSubject/subjectTopicController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createSubjectTopicSchema,
    updateSubjectTopicSchema,
} from "../../../validations/master/createTopicInSubject/subjectTopic.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    validate(createSubjectTopicSchema),
    createSubjectTopic
);

router.get("/", getSubjectTopics);

router.get("/:slug", getSubjectTopicBySlug);

router.patch("/:slug/restore", restoreSubjectTopic);

router.patch(
    "/:slug",
    validate(updateSubjectTopicSchema),
    updateSubjectTopic
);

router.delete("/:slug", deleteSubjectTopic);

export default router;