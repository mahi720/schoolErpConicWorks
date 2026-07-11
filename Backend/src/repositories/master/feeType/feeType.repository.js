import prisma from "../../../config/prisma.js";

const feeTypeInclude = {
    board: {
        select: {
            slug: true,
            title: true,
        },
    },
};

export const findBoardByTitleRepo = async (
    schoolSlug,
    boardTitle
) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: boardTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findFeeTypeByNameRepo = async ({
    schoolSlug,
    boardSlug,
    feeType,
    excludeSlug,
}) => {
    return prisma.feeType.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            feeType,

            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createFeeTypeRepo = async (data) => {
    return prisma.feeType.create({
        data,
        include: feeTypeInclude,
    });
};

export const getFeeTypesRepo = async ({
    schoolSlug,
    boardSlug,
    status,
}) => {
    const where = {
        schoolSlug,
        boardSlug,
    };

    if (status === "active") {
        where.status = "active";
        where.isActive = true;
        where.deletedAt = null;
    }

    if (status === "inactive") {
        where.status = "inactive";
        where.isActive = false;
        where.deletedAt = {
            not: null,
        };
    }

    return prisma.feeType.findMany({
        where,
        include: feeTypeInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getFeeTypeBySlugRepo = async (
    slug,
    schoolSlug,
    includeDeleted = true
) => {
    return prisma.feeType.findFirst({
        where: {
            slug,
            schoolSlug,

            ...(!includeDeleted && {
                isActive: true,
                deletedAt: null,
            }),
        },

        include: feeTypeInclude,
    });
};

export const updateFeeTypeRepo = async (
    slug,
    data
) => {
    return prisma.feeType.update({
        where: {
            slug,
        },
        data,
        include: feeTypeInclude,
    });
};

export const deleteFeeTypeRepo = async (slug) => {
    return prisma.feeType.update({
        where: {
            slug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        include: feeTypeInclude,
    });
};

export const restoreFeeTypeRepo = async (slug) => {
    return prisma.feeType.update({
        where: {
            slug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        include: feeTypeInclude,
    });
};