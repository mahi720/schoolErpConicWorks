import prisma from "../../../../config/prisma.js";

export const createDepartmentRepo = async (data) => {
    return prisma.hrmDepartment.create({
        data,
    });
};

export const findDepartmentByNameRepo = async ({
    schoolSlug,
    departmentName,
    excludeSlug,
}) => {
    return prisma.hrmDepartment.findFirst({
        where: {
            schoolSlug,
            departmentName,
            ...(excludeSlug
                ? {
                    NOT: {
                        slug: excludeSlug,
                    },
                }
                : {}),
        },
    });
};

export const getDepartmentsRepo = async ({
    schoolSlug,
    status,
    search,
}) => {
    return prisma.hrmDepartment.findMany({
        where: {
            schoolSlug,
            ...(status ? { status } : {}),
            ...(search
                ? {
                    departmentName: {
                        contains: search,
                    },
                }
                : {}),
        },
        include: {
            _count: {
                select: {
                    designations: true,
                    shifts: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const getDepartmentBySlugRepo = async ({
    schoolSlug,
    slug,
}) => {
    return prisma.hrmDepartment.findFirst({
        where: {
            schoolSlug,
            slug,
        },
        include: {
            designations: {
                where: {
                    isActive: true,
                },
                orderBy: {
                    designationLevel: "asc",
                },
            },
            shifts: {
                where: {
                    isActive: true,
                },
                orderBy: {
                    shiftName: "asc",
                },
            },
        },
    });
};

export const updateDepartmentRepo = async ({
    slug,
    data,
}) => {
    return prisma.hrmDepartment.update({
        where: {
            slug,
        },
        data,
    });
};

export const deleteDepartmentRepo = async ({ slug }) => {
    return prisma.hrmDepartment.update({
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

export const restoreDepartmentRepo = async ({ slug }) => {
    return prisma.hrmDepartment.update({
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