import prisma from "../../../config/prisma.js";

/* -------------------------------------------------------------------------- */
/*                                  SCHOOL                                    */
/* -------------------------------------------------------------------------- */

export const findWeeklyPlanSchoolByCodeRepo = async (schoolCode) => {
    return prisma.school.findFirst({
        where: {
            schoolCode,
            isActive: true,
        },
        select: {
            slug: true,
            schoolCode: true,
            schoolName: true,
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                                  SESSION                                   */
/* -------------------------------------------------------------------------- */

export const findWeeklyPlanSessionByNameRepo = async ({
    schoolSlug,
    sessionName,
}) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: sessionName,
            isActive: true,
        },
        select: {
            slug: true,
            name: true,
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                                   BOARD                                    */
/* -------------------------------------------------------------------------- */

export const findWeeklyPlanBoardByTitleRepo = async ({
    schoolSlug,
    boardTitle,
}) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: boardTitle,
            isActive: true,
        },
        select: {
            slug: true,
            title: true,
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                                   CLASS                                    */
/* -------------------------------------------------------------------------- */

export const findWeeklyPlanClassBySlugRepo = async ({
    schoolSlug,
    classSlug,
}) => {
    return prisma.class.findFirst({
        where: {
            schoolSlug,
            slug: classSlug,
            isActive: true,
        },
        select: {
            slug: true,
            classTitle: true,
            sessionSlug: true,
            boardSlug: true,
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                             MAPPED CLASSES                                  */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanMappedClassesRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
}) => {
    return prisma.classSectionStreamMapping.findMany({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            isActive: true,

            class: {
                isActive: true,
            },
        },

        select: {
            classSlug: true,

            class: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                    status: true,
                    isActive: true,
                },
            },
        },

        orderBy: {
            class: {
                classTitle: "asc",
            },
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                              CLASS SECTIONS                                */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanSectionsByClassRepo = async ({
    schoolSlug,
    classSlug,
}) => {
    return prisma.classSectionStreamMapping.findMany({
        where: {
            schoolSlug,
            classSlug,
            isActive: true,

            sectionSlug: {
                not: null,
            },

            section: {
                isActive: true,
            },
        },

        select: {
            sectionSlug: true,

            section: {
                select: {
                    slug: true,
                    sectionTitle: true,
                    status: true,
                    isActive: true,
                },
            },
        },

        orderBy: {
            section: {
                sectionTitle: "asc",
            },
        },
    });
};

/* -------------------------------------------------------------------------- */
/*                              CLASS SUBJECTS                                */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanSubjectsByClassRepo = async ({
    schoolSlug,
    classSlug,
}) => {
    return prisma.addSubjectToClass.findMany({
        where: {
            schoolSlug,
            classSlug,
            isActive: true,

            subject: {
                isActive: true,
            },
        },

        select: {
            slug: true,
            classSlug: true,
            subjectSlug: true,

            subject: {
                select: {
                    slug: true,
                    subjectTitle: true,
                    status: true,
                    isActive: true,
                },
            },

            status: true,
            isActive: true,
        },

        orderBy: {
            subject: {
                subjectTitle: "asc",
            },
        },
    });
};