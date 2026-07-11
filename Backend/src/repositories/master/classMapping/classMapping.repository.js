import prisma from "../../../config/prisma.js";

export const findSessionByNameRepo = async (schoolSlug, name) => {
    return prisma.session.findFirst({
        where: { schoolSlug, name, isActive: true, deletedAt: null },
    });
};

export const findBoardByTitleRepo = async (schoolSlug, title) => {
    return prisma.board.findFirst({
        where: { schoolSlug, title, isActive: true, deletedAt: null },
    });
};

export const findClassByTitleRepo = async (schoolSlug, boardSlug, classTitle) => {
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

export const findSectionsByTitlesRepo = async (schoolSlug, boardSlug, titles) => {
    return prisma.section.findMany({
        where: {
            schoolSlug,
            boardSlug,
            sectionTitle: { in: titles },
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findStreamsByTitlesRepo = async (schoolSlug, boardSlug, titles) => {
    return prisma.stream.findMany({
        where: {
            schoolSlug,
            boardSlug,
            streamTitle: { in: titles },
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findTeachersByEmailsRepo = async (schoolSlug, emails) => {
    return prisma.user.findMany({
        where: {
            schoolSlug,
            email: { in: emails },
            role: "TEACHER",
            isActive: true,
        },
        select: {
            slug: true,
            name: true,
            email: true,
        },
    });
};

export const upsertClassMappingRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    data,
}) => {
    const createData = {
        slug: data.slug,
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,

        sectionSlugs: data.sectionSlugs ?? [],
        streamSlugs: data.streamSlugs ?? [],
        classTeacherSlugs: data.classTeacherSlugs ?? [],

        startTime: data.startTime ?? null,
        endTime: data.endTime ?? null,
        periodDuration: data.periodDuration ?? null,
        breakTime: data.breakTime ?? null,
        breakDuration: data.breakDuration ?? null,
        status: data.status || "active",
        isActive: true,
        deletedAt: null,
    };

    const updateData = {};

    if (data.sectionSlugs !== undefined) {
        updateData.sectionSlugs = data.sectionSlugs;
    }

    if (data.streamSlugs !== undefined) {
        updateData.streamSlugs = data.streamSlugs;
    }

    if (data.classTeacherSlugs !== undefined) {
        updateData.classTeacherSlugs = data.classTeacherSlugs;
    }

    if (data.startTime !== undefined) {
        updateData.startTime = data.startTime;
    }

    if (data.endTime !== undefined) {
        updateData.endTime = data.endTime;
    }

    if (data.periodDuration !== undefined) {
        updateData.periodDuration = data.periodDuration;
    }

    if (data.breakTime !== undefined) {
        updateData.breakTime = data.breakTime;
    }

    if (data.breakDuration !== undefined) {
        updateData.breakDuration = data.breakDuration;
    }

    if (data.status !== undefined) {
        updateData.status = data.status;
    }

    updateData.isActive = true;
    updateData.deletedAt = null;

    return prisma.classSectionStreamMapping.upsert({
        where: {
            schoolSlug_sessionSlug_boardSlug_classSlug: {
                schoolSlug,
                sessionSlug,
                boardSlug,
                classSlug,
            },
        },
        update: updateData,
        create: createData,
    });
};

export const getClassMappingsRepo = async ({ schoolSlug, sessionSlug, boardSlug }) => {
    return prisma.classSectionStreamMapping.findMany({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            isActive: true,
            deletedAt: null,
        },
        include: {
            session: { select: { name: true } },
            board: { select: { title: true } },
            class: { select: { classTitle: true, classType: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const findSectionsBySlugsRepo = async (schoolSlug, slugs) => {
    return prisma.section.findMany({
        where: {
            schoolSlug,
            slug: { in: slugs },
            isActive: true,
            deletedAt: null,
        },
        select: {
            slug: true,
            sectionTitle: true,
        },
    });
};

export const findStreamsBySlugsRepo = async (schoolSlug, slugs) => {
    return prisma.stream.findMany({
        where: {
            schoolSlug,
            slug: { in: slugs },
            isActive: true,
            deletedAt: null,
        },
        select: {
            slug: true,
            streamTitle: true,
        },
    });
};

export const findTeachersBySlugsRepo = async (schoolSlug, slugs) => {
    return prisma.user.findMany({
        where: {
            schoolSlug,
            slug: { in: slugs },
            isActive: true,
        },
        select: {
            slug: true,
            name: true,
            email: true,
        },
    });
};