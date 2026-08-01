import { randomUUID } from "crypto";

import {
    findTermMarkSchoolRepo,
    findTermMarkSessionByNameRepo,
    findTermMarkBoardByTitleRepo,
    findTermExamByTitleRepo,
    findTermMarkClassByTitleRepo,
    findTermExamClassConfigurationRepo,
    findTermMarkSectionByTitleRepo,
    findTermMarkStreamByTitleRepo,
    findTermClassSubjectBySlugRepo,
    findTermExamTimeTableRepo,
    findTermAcademicStudentsRepo,
    findTermSubmissionByScopeRepo,
    findTermSubmissionBySlugRepo,
    findTermStudentMarksBySlugsRepo,
    findTermComponentMarksBySlugsRepo,
    saveTermExamMarksTransactionRepo,
    bulkUpdateTermExamMarksTransactionRepo,
    lockTermExamSubmissionRepo,
    unlockTermExamSubmissionRepo,
    softDeleteTermExamSubmissionRepo,
    restoreTermExamSubmissionRepo,
    createTermExamAuditLogRepo,
    createTermExamAuditLogsRepo,
    getTermExamAuditLogsRepo,
} from "../../../../repositories/examManager/marksSubmission/termExamMarkSubmission/termExamMarkSubmission.repository.js";

import {
    buildTermExamScopeKey,
    buildTermExamChangedFields,
} from "../../../../utils/termExamMarkAuditHelper.js";

const normalizeDecimal = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    return Number(value);
};

const createServiceError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;

    return error;
};

const resolveSchool = async ({ user }) => {
    const school = await findTermMarkSchoolRepo({
        schoolSlug: user?.schoolSlug,
        schoolCode: user?.schoolCode,
    });

    if (!school) {
        throw createServiceError("School not found", 404);
    }

    return school;
};

const buildCanonicalComponents = ({ classSubject, termExam, timeTable }) => {
    const configuredComponents = (classSubject.marksConfigs || []).map((item) => ({
        componentKey: `CONFIG:${item.slug}`,
        componentName: item.componentName,
        sourceType: "SUBJECT_MARKS_CONFIG",
        subjectMarksConfigSlug: item.slug,
        termExamTimeTableSlug: null,
        maxMarks: Number(item.totalMarks),
        minMarks:
            item.passingMarks === null || item.passingMarks === undefined
                ? null
                : Number(item.passingMarks),
    }));

    return [
        ...configuredComponents,
        {
            componentKey: `TERM:${timeTable.slug}`,
            componentName: termExam.examTitle,
            sourceType: "TERM_EXAM",
            subjectMarksConfigSlug: null,
            termExamTimeTableSlug: timeTable.slug,
            maxMarks: Number(timeTable.maxMarks),
            minMarks: Number(timeTable.minMarks),
        },
    ];
};

