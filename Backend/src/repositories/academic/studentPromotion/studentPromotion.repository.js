import prisma from "../../../config/prisma.js";

export const findSchoolByCodeRepo = async (
    schoolCode,
    client = prisma,
) => {
    return client.school.findFirst({
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

export const findSessionByNameRepo = async (
    schoolSlug,
    sessionName,
    client = prisma,
) => {
    return client.session.findFirst({
        where: {
            schoolSlug,
            name: sessionName,
            isActive: true,
        },
        select: {
            slug: true,
            name: true,
            startDate: true,
            endDate: true,
        },
    });
};

export const findBoardByTitleRepo = async (
    schoolSlug,
    boardTitle,
    client = prisma,
) => {
    return client.board.findFirst({
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

export const findClassByTitleRepo = async (
    schoolSlug,
    boardSlug,
    classTitle,
    client = prisma,
) => {
    return client.class.findFirst({
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
            boardSlug: true,
        },
    });
};

export const findSectionBySlugRepo = async (
    schoolSlug,
    boardSlug,
    sectionSlug,
    client = prisma,
) => {
    return client.section.findFirst({
        where: {
            slug: sectionSlug,
            schoolSlug,
            boardSlug,
            isActive: true,
        },
        select: {
            slug: true,
            sectionTitle: true,
        },
    });
};

export const findStreamBySlugRepo = async (
    schoolSlug,
    boardSlug,
    streamSlug,
    client = prisma,
) => {
    return client.stream.findFirst({
        where: {
            slug: streamSlug,
            schoolSlug,
            boardSlug,
            isActive: true,
        },
        select: {
            slug: true,
            streamTitle: true,
        },
    });
};

export const findStudentBySlugRepo = async (
    schoolSlug,
    studentSlug,
    client = prisma,
) => {
    return client.student.findFirst({
        where: {
            slug: studentSlug,
            schoolSlug,
            isActive: true,
        },
        select: {
            slug: true,
            admissionNumber: true,
            studentName: true,
            currentSessionSlug: true,
            currentClassSlug: true,
            boardSlug: true,
        },
    });
};

export const findCurrentAcademicMappingRepo = async (
    {
        schoolSlug,
        studentSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        sectionSlug,
        streamSlug,
    },
    client = prisma,
) => {
    return client.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            studentSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            academicStatus: "CURRENT",
            isActive: true,
            ...(sectionSlug !== undefined && {
                sectionSlug,
            }),
            ...(streamSlug !== undefined && {
                streamSlug,
            }),
        },
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
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
    });
};

export const findAcademicMappingByStudentSessionRepo = async (
    {
        schoolSlug,
        studentSlug,
        sessionSlug,
    },
    client = prisma,
) => {
    return client.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            studentSlug,
            sessionSlug,
        },
        select: {
            slug: true,
            studentSlug: true,
            sessionSlug: true,
            academicStatus: true,
            isActive: true,
        },
    });
};

export const findDuplicateRollNumberRepo = async (
    {
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        sectionSlug,
        rollNumber,
        excludeStudentSlug,
    },
    client = prisma,
) => {
    if (!rollNumber) {
        return null;
    }

    return client.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            sectionSlug: sectionSlug || null,
            rollNumber,
            isActive: true,
            ...(excludeStudentSlug && {
                studentSlug: {
                    not: excludeStudentSlug,
                },
            }),
        },
        select: {
            slug: true,
            studentSlug: true,
            rollNumber: true,
            student: {
                select: {
                    admissionNumber: true,
                    studentName: true,
                },
            },
        },
    });
};

export const createAcademicMappingRepo = async (
    data,
    client = prisma,
) => {
    return client.studentAcademicRollSectionStreamMapping.create({
        data,
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
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
    });
};

export const updateAcademicMappingRepo = async (
    slug,
    data,
    client = prisma,
) => {
    return client.studentAcademicRollSectionStreamMapping.update({
        where: {
            slug,
        },
        data,
    });
};

