import prisma from "../../../config/prisma.js";

const topicInclude = {
    addedSubjectToClass: {
        select: {
            slug: true,
            schoolSlug: true,
            sessionSlug: true,
            boardSlug: true,
            classSlug: true,
            subjectSlug: true,
            streamSlug: true,
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
        include: {
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
                    classTitle: true,
                    classType: true,
                },
            },
            stream: {
                select: {
                    streamTitle: true,
                },
            },
            subject: {
                select: {
                    subjectTitle: true,
                    subjectType: true,
                },
            },
        },
    });
};

export const findDuplicateSubjectTopicRepo = async ({
    addedSubjectToClassSlug,
    topicTitle,
    topicGroup,
    excludeSlug,
}) => {
    return prisma.subjectTopic.findFirst({
        where: {
            addedSubjectToClassSlug,
            topicTitle,
            topicGroup,

            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createSubjectTopicRepo = async (data) => {
    return prisma.subjectTopic.create({
        data,
        include: topicInclude,
    });
};

export const getSubjectTopicsRepo = async ({
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

    return prisma.subjectTopic.findMany({
        where,
        include: topicInclude,
        orderBy: [
            {
                topicGroup: "asc",
            },
            {
                createdAt: "asc",
            },
        ],
    });
};

export const getSubjectTopicBySlugRepo = async (
    slug,
    schoolSlug,
    includeDeleted = true
) => {
    return prisma.subjectTopic.findFirst({
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
        include: topicInclude,
    });
};

export const updateSubjectTopicRepo = async (slug, data) => {
    return prisma.subjectTopic.update({
        where: {
            slug,
        },
        data,
        include: topicInclude,
    });
};

export const deleteSubjectTopicRepo = async (slug) => {
    return prisma.subjectTopic.update({
        where: {
            slug,
        },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
        include: topicInclude,
    });
};

export const restoreSubjectTopicRepo = async (slug) => {
    return prisma.subjectTopic.update({
        where: {
            slug,
        },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        include: topicInclude,
    });
};