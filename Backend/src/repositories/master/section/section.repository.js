import prisma from "../../../config/prisma.js";

export const findBoardByTitleRepo = async (schoolSlug, boardTitle) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: boardTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const createSectionRepo = async (data) => {
    return prisma.section.create({
        data,
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
    });
};

export const getSectionsRepo = async ({ schoolSlug, board }) => {
    const where = {
        schoolSlug,
        isActive: true,
        deletedAt: null,
    };

    if (board) {
        const boardData = await findBoardByTitleRepo(schoolSlug, board);

        if (!boardData) {
            return [];
        }

        where.boardSlug = boardData.slug;
    }

    const sections = await prisma.section.findMany({
        where,
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return sections.map((item) => ({
        ...item,
        board: item.board?.title,
    }));
};

export const getSectionBySlugRepo = async (slug, schoolSlug) => {
    const section = await prisma.section.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
    });

    if (!section) return null;

    return {
        ...section,
        board: section.board?.title,
    };
};

export const findSectionByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    sectionTitle,
}) => {
    return prisma.section.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            sectionTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const updateSectionRepo = async (id, data) => {
    return prisma.section.update({
        where: { id },
        data,
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
    });
};

export const deleteSectionRepo = async (id) => {
    return prisma.section.update({
        where: { id },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const getSectionBySlugForRestoreRepo = async (slug, schoolSlug) => {
    return prisma.section.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: false,
            deletedAt: {
                not: null,
            },
        },
    });
};

export const restoreSectionRepo = async (id) => {
    return prisma.section.update({
        where: { id },
        data: {
            isActive: true,
            deletedAt: null,
            status: "active",
        },
    });
};