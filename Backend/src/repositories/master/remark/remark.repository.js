import prisma from "../../../config/prisma.js";

export const findRemarkByTitleRepo = async ({
    schoolSlug,
    remarksTitle,
    excludeSlug,
}) => {
    return prisma.remark.findFirst({
        where: {
            schoolSlug,
            remarksTitle,

            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createRemarkRepo = async (data) => {
    return prisma.remark.create({
        data,
    });
};

export const getRemarksRepo = async ({
    schoolSlug,
    status,
}) => {
    const where = {
        schoolSlug,
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

    return prisma.remark.findMany({
        where,

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getRemarkBySlugRepo = async (
    slug,
    schoolSlug,
    includeDeleted = true,
) => {
    return prisma.remark.findFirst({
        where: {
            slug,
            schoolSlug,

            ...(!includeDeleted && {
                isActive: true,
                deletedAt: null,
            }),
        },
    });
};

export const updateRemarkRepo = async (
    slug,
    data,
) => {
    return prisma.remark.update({
        where: {
            slug,
        },

        data,
    });
};

export const deleteRemarkRepo = async (slug) => {
    return prisma.remark.update({
        where: {
            slug,
        },

        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreRemarkRepo = async (slug) => {
    return prisma.remark.update({
        where: {
            slug,
        },

        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};