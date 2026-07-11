import express from "express";
import {
    createSession,
    getSessions,
    getSessionBySlug,
    updateSession,
    deleteSession,
} from "../../../controllers/master/session/sessionController.js";

import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSession);
router.get("/", getSessions);
router.get("/:slug", getSessionBySlug);
router.patch("/:slug", updateSession);
router.delete("/:slug", deleteSession);

export default router;