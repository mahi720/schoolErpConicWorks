import {
    createBoardService,
    getBoardsService,
    getBoardBySlugService,
    updateBoardService,
    deleteBoardService,
} from "../../../services/master/board/board.service.js";
import { successResponse, errorResponse } from "../../../utils/apiResponse.js";

export const createBoard = async (req, res) => {
    try {
        const boardData = await createBoardService(req.body, req.user);

        return successResponse(
            res,
            201,
            "Board created successfully",
            boardData
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getBoards = async (req, res) => {
    try {
        const boards = await getBoardsService(req.user);

        return successResponse(
            res,
            200,
            "Boards fetched successfully",
            boards
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const getBoardBySlug = async (req, res) => {
    try {
        const board = await getBoardBySlugService(
            req.params.slug,
            req.user
        );

        return successResponse(
            res,
            200,
            "Board fetched successfully",
            board
        );
    } catch (error) {
        return errorResponse(res, 404, error.message);
    }
};

export const updateBoard = async (req, res) => {
    try {
        const updatedBoard = await updateBoardService(
            req.params.slug,
            req.body,
            req.user
        );

        return successResponse(
            res,
            200,
            "Board updated successfully",
            updatedBoard
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};

export const deleteBoard = async (req, res) => {
    try {
        await deleteBoardService(req.params.slug, req.user);

        return successResponse(
            res,
            200,
            "Board deleted successfully"
        );
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
};