import prisma from "../../../../config/prisma.js";

const activeWhere = { status: "active", isActive: true, deletedAt: null };

const submissionInclude = {
    termExam: { include: { session: true, board: true, examType: true } },
    class: true,
    section: true,
    stream: true,
    studentGrades: {
        orderBy: [{ rollNumber: "asc" }, { student: { studentName: "asc" } }],
        include: {
            student: true,
            academicMapping: { include: { section: true, stream: true } },
            subjectGrades: {
                orderBy: { subjectOrder: "asc" },
                include: { classSubject: { include: { subject: true, stream: true } }, subject: true },
            },
        },
    },
    submittedBy: { select: { slug: true, name: true, email: true, role: true } },
    lockedBy: { select: { slug: true, name: true, email: true, role: true } },
};

export const findCoScholasticSchoolRepo = async ({ schoolSlug, schoolCode }) => prisma.school.findFirst({
    where: { ...(schoolSlug ? { slug: schoolSlug } : {}), ...(schoolCode ? { schoolCode } : {}), isActive: true, deletedAt: null },
});

export const findCoScholasticSessionRepo = async ({ schoolSlug, academicYear }) => prisma.session.findFirst({
    where: { schoolSlug, name: academicYear, ...activeWhere },
});

export const findCoScholasticBoardRepo = async ({ schoolSlug, boardTitle }) => prisma.board.findFirst({
    where: { schoolSlug, title: boardTitle, ...activeWhere },
});

export const findCoScholasticTermExamBySlugRepo = async ({ schoolSlug, sessionSlug, boardSlug, termExamSlug }) => prisma.termExam.findFirst({
    where: { schoolSlug, sessionSlug, boardSlug, slug: termExamSlug, ...activeWhere },
    include: { session: true, board: true, examType: true },
});

export const findCoScholasticClassRepo = async ({ schoolSlug, boardSlug, classTitle }) => prisma.class.findFirst({
    where: { schoolSlug, boardSlug, classTitle, ...activeWhere },
});

export const findCoScholasticSectionRepo = async ({ schoolSlug, boardSlug, sectionTitle }) => prisma.section.findFirst({
    where: { schoolSlug, boardSlug, sectionTitle, ...activeWhere },
});

export const findCoScholasticStreamRepo = async ({ schoolSlug, boardSlug, streamTitle }) => prisma.stream.findFirst({
    where: { schoolSlug, boardSlug, streamTitle, ...activeWhere },
});

export const findCoScholasticClassSubjectsRepo = async ({ schoolSlug, sessionSlug, boardSlug, classSlug, streamSlug }) => prisma.addSubjectToClass.findMany({
    where: {
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        ...activeWhere,
        subject: {
            isActive: true,
            deletedAt: null,
            subjectType: { in: ["Co-Scholastic", "Personality Traits"] },
        },
        ...(streamSlug ? { OR: [{ streamSlug }, { streamSlug: null }] } : {}),
    },
    include: { subject: true, stream: true },
    orderBy: [{ subject: { subjectOrder: "asc" } }, { subject: { subjectTitle: "asc" } }],
});

export const findCoScholasticAcademicStudentsRepo = async ({ schoolSlug, sessionSlug, boardSlug, classSlug, sectionSlug, streamSlug }) => prisma.studentAcademicRollSectionStreamMapping.findMany({
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
        student: { select: { slug: true, admissionNumber: true, studentName: true, fatherName: true, motherName: true, profileImage: true, gender: true, category: true } },
        section: true,
        stream: true,
    },
    orderBy: [{ rollNumber: "asc" }, { student: { studentName: "asc" } }],
});

export const findCoScholasticSubmissionByScopeRepo = async ({ schoolSlug, termExamSlug, classSlug, scopeKey, includeInactive = false }) => prisma.coScholasticGradeSubmission.findFirst({
    where: { schoolSlug, termExamSlug, classSlug, scopeKey, ...(!includeInactive ? { isActive: true, deletedAt: null } : {}) },
    include: submissionInclude,
});

export const findCoScholasticSubmissionBySlugRepo = async ({ schoolSlug, submissionSlug, includeInactive = false }) => prisma.coScholasticGradeSubmission.findFirst({
    where: { schoolSlug, slug: submissionSlug, ...(!includeInactive ? { isActive: true, deletedAt: null } : {}) },
    include: submissionInclude,
});

