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

export const createClassRepo = async (data) => {
    return prisma.class.create({
        data,
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
    });
};

export const getClassesRepo = async ({ schoolSlug, board, session }) => {
    const where = {
        schoolSlug,
        isActive: true,
        deletedAt: null,
    };

    let boardSlug = null;
    let sessionSlug = null;

    if (board) {
        const boardData = await findBoardByTitleRepo(schoolSlug, board);

        if (!boardData) {
            return [];
        }

        boardSlug = boardData.slug;
        where.boardSlug = boardData.slug;
    }

    if (session) {
        const sessionData = await prisma.session.findFirst({
            where: {
                schoolSlug,
                name: session,
                isActive: true,
                deletedAt: null,
            },
        });

        if (sessionData) {
            sessionSlug = sessionData.slug;
        }
    }

    const classes = await prisma.class.findMany({
        where,
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const result = [];

    for (const item of classes) {
        let mapping = null;

        if (boardSlug && sessionSlug) {
            mapping = await prisma.classSectionStreamMapping.findFirst({
                where: {
                    schoolSlug,
                    boardSlug,
                    sessionSlug,
                    classSlug: item.slug,
                    isActive: true,
                    deletedAt: null,
                },
            });
        }

        const sectionSlugs = mapping?.sectionSlugs || [];
        const streamSlugs = mapping?.streamSlugs || [];
        const classTeacherSlugs = mapping?.classTeacherSlugs || [];


        const sections = sectionSlugs.length
            ? await prisma.section.findMany({
                where: {
                    schoolSlug,
                    slug: { in: sectionSlugs },
                    isActive: true,
                    deletedAt: null,
                },
                select: {
                    sectionTitle: true,
                },
            })
            : [];

        const streams = streamSlugs.length
            ? await prisma.stream.findMany({
                where: {
                    schoolSlug,
                    slug: { in: streamSlugs },
                    isActive: true,
                    deletedAt: null,
                },
                select: {
                    streamTitle: true,
                },
            })
            : [];

        const teachers = classTeacherSlugs.length
            ? await prisma.user.findMany({
                where: {
                    schoolSlug,
                    slug: { in: classTeacherSlugs },
                    isActive: true,
                },
                select: {
                    name: true,
                    email: true,
                },
            })
            : [];

        result.push({
            ...item,
            board: item.board?.title,

            mappingSlug: mapping?.slug || null,

            sectionSlugs,
            streamSlugs,
            classTeacherSlugs,

            sections: sections.map((section) => section.sectionTitle),
            streams: streams.map((stream) => stream.streamTitle),
            classTeachers: teachers,

            startTime: mapping?.startTime || null,
            endTime: mapping?.endTime || null,
            periodDuration: mapping?.periodDuration || null,
            breakTime: mapping?.breakTime || null,
            breakDuration: mapping?.breakDuration || null,

            timing:
                mapping?.startTime && mapping?.endTime
                    ? `${mapping.startTime} - ${mapping.endTime}`
                    : "-",
        });
    }

    return result;
};

export const getClassBySlugRepo = async (slug, schoolSlug) => {
    const classData = await prisma.class.findFirst({
        where: {
            slug,
            schoolSlug,
            isActive: true,
            deletedAt: null,
        },
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
    });

    if (!classData) return null;

    return {
        ...classData,
        board: classData.board?.title,
    };
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

export const updateClassRepo = async (id, data) => {
    return prisma.class.update({
        where: { id },
        data,
        include: {
            board: {
                select: {
                    title: true,
                },
            },
        },
    });
};

export const deleteClassRepo = async (id) => {
    return prisma.class.update({
        where: { id },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const getClassBySlugForRestoreRepo = async (slug, schoolSlug) => {
    return prisma.class.findFirst({
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

export const restoreClassRepo = async (id) => {
    return prisma.class.update({
        where: { id },
        data: {
            isActive: true,
            deletedAt: null,
            status: "active",
        },
    });
};