import crypto from "crypto";
import {
    createSubjectRepo,
    getSubjectsRepo,
    getSubjectBySlugRepo,
    findSubjectByTitleRepo,
    updateSubjectRepo,
    deleteSubjectRepo,
    getSubjectBySlugForRestoreRepo,
    restoreSubjectRepo,
    findBoardByTitleRepo,
} from "../../../repositories/master/subject/subject.repository.js";

const generateSlug = () => crypto.randomUUID();

export const createSubjectService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");
    if (!body.board) throw new Error("Board is required");
    if (!body.subjectTitle) throw new Error("Subject title is required");
    if (!body.subjectType) throw new Error("Subject type is required");
    if (body.subjectOrder === undefined || body.subjectOrder === null) {
        throw new Error("Subject order is required");
    }

    const boardData = await findBoardByTitleRepo(schoolSlug, body.board.trim());

    if (!boardData) {
        throw new Error("Board not found");
    }

    const subjectTitle = body.subjectTitle.trim();

    const existingSubject = await findSubjectByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        subjectTitle,
    });

    if (existingSubject) throw new Error("Subject already exists for this board");

    return createSubjectRepo({
        slug: generateSlug(),
        schoolSlug,
        boardSlug: boardData.slug,
        subjectTitle,
        subjectType: body.subjectType,
        subjectOrder: Number(body.subjectOrder),
        status: body.status || "active",
    });
};

export const getSubjectsService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");
    if (!query.board) throw new Error("Board is required");

    const boardData = await findBoardByTitleRepo(schoolSlug, query.board.trim());

    if (!boardData) {
        throw new Error("Board not found");
    }

    return getSubjectsRepo({
        schoolSlug,
        boardSlug: boardData.slug,
    });
};

export const getSubjectBySlugService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const subject = await getSubjectBySlugRepo(slug, schoolSlug);
    if (!subject) throw new Error("Subject not found");

    return {
        ...subject,
        board: subject.board?.title,
    };
};

export const updateSubjectService = async (slug, body, user) => {
    const schoolSlug = user?.schoolSlug;

    const subject = await getSubjectBySlugRepo(slug, schoolSlug);
    if (!subject) throw new Error("Subject not found");

    const updateData = {};

    let finalBoardSlug = subject.boardSlug;

    if (body.board) {
        const boardData = await findBoardByTitleRepo(schoolSlug, body.board.trim());

        if (!boardData) {
            throw new Error("Board not found");
        }

        finalBoardSlug = boardData.slug;
        updateData.boardSlug = boardData.slug;
    }

    if (body.subjectTitle) {
        const subjectTitle = body.subjectTitle.trim();

        if (
            subjectTitle !== subject.subjectTitle ||
            finalBoardSlug !== subject.boardSlug
        ) {
            const existingSubject = await findSubjectByTitleRepo({
                schoolSlug,
                boardSlug: finalBoardSlug,
                subjectTitle,
            });

            if (existingSubject && existingSubject.slug !== slug) {
                throw new Error("Subject already exists for this board");
            }
        }

        updateData.subjectTitle = subjectTitle;
    }

    if (body.subjectType) updateData.subjectType = body.subjectType;

    if (body.subjectOrder !== undefined) {
        updateData.subjectOrder = Number(body.subjectOrder);
    }

    if (body.status) updateData.status = body.status;

    return updateSubjectRepo(subject.id, updateData);
};

export const deleteSubjectService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const subject = await getSubjectBySlugRepo(slug, schoolSlug);
    if (!subject) throw new Error("Subject not found");

    return deleteSubjectRepo(subject.id);
};

export const restoreSubjectService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;
    if (!schoolSlug) throw new Error("School not found for this user");

    const subject = await getSubjectBySlugForRestoreRepo(slug, schoolSlug);
    if (!subject) throw new Error("Subject not found");

    return restoreSubjectRepo(subject.id);
};