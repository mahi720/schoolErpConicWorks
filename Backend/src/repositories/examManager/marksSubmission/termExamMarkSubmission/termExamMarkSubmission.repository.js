import prisma from "../../../../config/prisma.js";

const activeWhere = {
    status: "active",
    isActive: true,
    deletedAt: null,
};

const submissionInclude = {
    termExamTimeTable: {
        include: {
            termExamClassConfiguration: {
                include: {
                    termExam: {
                        include: {
                            session: true,
                            board: true,
                            examType: true,
                        },
                    },
                    class: true,
                },
            },
        },
    },
    classSubject: {
        include: {
            subject: true,
            stream: true,
            marksConfigs: {
                where: activeWhere,
                orderBy: { createdAt: "asc" },
            },
        },
    },
    section: true,
    stream: true,
    studentMarks: {
        orderBy: [
            { rollNumber: "asc" },
            { student: { studentName: "asc" } },
        ],
        include: {
            student: true,
            academicMapping: {
                include: {
                    section: true,
                    stream: true,
                },
            },
            componentMarks: {
                orderBy: { createdAt: "asc" },
            },
        },
    },
    submittedBy: {
        select: { slug: true, name: true, email: true, role: true },
    },
    lockedBy: {
        select: { slug: true, name: true, email: true, role: true },
    },
};

export const findTermMarkSchoolRepo = async ({ schoolSlug, schoolCode }) => {
    return prisma.school.findFirst({
        where: {
            ...(schoolSlug ? { slug: schoolSlug } : {}),
            ...(schoolCode ? { schoolCode } : {}),
            isActive: true,
            deletedAt: null,
        },
    });
};

export const findTermMarkSessionByNameRepo = async ({ schoolSlug, academicYear }) => {
    return prisma.session.findFirst({
        where: { schoolSlug, name: academicYear, ...activeWhere },
    });
};

export const findTermMarkBoardByTitleRepo = async ({ schoolSlug, boardTitle }) => {
    return prisma.board.findFirst({
        where: { schoolSlug, title: boardTitle, ...activeWhere },
    });
};

export const findTermExamByTitleRepo = async ({ schoolSlug, sessionSlug, boardSlug, termExamTitle }) => {
    return prisma.termExam.findFirst({
        where: {
            schoolSlug,
            sessionSlug,
            boardSlug,
            examTitle: termExamTitle,
            ...activeWhere,
        },
        include: { session: true, board: true, examType: true },
    });
};

export const findTermMarkClassByTitleRepo = async ({ schoolSlug, boardSlug, classTitle }) => {
    return prisma.class.findFirst({
        where: { schoolSlug, boardSlug, classTitle, ...activeWhere },
    });
};

export const findTermExamClassConfigurationRepo = async ({ schoolSlug, termExamSlug, classSlug }) => {
    return prisma.termExamClassConfiguration.findFirst({
        where: { schoolSlug, termExamSlug, classSlug, ...activeWhere },
    });
};

export const findTermMarkSectionByTitleRepo = async ({ schoolSlug, boardSlug, sectionTitle }) => {
    return prisma.section.findFirst({
        where: { schoolSlug, boardSlug, sectionTitle, ...activeWhere },
    });
};

export const findTermMarkStreamByTitleRepo = async ({ schoolSlug, boardSlug, streamTitle }) => {
    return prisma.stream.findFirst({
        where: { schoolSlug, boardSlug, streamTitle, ...activeWhere },
    });
};

export const findTermClassSubjectBySlugRepo = async ({ schoolSlug, classSubjectSlug }) => {
    return prisma.addSubjectToClass.findFirst({
        where: { schoolSlug, slug: classSubjectSlug, ...activeWhere },
        include: {
            subject: true,
            stream: true,
            marksConfigs: {
                where: activeWhere,
                orderBy: { createdAt: "asc" },
            },
        },
    });
};

export const findTermExamTimeTableRepo = async ({
    schoolSlug,
    termExamClassConfigurationSlug,
    classSubjectSlug,
    streamSlug,
}) => {
    return prisma.termExamTimeTable.findFirst({
        where: {
            schoolSlug,
            termExamClassConfigurationSlug,
            classSubjectSlug,
            streamSlug: streamSlug || null,
            ...activeWhere,
        },
        include: {
            stream: true,
            classSubject: {
                include: {
                    subject: true,
                    stream: true,
                    marksConfigs: {
                        where: activeWhere,
                        orderBy: { createdAt: "asc" },
                    },
                },
            },
        },
    });
};

