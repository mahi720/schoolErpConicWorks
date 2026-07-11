import crypto from "crypto";
import {
    createBoardRepo,
    getBoardsRepo,
    getBoardBySlugRepo,
    updateBoardRepo,
    deleteBoardRepo,
    findBoardByTitleRepo,
} from "../../../repositories/master/board/board.repository.js";

const generateSlug = () => crypto.randomUUID();

const getSchoolSlug = (user) => {
    return user?.schoolSlug;
};

export const createBoardService = async (body, user) => {
    const schoolSlug = getSchoolSlug(user);

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    if (!body.title) {
        throw new Error("Board title is required");
    }

    const title = body.title.trim();

    const existingBoard = await findBoardByTitleRepo(title, schoolSlug);

    if (existingBoard) {
        throw new Error("Board already exists");
    }

    return createBoardRepo({
        slug: generateSlug(),
        schoolSlug,
        title,
        description: body.description || null,
        status: body.status || "active",
    });
};

export const getBoardsService = async (user) => {
    const schoolSlug = getSchoolSlug(user);

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    return getBoardsRepo(schoolSlug);
};

export const getBoardBySlugService = async (slug, user) => {
    const schoolSlug = getSchoolSlug(user);

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const board = await getBoardBySlugRepo(slug, schoolSlug);

    if (!board) {
        throw new Error("Board not found");
    }

    return board;
};

export const updateBoardService = async (slug, body, user) => {
    const schoolSlug = getSchoolSlug(user);

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const board = await getBoardBySlugRepo(slug, schoolSlug);

    if (!board) {
        throw new Error("Board not found");
    }

    const updateData = {};

    if (body.title) {
        const title = body.title.trim();

        if (title !== board.title) {
            const existingBoard = await findBoardByTitleRepo(title, schoolSlug);

            if (existingBoard) {
                throw new Error("Board already exists");
            }
        }

        updateData.title = title;
    }

    if (body.description !== undefined) {
        updateData.description = body.description || null;
    }

    if (body.status) {
        updateData.status = body.status;
    }

    return updateBoardRepo(board.id, updateData);
};

export const deleteBoardService = async (slug, user) => {
    const schoolSlug = getSchoolSlug(user);

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const board = await getBoardBySlugRepo(slug, schoolSlug);

    if (!board) {
        throw new Error("Board not found");
    }

    return deleteBoardRepo(board.id);
};