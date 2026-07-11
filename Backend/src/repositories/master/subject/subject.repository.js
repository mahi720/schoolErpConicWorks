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

export const createSubjectRepo = async (data) => {
    return prisma.subject.create({
        data,
        include: {
            board: {
                select: { title: true },
            },
        },
    });
};

export const getSubjectsRepo = async ({ schoolSlug, boardSlug }) => {
    return prisma.subject.findMany({
        where: {
            schoolSlug,
            boardSlug,
            isActive: true,
            deletedAt: null,
        },
        include: {
            board: {
                select: { title: true },
            },
        },
        orderBy: { subjectOrder: "asc" },
    });
};

export const getSubjectBySlugRepo = async (slug, schoolSlug) => {
    return prisma.subject.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
        include: {
            board: {
                select: { title: true },
            },
        },
    });
};

export const findSubjectByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    subjectTitle,
}) => {
    return prisma.subject.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            subjectTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const updateSubjectRepo = async (id, data) => {
    return prisma.subject.update({
        where: { id },
        data,
        include: {
            board: {
                select: { title: true },
            },
        },
    });
};

export const deleteSubjectRepo = async (id) => {
    return prisma.subject.update({
        where: { id },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const getSubjectBySlugForRestoreRepo = async (slug, schoolSlug) => {
    return prisma.subject.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: false,
            deletedAt: { not: null },
        },
    });
};

export const restoreSubjectRepo = async (id) => {
    return prisma.subject.update({
        where: { id },
        data: {
            isActive: true,
            deletedAt: null,
            status: "active",
        },
    });
};