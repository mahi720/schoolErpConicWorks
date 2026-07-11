import express from "express";
import {
    createStream,
    getStreams,
    getStreamBySlug,
    updateStream,
    deleteStream,
    restoreStream,
} from "../../../controllers/master/stream/streamController.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";
import {
    createStreamSchema,
    updateStreamSchema,
} from "../../../validations/master/stream/stream.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createStreamSchema), createStream);
router.get("/", getStreams);
router.get("/:slug", getStreamBySlug);
// router.patch("/:slug/restore", validate(updateClassSchema), restoreClass);
router.patch("/:slug/restore", restoreStream);
router.patch("/:slug", validate(updateStreamSchema), updateStream);
router.delete("/:slug", deleteStream);

export default router;