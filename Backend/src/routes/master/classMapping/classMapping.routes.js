import express from "express";

import {
    createClassMapping,
    getClassMappings,
} from "../../../controllers/master/classMapping/classMapping.controller.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";

import {
    createClassMappingSchema,
} from "../../../validations/master/classMapping/classMapping.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createClassMappingSchema), createClassMapping);
router.get("/", getClassMappings);

export default router;