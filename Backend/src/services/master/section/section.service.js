import crypto from "crypto";
import {
    createSectionRepo,
    getSectionsRepo,
    getSectionBySlugRepo,
    findSectionByTitleRepo,
    updateSectionRepo,
    deleteSectionRepo,
    findBoardByTitleRepo,
    restoreSectionRepo,
    getSectionBySlugForRestoreRepo,
} from "../../../repositories/master/section/section.repository.js";

const generateSlug = () => crypto.randomUUID();

export const createSectionService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");
    if (!body.board) throw new Error("Board is required");
    if (!body.sectionTitle) throw new Error("Section title is required");

    const boardTitle = body.board.trim();
    const sectionTitle = body.sectionTitle.trim();

    const boardData = await findBoardByTitleRepo(schoolSlug, boardTitle);

    if (!boardData) {
        throw new Error("Board not found");
    }

    const existingSection = await findSectionByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        sectionTitle,
    });

    if (existingSection) throw new Error("Section already exists");

    return createSectionRepo({
        slug: generateSlug(),
        schoolSlug,
        boardSlug: boardData.slug,
        sectionTitle,
        status: body.status || "active",
    });
};

export const getSectionsService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    return getSectionsRepo({
        schoolSlug,
        board: query.board,
    });
};

export const getSectionBySlugService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const sectionData = await getSectionBySlugRepo(slug, schoolSlug);

    if (!sectionData) throw new Error("Section not found");

    return sectionData;
};

export const updateSectionService = async (slug, body, user) => {
    const schoolSlug = user?.schoolSlug;

    const sectionData = await getSectionBySlugRepo(slug, schoolSlug);

    if (!sectionData) throw new Error("Section not found");

    const updateData = {};

    if (body.sectionTitle) {
        updateData.sectionTitle = body.sectionTitle.trim();
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

    return updateSectionRepo(sectionData.id, updateData);
};

export const deleteSectionService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const sectionData = await getSectionBySlugRepo(slug, schoolSlug);

    if (!sectionData) throw new Error("Section not found");

    return deleteSectionRepo(sectionData.id);
};

export const restoreSectionService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const sectionData = await getSectionBySlugForRestoreRepo(slug, schoolSlug);

    if (!sectionData) {
        throw new Error("Section not found");
    }

    return restoreSectionRepo(sectionData.id);
};