const resolveTermExamMarkContext = async ({ user, payload }) => {
    const school = await resolveSchool({ user });

    const session = await findTermMarkSessionByNameRepo({
        schoolSlug: school.slug,
        academicYear: payload.academicYear,
    });

    if (!session) {
        throw createServiceError("Academic year not found", 404);
    }

    const board = await findTermMarkBoardByTitleRepo({
        schoolSlug: school.slug,
        boardTitle: payload.board,
    });

    if (!board) {
        throw createServiceError("Board not found", 404);
    }

    const termExam = await findTermExamByTitleRepo({
        schoolSlug: school.slug,
        sessionSlug: session.slug,
        boardSlug: board.slug,
        termExamTitle: payload.termExamTitle,
    });

    if (!termExam) {
        throw createServiceError("Term exam not found", 404);
    }

    const classData = await findTermMarkClassByTitleRepo({
        schoolSlug: school.slug,
        boardSlug: board.slug,
        classTitle: payload.classTitle,
    });

    if (!classData) {
        throw createServiceError("Class not found", 404);
    }

    const configuration = await findTermExamClassConfigurationRepo({
        schoolSlug: school.slug,
        termExamSlug: termExam.slug,
        classSlug: classData.slug,
    });

    if (!configuration) {
        throw createServiceError("Term exam class configuration not found", 404);
    }

    let section = null;

    if (payload.section) {
        section = await findTermMarkSectionByTitleRepo({
            schoolSlug: school.slug,
            boardSlug: board.slug,
            sectionTitle: payload.section,
        });

        if (!section) {
            throw createServiceError("Section not found", 404);
        }
    }

    let stream = null;

    if (payload.stream) {
        stream = await findTermMarkStreamByTitleRepo({
            schoolSlug: school.slug,
            boardSlug: board.slug,
            streamTitle: payload.stream,
        });

        if (!stream) {
            throw createServiceError("Stream not found", 404);
        }
    }

    const classSubject = await findTermClassSubjectBySlugRepo({
        schoolSlug: school.slug,
        classSubjectSlug: payload.classSubjectSlug,
    });

    if (!classSubject) {
        throw createServiceError("Subject is not assigned to selected class", 404);
    }

    if (classSubject.classSlug !== classData.slug) {
        throw createServiceError("Selected subject does not belong to selected class");
    }

    if (classSubject.sessionSlug !== session.slug) {
        throw createServiceError("Selected subject does not belong to selected academic year");
    }

    if (classSubject.boardSlug !== board.slug) {
        throw createServiceError("Selected subject does not belong to selected board");
    }

    if (classSubject.subject?.subjectTitle !== payload.subjectTitle) {
        throw createServiceError("Selected subject title does not match class subject");
    }

    if (classSubject.studyType !== payload.studyMode) {
        throw createServiceError("Selected study mode does not match class subject");
    }

    if (!stream && classSubject.streamSlug) {
        stream = classSubject.stream || null;
    }

    const effectiveStreamSlug = stream?.slug || classSubject.streamSlug || null;

    if (stream && classSubject.streamSlug && stream.slug !== classSubject.streamSlug) {
        throw createServiceError("Selected stream does not match class subject stream");
    }

    const timeTable = await findTermExamTimeTableRepo({
        schoolSlug: school.slug,
        termExamClassConfigurationSlug: configuration.slug,
        classSubjectSlug: classSubject.slug,
        streamSlug: effectiveStreamSlug,
    });

    if (!timeTable) {
        throw createServiceError("Term exam timetable or marks configuration not found", 404);
    }

    const components = buildCanonicalComponents({
        classSubject,
        termExam,
        timeTable,
    });

    const totalMaxMarks = components.reduce(
        (sum, item) => sum + Number(item.maxMarks || 0),
        0,
    );

    const totalMinMarks = components.reduce(
        (sum, item) => sum + Number(item.minMarks || 0),
        0,
    );

    const scopeKey = buildTermExamScopeKey({
        sectionSlug: section?.slug || null,
        streamSlug: effectiveStreamSlug,
    });

    return {
        school,
        session,
        board,
        termExam,
        classData,
        configuration,
        section,
        stream,
        effectiveStreamSlug,
        classSubject,
        timeTable,
        components,
        totalMaxMarks,
        totalMinMarks,
        scopeKey,
    };
};

const createAuditContextFromSubmission = ({ school, submission }) => {
    const configuration =
        submission.termExamTimeTable.termExamClassConfiguration;

    return {
        school,
        session: configuration.termExam.session,
        board: configuration.termExam.board,
        termExam: configuration.termExam,
        classData: configuration.class,
        classSubject: submission.classSubject,
        section: submission.section,
        stream: submission.stream,
        effectiveStreamSlug: submission.streamSlug,
    };
};

