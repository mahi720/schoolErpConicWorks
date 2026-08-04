import { randomUUID } from "crypto";

import {
    findCoScholasticSchoolRepo,
    findCoScholasticSessionRepo,
    findCoScholasticBoardRepo,
    findCoScholasticTermExamBySlugRepo,
    findCoScholasticClassRepo,
    findCoScholasticSectionRepo,
    findCoScholasticStreamRepo,
    findCoScholasticClassSubjectsRepo,
    findCoScholasticAcademicStudentsRepo,
    findCoScholasticSubmissionByScopeRepo,
    findCoScholasticSubmissionBySlugRepo,
    saveCoScholasticGradesTransactionRepo,
    bulkUpdateCoScholasticGradesTransactionRepo,
    lockCoScholasticSubmissionRepo,
    unlockCoScholasticSubmissionRepo,
    softDeleteCoScholasticSubmissionRepo,
    restoreCoScholasticSubmissionRepo,
    createCoScholasticAuditLogRepo,
    createCoScholasticAuditLogsRepo,
    getCoScholasticAuditLogsRepo,
} from "../../../../repositories/examManager/marksSubmission/coScholasticGradeSubmission/coScholasticGradeSubmission.repository.js";

import {
    buildCoScholasticScopeKey,
    buildCoScholasticChangedFields,
} from "../../../../utils/coScholasticGradeAuditHelper.js";

const VALID_GRADES = new Set([
    "A_PLUS", "A", "B_PLUS", "B", "C_PLUS", "C", "D_PLUS", "D", "E", "NEEDS_IMPROVEMENT", "NOT_ASSESSED",
]);

const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const resolveSchool = async ({ user }) => {
    const school = await findCoScholasticSchoolRepo({ schoolSlug: user?.schoolSlug, schoolCode: user?.schoolCode });

    if (!school) throw createError("School not found", 404);

    return school;
};

const resolveContext = async ({ user, payload }) => {
    const school = await resolveSchool({ user });
    const session = await findCoScholasticSessionRepo({ schoolSlug: school.slug, academicYear: payload.academicYear });

    if (!session) throw createError("Academic year not found", 404);

    const board = await findCoScholasticBoardRepo({ schoolSlug: school.slug, boardTitle: payload.board });

    if (!board) throw createError("Board not found", 404);

    const termExam = await findCoScholasticTermExamBySlugRepo({
        schoolSlug: school.slug,
        sessionSlug: session.slug,
        boardSlug: board.slug,
        termExamSlug: payload.termExamSlug,
    });

    if (!termExam) throw createError("Term exam not found", 404);

    const classData = await findCoScholasticClassRepo({ schoolSlug: school.slug, boardSlug: board.slug, classTitle: payload.classTitle });

    if (!classData) throw createError("Class not found", 404);

    let section = null;
    let stream = null;

    if (payload.section) {
        section = await findCoScholasticSectionRepo({ schoolSlug: school.slug, boardSlug: board.slug, sectionTitle: payload.section });

        if (!section) throw createError("Section not found", 404);
    }

    if (payload.stream) {
        stream = await findCoScholasticStreamRepo({ schoolSlug: school.slug, boardSlug: board.slug, streamTitle: payload.stream });

        if (!stream) throw createError("Stream not found", 404);
    }

    const classSubjects = await findCoScholasticClassSubjectsRepo({
        schoolSlug: school.slug,
        sessionSlug: session.slug,
        boardSlug: board.slug,
        classSlug: classData.slug,
        streamSlug: stream?.slug || null,
    });

    if (!classSubjects.length) {
        throw createError("No Co-Scholastic or Personality Traits subjects found", 404);
    }

    return {
        school,
        session,
        board,
        termExam,
        classData,
        section,
        stream,
        classSubjects,
        scopeKey: buildCoScholasticScopeKey({ sectionSlug: section?.slug || null, streamSlug: stream?.slug || null }),
    };
};