export const findTermAcademicStudentsRepo = async ({
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
            student: { isActive: true, deletedAt: null },
            ...(sectionSlug ? { sectionSlug } : {}),
            ...(streamSlug ? { streamSlug } : {}),
        },
        include: {
            student: true,
            section: true,
            stream: true,
        },
        orderBy: [
            { rollNumber: "asc" },
            { student: { studentName: "asc" } },
        ],
    });
};

export const findTermSubmissionByScopeRepo = async ({
    schoolSlug,
    termExamTimeTableSlug,
    classSubjectSlug,
    scopeKey,
    includeInactive = false,
}) => {
    return prisma.termExamMarkSubmission.findFirst({
        where: {
            schoolSlug,
            termExamTimeTableSlug,
            classSubjectSlug,
            scopeKey,
            ...(!includeInactive ? { isActive: true, deletedAt: null } : {}),
        },
        include: submissionInclude,
    });
};

export const findTermSubmissionBySlugRepo = async ({ schoolSlug, submissionSlug, includeInactive = false }) => {
    return prisma.termExamMarkSubmission.findFirst({
        where: {
            schoolSlug,
            slug: submissionSlug,
            ...(!includeInactive ? { isActive: true, deletedAt: null } : {}),
        },
        include: submissionInclude,
    });
};

export const findTermStudentMarksBySlugsRepo = async ({ schoolSlug, studentMarkSlugs }) => {
    return prisma.termExamStudentMark.findMany({
        where: {
            schoolSlug,
            slug: { in: studentMarkSlugs },
            isActive: true,
            deletedAt: null,
        },
        include: {
            student: true,
            academicMapping: true,
            componentMarks: true,
        },
    });
};

export const findTermComponentMarksBySlugsRepo = async ({ schoolSlug, componentMarkSlugs }) => {
    return prisma.termExamStudentComponentMark.findMany({
        where: {
            schoolSlug,
            slug: { in: componentMarkSlugs },
            isActive: true,
            deletedAt: null,
        },
    });
};