const buildAuditData = ({
    context,
    actor,
    requestMetadata,
    submissionSlug = null,
    studentMarkSlug = null,
    componentMarkSlug = null,
    academicMapping = null,
    component = null,
    action,
    result = "SUCCESS",
    requestBody = null,
    oldData = null,
    newData = null,
    remarks = null,
}) => ({
    slug: randomUUID(),
    schoolSlug: context.school.slug,
    submissionSlug,
    studentMarkSlug,
    componentMarkSlug,
    periodicTestSlug: null,
    termExamSlug: context.termExam.slug,
    classSubjectSlug: context.classSubject.slug,
    classSlug: context.classData.slug,
    sectionSlug: context.section?.slug || null,
    streamSlug: context.effectiveStreamSlug || null,
    studentSlug: academicMapping?.studentSlug || null,
    actorSlug: actor?.actorSlug || null,
    action,
    result,
    academicYear: context.session.name,
    boardTitle: context.board.title,
    examTitle: context.termExam.examTitle,
    classTitle: context.classData.classTitle,
    subjectTitle: context.classSubject.subject.subjectTitle,
    studyMode: context.classSubject.studyType,
    sectionTitle: context.section?.sectionTitle || null,
    streamTitle:
        context.stream?.streamTitle ||
        context.classSubject.stream?.streamTitle ||
        null,
    studentName: academicMapping?.student?.studentName || null,
    admissionNumber: academicMapping?.student?.admissionNumber || null,
    rollNumber: academicMapping?.rollNumber ?? null,
    componentKey: component?.componentKey || null,
    componentName: component?.componentName || null,
    requestMethod: requestMetadata?.requestMethod || null,
    requestUrl: requestMetadata?.requestUrl || null,
    ipAddress: requestMetadata?.ipAddress || null,
    userAgent: requestMetadata?.userAgent || null,
    requestBody,
    oldData,
    newData,
    changedFields: buildTermExamChangedFields({ oldData, newData }),
    remarks,
});

