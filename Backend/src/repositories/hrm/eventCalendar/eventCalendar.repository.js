import prisma from "../../../config/prisma.js";

export const createEventCalendarRepo =
    async (
        data,
        db = prisma,
    ) => {
        return db.hrmEventCalendar.create({
            data,
        });
    };

export const getEventCalendarsRepo =
    async ({
        schoolSlug,
        monthStart = null,
        monthEnd = null,
        includeInactive = true,
        db = prisma,
    }) => {
        const where = {
            schoolSlug,
        };

        if (!includeInactive) {
            where.isActive =
                true;
        }

        if (
            monthStart &&
            monthEnd
        ) {
            where.AND = [
                {
                    startDate: {
                        lte:
                            monthEnd,
                    },
                },
                {
                    endDate: {
                        gte:
                            monthStart,
                    },
                },
            ];
        }

        return db.hrmEventCalendar.findMany({
            where,

            orderBy: [
                {
                    startDate:
                        "asc",
                },
                {
                    startTime:
                        "asc",
                },
            ],
        });
    };

export const findEventCalendarBySlugRepo =
    async ({
        schoolSlug,
        slug,
        db = prisma,
    }) => {
        return db.hrmEventCalendar.findFirst({
            where: {
                schoolSlug,
                slug,
            },
        });
    };

export const updateEventCalendarRepo =
    async ({
        slug,
        data,
        db = prisma,
    }) => {
        return db.hrmEventCalendar.update({
            where: {
                slug,
            },

            data,
        });
    };

export const deleteEventCalendarRepo =
    async ({
        slug,
        db = prisma,
    }) => {
        return db.hrmEventCalendar.update({
            where: {
                slug,
            },

            data: {
                status:
                    "inactive",

                isActive:
                    false,

                deletedAt:
                    new Date(),
            },
        });
    };

export const restoreEventCalendarRepo =
    async ({
        slug,
        db = prisma,
    }) => {
        return db.hrmEventCalendar.update({
            where: {
                slug,
            },

            data: {
                status:
                    "active",

                isActive:
                    true,

                deletedAt:
                    null,
            },
        });
    };