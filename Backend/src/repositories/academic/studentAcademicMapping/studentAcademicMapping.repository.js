import prisma from "../../../config/prisma.js";

/*
|--------------------------------------------------------------------------
| Session Repository
|--------------------------------------------------------------------------
*/

export const findSessionByNameRepo = async ({
    schoolSlug,
    sessionName,
}) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: sessionName,
            isActive: true,
        },
    });
};

/*
|--------------------------------------------------------------------------
| Board Repository
|--------------------------------------------------------------------------
*/

export const findBoardByTitleRepo = async ({
    schoolSlug,
    boardTitle,
}) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: boardTitle,
            isActive: true,
        },
    });
};

/*
|--------------------------------------------------------------------------
| Class Repository
|--------------------------------------------------------------------------
*/

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
        },

        include: {
            board: {
                select: {
                    slug: true,
                    title: true,
                },
            },
        },
    });
};

/*
|--------------------------------------------------------------------------
| Class Section Stream Mapping Repositories
|--------------------------------------------------------------------------
*/

export const getClassSectionStreamMappingsRepo = async ({
    schoolSlug,
    sessionSlug,
}) => {
    return prisma.classSectionStreamMapping.findMany({
        where: {
            schoolSlug,
            sessionSlug,
            isActive: true,
        },

        include: {
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
        },

        orderBy: [
            {
                board: {
                    title: "asc",
                },
            },
            {
                class: {
                    classTitle: "asc",
                },
            },
        ],
    });
};

export const findClassSectionStreamMappingRepo = async ({
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

        include: {
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
        },
    });
};

/*
|--------------------------------------------------------------------------
| Section And Stream Repositories
|--------------------------------------------------------------------------
|
| Full records fetch kar rahe hain, isliye tumhare model mein readable field
| sectionName/title/name ya streamName/title/name jo bhi ho, service usko
| normalize kar dega.
|
*/

export const getSectionsBySlugsRepo = async ({
    schoolSlug,
    sectionSlugs,
}) => {
    if (!sectionSlugs.length) {
        return [];
    }

    return prisma.section.findMany({
        where: {
            schoolSlug,
            slug: {
                in: sectionSlugs,
            },
            isActive: true,
        },
    });
};

export const getStreamsBySlugsRepo = async ({
    schoolSlug,
    streamSlugs,
}) => {
    if (!streamSlugs.length) {
        return [];
    }

    return prisma.stream.findMany({
        where: {
            schoolSlug,
            slug: {
                in: streamSlugs,
            },
            isActive: true,
        },
    });
};

export const findSectionBySlugRepo = async ({
    schoolSlug,
    sectionSlug,
}) => {
    return prisma.section.findFirst({
        where: {
            schoolSlug,
            slug: sectionSlug,
            isActive: true,
        },
    });
};

export const findStreamBySlugRepo = async ({
    schoolSlug,
    streamSlug,
}) => {
    return prisma.stream.findFirst({
        where: {
            schoolSlug,
            slug: streamSlug,
            isActive: true,
        },
    });
};

/*
|--------------------------------------------------------------------------
| Student Repository - Before Mapping
|--------------------------------------------------------------------------
*/

export const getStudentsByCurrentAcademicDetailsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
}) => {
    return prisma.student.findMany({
        where: {
            schoolSlug,
            currentSessionSlug: sessionSlug,
            boardSlug,
            currentClassSlug: classSlug,
            isActive: true,
        },

        select: {
            id: true,
            slug: true,
            admissionNumber: true,
            admissionDate: true,
            studentName: true,
            fatherName: true,
            motherName: true,
            gender: true,
            phone: true,
            profileImage: true,

            currentSessionSlug: true,
            boardSlug: true,
            currentClassSlug: true,

            currentSession: {
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

            currentClass: {
                select: {
                    slug: true,
                    classTitle: true,
                    classType: true,
                },
            },
        },

        orderBy: {
            studentName: "asc",
        },
    });
};

export const findStudentsBySlugsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    studentSlugs,
}) => {
    return prisma.student.findMany({
        where: {
            schoolSlug,
            slug: {
                in: studentSlugs,
            },
            currentSessionSlug: sessionSlug,
            boardSlug,
            currentClassSlug: classSlug,
            isActive: true,
        },
    });
};

/*
|--------------------------------------------------------------------------
| Student Academic Mapping Repositories
|--------------------------------------------------------------------------
*/

export const findStudentMappingByStudentAndSessionRepo = async ({
    schoolSlug,
    studentSlug,
    sessionSlug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            studentSlug,
            sessionSlug,
        },
    });
};

export const findRollNumberMappingRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    sectionSlug,
    rollNumber,
    excludeSlug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            sectionSlug: sectionSlug || null,
            rollNumber,

            ...(excludeSlug && {
                slug: {
                    not: excludeSlug,
                },
            }),
        },
    });
};

export const createStudentAcademicMappingsRepo = async ({
    mappings,
}) => {
    return prisma.$transaction(
        mappings.map((mapping) =>
            prisma.studentAcademicRollSectionStreamMapping.create({
                data: mapping,
            }),
        ),
    );
};

export const restoreAndUpdateStudentMappingRepo = async ({
    slug,
    data,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.update({
        where: {
            slug,
        },

        data: {
            ...data,
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};

/*
|--------------------------------------------------------------------------
| After Mapping Fetch Repository
|--------------------------------------------------------------------------
*/

export const getMappedStudentsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    sectionSlug,
    streamSlug,
    status,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findMany({
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

            ...(streamSlug && {
                streamSlug,
            }),

            ...(status === "inactive"
                ? {
                    isActive: false,
                }
                : status === "all"
                    ? {}
                    : {
                        isActive: true,
                    }),
        },

        include: {
            student: {
                select: {
                    id: true,
                    slug: true,
                    admissionNumber: true,
                    admissionDate: true,
                    studentName: true,
                    fatherName: true,
                    motherName: true,
                    gender: true,
                    phone: true,
                    profileImage: true,
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

            section: true,

            stream: true,
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

export const getStudentAcademicMappingBySlugRepo = async ({
    schoolSlug,
    slug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            schoolSlug,
            slug,
        },

        include: {
            student: {
                select: {
                    id: true,
                    slug: true,
                    admissionNumber: true,
                    admissionDate: true,
                    studentName: true,
                    fatherName: true,
                    motherName: true,
                    gender: true,
                    phone: true,
                    profileImage: true,
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

            section: true,

            stream: true,
        },
    });
};

export const updateStudentAcademicMappingRepo = async ({
    slug,
    data,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.update({
        where: {
            slug,
        },

        data,

        include: {
            student: {
                select: {
                    id: true,
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    fatherName: true,
                    motherName: true,
                    gender: true,
                    phone: true,
                    profileImage: true,
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

            section: true,

            stream: true,
        },
    });
};

export const softDeleteStudentAcademicMappingRepo = async ({
    slug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.update({
        where: {
            slug,
        },

        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreStudentAcademicMappingRepo = async ({
    slug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.update({
        where: {
            slug,
        },

        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },

        include: {
            student: {
                select: {
                    id: true,
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    fatherName: true,
                    profileImage: true,
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

            section: true,

            stream: true,
        },
    });
};