export const getTermExamMarkStudentsService = async ({
    user,
    query,
    actor,
    requestMetadata,
}) => {
    const context = await resolveTermExamMarkContext({
        user,
        payload: query,
    });

    const academicStudents = await findTermAcademicStudentsRepo({
        schoolSlug: context.school.slug,
        sessionSlug: context.session.slug,
        boardSlug: context.board.slug,
        classSlug: context.classData.slug,
        sectionSlug: context.section?.slug || null,
        streamSlug: context.effectiveStreamSlug,
    });

    const existingSubmission = await findTermSubmissionByScopeRepo({
        schoolSlug: context.school.slug,
        termExamTimeTableSlug: context.timeTable.slug,
        classSubjectSlug: context.classSubject.slug,
        scopeKey: context.scopeKey,
    });

    const existingStudentMap = new Map(
        (existingSubmission?.studentMarks || []).map((item) => [
            item.studentSlug,
            item,
        ]),
    );

    const students = academicStudents.map((mapping, index) => {
        const savedStudent = existingStudentMap.get(mapping.studentSlug);
        const componentValues = {};

        for (const component of context.components) {
            const savedComponent = savedStudent?.componentMarks?.find(
                (item) => item.componentKey === component.componentKey,
            );

            componentValues[component.componentKey] = {
                componentMarkSlug: savedComponent?.slug || null,
                obtainedMarks: normalizeDecimal(savedComponent?.obtainedMarks),
                markStatus: savedComponent?.markStatus || "PRESENT",
                remarks: savedComponent?.remarks || "",
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
            studentMarkSlug: savedStudent?.slug || null,
            totalObtainedMarks: normalizeDecimal(
                savedStudent?.totalObtainedMarks,
            ),
            markStatus: savedStudent?.markStatus || "PRESENT",
            remarks: savedStudent?.remarks || "",
            components: componentValues,
        };
    });

    await createTermExamAuditLogRepo({
        data: buildAuditData({
            context,
            actor,
            requestMetadata,
            submissionSlug: existingSubmission?.slug || null,
            action: "VIEW_MARKS",
            requestBody: query,
        }),
    });

    return {
        filters: {
            academicYear: context.session.name,
            board: context.board.title,
            termExamTitle: context.termExam.examTitle,
            classTitle: context.classData.classTitle,
            subjectTitle: context.classSubject.subject.subjectTitle,
            studyMode: context.classSubject.studyType,
            section: context.section?.sectionTitle || null,
            stream:
                context.stream?.streamTitle ||
                context.classSubject.stream?.streamTitle ||
                null,
        },
        configuration: {
            termExamSlug: context.termExam.slug,
            termExamClassConfigurationSlug: context.configuration.slug,
            termExamTimeTableSlug: context.timeTable.slug,
            classSlug: context.classData.slug,
            classSubjectSlug: context.classSubject.slug,
            sectionSlug: context.section?.slug || null,
            streamSlug: context.effectiveStreamSlug,
            scopeKey: context.scopeKey,
            totalMaxMarks: context.totalMaxMarks,
            totalMinMarks: context.totalMinMarks,
            components: context.components,
        },
        submission: existingSubmission
            ? {
                slug: existingSubmission.slug,
                isLocked: existingSubmission.isLocked,
                lockedAt: existingSubmission.lockedAt,
                submittedAt: existingSubmission.submittedAt,
                status: existingSubmission.status,
                isActive: existingSubmission.isActive,
            }
            : null,
        students,
    };
};

export const saveTermExamMarksService = async ({
    user,
    payload,
    actor,
    requestMetadata,
}) => {
    const context = await resolveTermExamMarkContext({ user, payload });

    const academicStudents = await findTermAcademicStudentsRepo({
        schoolSlug: context.school.slug,
        sessionSlug: context.session.slug,
        boardSlug: context.board.slug,
        classSlug: context.classData.slug,
        sectionSlug: context.section?.slug || null,
        streamSlug: context.effectiveStreamSlug,
    });

    if (!academicStudents.length) {
        throw createServiceError(
            "No active students found for selected filters",
            404,
        );
    }

    const academicMappingMap = new Map(
        academicStudents.map((item) => [item.slug, item]),
    );

    const existingSubmission = await findTermSubmissionByScopeRepo({
        schoolSlug: context.school.slug,
        termExamTimeTableSlug: context.timeTable.slug,
        classSubjectSlug: context.classSubject.slug,
        scopeKey: context.scopeKey,
    });

    if (existingSubmission?.isLocked) {
        throw createServiceError("Marks are locked and cannot be edited");
    }

    const canonicalMap = new Map(
        context.components.map((item) => [item.componentKey, item]),
    );

    const normalizedStudents = payload.students.map((student) => {
        const academicMapping = academicMappingMap.get(
            student.academicMappingSlug,
        );

        if (!academicMapping) {
            throw createServiceError(
                "Invalid student academic mapping found",
            );
        }

        if (academicMapping.studentSlug !== student.studentSlug) {
            throw createServiceError(
                "Student and academic mapping do not match",
            );
        }

        if (student.components.length !== context.components.length) {
            throw createServiceError(
                `All marks components are required for ${academicMapping.student.studentName}`,
            );
        }

        const seenComponents = new Set();

        const components = student.components.map((input) => {
            if (seenComponents.has(input.componentKey)) {
                throw createServiceError("Duplicate marks component found");
            }

            seenComponents.add(input.componentKey);

            const canonical = canonicalMap.get(input.componentKey);

            if (!canonical) {
                throw createServiceError("Invalid marks component found");
            }

            if (input.sourceType !== canonical.sourceType) {
                throw createServiceError(
                    "Marks component source does not match",
                );
            }

            if (
                canonical.sourceType === "SUBJECT_MARKS_CONFIG" &&
                input.subjectMarksConfigSlug !==
                canonical.subjectMarksConfigSlug
            ) {
                throw createServiceError(
                    "Invalid subject marks configuration",
                );
            }

            if (
                canonical.sourceType === "TERM_EXAM" &&
                input.termExamTimeTableSlug !==
                canonical.termExamTimeTableSlug
            ) {
                throw createServiceError(
                    "Invalid term exam timetable component",
                );
            }

            let markStatus = input.markStatus || "PRESENT";
            let obtainedMarks = input.obtainedMarks ?? null;

            if (student.markStatus !== "PRESENT") {
                markStatus = student.markStatus;
                obtainedMarks = null;
            } else if (markStatus !== "PRESENT") {
                obtainedMarks = null;
            }

            if (markStatus === "PRESENT" && obtainedMarks === null) {
                throw createServiceError(
                    `${canonical.componentName} marks are required for ${academicMapping.student.studentName}`,
                );
            }

            if (
                obtainedMarks !== null &&
                Number(obtainedMarks) > Number(canonical.maxMarks)
            ) {
                throw createServiceError(
                    `${canonical.componentName} marks for ${academicMapping.student.studentName} cannot exceed ${canonical.maxMarks}`,
                );
            }

            return {
                slug: randomUUID(),
                ...canonical,
                obtainedMarks,
                markStatus,
                remarks: input.remarks || null,
            };
        });

        const totalObtainedMarks = components.reduce(
            (sum, component) =>
                sum +
                (component.markStatus === "PRESENT"
                    ? Number(component.obtainedMarks || 0)
                    : 0),
            0,
        );

        return {
            slug: randomUUID(),
            studentSlug: student.studentSlug,
            academicMappingSlug: student.academicMappingSlug,
            rollNumber: academicMapping.rollNumber,
            totalObtainedMarks,
            markStatus: student.markStatus || "PRESENT",
            remarks: student.remarks || null,
            components,
            academicMapping,
        };
    });

    const result = await saveTermExamMarksTransactionRepo({
        submissionData: {
            slug: existingSubmission?.slug || randomUUID(),
            schoolSlug: context.school.slug,
            termExamTimeTableSlug: context.timeTable.slug,
            classSubjectSlug: context.classSubject.slug,
            sectionSlug: context.section?.slug || null,
            streamSlug: context.effectiveStreamSlug,
            scopeKey: context.scopeKey,
            totalMaxMarks: context.totalMaxMarks,
            totalMinMarks: context.totalMinMarks,
            submittedBySlug: user?.slug || null,
            submittedAt: new Date(),
            isLocked: false,
        },
        students: normalizedStudents,
    });

    const auditLogs = [];

    if (result.isNewSubmission) {
        auditLogs.push(
            buildAuditData({
                context,
                actor,
                requestMetadata,
                submissionSlug: result.submission.slug,
                action: "CREATE_SUBMISSION",
                requestBody: payload,
                newData: {
                    slug: result.submission.slug,
                    scopeKey: result.submission.scopeKey,
                    totalMaxMarks: normalizeDecimal(
                        result.submission.totalMaxMarks,
                    ),
                    totalMinMarks: normalizeDecimal(
                        result.submission.totalMinMarks,
                    ),
                },
            }),
        );
    }

    for (const savedStudent of result.savedStudents) {
        const normalized = normalizedStudents.find(
            (item) =>
                item.studentSlug === savedStudent.newStudentMark.studentSlug,
        );

        for (const savedComponent of savedStudent.savedComponents) {
            const oldData = savedComponent.oldComponent
                ? {
                    obtainedMarks: normalizeDecimal(
                        savedComponent.oldComponent.obtainedMarks,
                    ),
                    markStatus: savedComponent.oldComponent.markStatus,
                    remarks: savedComponent.oldComponent.remarks,
                }
                : null;

            const newData = {
                obtainedMarks: normalizeDecimal(
                    savedComponent.newComponent.obtainedMarks,
                ),
                markStatus: savedComponent.newComponent.markStatus,
                remarks: savedComponent.newComponent.remarks,
            };

            auditLogs.push({
                ...buildAuditData({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug: result.submission.slug,
                    studentMarkSlug: savedStudent.newStudentMark.slug,
                    componentMarkSlug: savedComponent.newComponent.slug,
                    academicMapping: normalized?.academicMapping,
                    component: savedComponent.newComponent,
                    action: savedComponent.oldComponent
                        ? "UPDATE_COMPONENT_MARK"
                        : "SAVE_COMPONENT_MARK",
                    requestBody: payload,
                    oldData,
                    newData,
                }),
                previousMarks: normalizeDecimal(
                    savedComponent.oldComponent?.obtainedMarks,
                ),
                newMarks: normalizeDecimal(
                    savedComponent.newComponent.obtainedMarks,
                ),
                previousMarkStatus:
                    savedComponent.oldComponent?.markStatus || null,
                newMarkStatus: savedComponent.newComponent.markStatus,
            });
        }
    }

    await createTermExamAuditLogsRepo({ logs: auditLogs });

    return findTermSubmissionBySlugRepo({
        schoolSlug: context.school.slug,
        submissionSlug: result.submission.slug,
    });
};

export const bulkUpdateTermExamMarksService = async ({
    user,
    submissionSlug,
    payload,
    actor,
    requestMetadata,
}) => {
    const school = await resolveSchool({ user });

    const submission = await findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
    });

    if (!submission) {
        throw createServiceError(
            "Term exam mark submission not found",
            404,
        );
    }

    if (submission.isLocked) {
        throw createServiceError("Marks are locked and cannot be edited");
    }

    const studentMarkSlugs = payload.students.map(
        (item) => item.studentMarkSlug,
    );

    const componentMarkSlugs = payload.students.flatMap((student) =>
        student.components.map((component) => component.componentMarkSlug),
    );

    const [existingStudents, existingComponents] = await Promise.all([
        findTermStudentMarksBySlugsRepo({
            schoolSlug: school.slug,
            studentMarkSlugs,
        }),
        findTermComponentMarksBySlugsRepo({
            schoolSlug: school.slug,
            componentMarkSlugs,
        }),
    ]);

    if (existingStudents.length !== studentMarkSlugs.length) {
        throw createServiceError(
            "One or more student marks were not found",
            404,
        );
    }

    if (existingComponents.length !== componentMarkSlugs.length) {
        throw createServiceError(
            "One or more component marks were not found",
            404,
        );
    }

    const componentMap = new Map(
        existingComponents.map((item) => [item.slug, item]),
    );

    const normalizedStudents = payload.students.map((student) => {
        const studentRecord = existingStudents.find(
            (item) => item.slug === student.studentMarkSlug,
        );

        let totalObtainedMarks = 0;

        const components = student.components.map((component) => {
            const existing = componentMap.get(component.componentMarkSlug);

            if (!existing) {
                throw createServiceError("Component mark not found", 404);
            }

            if (existing.studentMarkSlug !== studentRecord?.slug) {
                throw createServiceError(
                    "Component mark does not belong to selected student mark",
                );
            }

            let markStatus = component.markStatus || "PRESENT";
            let obtainedMarks = component.obtainedMarks ?? null;

            if (student.markStatus !== "PRESENT") {
                markStatus = student.markStatus;
                obtainedMarks = null;
            } else if (markStatus !== "PRESENT") {
                obtainedMarks = null;
            }

            if (markStatus === "PRESENT" && obtainedMarks === null) {
                throw createServiceError(
                    `${existing.componentName} marks are required`,
                );
            }

            if (
                obtainedMarks !== null &&
                Number(obtainedMarks) > Number(existing.maxMarks)
            ) {
                throw createServiceError(
                    `${existing.componentName} marks cannot exceed ${normalizeDecimal(existing.maxMarks)}`,
                );
            }

            if (markStatus === "PRESENT") {
                totalObtainedMarks += Number(obtainedMarks || 0);
            }

            return {
                componentMarkSlug: component.componentMarkSlug,
                obtainedMarks,
                markStatus,
                remarks: component.remarks || null,
            };
        });

        return {
            studentMarkSlug: student.studentMarkSlug,
            totalObtainedMarks,
            markStatus: student.markStatus || "PRESENT",
            remarks: student.remarks || null,
            components,
        };
    });

    const updatedStudents = await bulkUpdateTermExamMarksTransactionRepo({
        schoolSlug: school.slug,
        students: normalizedStudents,
    });

    const context = createAuditContextFromSubmission({ school, submission });
    const auditLogs = [];

    for (const updatedStudent of updatedStudents) {
        const existingStudent = existingStudents.find(
            (item) => item.slug === updatedStudent.newStudentMark.slug,
        );

        for (const updatedComponent of updatedStudent.updatedComponents) {
            const oldData = {
                obtainedMarks: normalizeDecimal(
                    updatedComponent.oldComponent.obtainedMarks,
                ),
                markStatus: updatedComponent.oldComponent.markStatus,
                remarks: updatedComponent.oldComponent.remarks,
            };

            const newData = {
                obtainedMarks: normalizeDecimal(
                    updatedComponent.newComponent.obtainedMarks,
                ),
                markStatus: updatedComponent.newComponent.markStatus,
                remarks: updatedComponent.newComponent.remarks,
            };

            auditLogs.push({
                ...buildAuditData({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug: submission.slug,
                    studentMarkSlug: updatedStudent.newStudentMark.slug,
                    componentMarkSlug: updatedComponent.newComponent.slug,
                    academicMapping: {
                        studentSlug: existingStudent?.studentSlug,
                        rollNumber: existingStudent?.rollNumber,
                        student: existingStudent?.student,
                    },
                    component: updatedComponent.newComponent,
                    action: "BULK_UPDATE_MARKS",
                    requestBody: payload,
                    oldData,
                    newData,
                }),
                previousMarks: normalizeDecimal(
                    updatedComponent.oldComponent.obtainedMarks,
                ),
                newMarks: normalizeDecimal(
                    updatedComponent.newComponent.obtainedMarks,
                ),
                previousMarkStatus:
                    updatedComponent.oldComponent.markStatus,
                newMarkStatus: updatedComponent.newComponent.markStatus,
            });
        }
    }

    await createTermExamAuditLogsRepo({ logs: auditLogs });

    return findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
    });
};

