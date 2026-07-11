import express from "express";
import {
    createBoard,
    getBoards,
    getBoardBySlug,
    updateBoard,
    deleteBoard,
} from "../../../controllers/master/board/boardController.js";
import { authMiddleware } from "../../../middleware/auth/auth.middleware.js";
import { validate } from "../../../middleware/validate/validate.middleware.js";
import {
    createBoardSchema,
    updateBoardSchema,
} from "../../../validations/master/board/board.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createBoardSchema), createBoard);
router.get("/", getBoards);
router.get("/:slug", getBoardBySlug);
router.patch("/:slug", validate(updateBoardSchema), updateBoard);
router.delete("/:slug", deleteBoard);

export default router;