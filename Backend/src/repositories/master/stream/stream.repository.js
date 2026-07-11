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

export const createStreamRepo = async (data) => {
    return prisma.stream.create({
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

export const getStreamsRepo = async ({ schoolSlug, board }) => {
    const where = {
        schoolSlug,
        isActive: true,
        deletedAt: null,
    };

    if (board) {
        const boardData = await findBoardByTitleRepo(schoolSlug, board);

        if (!boardData) {
            return [];
        }

        where.boardSlug = boardData.slug;
    }

    const streams = await prisma.stream.findMany({
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

    return streams.map((item) => ({
        ...item,
        board: item.board?.title,
    }));
};

export const getStreamBySlugRepo = async (slug, schoolSlug) => {
    const stream = await prisma.stream.findFirst({
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

    if (!stream) return null;

    return {
        ...stream,
        board: stream.board?.title,
    };
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

export const updateStreamRepo = async (id, data) => {
    return prisma.stream.update({
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

export const deleteStreamRepo = async (id) => {
    return prisma.stream.update({
        where: { id },
        data: {
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const getStreamBySlugForRestoreRepo = async (slug, schoolSlug) => {
    return prisma.stream.findFirst({
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

export const restoreStreamRepo = async (id) => {
    return prisma.stream.update({
        where: { id },
        data: {
            isActive: true,
            deletedAt: null,
            status: "active",
        },
    });
};