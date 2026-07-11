import prisma from "../../../config/prisma.js";

const marksConfigInclude = {
    addedSubjectToClass: {
        select: {
            slug: true,
            schoolSlug: true,
            sessionSlug: true,
            boardSlug: true,
            classSlug: true,
            streamSlug: true,
            subjectSlug: true,
            studyType: true,

            session: {
                select: {
                    name: true,
                },
            },

            board: {
                select: {
                    title: true,
                },
            },

            class: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },

            stream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },

            subject: {
                select: {
                    slug: true,
                    subjectTitle: true,
                    subjectType: true,
                    subjectOrder: true,
                },
            },
        },
    },
};

export const findAddedSubjectToClassBySlugRepo = async (
    addedSubjectToClassSlug,
    schoolSlug
) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            slug: addedSubjectToClassSlug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findDuplicateMarksConfigRepo = async ({
    addedSubjectToClassSlug,
    componentName,
    excludeSlug,
}) => {
    return prisma.subjectMarksConfig.findFirst({
        where: {
            addedSubjectToClassSlug,
            componentName,

            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createSubjectMarksConfigRepo = async (data) => {
    return prisma.subjectMarksConfig.create({
        data,
        include: marksConfigInclude,
    });
};

export const getSubjectMarksConfigsRepo = async ({
    schoolSlug,
    addedSubjectToClassSlug,
    status,
}) => {
    const where = {
        addedSubjectToClassSlug,

        addedSubjectToClass: {
            schoolSlug,
        },
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

    return prisma.subjectMarksConfig.findMany({
        where,
        include: marksConfigInclude,
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const getSubjectMarksConfigBySlugRepo = async (
    slug,
    schoolSlug,
    includeDeleted = true
) => {
    return prisma.subjectMarksConfig.findFirst({
        where: {
            slug,

            addedSubjectToClass: {
                schoolSlug,
            },

            ...(!includeDeleted && {
                isActive: true,
                deletedAt: null,
            }),
        },
        include: marksConfigInclude,
    });
};

export const updateSubjectMarksConfigRepo = async (
    slug,
    data
) => {
    return prisma.subjectMarksConfig.update({
        where: {
            slug,
        },
        data,
        include: marksConfigInclude,
    });
};

export const deleteSubjectMarksConfigRepo = async (slug) => {
    return prisma.subjectMarksConfig.update({
        where: {
            slug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        include: marksConfigInclude,
    });
};

export const restoreSubjectMarksConfigRepo = async (slug) => {
    return prisma.subjectMarksConfig.update({
        where: {
            slug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        include: marksConfigInclude,
    });
};