export const getTermExamSubmissionService = async ({
    user,
    submissionSlug,
    actor,
    requestMetadata,
}) => {
    const school = await resolveSchool({ user });

    const submission = await findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
    });

    if (!submission) {
        throw createServiceError(
            "Term exam mark submission not found",
            404,
        );
    }

    const context = createAuditContextFromSubmission({ school, submission });

    await createTermExamAuditLogRepo({
        data: buildAuditData({
            context,
            actor,
            requestMetadata,
            submissionSlug: submission.slug,
            action: "VIEW_MARKS",
        }),
    });

    return submission;
};

export const lockTermExamMarksService = async ({
    user,
    submissionSlug,
    actor,
    requestMetadata,
}) => {
    const school = await resolveSchool({ user });

    const submission = await findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
    });

    if (!submission) {
        throw createServiceError(
            "Term exam mark submission not found",
            404,
        );
    }

    if (submission.isLocked) {
        throw createServiceError("Marks are already locked");
    }

    if (!submission.studentMarks.length) {
        throw createServiceError("Cannot lock empty marks submission");
    }

    const updatedSubmission = await lockTermExamSubmissionRepo({
        submissionSlug,
        userSlug: user?.slug,
    });

    const context = createAuditContextFromSubmission({ school, submission });

    await createTermExamAuditLogRepo({
        data: {
            ...buildAuditData({
                context,
                actor,
                requestMetadata,
                submissionSlug: submission.slug,
                action: "LOCK_MARKS",
                oldData: {
                    isLocked: false,
                    lockedAt: null,
                    lockedBySlug: null,
                },
                newData: {
                    isLocked: true,
                    lockedAt: updatedSubmission.lockedAt,
                    lockedBySlug: updatedSubmission.lockedBySlug,
                },
            }),
            previousIsLocked: false,
            newIsLocked: true,
        },
    });

    return updatedSubmission;
};