const buildAudit = ({ context, actor, requestMetadata, submissionSlug = null, studentGradeSlug = null, studentSubjectGradeSlug = null, academicMapping = null, classSubject = null, action, oldData = null, newData = null, requestBody = null, remarks = null }) => ({
    slug: randomUUID(),
    schoolSlug: context.school.slug,
    submissionSlug,
    studentGradeSlug,
    studentSubjectGradeSlug,
    termExamSlug: context.termExam.slug,
    classSlug: context.classData.slug,
    classSubjectSlug:
        classSubject?.classSubjectSlug ||
        classSubject?.slug ||
        null,

    subjectSlug:
        classSubject?.subjectSlug ||
        classSubject?.subject?.slug ||
        null,
    sectionSlug: context.section?.slug || null,
    streamSlug: context.stream?.slug || null,
    studentSlug: academicMapping?.studentSlug || null,
    performedBySlug: actor?.performedBySlug || null,
    action,
    result: "SUCCESS",
    actorName: actor?.actorName || null,
    actorEmail: actor?.actorEmail || null,
    actorRole: actor?.actorRole || null,
    termExamTitle: context.termExam.examTitle,
    academicYear: context.session.name,
    boardTitle: context.board.title,
    classTitle: context.classData.classTitle,
    sectionTitle: context.section?.sectionTitle || null,
    streamTitle: context.stream?.streamTitle || null,
    subjectTitle: classSubject?.subjectTitle || classSubject?.subject?.subjectTitle || null,
    subjectType: classSubject?.subjectType || classSubject?.subject?.subjectType || null,
    studentName: academicMapping?.student?.studentName || null,
    admissionNumber: academicMapping?.student?.admissionNumber || null,
    rollNumber: academicMapping?.rollNumber ?? null,
    oldData,
    newData,
    changedFields: buildCoScholasticChangedFields({ oldData, newData }),
    requestBody,
    remarks,
    ipAddress: requestMetadata?.ipAddress || null,
    forwardedFor: requestMetadata?.forwardedFor || null,
    userAgent: requestMetadata?.userAgent || null,
    requestMethod: requestMetadata?.requestMethod || null,
    requestUrl: requestMetadata?.requestUrl || null,
    requestId: requestMetadata?.requestId || null,
    deviceIdentifier: requestMetadata?.deviceIdentifier || null,
});

