import prisma from "../../../config/prisma.js";

const studentAttendanceInclude = {
    student: {
        select: {
            slug: true,
            admissionNumber: true,
            studentName: true,
            gender: true,
            fatherName: true,
            motherName: true,
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

    academicMapping: {
        select: {
            slug: true,
            rollNumberPrefix: true,
            rollNumber: true,
        },
    },
};

export const findAcademicMappingsForAttendanceRepo = async ({
    schoolSlug,
    session,
    board,
    classTitle,
    sectionSlug,
    streamSlug,
}) => {
    const where = {
        schoolSlug,
        status: "active",
        isActive: true,

        session: {
            name: session,
            status: "active",
            isActive: true,
        },

        board: {
            title: board,
            status: "active",
            isActive: true,
        },

        class: {
            classTitle,
            status: "active",
            isActive: true,
        },

        student: {
            status: "active",
            isActive: true,
        },
    };

    if (sectionSlug) {
        where.sectionSlug = sectionSlug;
    }

    if (streamSlug) {
        where.streamSlug = streamSlug;
    }

    return prisma.studentAcademicRollSectionStreamMapping.findMany({
        where,

        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    gender: true,
                    fatherName: true,
                    motherName: true,
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

export const findAttendanceDaysByMappingsRepo = async ({
    schoolSlug,
    academicMappingSlugs,
    attendanceDate,
}) => {
    if (!academicMappingSlugs.length) {
        return [];
    }

    return prisma.studentAttendanceDay.findMany({
        where: {
            schoolSlug,
            academicMappingSlug: {
                in: academicMappingSlugs,
            },
            attendanceDate,
        },

        select: {
            slug: true,
            academicMappingSlug: true,
            attendanceStatus: true,
            attendanceDate: true,
            isLocked: true,
            markedAt: true,
            status: true,
            isActive: true,
            deletedAt: true,

            markedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },

            lockedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },
        },
    });
};

export const findAcademicMappingBySlugRepo = async ({
    tx = prisma,
    schoolSlug,
    academicMappingSlug,
}) => {
    return tx.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            slug: academicMappingSlug,
            schoolSlug,
            status: "active",
            isActive: true,
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

export const findMonthlyAttendanceRepo = async ({
    tx = prisma,
    schoolSlug,
    studentSlug,
    sessionSlug,
    year,
    month,
}) => {
    return tx.studentAttendance.findUnique({
        where: {
            schoolSlug_studentSlug_sessionSlug_year_month: {
                schoolSlug,
                studentSlug,
                sessionSlug,
                year,
                month,
            },
        },

        include: studentAttendanceInclude,
    });
};

export const createMonthlyAttendanceRepo = async ({
    tx = prisma,
    data,
}) => {
    return tx.studentAttendance.create({
        data,
        include: studentAttendanceInclude,
    });
};

export const updateMonthlyAttendanceRepo = async ({
    tx = prisma,
    slug,
    data,
}) => {
    return tx.studentAttendance.update({
        where: {
            slug,
        },

        data,
        include: studentAttendanceInclude,
    });
};

export const findAttendanceDayByAttendanceAndDateRepo = async ({
    tx = prisma,
    attendanceSlug,
    attendanceDate,
}) => {
    return tx.studentAttendanceDay.findUnique({
        where: {
            attendanceSlug_attendanceDate: {
                attendanceSlug,
                attendanceDate,
            },
        },

        include: {
            markedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },

            lockedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },

            unlockedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },
        },
    });
};

export const findAttendanceDayBySlugRepo = async ({
    tx = prisma,
    schoolSlug,
    daySlug,
}) => {
    return tx.studentAttendanceDay.findFirst({
        where: {
            slug: daySlug,
            schoolSlug,
        },

        include: {
            attendance: true,

            academicMapping: {
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
            },

            markedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },

            lockedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },

            unlockedBy: {
                select: {
                    slug: true,
                    name: true,
                },
            },
        },
    });
};

export const createAttendanceDayRepo = async ({
    tx = prisma,
    data,
}) => {
    return tx.studentAttendanceDay.create({
        data,
    });
};

export const updateAttendanceDayRepo = async ({
    tx = prisma,
    slug,
    data,
}) => {
    return tx.studentAttendanceDay.update({
        where: {
            slug,
        },

        data,
    });
};

export const createAttendanceLogRepo = async ({
    tx = prisma,
    data,
}) => {
    return tx.studentAttendanceLog.create({
        data,
    });
};

