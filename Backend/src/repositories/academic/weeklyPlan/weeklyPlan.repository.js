import prisma from "../../../config/prisma.js";

const weeklyPlanInclude = {
    session: {
        select: {
            slug: true,
            name: true,
        },
    },

    classSubject: {
        select: {
            slug: true,
            subjectSlug: true,
            classSlug: true,

            subject: {
                select: {
                    slug: true,
                    subjectTitle: true,
                },
            },

            class: {
                select: {
                    slug: true,
                    classTitle: true,
                },
            },
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
        orderBy: {
            lessonOrder: "asc",
        },
    },
};

// Find session
export const findWeeklyPlanSessionRepo = async (schoolSlug, sessionName) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: sessionName,
            isActive: true,
        },
    });
};

// Find class
export const findWeeklyPlanClassRepo = async ({
    schoolSlug,
    sessionSlug,
    classTitle,
}) => {
    return prisma.class.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            classTitle,
            isActive: true,
        },
    });
};

// Find class subject
export const findWeeklyPlanClassSubjectRepo = async ({
    schoolSlug,
    classSlug,
    subjectTitle,
}) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            schoolSlug,
            classSlug,
            isActive: true,

            subject: {
                subjectTitle,
                isActive: true,
            },
        },

        include: {
            subject: true,
            class: true,
        },
    });
};

// Find section
export const findWeeklyPlanSectionRepo = async ({
    schoolSlug,
    sectionTitle,
}) => {
    return prisma.section.findFirst({
        where: {
            schoolSlug,
            title: sectionTitle,
            isActive: true,
        },
    });
};

// Find teacher
export const findWeeklyPlanTeacherRepo = async ({
    schoolSlug,
    teacherSlug,
}) => {
    return prisma.user.findFirst({
        where: {
            schoolSlug,
            slug: teacherSlug,
            isActive: true,
        },
    });
};

// Find duplicate
export const findDuplicateWeeklyPlanRepo = async ({
    teacherSlug,
    classSubjectSlug,
    sectionSlug,
    fromDate,
    toDate,
    excludeSlug,
}) => {
    return prisma.weeklyPlan.findFirst({
        where: {
            teacherSlug,
            classSubjectSlug,
            sectionSlug,
            fromDate,
            toDate,

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

// Create plan with lessons
export const createWeeklyPlanRepo = async ({
    weeklyPlanData,
    lessons,
}) => {
    return prisma.$transaction(async (tx) => {
        const weeklyPlan = await tx.weeklyPlan.create({
            data: {
                ...weeklyPlanData,

                lessons: {
                    create: lessons,
                },
            },

            include: weeklyPlanInclude,
        });

        return weeklyPlan;
    });
};

// Get all plans
export const getWeeklyPlansRepo = async ({
    schoolSlug,
    sessionSlug,
    classSubjectSlug,
    sectionSlug,
    teacherSlug,
    status,
    fromDate,
    toDate,
}) => {
    const where = {
        schoolSlug,
    };

    if (sessionSlug) {
        where.sessionSlug = sessionSlug;
    }

    if (classSubjectSlug) {
        where.classSubjectSlug = classSubjectSlug;
    }

    if (sectionSlug) {
        where.sectionSlug = sectionSlug;
    }

    if (teacherSlug) {
        where.teacherSlug = teacherSlug;
    }

    if (status && status !== "all") {
        where.status = status;
    }

    if (fromDate || toDate) {
        where.AND = [];

        if (fromDate) {
            where.AND.push({
                toDate: {
                    gte: new Date(fromDate),
                },
            });
        }

        if (toDate) {
            where.AND.push({
                fromDate: {
                    lte: new Date(toDate),
                },
            });
        }
    }

    return prisma.weeklyPlan.findMany({
        where,

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

// Get plan by slug
export const getWeeklyPlanBySlugRepo = async (slug, schoolSlug) => {
    return prisma.weeklyPlan.findFirst({
        where: {
            slug,
            schoolSlug,
        },

        include: weeklyPlanInclude,
    });
};

// Update plan and replace lessons
export const updateWeeklyPlanRepo = async ({
    slug,
    schoolSlug,
    weeklyPlanData,
    lessons,
}) => {
    return prisma.$transaction(async (tx) => {
        if (lessons) {
            await tx.weeklyPlanLesson.deleteMany({
                where: {
                    weeklyPlanSlug: slug,
                    schoolSlug,
                },
            });
        }

        const updatedPlan = await tx.weeklyPlan.update({
            where: {
                slug,
            },

            data: {
                ...weeklyPlanData,

                ...(lessons
                    ? {
                        lessons: {
                            create: lessons,
                        },
                    }
                    : {}),
            },

            include: weeklyPlanInclude,
        });

        return updatedPlan;
    });
};

// Soft delete plan and lessons
export const deleteWeeklyPlanRepo = async (slug, schoolSlug) => {
    return prisma.$transaction(async (tx) => {
        await tx.weeklyPlanLesson.updateMany({
            where: {
                weeklyPlanSlug: slug,
                schoolSlug,
            },

            data: {
                status: "inactive",
                isActive: false,
                deletedAt: new Date(),
            },
        });

        return tx.weeklyPlan.update({
            where: {
                slug,
            },

            data: {
                status: "inactive",
                isActive: false,
                deletedAt: new Date(),
            },

            include: weeklyPlanInclude,
        });
    });
};

// Restore plan and lessons
export const restoreWeeklyPlanRepo = async (slug, schoolSlug) => {
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