export const getCoScholasticStudentsService = async ({ user, query, actor, requestMetadata }) => {
    const context = await resolveContext({ user, payload: query });
    const academicStudents = await findCoScholasticAcademicStudentsRepo({
        schoolSlug: context.school.slug,
        sessionSlug: context.session.slug,
        boardSlug: context.board.slug,
        classSlug: context.classData.slug,
        sectionSlug: context.section?.slug || null,
        streamSlug: context.stream?.slug || null,
    });

    const existingSubmission = await findCoScholasticSubmissionByScopeRepo({
        schoolSlug: context.school.slug,
        termExamSlug: context.termExam.slug,
        classSlug: context.classData.slug,
        scopeKey: context.scopeKey,
    });

    const existingMap = new Map((existingSubmission?.studentGrades || []).map((item) => [item.studentSlug, item]));
    const subjects = context.classSubjects.map((item) => ({
        classSubjectSlug: item.slug,
        subjectSlug: item.subject.slug,
        subjectTitle: item.subject.subjectTitle,
        subjectType: item.subject.subjectType,
        subjectOrder: item.subject.subjectOrder,
        studyMode: item.studyType,
        streamSlug: item.streamSlug,
        streamTitle: item.stream?.streamTitle || null,
    }));

    const students = academicStudents.map((mapping, index) => {
        const savedStudent = existingMap.get(mapping.studentSlug);
        const subjectGrades = {};

        for (const subject of subjects) {
            const saved = savedStudent?.subjectGrades?.find((item) => item.classSubjectSlug === subject.classSubjectSlug);
            subjectGrades[subject.classSubjectSlug] = {
                studentSubjectGradeSlug: saved?.slug || null,
                grade: saved?.grade || null,
                assessmentStatus: saved?.assessmentStatus || "ASSESSED",
                remarks: saved?.remarks || "",
            };
        }

        return {
            sn: index + 1,
            studentSlug: mapping.studentSlug,
            academicMappingSlug: mapping.slug,
            admissionNumber: mapping.student.admissionNumber,
            studentName: mapping.student.studentName,
            profileImage: mapping.student.profileImage,
            rollNumberPrefix: mapping.rollNumberPrefix,
            rollNumber: mapping.rollNumber,
            sectionSlug: mapping.sectionSlug,
            sectionTitle: mapping.section?.sectionTitle || null,
            streamSlug: mapping.streamSlug,
            streamTitle: mapping.stream?.streamTitle || null,
            studentGradeSlug: savedStudent?.slug || null,
            overallStatus: savedStudent?.overallStatus || "ASSESSED",
            remarkType: savedStudent?.remarkType || "",
            remark: savedStudent?.remark || "",
            presentDays: savedStudent?.presentDays ?? null,
            totalDays: savedStudent?.totalDays ?? null,
            result: savedStudent?.result || "NOT_DECLARED",
            subjectGrades,
        };
    });

    try {
        await createCoScholasticAuditLogRepo({
            data: buildAudit({ context, actor, requestMetadata, submissionSlug: existingSubmission?.slug || null, action: "VIEW_GRADES", requestBody: query }),
        });
    } catch (auditError) {
        console.error("Co-Scholastic view audit error:", auditError);
    }

    return {
        filters: {
            academicYear: context.session.name,
            board: context.board.title,
            termExamSlug: context.termExam.slug,
            termExamTitle: context.termExam.examTitle,
            classTitle: context.classData.classTitle,
            section: context.section?.sectionTitle || null,
            stream: context.stream?.streamTitle || null,
        },
        configuration: {
            termExamSlug: context.termExam.slug,
            classSlug: context.classData.slug,
            sectionSlug: context.section?.slug || null,
            streamSlug: context.stream?.slug || null,
            scopeKey: context.scopeKey,
            subjects,
        },
        submission: existingSubmission ? {
            slug: existingSubmission.slug,
            isLocked: existingSubmission.isLocked,
            lockedAt: existingSubmission.lockedAt,
            submittedAt: existingSubmission.submittedAt,
            status: existingSubmission.status,
            isActive: existingSubmission.isActive,
        } : null,
        students,
    };
};