export const unlockTermExamMarksService = async ({
    user,
    submissionSlug,
    remarks,
    actor,
    requestMetadata,
}) => {
    const school = await resolveSchool({ user });

    const submission = await findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
    });

    if (!submission) {
        throw createServiceError(
            "Term exam mark submission not found",
            404,
        );
    }

    if (!submission.isLocked) {
        throw createServiceError("Marks are already unlocked");
    }

    const updatedSubmission = await unlockTermExamSubmissionRepo({
        submissionSlug,
    });

    const context = createAuditContextFromSubmission({ school, submission });

    await createTermExamAuditLogRepo({
        data: {
            ...buildAuditData({
                context,
                actor,
                requestMetadata,
                submissionSlug: submission.slug,
                action: "UNLOCK_MARKS",
                remarks,
                oldData: {
                    isLocked: true,
                    lockedAt: submission.lockedAt,
                    lockedBySlug: submission.lockedBySlug,
                },
                newData: {
                    isLocked: false,
                    lockedAt: null,
                    lockedBySlug: null,
                },
            }),
            previousIsLocked: true,
            newIsLocked: false,
        },
    });

    return updatedSubmission;
};

export const deleteTermExamMarksService = async ({
    user,
    submissionSlug,
    actor,
    requestMetadata,
}) => {
    const school = await resolveSchool({ user });

    const submission = await findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
    });

    if (!submission) {
        throw createServiceError(
            "Term exam mark submission not found",
            404,
        );
    }

    if (submission.isLocked) {
        throw createServiceError("Locked marks cannot be deleted");
    }

    const deletedSubmission = await softDeleteTermExamSubmissionRepo({
        submissionSlug,
    });

    const context = createAuditContextFromSubmission({ school, submission });

    await createTermExamAuditLogRepo({
        data: buildAuditData({
            context,
            actor,
            requestMetadata,
            submissionSlug: submission.slug,
            action: "DELETE_MARKS",
            oldData: {
                status: submission.status,
                isActive: submission.isActive,
                deletedAt: submission.deletedAt,
            },
            newData: {
                status: deletedSubmission.status,
                isActive: deletedSubmission.isActive,
                deletedAt: deletedSubmission.deletedAt,
            },
        }),
    });

    return deletedSubmission;
};

