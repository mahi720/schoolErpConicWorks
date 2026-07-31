import prisma from "../../../../config/prisma.js";

const activeWhere = {
    status: "active",
    isActive: true,
    deletedAt: null,
};

export const findMarkSchoolRepo = async ({
    schoolSlug,
    schoolCode,
}) => {
    return prisma.school.findFirst({
        where: {
            ...(schoolSlug ? { slug: schoolSlug } : {}),
            ...(schoolCode ? { schoolCode } : {}),
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findMarkSessionByNameRepo = async ({
    schoolSlug,
    academicYear,
}) => {
    return prisma.session.findFirst({
        where: {
            schoolSlug,
            name: academicYear,
            ...activeWhere,
        },
    });
};

export const findMarkBoardByTitleRepo = async ({
    schoolSlug,
    boardTitle,
}) => {
    return prisma.board.findFirst({
        where: {
            schoolSlug,
            title: boardTitle,
            ...activeWhere,
        },
    });
};

export const findPeriodicTestByTitleRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    periodicTestTitle,
}) => {
    return prisma.periodicTest.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            testTitle: periodicTestTitle,
            ...activeWhere,
        },
    });
};

export const findMarkClassByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    classTitle,
}) => {
    return prisma.class.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            classTitle,
            ...activeWhere,
        },
    });
};

export const findPeriodicTestClassConfigurationRepo = async ({
    schoolSlug,
    periodicTestSlug,
    classSlug,
}) => {
    return prisma.periodicTestClassConfiguration.findFirst({
        where: {
            schoolSlug,
            periodicTestSlug,
            classSlug,
            ...activeWhere,
        },
        include: {
            periodicTest: true,
            class: true,
        },
    });
};

export const findMarkSectionByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    sectionTitle,
}) => {
    return prisma.section.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            sectionTitle,
            ...activeWhere,
        },
    });
};

export const findMarkStreamByTitleRepo = async ({
    schoolSlug,
    boardSlug,
    streamTitle,
}) => {
    return prisma.stream.findFirst({
        where: {
            schoolSlug,
            boardSlug,
            streamTitle,
            ...activeWhere,
        },
    });
};

export const findClassSubjectBySlugRepo = async ({
    schoolSlug,
    classSubjectSlug,
}) => {
    return prisma.addSubjectToClass.findFirst({
        where: {
            schoolSlug,
            slug: classSubjectSlug,
            ...activeWhere,
        },
        include: {
            subject: true,
            stream: true,
        },
    });
};