export const saveCoScholasticGradesService = async ({ user, payload, actor, requestMetadata }) => {
    const context = await resolveContext({ user, payload });
    const academicStudents = await findCoScholasticAcademicStudentsRepo({
        schoolSlug: context.school.slug,
        sessionSlug: context.session.slug,
        boardSlug: context.board.slug,
        classSlug: context.classData.slug,
        sectionSlug: context.section?.slug || null,
        streamSlug: context.stream?.slug || null,
    });

    if (!academicStudents.length) throw createError("No active students found for selected filters", 404);

    const academicMap = new Map(academicStudents.map((item) => [item.slug, item]));
    const subjectMap = new Map(context.classSubjects.map((item) => [item.slug, item]));
    const existingSubmission = await findCoScholasticSubmissionByScopeRepo({
        schoolSlug: context.school.slug,
        termExamSlug: context.termExam.slug,
        classSlug: context.classData.slug,
        scopeKey: context.scopeKey,
    });

    if (existingSubmission?.isLocked) throw createError("Grades are locked and cannot be edited");

    const normalizedStudents = payload.students.map((student) => {
        const academicMapping = academicMap.get(student.academicMappingSlug);

        if (!academicMapping) throw createError("Invalid student academic mapping found");
        if (academicMapping.studentSlug !== student.studentSlug) throw createError("Student and academic mapping do not match");
        if (student.presentDays != null && student.totalDays != null && Number(student.presentDays) > Number(student.totalDays)) {
            throw createError(`Present days cannot exceed total days for ${academicMapping.student.studentName}`);
        }
        if (student.subjectGrades.length !== context.classSubjects.length) {
            throw createError(`All subject grades are required for ${academicMapping.student.studentName}`);
        }

        const seen = new Set();
        const subjectGrades = student.subjectGrades.map((input) => {
            if (seen.has(input.classSubjectSlug)) throw createError("Duplicate class subject found");
            seen.add(input.classSubjectSlug);

            const classSubject = subjectMap.get(input.classSubjectSlug);

            if (!classSubject) throw createError("Invalid Co-Scholastic subject found");

            let assessmentStatus = input.assessmentStatus || "ASSESSED";
            let grade = input.grade ?? null;

            if (student.overallStatus !== "ASSESSED") {
                assessmentStatus = student.overallStatus;
                grade = null;
            } else if (assessmentStatus !== "ASSESSED") {
                grade = null;
            }

            if (assessmentStatus === "ASSESSED" && (!grade || !VALID_GRADES.has(grade))) {
                throw createError(`Valid grade is required for ${classSubject.subject.subjectTitle} - ${academicMapping.student.studentName}`);
            }

            return {
                slug: randomUUID(),
                classSubjectSlug: classSubject.slug,
                subjectSlug: classSubject.subject.slug,
                subjectTitle: classSubject.subject.subjectTitle,
                subjectType: classSubject.subject.subjectType,
                subjectOrder: classSubject.subject.subjectOrder,
                grade,
                assessmentStatus,
                remarks: input.remarks || null,
            };
        });

        return {
            slug: randomUUID(),
            studentSlug: student.studentSlug,
            academicMappingSlug: student.academicMappingSlug,
            rollNumber: academicMapping.rollNumber,
            overallStatus: student.overallStatus || "ASSESSED",
            remarkType: student.remarkType || null,
            remark: student.remark || null,
            presentDays: student.presentDays ?? null,
            totalDays: student.totalDays ?? null,
            result: student.result || "NOT_DECLARED",
            subjectGrades,
            academicMapping,
        };
    });

    const result = await saveCoScholasticGradesTransactionRepo({
        submissionData: {
            slug: existingSubmission?.slug || randomUUID(),
            schoolSlug: context.school.slug,
            termExamSlug: context.termExam.slug,
            classSlug: context.classData.slug,
            sectionSlug: context.section?.slug || null,
            streamSlug: context.stream?.slug || null,
            scopeKey: context.scopeKey,
            submittedBySlug: user?.slug || null,
            submittedAt: new Date(),
            isLocked: false,
        },
        students: normalizedStudents,
    });

    const logs = [];

    if (result.isNewSubmission) {
        logs.push(buildAudit({
            context,
            actor,
            requestMetadata,
            submissionSlug: result.submission.slug,
            action: "CREATE_SUBMISSION",
            requestBody: payload,
            newData: { slug: result.submission.slug, scopeKey: result.submission.scopeKey },
        }));
    }

    for (const savedStudent of result.savedStudents) {
        const normalized = normalizedStudents.find((item) => item.studentSlug === savedStudent.newStudentGrade.studentSlug);

        for (const savedSubject of savedStudent.savedSubjectGrades) {
            const oldData = savedSubject.oldSubjectGrade ? {
                grade: savedSubject.oldSubjectGrade.grade,
                assessmentStatus: savedSubject.oldSubjectGrade.assessmentStatus,
                remarks: savedSubject.oldSubjectGrade.remarks,
            } : null;

            const newData = {
                grade: savedSubject.newSubjectGrade.grade,
                assessmentStatus: savedSubject.newSubjectGrade.assessmentStatus,
                remarks: savedSubject.newSubjectGrade.remarks,
            };

            logs.push({
                ...buildAudit({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug: result.submission.slug,
                    studentGradeSlug: savedStudent.newStudentGrade.slug,
                    studentSubjectGradeSlug: savedSubject.newSubjectGrade.slug,
                    academicMapping: normalized?.academicMapping,
                    classSubject: savedSubject.newSubjectGrade,
                    action: savedSubject.oldSubjectGrade ? "UPDATE_SUBJECT_GRADE" : "SAVE_SUBJECT_GRADE",
                    oldData,
                    newData,
                    requestBody: payload,
                }),
                previousGrade: savedSubject.oldSubjectGrade?.grade || null,
                newGrade: savedSubject.newSubjectGrade.grade,
                previousAssessmentStatus: savedSubject.oldSubjectGrade?.assessmentStatus || null,
                newAssessmentStatus: savedSubject.newSubjectGrade.assessmentStatus,
            });
        }
    }

    await createCoScholasticAuditLogsRepo({ logs });

    return findCoScholasticSubmissionBySlugRepo({ schoolSlug: context.school.slug, submissionSlug: result.submission.slug });
};

