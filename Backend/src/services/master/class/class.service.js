import crypto from "crypto";
import {
    createClassRepo,
    getClassesRepo,
    getClassBySlugRepo,
    findClassByTitleRepo,
    updateClassRepo,
    deleteClassRepo,
    findBoardByTitleRepo,
    restoreClassRepo,
    getClassBySlugForRestoreRepo,
} from "../../../repositories/master/class/class.repository.js";

const generateSlug = () => crypto.randomUUID();

export const createClassService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");
    if (!body.board) throw new Error("Board is required");
    if (!body.classTitle) throw new Error("Class title is required");
    if (!body.classType && !body.type) throw new Error("Class type is required");

    const boardTitle = body.board.trim();
    const classTitle = body.classTitle.trim();
    const classType = body.classType || body.type;

    const boardData = await findBoardByTitleRepo(schoolSlug, boardTitle);

    if (!boardData) {
        throw new Error("Board not found");
    }

    const existingClass = await findClassByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        classTitle,
    });

    if (existingClass) throw new Error("Class already exists");

    return createClassRepo({
        slug: generateSlug(),
        schoolSlug,
        boardSlug: boardData.slug,
        classTitle,
        classType,
        status: body.status || "active",
    });
};

export const getClassesService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    return getClassesRepo({
        schoolSlug,
        board: query.board,
        session: query.session,
    });
};

export const getClassBySlugService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const classData = await getClassBySlugRepo(slug, schoolSlug);

    if (!classData) throw new Error("Class not found");

    return classData;
};

export const updateClassService = async (slug, body, user) => {
    const schoolSlug = user?.schoolSlug;

    const classData = await getClassBySlugRepo(slug, schoolSlug);

    if (!classData) throw new Error("Class not found");

    const updateData = {};

    if (body.classTitle) {
        updateData.classTitle = body.classTitle.trim();
    }

    if (body.classType || body.type) {
        updateData.classType = body.classType || body.type;
    }

    if (body.board) {
        const boardData = await findBoardByTitleRepo(
            schoolSlug,
            body.board.trim()
        );

        if (!boardData) {
            throw new Error("Board not found");
        }

        updateData.boardSlug = boardData.slug;
    }

    if (body.status) {
        updateData.status = body.status;
    }

    return updateClassRepo(classData.id, updateData);
};

export const deleteClassService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const classData = await getClassBySlugRepo(slug, schoolSlug);

    if (!classData) throw new Error("Class not found");

    return deleteClassRepo(classData.id);
};

export const restoreClassService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const classData = await getClassBySlugForRestoreRepo(slug, schoolSlug);

    if (!classData) {
        throw new Error("Class not found");
    }

    return restoreClassRepo(classData.id);
};