export const saveCoScholasticGradesTransactionRepo = async ({ submissionData, students }) => prisma.$transaction(async (tx) => {
    const uniqueWhere = {
        schoolSlug_termExamSlug_classSlug_scopeKey: {
            schoolSlug: submissionData.schoolSlug,
            termExamSlug: submissionData.termExamSlug,
            classSlug: submissionData.classSlug,
            scopeKey: submissionData.scopeKey,
        },
    };

    const existingSubmission = await tx.coScholasticGradeSubmission.findUnique({ where: uniqueWhere });
    const submission = await tx.coScholasticGradeSubmission.upsert({
        where: uniqueWhere,
        update: {
            sectionSlug: submissionData.sectionSlug,
            streamSlug: submissionData.streamSlug,
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
        const studentWhere = { submissionSlug_studentSlug: { submissionSlug: submission.slug, studentSlug: student.studentSlug } };
        const oldStudentGrade = await tx.coScholasticStudentGrade.findUnique({ where: studentWhere, include: { subjectGrades: true } });
        const studentGrade = await tx.coScholasticStudentGrade.upsert({
            where: studentWhere,
            update: {
                academicMappingSlug: student.academicMappingSlug,
                rollNumber: student.rollNumber,
                overallStatus: student.overallStatus,
                remarkType: student.remarkType,
                remark: student.remark,
                presentDays: student.presentDays,
                totalDays: student.totalDays,
                result: student.result,
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
                overallStatus: student.overallStatus,
                remarkType: student.remarkType,
                remark: student.remark,
                presentDays: student.presentDays,
                totalDays: student.totalDays,
                result: student.result,
            },
        });

        const savedSubjectGrades = [];

        for (const subject of student.subjectGrades) {
            const oldSubjectGrade = oldStudentGrade?.subjectGrades.find((item) => item.classSubjectSlug === subject.classSubjectSlug) || null;
            const newSubjectGrade = await tx.coScholasticStudentSubjectGrade.upsert({
                where: { studentGradeSlug_classSubjectSlug: { studentGradeSlug: studentGrade.slug, classSubjectSlug: subject.classSubjectSlug } },
                update: {
                    subjectSlug: subject.subjectSlug,
                    subjectTitle: subject.subjectTitle,
                    subjectType: subject.subjectType,
                    subjectOrder: subject.subjectOrder,
                    grade: subject.grade,
                    assessmentStatus: subject.assessmentStatus,
                    remarks: subject.remarks,
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
                create: {
                    slug: subject.slug,
                    schoolSlug: submissionData.schoolSlug,
                    studentGradeSlug: studentGrade.slug,
                    classSubjectSlug: subject.classSubjectSlug,
                    subjectSlug: subject.subjectSlug,
                    subjectTitle: subject.subjectTitle,
                    subjectType: subject.subjectType,
                    subjectOrder: subject.subjectOrder,
                    grade: subject.grade,
                    assessmentStatus: subject.assessmentStatus,
                    remarks: subject.remarks,
                },
            });

            savedSubjectGrades.push({ oldSubjectGrade, newSubjectGrade });
        }

        savedStudents.push({ oldStudentGrade, newStudentGrade: studentGrade, savedSubjectGrades });
    }

    return { isNewSubmission: !existingSubmission, submission, savedStudents };
});

export const bulkUpdateCoScholasticGradesTransactionRepo = async ({ schoolSlug, students }) => prisma.$transaction(async (tx) => {
    const updatedStudents = [];

    for (const student of students) {
        const oldStudentGrade = await tx.coScholasticStudentGrade.findFirst({
            where: { schoolSlug, slug: student.studentGradeSlug, isActive: true, deletedAt: null },
            include: { student: true, subjectGrades: true },
        });

        if (!oldStudentGrade) throw new Error("Student grade not found");

        const updatedSubjectGrades = [];

        for (const subject of student.subjectGrades) {
            const oldSubjectGrade = oldStudentGrade.subjectGrades.find((item) => item.slug === subject.studentSubjectGradeSlug);

            if (!oldSubjectGrade) throw new Error("Student subject grade not found");

            const newSubjectGrade = await tx.coScholasticStudentSubjectGrade.update({
                where: { slug: subject.studentSubjectGradeSlug },
                data: { grade: subject.grade, assessmentStatus: subject.assessmentStatus, remarks: subject.remarks },
            });

            updatedSubjectGrades.push({ oldSubjectGrade, newSubjectGrade });
        }

        const newStudentGrade = await tx.coScholasticStudentGrade.update({
            where: { slug: student.studentGradeSlug },
            data: {
                overallStatus: student.overallStatus,
                remarkType: student.remarkType,
                remark: student.remark,
                presentDays: student.presentDays,
                totalDays: student.totalDays,
                result: student.result,
            },
        });

        updatedStudents.push({ oldStudentGrade, newStudentGrade, updatedSubjectGrades });
    }

    return updatedStudents;
});

export const lockCoScholasticSubmissionRepo = async ({ submissionSlug, userSlug }) => prisma.coScholasticGradeSubmission.update({
    where: { slug: submissionSlug },
    data: { isLocked: true, lockedAt: new Date(), lockedBySlug: userSlug || null },
});

export const unlockCoScholasticSubmissionRepo = async ({ submissionSlug }) => prisma.coScholasticGradeSubmission.update({
    where: { slug: submissionSlug },
    data: { isLocked: false, lockedAt: null, lockedBySlug: null },
});

export const softDeleteCoScholasticSubmissionRepo = async ({ submissionSlug }) => prisma.coScholasticGradeSubmission.update({
    where: { slug: submissionSlug },
    data: { status: "inactive", isActive: false, deletedAt: new Date() },
});

export const restoreCoScholasticSubmissionRepo = async ({ submissionSlug }) => prisma.coScholasticGradeSubmission.update({
    where: { slug: submissionSlug },
    data: { status: "active", isActive: true, deletedAt: null },
});

export const createCoScholasticAuditLogRepo = async ({ data }) => prisma.coScholasticGradeAuditLog.create({ data });
export const createCoScholasticAuditLogsRepo = async ({ logs }) => logs.length ? prisma.coScholasticGradeAuditLog.createMany({ data: logs }) : { count: 0 };

export const getCoScholasticAuditLogsRepo = async ({ schoolSlug, submissionSlug, studentSlug, action, result, skip, take }) => {
    const where = {
        schoolSlug,
        ...(submissionSlug ? { submissionSlug } : {}),
        ...(studentSlug ? { studentSlug } : {}),
        ...(action ? { action } : {}),
        ...(result ? { result } : {}),
    };

    const [logs, total] = await Promise.all([
        prisma.coScholasticGradeAuditLog.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
        prisma.coScholasticGradeAuditLog.count({ where }),
    ]);

    return { logs, total };
};