export const findClassSubjectRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    subjectTitle,
    studyMode,
    streamSlug,
}) => {
    const where = {
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        subject: {
            subjectTitle,
            status: "active",
            isActive: true,
            deletedAt: null,
        },
        ...activeWhere,
    };

    if (streamSlug) {
        where.OR = [
            {
                streamSlug,
            },
            {
                streamSlug: null,
            },
        ];
    } else {
        where.streamSlug = null;
    }

    const classSubjects =
        await prisma.addSubjectToClass.findMany({
            where,
            include: {
                subject: true,
                stream: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

    if (!classSubjects.length) {
        return null;
    }

    if (studyMode) {
        const exactStudyMode =
            classSubjects.find(
                (item) =>
                    item.studyType ===
                    studyMode,
            );

        return exactStudyMode || null;
    }

    return classSubjects[0] || null;
};

export const findPeriodicTestTimeTableRepo = async ({
    schoolSlug,
    periodicTestClassConfigurationSlug,
    classSubjectSlug,
    streamSlug,
}) => {
    return prisma.periodicTestTimeTable.findFirst({
        where: {
            schoolSlug,
            periodicTestClassConfigurationSlug,
            classSubjectSlug,
            streamSlug:
                streamSlug || null,
            ...activeWhere,
        },
        include: {
            classSubject: {
                include: {
                    subject: true,
                    stream: true,
                },
            },
            stream: true,
        },
    });
};

export const findAcademicStudentsRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    classSlug,
    sectionSlug,
    streamSlug,
}) => {
    return prisma.studentAcademicRollSectionStreamMapping.findMany({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            classSlug,
            academicStatus: "CURRENT",
            isActive: true,
            deletedAt: null,
            student: {
                isActive: true,
                deletedAt: null,
            },
            ...(sectionSlug ? { sectionSlug } : {}),
            ...(streamSlug ? { streamSlug } : {}),
        },
        include: {
            student: {
                select: {
                    slug: true,
                    admissionNumber: true,
                    studentName: true,
                    fatherName: true,
                    motherName: true,
                    profileImage: true,
                    gender: true,
                    category: true,
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

export const findSubmissionByScopeRepo = async ({
    schoolSlug,
    periodicTestClassConfigurationSlug,
    classSubjectSlug,
    scopeKey,
}) => {
    return prisma.periodicTestMarkSubmission.findFirst({
        where: {
            schoolSlug,
            periodicTestClassConfigurationSlug,
            classSubjectSlug,
            scopeKey,
        },
        include: {
            studentMarks: {
                where: {
                    isActive: true,
                    deletedAt: null,
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
                    academicMapping: {
                        include: {
                            section: true,
                            stream: true,
                        },
                    },
                },
            },
            section: true,
            stream: true,
            submittedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            lockedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
};

export const findSubmissionBySlugRepo = async ({
    schoolSlug,
    submissionSlug,
    includeInactive = false,
}) => {
    return prisma.periodicTestMarkSubmission.findFirst({
        where: {
            schoolSlug,
            slug: submissionSlug,
            ...(!includeInactive
                ? {
                    isActive: true,
                    deletedAt: null,
                }
                : {}),
        },
        include: {
            periodicTestClassConfiguration: {
                include: {
                    periodicTest: {
                        include: {
                            session: true,
                            board: true,
                        },
                    },
                    class: true,
                },
            },
            classSubject: {
                include: {
                    subject: true,
                    stream: true,
                },
            },
            section: true,
            stream: true,
            studentMarks: {
                orderBy: [
                    {
                        rollNo: "asc",
                    },
                    {
                        student: {
                            studentName: "asc",
                        },
                    },
                ],
                include: {
                    student: {
                        select: {
                            slug: true,
                            admissionNumber: true,
                            studentName: true,
                            fatherName: true,
                            profileImage: true,
                        },
                    },
                    academicMapping: {
                        include: {
                            section: true,
                            stream: true,
                        },
                    },
                },
            },
            submittedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            lockedBy: {
                select: {
                    slug: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
};

export const findStudentMarksBySlugsRepo = async ({
    schoolSlug,
    studentMarkSlugs,
}) => {
    return prisma.periodicTestStudentMark.findMany({
        where: {
            schoolSlug,
            slug: {
                in: studentMarkSlugs,
            },
        },
        include: {
            student: true,
            submission: {
                include: {
                    periodicTestClassConfiguration: {
                        include: {
                            periodicTest: {
                                include: {
                                    session: true,
                                    board: true,
                                },
                            },
                            class: true,
                        },
                    },
                    classSubject: {
                        include: {
                            subject: true,
                        },
                    },
                    section: true,
                    stream: true,
                },
            },
        },
    });
};

export const savePeriodicTestMarksTransactionRepo = async ({
    submissionData,
    students,
}) => {
    return prisma.$transaction(async (tx) => {
        const submission =
            await tx.periodicTestMarkSubmission.upsert({
                where: {
                    schoolSlug_periodicTestClassConfigurationSlug_classSubjectSlug_scopeKey:
                    {
                        schoolSlug: submissionData.schoolSlug,
                        periodicTestClassConfigurationSlug:
                            submissionData.periodicTestClassConfigurationSlug,
                        classSubjectSlug:
                            submissionData.classSubjectSlug,
                        scopeKey: submissionData.scopeKey,
                    },
                },
                update: {
                    sectionSlug: submissionData.sectionSlug,
                    streamSlug: submissionData.streamSlug,
                    maxMarks: submissionData.maxMarks,
                    minMarks: submissionData.minMarks,
                    submittedBySlug: submissionData.submittedBySlug,
                    submittedAt: submissionData.submittedAt,
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
                create: submissionData,
            });

        const oldStudentMarks =
            await tx.periodicTestStudentMark.findMany({
                where: {
                    submissionSlug: submission.slug,
                    studentSlug: {
                        in: students.map((item) => item.studentSlug),
                    },
                },
            });

        const oldStudentMarkMap = new Map(
            oldStudentMarks.map((item) => [
                item.studentSlug,
                item,
            ]),
        );

        const savedStudentMarks = [];

        for (const item of students) {
            const studentMark =
                await tx.periodicTestStudentMark.upsert({
                    where: {
                        submissionSlug_studentSlug: {
                            submissionSlug: submission.slug,
                            studentSlug: item.studentSlug,
                        },
                    },
                    update: {
                        academicMappingSlug:
                            item.academicMappingSlug,
                        rollNo: item.rollNo,
                        obtainedMarks: item.obtainedMarks,
                        markStatus: item.markStatus,
                        remarks: item.remarks,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                    create: {
                        slug: item.slug,
                        schoolSlug:
                            submissionData.schoolSlug,
                        submissionSlug: submission.slug,
                        studentSlug: item.studentSlug,
                        academicMappingSlug:
                            item.academicMappingSlug,
                        rollNo: item.rollNo,
                        obtainedMarks: item.obtainedMarks,
                        markStatus: item.markStatus,
                        remarks: item.remarks,
                    },
                });

            savedStudentMarks.push({
                oldMark: oldStudentMarkMap.get(
                    item.studentSlug,
                ),
                newMark: studentMark,
            });
        }

        return {
            submission,
            savedStudentMarks,
            isNewSubmission:
                oldStudentMarks.length === 0,
        };
    });
};

export const updatePeriodicStudentMarksTransactionRepo =
    async ({
        schoolSlug,
        students,
    }) => {
        return prisma.$transaction(async (tx) => {
            const updatedMarks = [];

            for (const item of students) {
                const oldMark =
                    await tx.periodicTestStudentMark.findFirst({
                        where: {
                            schoolSlug,
                            slug: item.studentMarkSlug,
                        },
                    });

                if (!oldMark) {
                    throw new Error(
                        `Student mark not found: ${item.studentMarkSlug}`,
                    );
                }

                const newMark =
                    await tx.periodicTestStudentMark.update({
                        where: {
                            slug: item.studentMarkSlug,
                        },
                        data: {
                            obtainedMarks: item.obtainedMarks,
                            markStatus: item.markStatus,
                            remarks: item.remarks,
                            status: "active",
                            isActive: true,
                            deletedAt: null,
                        },
                    });

                updatedMarks.push({
                    oldMark,
                    newMark,
                });
            }

            return updatedMarks;
        });
    };

export const lockPeriodicTestSubmissionRepo = async ({
    submissionSlug,
    userSlug,
}) => {
    return prisma.periodicTestMarkSubmission.update({
        where: {
            slug: submissionSlug,
        },
        data: {
            isLocked: true,
            lockedAt: new Date(),
            lockedBySlug: userSlug,
        },
    });
};

export const unlockPeriodicTestSubmissionRepo = async ({
    submissionSlug,
}) => {
    return prisma.periodicTestMarkSubmission.update({
        where: {
            slug: submissionSlug,
        },
        data: {
            isLocked: false,
            lockedAt: null,
            lockedBySlug: null,
        },
    });
};

export const softDeletePeriodicTestSubmissionRepo = async ({
    submissionSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        await tx.periodicTestStudentMark.updateMany({
            where: {
                submissionSlug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt: new Date(),
            },
        });

        return tx.periodicTestMarkSubmission.update({
            where: {
                slug: submissionSlug,
            },
            data: {
                status: "inactive",
                isActive: false,
                deletedAt: new Date(),
            },
        });
    });
};

export const restorePeriodicTestSubmissionRepo = async ({
    submissionSlug,
}) => {
    return prisma.$transaction(async (tx) => {
        await tx.periodicTestStudentMark.updateMany({
            where: {
                submissionSlug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });

        return tx.periodicTestMarkSubmission.update({
            where: {
                slug: submissionSlug,
            },
            data: {
                status: "active",
                isActive: true,
                deletedAt: null,
            },
        });
    });
};

export const createPeriodicTestAuditLogsRepo = async ({
    logs,
}) => {
    if (!logs?.length) {
        return null;
    }

    return prisma.periodicTestMarkAuditLog.createMany({
        data: logs,
    });
};

export const createPeriodicTestAuditLogRepo = async ({
    data,
}) => {
    return prisma.periodicTestMarkAuditLog.create({
        data,
    });
};

export const getPeriodicTestAuditLogsRepo = async ({
    schoolSlug,
    submissionSlug,
    studentSlug,
    action,
    result,
    skip,
    take,
}) => {
    const where = {
        schoolSlug,
        ...(submissionSlug ? { submissionSlug } : {}),
        ...(studentSlug ? { studentSlug } : {}),
        ...(action ? { action } : {}),
        ...(result ? { result } : {}),
    };

    const [logs, total] = await Promise.all([
        prisma.periodicTestMarkAuditLog.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                performedBy: {
                    select: {
                        slug: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        }),
        prisma.periodicTestMarkAuditLog.count({
            where,
        }),
    ]);

    return {
        logs,
        total,
    };
};