export const bulkUpdateCoScholasticGradesService = async ({ user, submissionSlug, payload }) => {
    const school = await resolveSchool({ user });
    const submission = await findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug });

    if (!submission) throw createError("Co-Scholastic grade submission not found", 404);
    if (submission.isLocked) throw createError("Grades are locked and cannot be edited");

    const students = payload.students.map((student) => ({
        studentGradeSlug: student.studentGradeSlug,
        overallStatus: student.overallStatus || "ASSESSED",
        remarkType: student.remarkType || null,
        remark: student.remark || null,
        presentDays: student.presentDays ?? null,
        totalDays: student.totalDays ?? null,
        result: student.result || "NOT_DECLARED",
        subjectGrades: student.subjectGrades.map((subject) => {
            let grade = subject.grade ?? null;
            let assessmentStatus = subject.assessmentStatus || "ASSESSED";

            if (student.overallStatus !== "ASSESSED") {
                assessmentStatus = student.overallStatus;
                grade = null;
            } else if (assessmentStatus !== "ASSESSED") {
                grade = null;
            }

            if (assessmentStatus === "ASSESSED" && (!grade || !VALID_GRADES.has(grade))) {
                throw createError("Valid grade is required for assessed subject");
            }

            return {
                studentSubjectGradeSlug: subject.studentSubjectGradeSlug,
                grade,
                assessmentStatus,
                remarks: subject.remarks || null,
            };
        }),
    }));

    await bulkUpdateCoScholasticGradesTransactionRepo({ schoolSlug: school.slug, students });

    return findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug });
};

export const getCoScholasticSubmissionService = async ({ user, submissionSlug }) => {
    const school = await resolveSchool({ user });
    const submission = await findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug });

    if (!submission) throw createError("Co-Scholastic grade submission not found", 404);

    return submission;
};

export const lockCoScholasticGradesService = async ({ user, submissionSlug }) => {
    const school = await resolveSchool({ user });
    const submission = await findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug });

    if (!submission) throw createError("Co-Scholastic grade submission not found", 404);
    if (submission.isLocked) throw createError("Grades are already locked");
    if (!submission.studentGrades.length) throw createError("Cannot lock empty grade submission");

    return lockCoScholasticSubmissionRepo({ submissionSlug, userSlug: user?.slug });
};

export const unlockCoScholasticGradesService = async ({ user, submissionSlug }) => {
    const school = await resolveSchool({ user });
    const submission = await findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug });

    if (!submission) throw createError("Co-Scholastic grade submission not found", 404);
    if (!submission.isLocked) throw createError("Grades are already unlocked");

    return unlockCoScholasticSubmissionRepo({ submissionSlug });
};

export const deleteCoScholasticGradesService = async ({ user, submissionSlug }) => {
    const school = await resolveSchool({ user });
    const submission = await findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug });

    if (!submission) throw createError("Co-Scholastic grade submission not found", 404);
    if (submission.isLocked) throw createError("Locked grades cannot be deleted");

    return softDeleteCoScholasticSubmissionRepo({ submissionSlug });
};

export const restoreCoScholasticGradesService = async ({ user, submissionSlug }) => {
    const school = await resolveSchool({ user });
    const submission = await findCoScholasticSubmissionBySlugRepo({ schoolSlug: school.slug, submissionSlug, includeInactive: true });

    if (!submission) throw createError("Co-Scholastic grade submission not found", 404);
    if (submission.isActive) throw createError("Co-Scholastic grade submission is already active");

    return restoreCoScholasticSubmissionRepo({ submissionSlug });
};

export const getCoScholasticAuditLogsService = async ({ user, query }) => {
    const school = await resolveSchool({ user });
    const page = Number(query.page || 1);
    const limit = Math.min(Number(query.limit || 20), 100);
    const result = await getCoScholasticAuditLogsRepo({
        schoolSlug: school.slug,
        submissionSlug: query.submissionSlug,
        studentSlug: query.studentSlug,
        action: query.action,
        result: query.result,
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        data: result.logs,
        pagination: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
    };
};
