import prisma from "../../../config/prisma.js";

export const createBoardRepo = async (data) => {
    return prisma.board.create({ data });
};

export const getBoardsRepo = async (schoolSlug) => {
    return prisma.board.findMany({
        where: {
            schoolSlug,
            deletedAt: null,
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getBoardBySlugRepo = async (slug, schoolSlug) => {
    return prisma.board.findFirst({
        where: {
            slug,
            schoolSlug,
            deletedAt: null,
        },
    });
};

export const updateBoardRepo = async (id, data) => {
    return prisma.board.update({
        where: { id },
        data,
    });
};

export const deleteBoardRepo = async (id) => {
    return prisma.board.update({
        where: { id },
        data: {
            deletedAt: new Date(),
            isActive: false,
        },
    });
};

export const findBoardByTitleRepo = async (title, schoolSlug) => {
    return prisma.board.findFirst({
        where: {
            title,
            schoolSlug,
            deletedAt: null,
        },
    });
};