export const updateStudentCurrentAcademicRepo = async (
    studentSlug,
    data,
    client = prisma,
) => {
    return client.student.update({
        where: {
            slug: studentSlug,
        },
        data,
        select: {
            slug: true,
            admissionNumber: true,
            studentName: true,
            currentSessionSlug: true,
            currentClassSlug: true,
            boardSlug: true,
        },
    });
};

export const createStudentPromotionRepo = async (
    data,
    client = prisma,
) => {
    return client.studentPromotion.create({
        data,
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    profileImage: true,
                },
            },
            previousSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            newSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            previousBoard: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            newBoard: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            previousClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            newClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            previousSection: {
                select: {
                    slug: true,
                    sectionTitle: true,
                },
            },
            newSection: {
                select: {
                    slug: true,
                    sectionTitle: true,
                },
            },
            previousStream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
            newStream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
            promotedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const getStudentPromotionsRepo = async (
    {
        schoolSlug,
        batchSlug,
        studentSlug,
        previousSessionSlug,
        newSessionSlug,
        previousClassSlug,
        newClassSlug,
        promotionType,
        promotionStatus,
    },
    client = prisma,
) => {
    return client.studentPromotion.findMany({
        where: {
            schoolSlug,
            ...(batchSlug && {
                batchSlug,
            }),
            ...(studentSlug && {
                studentSlug,
            }),
            ...(previousSessionSlug && {
                previousSessionSlug,
            }),
            ...(newSessionSlug && {
                newSessionSlug,
            }),
            ...(previousClassSlug && {
                previousClassSlug,
            }),
            ...(newClassSlug && {
                newClassSlug,
            }),
            ...(promotionType && {
                promotionType,
            }),
            ...(promotionStatus && {
                promotionStatus,
            }),
        },
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    profileImage: true,
                },
            },
            previousSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            newSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            previousBoard: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            newBoard: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            previousClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            newClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            previousSection: {
                select: {
                    slug: true,
                    sectionTitle: true,
                },
            },
            newSection: {
                select: {
                    slug: true,
                    sectionTitle: true,
                },
            },
            previousStream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
            newStream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
            promotedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                },
            },
            rolledBackBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: [
            {
                promotedAt: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const getStudentPromotionBySlugRepo = async (
    slug,
    schoolSlug,
    client = prisma,
) => {
    return client.studentPromotion.findFirst({
        where: {
            slug,
            schoolSlug,
        },
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    profileImage: true,
                },
            },
            previousAcademicMapping: true,
            newAcademicMapping: true,
            previousSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            newSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            previousBoard: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            newBoard: {
                select: {
                    slug: true,
                    title: true,
                },
            },
            previousClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            newClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            previousSection: {
                select: {
                    slug: true,
                    sectionTitle: true,
                },
            },
            newSection: {
                select: {
                    slug: true,
                    sectionTitle: true,
                },
            },
            previousStream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
            newStream: {
                select: {
                    slug: true,
                    streamTitle: true,
                },
            },
            promotedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                },
            },
            rolledBackBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};

export const getPromotionBatchRepo = async (
    batchSlug,
    schoolSlug,
    client = prisma,
) => {
    return client.studentPromotion.findMany({
        where: {
            batchSlug,
            schoolSlug,
        },
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    profileImage: true,
                },
            },
            previousSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            newSession: {
                select: {
                    slug: true,
                    name: true,
                },
            },
            previousClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
            newClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const updateStudentPromotionRepo = async (
    slug,
    data,
    client = prisma,
) => {
    return client.studentPromotion.update({
        where: {
            slug,
        },
        data,
    });
};

export const runPromotionTransactionRepo = async (callback) => {
    return prisma.$transaction(
        async (tx) => {
            return callback(tx);
        },
        {
            maxWait: 10000,
            timeout: 30000,
        },
    );
};