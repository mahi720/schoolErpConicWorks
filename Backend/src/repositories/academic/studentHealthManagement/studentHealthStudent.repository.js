import prisma from "../../../config/prisma.js";
import { StudentAcademicStatus } from "@prisma/client";

export const findHealthSessionByNameRepo = async (
    schoolSlug,
    academicYear,
) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: academicYear,
            isActive: true,
        },
        select: {
            slug: true,
            name: true,
        },
    });
};

export const findActiveHealthSessionRepo = async (
    schoolSlug,
) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            isActive: true,
            status: "active",
        },
        orderBy: {
            startDate: "desc",
        },
        select: {
            slug: true,
            name: true,
        },
    });
};

export const findHealthBoardByTitleRepo = async (
    schoolSlug,
    boardTitle,
) => {
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

export const findHealthClassByTitleRepo = async ({
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
        select: {
            slug: true,
            classTitle: true,
            classType: true,
        },
    });
};

export const findHealthSectionByTitleRepo = async (
    schoolSlug,
    sectionTitle,
) => {
    return prisma.section.findFirst({
        where: {
            schoolSlug,
            title: sectionTitle,
            isActive: true,
        },
        select: {
            slug: true,
            title: true,
        },
    });
};

export const getHealthManagementStudentsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    sectionSlug,
    category,
    search,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findMany({
        where: {
            schoolSlug,
            sessionSlug,
            academicStatus: "CURRENT",
            isActive: true,

            ...(boardSlug && {
                boardSlug,
            }),

            ...(classSlug && {
                classSlug,
            }),

            ...(sectionSlug && {
                sectionSlug,
            }),

            student: {
                isActive: true,
                status: "active",

                ...(category && {
                    category,
                }),

                ...(search && {
                    OR: [
                        {
                            studentName: {
                                contains: search,
                            },
                        },
                        {
                            admissionNumber: {
                                contains: search,
                            },
                        },
                        {
                            phone: {
                                contains: search,
                            },
                        },
                        {
                            fatherName: {
                                contains: search,
                            },
                        },
                    ],
                }),
            },
        },

        select: {
            slug: true,
            rollNumber: true,
            academicStatus: true,

            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    dob: true,
                    phone: true,
                    gender: true,
                    category: true,
                    fatherName: true,
                    motherName: true,
                    profileImage: true,
                    status: true,
                    isActive: true,

                    otherInformation: {
                        select: {
                            slug: true,
                            studentBloodGroup: true,
                            status: true,
                            isActive: true,
                        },
                    },

                    healthAssessments: {
                        where: {
                            sessionSlug,
                        },
                        select: {
                            slug: true,
                            status: true,
                            isActive: true,
                        },
                        take: 1,
                    },
                },
            },

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

            stream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
        },

        orderBy: [
            {
                rollNumber: "asc",
            },
            {
                student: {
                    studentName: "asc",
                },
            },
        ],
    });
};

