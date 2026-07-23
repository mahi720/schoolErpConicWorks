import prisma from "../../../config/prisma.js";

//  Common include

const academicCalendarInclude = {
    session: {
        select: {
            slug: true,
            name: true,
            startDate: true,
            endDate: true,
        },
    },
};

//  Find session by name

export const findSessionByNameRepo = async (
    schoolSlug,
    sessionName,
) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: sessionName,
            isActive: true,
        },
    });
};

// Find duplicate calendar

export const findDuplicateAcademicCalendarRepo =
    async ({
        schoolSlug,
        sessionSlug,
        title,
        startDate,
        excludeSlug,
    }) => {
        return prisma.academicCalendar.findFirst({
            where: {
                schoolSlug,
                sessionSlug,
                title,
                startDate,

                ...(excludeSlug
                    ? {
                        slug: {
                            not: excludeSlug,
                        },
                    }
                    : {}),
            },
        });
    };

//  Create calendar

export const createAcademicCalendarRepo =
    async (data) => {
        return prisma.academicCalendar.create({
            data,
            include: academicCalendarInclude,
        });
    };

//  Get calendars

export const getAcademicCalendarsRepo =
    async ({
        schoolSlug,
        sessionSlug,
        category,
        status,
        startDate,
        endDate,
    }) => {
        const where = {
            schoolSlug,
        };

        if (sessionSlug) {
            where.sessionSlug = sessionSlug;
        }

        if (category) {
            where.category = category;
        }

        if (
            status &&
            status !== "all"
        ) {
            where.status = status;
        }

        if (startDate || endDate) {
            where.startDate = {};

            if (startDate) {
                where.startDate.gte =
                    new Date(startDate);
            }

            if (endDate) {
                where.startDate.lte =
                    new Date(endDate);
            }
        }

        return prisma.academicCalendar.findMany({
            where,

            include: academicCalendarInclude,

            orderBy: [
                {
                    startDate: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });
    };

//  Get calendar by slug

export const getAcademicCalendarBySlugRepo =
    async (
        slug,
        schoolSlug,
    ) => {
        return prisma.academicCalendar.findFirst({
            where: {
                slug,
                schoolSlug,
            },

            include: academicCalendarInclude,
        });
    };

//  Update calendar

export const updateAcademicCalendarRepo =
    async (
        slug,
        schoolSlug,
        data,
    ) => {
        return prisma.academicCalendar.update({
            where: {
                slug,
            },

            data,

            include: academicCalendarInclude,
        });
    };

//  Soft delete calendar

export const deleteAcademicCalendarRepo =
    async (
        slug,
        schoolSlug,
    ) => {
        return prisma.academicCalendar.update({
            where: {
                slug,
            },

            data: {
                status: "inactive",
                isActive: false,
                deletedAt: new Date(),
            },

            include: academicCalendarInclude,
        });
    };

//  Restore calendar

export const restoreAcademicCalendarRepo =
    async (
        slug,
        schoolSlug,
    ) => {
        return prisma.academicCalendar.update({
            where: {
                slug,
            },

            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },

            include: academicCalendarInclude,
        });
    };