export const restoreTermExamMarksService = async ({
    user,
    submissionSlug,
    actor,
    requestMetadata,
}) => {
    const school = await resolveSchool({ user });

    const submission = await findTermSubmissionBySlugRepo({
        schoolSlug: school.slug,
        submissionSlug,
        includeInactive: true,
    });

    if (!submission) {
        throw createServiceError(
            "Term exam mark submission not found",
            404,
        );
    }

    if (submission.isActive) {
        throw createServiceError(
            "Term exam mark submission is already active",
        );
    }

    const restoredSubmission = await restoreTermExamSubmissionRepo({
        submissionSlug,
    });

    const context = createAuditContextFromSubmission({ school, submission });

    await createTermExamAuditLogRepo({
        data: buildAuditData({
            context,
            actor,
            requestMetadata,
            submissionSlug: submission.slug,
            action: "RESTORE_MARKS",
            oldData: {
                status: submission.status,
                isActive: submission.isActive,
                deletedAt: submission.deletedAt,
            },
            newData: {
                status: restoredSubmission.status,
                isActive: restoredSubmission.isActive,
                deletedAt: restoredSubmission.deletedAt,
            },
        }),
    });

    return restoredSubmission;
};

export const getTermExamMarkAuditLogsService = async ({
    user,
    query,
}) => {
    const school = await resolveSchool({ user });

    const page = Number(query.page || 1);
    const limit = Math.min(Number(query.limit || 20), 100);
    const skip = (page - 1) * limit;

    const result = await getTermExamAuditLogsRepo({
        schoolSlug: school.slug,
        submissionSlug: query.submissionSlug,
        studentSlug: query.studentSlug,
        action: query.action,
        result: query.result,
        skip,
        take: limit,
    });

    return {
        data: result.logs,
        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
        },
    };
};
