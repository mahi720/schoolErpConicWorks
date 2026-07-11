import prisma from "../../../config/prisma.js";

export const findSessionByNameRepo = async (schoolSlug, name) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findBoardByTitleRepo = async (schoolSlug, title) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findClassByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    classTitle,
}) => {
    return prisma.class.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            classTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findStreamByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    streamTitle,
}) => {
    return prisma.stream.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            streamTitle,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findSubjectsBySlugsRepo = async ({
    schoolSlug,
    boardSlug,
    subjectSlugs,
}) => {
    return prisma.subject.findMany({
        where: {
            schoolSlug,
            boardSlug,
            slug: {
                in: subjectSlugs,
            },
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findExistingClassSubjectRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    streamSlug,
    subjectSlug,
}) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            subjectSlug,
            streamSlug: streamSlug || null,
            isActive: true,
            deletedAt: null,
        },
    });
};

export const createClassSubjectsRepo = async (rows) => {
    return prisma.$transaction(
        rows.map((data) =>
            prisma.addSubjectToClass.create({
                data,
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
                            subjectOrder: true,
                        },
                    },
                },
            })
        )
    );
};

export const getClassSubjectsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    streamSlug,
}) => {
    const where = {
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        isActive: true,
        deletedAt: null,
    };

    if (streamSlug !== undefined) {
        where.streamSlug = streamSlug;
    }

    return prisma.addSubjectToClass.findMany({
        where,

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

            marksConfigs: {
                where: {
                    isActive: true,
                    deletedAt: null,
                },

                select: {
                    slug: true,
                    componentName: true,
                    totalMarks: true,
                    passingMarks: true,
                    status: true,
                    isActive: true,
                },

                orderBy: {
                    createdAt: "asc",
                },
            },
        },

        orderBy: {
            subject: {
                subjectOrder: "asc",
            },
        },
    });
};

export const getClassSubjectBySlugRepo = async (slug, schoolSlug) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            slug,
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
                    subjectOrder: true,
                },
            },
        },
    });
};

export const updateClassSubjectRepo = async (id, data) => {
    return prisma.addSubjectToClass.update({
        where: {
            id,
        },
        data,
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
                    subjectOrder: true,
                },
            },
        },
    });
};

export const deleteClassSubjectRepo = async (id) => {
    return prisma.addSubjectToClass.update({
        where: {
            id,
        },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const getDeletedClassSubjectRepo = async (slug, schoolSlug) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: false,
            deletedAt: {
                not: null,
            },
        },
    });
};

export const restoreClassSubjectRepo = async (id) => {
    return prisma.addSubjectToClass.update({
        where: {
            id,
        },
        data: {
            isActive: true,
            deletedAt: null,
            status: "active",
        },
    });
};