export const saveTermExamMarksTransactionRepo = async ({ submissionData, students }) => {
    return prisma.$transaction(async (tx) => {
        const previousSubmission = await tx.termExamMarkSubmission.findUnique({
            where: {
                schoolSlug_termExamTimeTableSlug_classSubjectSlug_scopeKey: {
                    schoolSlug: submissionData.schoolSlug,
                    termExamTimeTableSlug: submissionData.termExamTimeTableSlug,
                    classSubjectSlug: submissionData.classSubjectSlug,
                    scopeKey: submissionData.scopeKey,
                },
            },
        });

        const submission = await tx.termExamMarkSubmission.upsert({
            where: {
                schoolSlug_termExamTimeTableSlug_classSubjectSlug_scopeKey: {
                    schoolSlug: submissionData.schoolSlug,
                    termExamTimeTableSlug: submissionData.termExamTimeTableSlug,
                    classSubjectSlug: submissionData.classSubjectSlug,
                    scopeKey: submissionData.scopeKey,
                },
            },
            update: {
                sectionSlug: submissionData.sectionSlug,
                streamSlug: submissionData.streamSlug,
                totalMaxMarks: submissionData.totalMaxMarks,
                totalMinMarks: submissionData.totalMinMarks,
                submittedBySlug: submissionData.submittedBySlug,
                submittedAt: submissionData.submittedAt,
                status: "active",
                isActive: true,
                deletedAt: null,
            },
            create: submissionData,
        });

        const savedStudents = [];

        for (const student of students) {
            const oldStudentMark = await tx.termExamStudentMark.findUnique({
                where: {
                    submissionSlug_studentSlug: {
                        submissionSlug: submission.slug,
                        studentSlug: student.studentSlug,
                    },
                },
                include: { componentMarks: true },
            });

            const studentMark = await tx.termExamStudentMark.upsert({
                where: {
                    submissionSlug_studentSlug: {
                        submissionSlug: submission.slug,
                        studentSlug: student.studentSlug,
                    },
                },
                update: {
                    academicMappingSlug: student.academicMappingSlug,
                    rollNumber: student.rollNumber,
                    totalObtainedMarks: student.totalObtainedMarks,
                    markStatus: student.markStatus,
                    remarks: student.remarks,
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
                create: {
                    slug: student.slug,
                    schoolSlug: submissionData.schoolSlug,
                    submissionSlug: submission.slug,
                    studentSlug: student.studentSlug,
                    academicMappingSlug: student.academicMappingSlug,
                    rollNumber: student.rollNumber,
                    totalObtainedMarks: student.totalObtainedMarks,
                    markStatus: student.markStatus,
                    remarks: student.remarks,
                },
            });

            const savedComponents = [];

            for (const component of student.components) {
                const oldComponent = oldStudentMark?.componentMarks.find(
                    (item) => item.componentKey === component.componentKey,
                ) || null;

                const componentMark = await tx.termExamStudentComponentMark.upsert({
                    where: {
                        studentMarkSlug_componentKey: {
                            studentMarkSlug: studentMark.slug,
                            componentKey: component.componentKey,
                        },
                    },
                    update: {
                        subjectMarksConfigSlug: component.subjectMarksConfigSlug,
                        termExamTimeTableSlug: component.termExamTimeTableSlug,
                        componentName: component.componentName,
                        sourceType: component.sourceType,
                        maxMarks: component.maxMarks,
                        minMarks: component.minMarks,
                        obtainedMarks: component.obtainedMarks,
                        markStatus: component.markStatus,
                        remarks: component.remarks,
                        status: "active",
                        isActive: true,
                        deletedAt: null,
                    },
                    create: {
                        slug: component.slug,
                        schoolSlug: submissionData.schoolSlug,
                        studentMarkSlug: studentMark.slug,
                        subjectMarksConfigSlug: component.subjectMarksConfigSlug,
                        termExamTimeTableSlug: component.termExamTimeTableSlug,
                        componentKey: component.componentKey,
                        componentName: component.componentName,
                        sourceType: component.sourceType,
                        maxMarks: component.maxMarks,
                        minMarks: component.minMarks,
                        obtainedMarks: component.obtainedMarks,
                        markStatus: component.markStatus,
                        remarks: component.remarks,
                    },
                });

                savedComponents.push({ oldComponent, newComponent: componentMark });
            }

            savedStudents.push({ oldStudentMark, newStudentMark: studentMark, savedComponents });
        }

        return {
            isNewSubmission: !previousSubmission,
            submission,
            savedStudents,
        };
    });
};

export const bulkUpdateTermExamMarksTransactionRepo = async ({ schoolSlug, students }) => {
    return prisma.$transaction(async (tx) => {
        const updatedStudents = [];

        for (const student of students) {
            const oldStudentMark = await tx.termExamStudentMark.findFirst({
                where: {
                    schoolSlug,
                    slug: student.studentMarkSlug,
                    isActive: true,
                    deletedAt: null,
                },
                include: { componentMarks: true },
            });

            if (!oldStudentMark) {
                throw new Error("Student mark not found");
            }

            const updatedComponents = [];

            for (const component of student.components) {
                const oldComponent = oldStudentMark.componentMarks.find(
                    (item) => item.slug === component.componentMarkSlug,
                );

                if (!oldComponent) {
                    throw new Error("Component mark not found");
                }

                const newComponent = await tx.termExamStudentComponentMark.update({
                    where: { slug: component.componentMarkSlug },
                    data: {
                        obtainedMarks: component.obtainedMarks,
                        markStatus: component.markStatus,
                        remarks: component.remarks,
                    },
                });

                updatedComponents.push({ oldComponent, newComponent });
            }

            const newStudentMark = await tx.termExamStudentMark.update({
                where: { slug: student.studentMarkSlug },
                data: {
                    totalObtainedMarks: student.totalObtainedMarks,
                    markStatus: student.markStatus,
                    remarks: student.remarks,
                },
            });

            updatedStudents.push({ oldStudentMark, newStudentMark, updatedComponents });
        }

        return updatedStudents;
    });
};

export const lockTermExamSubmissionRepo = async ({ submissionSlug, userSlug }) => {
    return prisma.termExamMarkSubmission.update({
        where: { slug: submissionSlug },
        data: {
            isLocked: true,
            lockedAt: new Date(),
            lockedBySlug: userSlug || null,
        },
    });
};

export const unlockTermExamSubmissionRepo = async ({ submissionSlug }) => {
    return prisma.termExamMarkSubmission.update({
        where: { slug: submissionSlug },
        data: {
            isLocked: false,
            lockedAt: null,
            lockedBySlug: null,
        },
    });
};

export const softDeleteTermExamSubmissionRepo = async ({ submissionSlug }) => {
    return prisma.termExamMarkSubmission.update({
        where: { slug: submissionSlug },
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreTermExamSubmissionRepo = async ({ submissionSlug }) => {
    return prisma.termExamMarkSubmission.update({
        where: { slug: submissionSlug },
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};

export const createTermExamAuditLogRepo = async ({ data }) => {
    return prisma.termExamMarkAuditLog.create({ data });
};

export const createTermExamAuditLogsRepo = async ({ logs }) => {
    if (!logs.length) {
        return { count: 0 };
    }

    return prisma.termExamMarkAuditLog.createMany({ data: logs });
};

export const getTermExamAuditLogsRepo = async ({
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
        prisma.termExamMarkAuditLog.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
        }),
        prisma.termExamMarkAuditLog.count({ where }),
    ]);

    return { logs, total };
};