export const getMonthlyStudentReportMappingsRepo = async ({
    schoolSlug,
    session,
    board,
    classTitle,
    sectionSlug,
    streamSlug,
    gender,
    year,
    month,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findMany({
        where: {
            schoolSlug,

            status: "active",
            isActive: true,
            deletedAt: null,

            session: {
                name: session,
                status: "active",
                isActive: true,
            },

            board: {
                title: board,
                status: "active",
                isActive: true,
            },

            class: {
                classTitle,
                status: "active",
                isActive: true,
            },

            student: {
                status: "active",
                isActive: true,

                ...(gender
                    ? {
                        gender,
                    }
                    : {}),
            },

            ...(sectionSlug
                ? {
                    sectionSlug,
                }
                : {}),

            ...(streamSlug
                ? {
                    streamSlug,
                }
                : {}),
        },

        select: {
            slug: true,
            rollNumberPrefix: true,
            rollNumber: true,

            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    gender: true,
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

            studentAttendances: {
                where: {
                    year: Number(year),
                    month: Number(month),

                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },

                select: {
                    slug: true,
                    year: true,
                    month: true,
                    attendance: true,

                    totalWorkingDays: true,
                    totalPresent: true,
                    totalAbsent: true,
                    totalLeave: true,
                    totalHalfDay: true,
                    totalHoliday: true,
                    attendancePercentage: true,
                },

                take: 1,
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

export const getDailyAttendanceReportMappingsRepo = async ({
    schoolSlug,
    session,
    board,
    startDate,
    nextDate,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findMany({
        where: {
            schoolSlug,

            status: "active",
            isActive: true,
            deletedAt: null,

            session: {
                name: session,
                status: "active",
                isActive: true,
            },

            board: {
                title: board,
                status: "active",
                isActive: true,
            },

            student: {
                status: "active",
                isActive: true,
            },
        },

        select: {
            slug: true,
            schoolSlug: true,
            rollNumberPrefix: true,
            rollNumber: true,

            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    gender: true,
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

            studentAttendanceDays: {
                where: {
                    attendanceDate: {
                        gte: startDate,
                        lt: nextDate,
                    },

                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },

                select: {
                    slug: true,
                    attendanceStatus: true,
                    attendanceDate: true,
                    isLocked: true,
                },

                take: 1,
            },
        },

        orderBy: [
            {
                class: {
                    classTitle: "asc",
                },
            },
            {
                section: {
                    sectionTitle: "asc",
                },
            },
            {
                rollNumber: "asc",
            },
        ],
    });
};

// export const getMonthlyStudentReportMappingsRepo = async ({
//     schoolSlug,
//     session,
//     board,
//     classTitle,
//     sectionSlug,
//     streamSlug,
//     gender,
//     startDate,
//     endDate,
// }) => {
//     const where = {
//         schoolSlug,

//         status: "active",
//         isActive: true,
//         deletedAt: null,

//         session: {
//             name: session,
//             status: "active",
//             isActive: true,
//         },

//         board: {
//             title: board,
//             status: "active",
//             isActive: true,
//         },

//         class: {
//             classTitle,
//             status: "active",
//             isActive: true,
//         },

//         student: {
//             status: "active",
//             isActive: true,

//             ...(gender
//                 ? {
//                     gender,
//                 }
//                 : {}),
//         },

//         ...(sectionSlug
//             ? {
//                 sectionSlug,
//             }
//             : {}),

//         ...(streamSlug
//             ? {
//                 streamSlug,
//             }
//             : {}),
//     };

//     return prisma.studentAcademicRollSectionStreamMapping.findMany({
//         where,

//         select: {
//             slug: true,
//             rollNumberPrefix: true,
//             rollNumber: true,

//             student: {
//                 select: {
//                     slug: true,
//                     admissionNumber: true,
//                     studentName: true,
//                     gender: true,
//                     profileImage: true,
//                 },
//             },

//             session: {
//                 select: {
//                     slug: true,
//                     name: true,
//                 },
//             },

//             board: {
//                 select: {
//                     slug: true,
//                     title: true,
//                 },
//             },

//             class: {
//                 select: {
//                     slug: true,
//                     classTitle: true,
//                     classType: true,
//                 },
//             },

//             section: {
//                 select: {
//                     slug: true,
//                     sectionTitle: true,
//                 },
//             },

//             stream: {
//                 select: {
//                     slug: true,
//                     streamTitle: true,
//                 },
//             },

//             studentAttendanceDays: {
//                 where: {
//                     attendanceDate: {
//                         gte: startDate,
//                         lte: endDate,
//                     },

//                     status: "active",
//                     isActive: true,
//                     deletedAt: null,
//                 },

//                 select: {
//                     slug: true,
//                     attendanceDate: true,
//                     attendanceStatus: true,
//                     isLocked: true,
//                 },

//                 orderBy: {
//                     attendanceDate: "asc",
//                 },
//             },
//         },

//         orderBy: [
//             {
//                 rollNumber: "asc",
//             },
//             {
//                 student: {
//                     studentName: "asc",
//                 },
//             },
//         ],
//     });
// };

export const getStudentDayWiseReportRepo = async ({
    schoolSlug,
    academicMappingSlug,
    startDate,
    endDate,
}) => {
    if (!academicMappingSlug) {
        throw new Error(
            "Academic mapping slug is required in repository",
        );
    }

    return prisma.studentAcademicRollSectionStreamMapping.findFirst({
        where: {
            slug: academicMappingSlug,
            schoolSlug,

            status: "active",
            isActive: true,
            deletedAt: null,
        },

        select: {
            slug: true,
            rollNumberPrefix: true,
            rollNumber: true,

            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    gender: true,
                },
            },

            class: {
                select: {
                    slug: true,
                    classTitle: true,
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

            studentAttendanceDays: {
                where: {
                    attendanceDate: {
                        gte: startDate,
                        lte: endDate,
                    },

                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },

                select: {
                    slug: true,
                    attendanceDate: true,
                    attendanceStatus: true,
                    isLocked: true,
                    markedAt: true,

                    markedBy: {
                        select: {
                            slug: true,
                            name: true,
                        },
                    },
                },

                orderBy: {
                    attendanceDate: "asc",
                },
            },
        },
    });
};

export const getMonthlyAttendanceByMappingRepo = async ({
    tx = prisma,
    schoolSlug,
    academicMappingSlug,
    year,
    month,
}) => {

    if (!academicMappingSlug) {
        throw new Error(
            "Academic mapping slug is required",
        );
    }

    return tx.studentAttendance.findFirst({
        where: {
            schoolSlug,
            academicMappingSlug,
            year: Number(year),
            month: Number(month),

            status: "active",
            isActive: true,
            deletedAt: null,
        },

        include: {
            ...studentAttendanceInclude,

            attendanceDays: {
                where: {
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },

                orderBy: {
                    attendanceDate: "asc",
                },
            },
        },
    });
};

export const getAttendanceLogsRepo = async ({
    schoolSlug,
    attendanceSlug,
    skip,
    take,
}) => {
    const where = {
        schoolSlug,
        attendanceSlug,
    };

    const [logs, total] = await Promise.all([
        prisma.studentAttendanceLog.findMany({
            where,

            skip,
            take,

            include: {
                performedBy: {
                    select: {
                        slug: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },

                student: {
                    select: {
                        slug: true,
                        admissionNumber: true,
                        studentName: true,
                    },
                },
            },

            orderBy: {
                performedAt: "desc",
            },
        }),

        prisma.studentAttendanceLog.count({
            where,
        }),
    ]);

    return {
        logs,
        total,
    };
};

export const getActiveAcademicMappingsForCronRepo = async ({ tx = prisma }) => {
    return tx.studentAcademicRollSectionStreamMapping.findMany({
        where: {
            status: "active",
            isActive: true,
            student: {
                status: "active",
                isActive: true,
            },
            session: {
                status: "active",
                isActive: true,
            },
            board: {
                status: "active",
                isActive: true,
            },
            class: {
                status: "active",
                isActive: true,
            },
        },
        select: {
            slug: true,
            schoolSlug: true,
            studentSlug: true,
            sessionSlug: true,
            boardSlug: true,
            classSlug: true,
            sectionSlug: true,
            streamSlug: true,
        },
    });
};

export const createMissingMonthlyAttendancesRepo = async ({ tx = prisma, data }) => {
    if (!data.length) {
        return {
            count: 0,
        };
    }

    return tx.studentAttendance.createMany({
        data,
        skipDuplicates: true,
    });
};

export const runAttendanceTransactionRepo = async (callback) => {
    return prisma.$transaction(callback);
};