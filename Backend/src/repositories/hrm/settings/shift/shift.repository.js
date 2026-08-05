import prisma from "../../../../config/prisma.js";

export const createShiftRepo = async (data) => {
    return prisma.hrmShift.create({
        data,
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },
        },
    });
};

export const findShiftDepartmentRepo = async ({
    schoolSlug,
    departmentSlug,
}) => {
    return prisma.hrmDepartment.findFirst({
        where: {
            schoolSlug,
            slug: departmentSlug,
            isActive: true,
        },
    });
};

export const findDuplicateShiftRepo = async ({
    schoolSlug,
    departmentSlug,
    shiftName,
    shiftCode,
    excludeSlug,
}) => {
    return prisma.hrmShift.findFirst({
        where: {
            schoolSlug,
            departmentSlug,
            ...(excludeSlug
                ? {
                    NOT: {
                        slug: excludeSlug,
                    },
                }
                : {}),
            OR: [
                {
                    shiftName,
                },
                {
                    shiftCode,
                },
            ],
        },
    });
};

export const getShiftsRepo = async ({
    schoolSlug,
    departmentSlug,
    status,
}) => {
    return prisma.hrmShift.findMany({
        where: {
            schoolSlug,
            ...(departmentSlug
                ? {
                    departmentSlug,
                }
                : {}),
            ...(status
                ? {
                    status,
                }
                : {}),
        },
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const getShiftBySlugRepo = async ({
    schoolSlug,
    slug,
}) => {
    return prisma.hrmShift.findFirst({
        where: {
            schoolSlug,
            slug,
        },
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },
        },
    });
};

export const updateShiftRepo = async ({
    slug,
    data,
}) => {
    return prisma.hrmShift.update({
        where: {
            slug,
        },
        data,
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },
        },
    });
};

export const deleteShiftRepo = async ({ slug }) => {
    return prisma.hrmShift.update({
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

export const restoreShiftRepo = async ({ slug }) => {
    return prisma.hrmShift.update({
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