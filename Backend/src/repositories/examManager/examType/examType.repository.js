import prisma from "../../../config/prisma.js";

export const findSchoolByCodeRepo = async (schoolCode) => {
    return prisma.school.findFirst({
        where: {
            schoolCode,
            isActive: true,
        },
        select: {
            slug: true,
            schoolCode: true,
            schoolName: true,
        },
    });
};

export const findExamTypeByNameRepo = async ({
    schoolSlug,
    examType,
    excludeSlug,
}) => {
    return prisma.examType.findFirst({
        where: {
            schoolSlug,
            examType: {
                equals: examType,
            },
            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createExamTypeRepo = async (data) => {
    return prisma.examType.create({
        data,
    });
};

export const getExamTypesRepo = async ({
    schoolSlug,
    status,
    search,
}) => {
    return prisma.examType.findMany({
        where: {
            schoolSlug,
            ...(status &&
                status !== "all" && {
                status,
            }),
            ...(search && {
                OR: [
                    {
                        examType: {
                            contains: search,
                        },
                    },
                    {
                        description: {
                            contains: search,
                        },
                    },
                ],
            }),
        },
        orderBy: [
            {
                isActive: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const getExamTypeBySlugRepo = async ({
    slug,
    schoolSlug,
}) => {
    return prisma.examType.findFirst({
        where: {
            slug,
            schoolSlug,
        },
    });
};

export const updateExamTypeRepo = async ({
    slug,
    schoolSlug,
    data,
}) => {
    return prisma.examType.update({
        where: {
            slug,
            schoolSlug,
        },
        data,
    });
};

export const deleteExamTypeRepo = async ({
    slug,
    schoolSlug,
}) => {
    return prisma.examType.update({
        where: {
            slug,
            schoolSlug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreExamTypeRepo = async ({
    slug,
    schoolSlug,
}) => {
    return prisma.examType.update({
        where: {
            slug,
            schoolSlug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};