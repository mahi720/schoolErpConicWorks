import express from "express";
import { login, logout, me, refreshAuth } from "../../controllers/auth/auth.controller.js";
import { validate } from "../../middleware/validate/validate.middleware.js";
import { loginSchema } from "../../validations/auth.validation.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", me);
router.post("/refresh", refreshAuth);

export default router;