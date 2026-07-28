import prisma from "../../../config/prisma.js";

const weeklyPlanInclude = {
    session: {
        select: {
            slug: true,
            name: true,
        },
    },

    board: {
        select: {
            slug: true,
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

    section: {
        select: {
            slug: true,
            sectionTitle: true,
        },
    },

    user: {
        select: {
            slug: true,
            name: true,
            email: true,
            role: true,
        },
    },

    lessons: {
        where: {
            isActive: true,
        },

        orderBy: {
            lessonOrder: "asc",
        },
    },
};

export const findWeeklyPlanSessionByNameRepo = async (
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

export const findWeeklyPlanBoardByTitleRepo = async (
    schoolSlug,
    boardTitle,
) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: boardTitle,
            isActive: true,
        },
    });
};

export const findWeeklyPlanClassByTitleRepo = async ({
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
        },
    });
};

export const findWeeklyPlanClassMappingRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
}) => {
    return prisma.classSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            isActive: true,
        },

        select: {
            slug: true,
            sectionSlugs: true,
        },
    });
};

export const findWeeklyPlanSectionByTitleRepo = async ({
    schoolSlug,
    sectionTitle,
    sectionSlugs,
}) => {
    return prisma.section.findFirst({
        where: {
            schoolSlug,
            sectionTitle,
            isActive: true,

            slug: {
                in: sectionSlugs,
            },
        },
    });
};

export const findWeeklyPlanUserByIdRepo = async (
    userId,
) => {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
};

export const findDuplicateWeeklyPlanRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    sectionSlug,
    fromDate,
    toDate,
    excludeSlug,
}) => {
    return prisma.weeklyPlan.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            sectionSlug,
            fromDate,
            toDate,

            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createWeeklyPlanRepo = async ({
    weeklyPlanData,
    lessons,
}) => {
    return prisma.$transaction(async (tx) => {
        return tx.weeklyPlan.create({
            data: {
                ...weeklyPlanData,

                lessons: {
                    create: lessons.map(
                        (lesson, index) => ({
                            slug: lesson.slug,
                            schoolSlug: weeklyPlanData.schoolSlug,
                            lessonOrder:
                                lesson.lessonOrder || index + 1,
                            day: lesson.day,
                            teachingMethodology:
                                lesson.teachingMethodology,
                            studentActivities:
                                lesson.studentActivities,
                            assessment:
                                lesson.assessment,
                        }),
                    ),
                },
            },

            include: weeklyPlanInclude,
        });
    });
};

export const getWeeklyPlansRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    sectionSlug,
    status,
    fromDate,
    toDate,
    search,
}) => {
    return prisma.weeklyPlan.findMany({
        where: {
            schoolSlug,

            ...(sessionSlug && {
                sessionSlug,
            }),

            ...(boardSlug && {
                boardSlug,
            }),

            ...(classSlug && {
                classSlug,
            }),

            ...(sectionSlug && {
                sectionSlug,
            }),

            ...(status && {
                status,
            }),

            ...(fromDate && {
                fromDate: {
                    gte: fromDate,
                },
            }),

            ...(toDate && {
                toDate: {
                    lte: toDate,
                },
            }),

            ...(search && {
                OR: [
                    {
                        topic: {
                            contains: search,
                        },
                    },
                    {
                        subTopic: {
                            contains: search,
                        },
                    },
                ],
            }),
        },

        include: weeklyPlanInclude,

        orderBy: [
            {
                fromDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const getWeeklyPlanBySlugRepo = async (
    slug,
    schoolSlug,
) => {
    return prisma.weeklyPlan.findFirst({
        where: {
            slug,
            schoolSlug,
        },

        include: weeklyPlanInclude,
    });
};

export const getWeeklyPlanForUpdateRepo = async (
    slug,
    schoolSlug,
) => {
    return prisma.weeklyPlan.findFirst({
        where: {
            slug,
            schoolSlug,
        },

        include: {
            lessons: true,
        },
    });
};

export const updateWeeklyPlanRepo = async ({
    slug,
    schoolSlug,
    weeklyPlanData,
    lessons,
}) => {
    return prisma.$transaction(async (tx) => {
        const existingLessons =
            await tx.weeklyPlanLesson.findMany({
                where: {
                    weeklyPlanSlug: slug,
                    schoolSlug,
                },
            });

        const incomingLessonSlugs = lessons
            .filter((lesson) => lesson.slug)
            .map((lesson) => lesson.slug);

        const lessonsToSoftDelete =
            existingLessons.filter(
                (lesson) =>
                    lesson.isActive &&
                    !incomingLessonSlugs.includes(
                        lesson.slug,
                    ),
            );

        if (lessonsToSoftDelete.length > 0) {
            await tx.weeklyPlanLesson.updateMany({
                where: {
                    schoolSlug,
                    weeklyPlanSlug: slug,

                    slug: {
                        in: lessonsToSoftDelete.map(
                            (lesson) => lesson.slug,
                        ),
                    },
                },

                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt: new Date(),
                },
            });
        }

        for (
            let index = 0;
            index < lessons.length;
            index += 1
        ) {
            const lesson = lessons[index];

            if (lesson.slug) {
                await tx.weeklyPlanLesson.updateMany({
                    where: {
                        slug: lesson.slug,
                        weeklyPlanSlug: slug,
                        schoolSlug,
                    },

                    data: {
                        lessonOrder:
                            lesson.lessonOrder ||
                            index + 1,
                        day: lesson.day,
                        teachingMethodology:
                            lesson.teachingMethodology,
                        studentActivities:
                            lesson.studentActivities,
                        assessment:
                            lesson.assessment,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                });

                continue;
            }

            await tx.weeklyPlanLesson.create({
                data: {
                    slug: lesson.generatedSlug,
                    schoolSlug,
                    weeklyPlanSlug: slug,
                    lessonOrder:
                        lesson.lessonOrder ||
                        index + 1,
                    day: lesson.day,
                    teachingMethodology:
                        lesson.teachingMethodology,
                    studentActivities:
                        lesson.studentActivities,
                    assessment:
                        lesson.assessment,
                },
            });
        }

        return tx.weeklyPlan.update({
            where: {
                slug,
            },

            data: weeklyPlanData,

            include: weeklyPlanInclude,
        });
    });
};

export const deleteWeeklyPlanRepo = async ({
    slug,
    schoolSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const deletedAt = new Date();

        await tx.weeklyPlanLesson.updateMany({
            where: {
                weeklyPlanSlug: slug,
                schoolSlug,
                isActive: true,
            },

            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },
        });

        return tx.weeklyPlan.update({
            where: {
                slug,
            },

            data: {
                status: "inactive",
                isActive: false,
                deletedAt,
            },

            include: weeklyPlanInclude,
        });
    });
};

export const restoreWeeklyPlanRepo = async ({
    slug,
    schoolSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        await tx.weeklyPlanLesson.updateMany({
            where: {
                weeklyPlanSlug: slug,
                schoolSlug,
            },

            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });

        return tx.weeklyPlan.update({
            where: {
                slug,
            },

            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },

            include: weeklyPlanInclude,
        });
    });
};

export const getWeeklyPlanLessonBySlugRepo = async ({
    weeklyPlanSlug,
    lessonSlug,
    schoolSlug,
}) => {
    return prisma.weeklyPlanLesson.findFirst({
        where: {
            slug: lessonSlug,
            weeklyPlanSlug,
            schoolSlug,
        },
    });
};

export const deleteWeeklyPlanLessonRepo = async ({
    weeklyPlanSlug,
    lessonSlug,
    schoolSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        const lesson =
            await tx.weeklyPlanLesson.updateMany({
                where: {
                    slug: lessonSlug,
                    weeklyPlanSlug,
                    schoolSlug,
                    isActive: true,
                },

                data: {
                    status: "inactive",
                    isActive: false,
                    deletedAt: new Date(),
                },
            });

        const activeLessonCount =
            await tx.weeklyPlanLesson.count({
                where: {
                    weeklyPlanSlug,
                    schoolSlug,
                    isActive: true,
                },
            });

        await tx.weeklyPlan.updateMany({
            where: {
                slug: weeklyPlanSlug,
                schoolSlug,
            },

            data: {
                numberOfPeriods:
                    activeLessonCount,
            },
        });

        return {
            lesson,
            numberOfPeriods:
                activeLessonCount,
        };
    });
};