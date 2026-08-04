import prisma from "../../../../config/prisma.js";

const activeWhere = {
    status: "active",
    isActive: true,
    deletedAt: null,
};

const submissionInclude = {
    termExam: {
        include: {
            session: true,
            board: true,
            examType: true,
        },
    },

    termExamClassConfiguration: {
        include: {
            class: true,
        },
    },

    classSubject: {
        include: {
            subject: true,
            stream: true,

            subjectTopics: {
                where: activeWhere,

                orderBy: [
                    {
                        topicGroup: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
            },
        },
    },

    section: true,
    stream: true,

    studentGrades: {
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

        include: {
            student: true,

            academicMapping: {
                include: {
                    section: true,
                    stream: true,
                },
            },

            topicGrades: {
                include: {
                    subjectTopic: true,
                },

                orderBy: [
                    {
                        topicGroup: "asc",
                    },
                    {
                        topicOrder: "asc",
                    },
                ],
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
};

export const findTopicGradeSchoolRepo = async ({
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

export const findTopicGradeSessionRepo = async ({
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

export const findTopicGradeBoardRepo = async ({
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

export const findTopicGradeTermExamRepo = async ({
    schoolSlug,
    sessionSlug,
    boardSlug,
    termExamTitle,
}) => {
    return prisma.termExam.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            examTitle: termExamTitle,
            ...activeWhere,
        },

        include: {
            session: true,
            board: true,
            examType: true,
        },
    });
};

export const findTopicGradeClassRepo = async ({
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

export const findTopicGradeClassConfigurationRepo = async ({
    schoolSlug,
    termExamSlug,
    classSlug,
}) => {
    return prisma.termExamClassConfiguration.findFirst({
        where: {
            schoolSlug,
            termExamSlug,
            classSlug,
            ...activeWhere,
        },

        include: {
            class: true,
        },
    });
};

export const findTopicGradeSectionRepo = async ({
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

export const findTopicGradeStreamRepo = async ({
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

export const findTopicGradeClassSubjectRepo = async ({
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

            subjectTopics: {
                where: activeWhere,

                orderBy: [
                    {
                        topicGroup: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
            },
        },
    });
};

export const findTopicGradeAcademicStudentsRepo = async ({
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

export const findTopicGradeSubmissionByScopeRepo = async ({
    schoolSlug,
    termExamSlug,
    classSubjectSlug,
    scopeKey,
    includeInactive = false,
}) => {
    return prisma.topicWiseGradeSubmission.findFirst({
        where: {
            schoolSlug,
            termExamSlug,
            classSubjectSlug,
            scopeKey,

            ...(!includeInactive
                ? {
                    isActive: true,
                    deletedAt: null,
                }
                : {}),
        },

        include: submissionInclude,
    });
};

export const findTopicGradeSubmissionBySlugRepo = async ({
    schoolSlug,
    submissionSlug,
    includeInactive = false,
}) => {
    return prisma.topicWiseGradeSubmission.findFirst({
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

        include: submissionInclude,
    });
};

export const saveTopicWiseGradesTransactionRepo = async ({
    submissionData,
    students,
}) => {
    return prisma.$transaction(async (tx) => {
        const existingSubmission =
            await tx.topicWiseGradeSubmission.findUnique({
                where: {
                    schoolSlug_termExamSlug_classSubjectSlug_scopeKey: {
                        schoolSlug:
                            submissionData.schoolSlug,
                        termExamSlug:
                            submissionData.termExamSlug,
                        classSubjectSlug:
                            submissionData.classSubjectSlug,
                        scopeKey:
                            submissionData.scopeKey,
                    },
                },
            });

        const submission =
            await tx.topicWiseGradeSubmission.upsert({
                where: {
                    schoolSlug_termExamSlug_classSubjectSlug_scopeKey: {
                        schoolSlug:
                            submissionData.schoolSlug,
                        termExamSlug:
                            submissionData.termExamSlug,
                        classSubjectSlug:
                            submissionData.classSubjectSlug,
                        scopeKey:
                            submissionData.scopeKey,
                    },
                },

                update: {
                    termExamClassConfigurationSlug:
                        submissionData.termExamClassConfigurationSlug,
                    sectionSlug:
                        submissionData.sectionSlug,
                    streamSlug:
                        submissionData.streamSlug,
                    submittedBySlug:
                        submissionData.submittedBySlug,
                    submittedAt:
                        submissionData.submittedAt,
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },

                create:
                    submissionData,
            });

        const savedStudents = [];

        for (const student of students) {
            const oldStudentGrade =
                await tx.topicWiseStudentGrade.findUnique({
                    where: {
                        submissionSlug_studentSlug: {
                            submissionSlug:
                                submission.slug,
                            studentSlug:
                                student.studentSlug,
                        },
                    },

                    include: {
                        topicGrades: true,
                    },
                });

            const studentGrade =
                await tx.topicWiseStudentGrade.upsert({
                    where: {
                        submissionSlug_studentSlug: {
                            submissionSlug:
                                submission.slug,
                            studentSlug:
                                student.studentSlug,
                        },
                    },

                    update: {
                        academicMappingSlug:
                            student.academicMappingSlug,
                        rollNumber:
                            student.rollNumber,
                        overallStatus:
                            student.overallStatus,
                        remarks:
                            student.remarks,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },

                    create: {
                        slug:
                            student.slug,
                        schoolSlug:
                            submissionData.schoolSlug,
                        submissionSlug:
                            submission.slug,
                        studentSlug:
                            student.studentSlug,
                        academicMappingSlug:
                            student.academicMappingSlug,
                        rollNumber:
                            student.rollNumber,
                        overallStatus:
                            student.overallStatus,
                        remarks:
                            student.remarks,
                    },
                });

            const savedTopicGrades = [];

            for (const topic of student.topicGrades) {
                const oldTopicGrade =
                    oldStudentGrade?.topicGrades.find(
                        (item) =>
                            item.subjectTopicSlug ===
                            topic.subjectTopicSlug,
                    ) || null;

                const topicGrade =
                    await tx.topicWiseStudentTopicGrade.upsert({
                        where: {
                            studentGradeSlug_subjectTopicSlug: {
                                studentGradeSlug:
                                    studentGrade.slug,
                                subjectTopicSlug:
                                    topic.subjectTopicSlug,
                            },
                        },

                        update: {
                            topicTitle:
                                topic.topicTitle,
                            topicGroup:
                                topic.topicGroup,
                            topicOrder:
                                topic.topicOrder,
                            grade:
                                topic.grade,
                            assessmentStatus:
                                topic.assessmentStatus,
                            remarks:
                                topic.remarks,
                            status: "active",
                            isActive: true,
                            deletedAt: null,
                        },

                        create: {
                            slug:
                                topic.slug,
                            schoolSlug:
                                submissionData.schoolSlug,
                            studentGradeSlug:
                                studentGrade.slug,
                            subjectTopicSlug:
                                topic.subjectTopicSlug,
                            topicTitle:
                                topic.topicTitle,
                            topicGroup:
                                topic.topicGroup,
                            topicOrder:
                                topic.topicOrder,
                            grade:
                                topic.grade,
                            assessmentStatus:
                                topic.assessmentStatus,
                            remarks:
                                topic.remarks,
                        },
                    });

                savedTopicGrades.push({
                    oldTopicGrade,
                    newTopicGrade:
                        topicGrade,
                });
            }

            savedStudents.push({
                oldStudentGrade,
                newStudentGrade:
                    studentGrade,
                savedTopicGrades,
            });
        }

        return {
            isNewSubmission:
                !existingSubmission,
            submission,
            savedStudents,
        };
    });
};

export const bulkUpdateTopicWiseGradesTransactionRepo = async ({
    schoolSlug,
    students,
}) => {
    return prisma.$transaction(async (tx) => {
        const updatedStudents = [];

        for (const student of students) {
            const oldStudentGrade =
                await tx.topicWiseStudentGrade.findFirst({
                    where: {
                        schoolSlug,
                        slug:
                            student.studentGradeSlug,
                        isActive: true,
                        deletedAt: null,
                    },

                    include: {
                        student: true,
                        topicGrades: true,
                    },
                });

            if (!oldStudentGrade) {
                throw new Error(
                    "Student grade not found",
                );
            }

            const updatedTopicGrades = [];

            for (const topic of student.topicGrades) {
                const oldTopicGrade =
                    oldStudentGrade.topicGrades.find(
                        (item) =>
                            item.slug ===
                            topic.studentTopicGradeSlug,
                    );

                if (!oldTopicGrade) {
                    throw new Error(
                        "Student topic grade not found",
                    );
                }

                const newTopicGrade =
                    await tx.topicWiseStudentTopicGrade.update({
                        where: {
                            slug:
                                topic.studentTopicGradeSlug,
                        },

                        data: {
                            grade:
                                topic.grade,
                            assessmentStatus:
                                topic.assessmentStatus,
                            remarks:
                                topic.remarks,
                        },
                    });

                updatedTopicGrades.push({
                    oldTopicGrade,
                    newTopicGrade,
                });
            }

            const newStudentGrade =
                await tx.topicWiseStudentGrade.update({
                    where: {
                        slug:
                            student.studentGradeSlug,
                    },

                    data: {
                        overallStatus:
                            student.overallStatus,
                        remarks:
                            student.remarks,
                    },
                });

            updatedStudents.push({
                oldStudentGrade,
                newStudentGrade,
                updatedTopicGrades,
            });
        }

        return updatedStudents;
    });
};

export const lockTopicWiseGradeSubmissionRepo = async ({
    submissionSlug,
    userSlug,
}) => {
    return prisma.topicWiseGradeSubmission.update({
        where: {
            slug:
                submissionSlug,
        },

        data: {
            isLocked: true,
            lockedAt: new Date(),
            lockedBySlug:
                userSlug || null,
        },
    });
};

export const unlockTopicWiseGradeSubmissionRepo = async ({
    submissionSlug,
}) => {
    return prisma.topicWiseGradeSubmission.update({
        where: {
            slug:
                submissionSlug,
        },

        data: {
            isLocked: false,
            lockedAt: null,
            lockedBySlug: null,
        },
    });
};

export const softDeleteTopicWiseGradeSubmissionRepo = async ({
    submissionSlug,
}) => {
    return prisma.topicWiseGradeSubmission.update({
        where: {
            slug:
                submissionSlug,
        },

        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreTopicWiseGradeSubmissionRepo = async ({
    submissionSlug,
}) => {
    return prisma.topicWiseGradeSubmission.update({
        where: {
            slug:
                submissionSlug,
        },

        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};

export const createTopicWiseGradeAuditLogRepo = async ({
    data,
}) => {
    return prisma.topicWiseGradeAuditLog.create({
        data,
    });
};

export const createTopicWiseGradeAuditLogsRepo = async ({
    logs,
}) => {
    if (!logs.length) {
        return {
            count: 0,
        };
    }

    return prisma.topicWiseGradeAuditLog.createMany({
        data:
            logs,
    });
};

export const getTopicWiseGradeAuditLogsRepo = async ({
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

        ...(submissionSlug
            ? { submissionSlug }
            : {}),

        ...(studentSlug
            ? { studentSlug }
            : {}),

        ...(action
            ? { action }
            : {}),

        ...(result
            ? { result }
            : {}),
    };

    const [logs, total] =
        await Promise.all([
            prisma.topicWiseGradeAuditLog.findMany({
                where,
                skip,
                take,

                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.topicWiseGradeAuditLog.count({
                where,
            }),
        ]);

    return {
        logs,
        total,
    };
};
