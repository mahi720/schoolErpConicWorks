import prisma from "../../../../config/prisma.js";

export const createDesignationRepo = async (data) => {
    return prisma.hrmDesignation.create({
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

export const findDesignationDepartmentRepo = async ({
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

export const findDuplicateDesignationRepo = async ({
    schoolSlug,
    departmentSlug,
    designationName,
    designationLevel,
    excludeSlug,
}) => {
    return prisma.hrmDesignation.findFirst({
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
                    designationName,
                },
                {
                    designationLevel,
                },
            ],
        },
    });
};

export const getDesignationsRepo = async ({
    schoolSlug,
    departmentSlug,
    status,
    search,
}) => {
    return prisma.hrmDesignation.findMany({
        where: {
            schoolSlug,
            ...(departmentSlug ? { departmentSlug } : {}),
            ...(status ? { status } : {}),
            ...(search
                ? {
                    designationName: {
                        contains: search,
                    },
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

export const getDesignationBySlugRepo = async ({
    schoolSlug,
    slug,
}) => {
    return prisma.hrmDesignation.findFirst({
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

export const updateDesignationRepo = async ({
    slug,
    data,
}) => {
    return prisma.hrmDesignation.update({
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

export const deleteDesignationRepo = async ({ slug }) => {
    return prisma.hrmDesignation.update({
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

export const restoreDesignationRepo = async ({ slug }) => {
    return prisma.hrmDesignation.update({
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