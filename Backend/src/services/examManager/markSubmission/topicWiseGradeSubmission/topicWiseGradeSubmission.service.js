import { randomUUID } from "crypto";

import {
    findTopicGradeSchoolRepo,
    findTopicGradeSessionRepo,
    findTopicGradeBoardRepo,
    findTopicGradeTermExamRepo,
    findTopicGradeClassRepo,
    findTopicGradeClassConfigurationRepo,
    findTopicGradeSectionRepo,
    findTopicGradeStreamRepo,
    findTopicGradeClassSubjectRepo,
    findTopicGradeAcademicStudentsRepo,
    findTopicGradeSubmissionByScopeRepo,
    findTopicGradeSubmissionBySlugRepo,
    saveTopicWiseGradesTransactionRepo,
    bulkUpdateTopicWiseGradesTransactionRepo,
    lockTopicWiseGradeSubmissionRepo,
    unlockTopicWiseGradeSubmissionRepo,
    softDeleteTopicWiseGradeSubmissionRepo,
    restoreTopicWiseGradeSubmissionRepo,
    createTopicWiseGradeAuditLogRepo,
    createTopicWiseGradeAuditLogsRepo,
    getTopicWiseGradeAuditLogsRepo,
} from "../../../../repositories/examManager/marksSubmission/topicWiseGradeSubmission/topicWiseGradeSubmission.repository.js";

import {
    buildTopicWiseGradeScopeKey,
    buildTopicWiseGradeChangedFields,
} from "../../../../utils/topicWiseGradeAuditHelper.js";

const VALID_GRADES = new Set([
    "A_PLUS",
    "A",
    "B_PLUS",
    "B",
    "C_PLUS",
    "C",
    "D_PLUS",
    "D",
    "E_PLUS",
    "E",
    "NEEDS_IMPROVEMENT",
    "NOT_ASSESSED",
]);

const VALID_STATUSES = new Set([
    "ASSESSED",
    "ABSENT",
    "EXEMPTED",
    "NOT_ASSESSED",
]);

const createError = (
    message,
    statusCode = 400,
) => {
    const error = new Error(message);

    error.statusCode =
        statusCode;

    return error;
};

const resolveSchool = async ({
    user,
}) => {
    const school =
        await findTopicGradeSchoolRepo({
            schoolSlug:
                user?.schoolSlug,
            schoolCode:
                user?.schoolCode,
        });

    if (!school) {
        throw createError(
            "School not found",
            404,
        );
    }

    return school;
};

const resolveContext = async ({
    user,
    payload,
}) => {
    const school =
        await resolveSchool({
            user,
        });

    const session =
        await findTopicGradeSessionRepo({
            schoolSlug:
                school.slug,
            academicYear:
                payload.academicYear,
        });

    if (!session) {
        throw createError(
            "Academic year not found",
            404,
        );
    }

    const board =
        await findTopicGradeBoardRepo({
            schoolSlug:
                school.slug,
            boardTitle:
                payload.board,
        });

    if (!board) {
        throw createError(
            "Board not found",
            404,
        );
    }

    const termExam =
        await findTopicGradeTermExamRepo({
            schoolSlug:
                school.slug,
            sessionSlug:
                session.slug,
            boardSlug:
                board.slug,
            termExamTitle:
                payload.termExamTitle,
        });

    if (!termExam) {
        throw createError(
            "Term exam not found",
            404,
        );
    }

    const classData =
        await findTopicGradeClassRepo({
            schoolSlug:
                school.slug,
            boardSlug:
                board.slug,
            classTitle:
                payload.classTitle,
        });

    if (!classData) {
        throw createError(
            "Class not found",
            404,
        );
    }

    const configuration =
        await findTopicGradeClassConfigurationRepo({
            schoolSlug:
                school.slug,
            termExamSlug:
                termExam.slug,
            classSlug:
                classData.slug,
        });

    if (!configuration) {
        throw createError(
            "Term exam class configuration not found",
            404,
        );
    }

    let section = null;

    if (payload.section) {
        section =
            await findTopicGradeSectionRepo({
                schoolSlug:
                    school.slug,
                boardSlug:
                    board.slug,
                sectionTitle:
                    payload.section,
            });

        if (!section) {
            throw createError(
                "Section not found",
                404,
            );
        }
    }

    let stream = null;

    if (payload.stream) {
        stream =
            await findTopicGradeStreamRepo({
                schoolSlug:
                    school.slug,
                boardSlug:
                    board.slug,
                streamTitle:
                    payload.stream,
            });

        if (!stream) {
            throw createError(
                "Stream not found",
                404,
            );
        }
    }

    const classSubject =
        await findTopicGradeClassSubjectRepo({
            schoolSlug:
                school.slug,
            classSubjectSlug:
                payload.classSubjectSlug,
        });

    if (!classSubject) {
        throw createError(
            "Subject is not assigned to selected class",
            404,
        );
    }

    if (
        classSubject.classSlug !==
        classData.slug
    ) {
        throw createError(
            "Selected subject does not belong to selected class",
        );
    }

    if (
        classSubject.sessionSlug !==
        session.slug
    ) {
        throw createError(
            "Selected subject does not belong to selected academic year",
        );
    }

    if (
        classSubject.boardSlug !==
        board.slug
    ) {
        throw createError(
            "Selected subject does not belong to selected board",
        );
    }

    if (
        classSubject.subject?.subjectTitle !==
        payload.subjectTitle
    ) {
        throw createError(
            "Selected subject title does not match class subject",
        );
    }

    if (
        classSubject.studyType !==
        payload.studyMode
    ) {
        throw createError(
            "Selected study mode does not match class subject",
        );
    }

    if (
        !stream &&
        classSubject.streamSlug
    ) {
        stream =
            classSubject.stream ||
            null;
    }

    const effectiveStreamSlug =
        stream?.slug ||
        classSubject.streamSlug ||
        null;

    if (
        stream &&
        classSubject.streamSlug &&
        stream.slug !==
        classSubject.streamSlug
    ) {
        throw createError(
            "Selected stream does not match class subject stream",
        );
    }

    const topics =
        classSubject.subjectTopics ||
        [];

    if (!topics.length) {
        throw createError(
            "No active topics found for selected subject",
            404,
        );
    }

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
        topics,
        scopeKey:
            buildTopicWiseGradeScopeKey({
                sectionSlug:
                    section?.slug ||
                    null,
                streamSlug:
                    effectiveStreamSlug,
            }),
    };
};

const contextFromSubmission = ({
    school,
    submission,
}) => ({
    school,
    session:
        submission.termExam.session,
    board:
        submission.termExam.board,
    termExam:
        submission.termExam,
    classData:
        submission
            .termExamClassConfiguration
            .class,
    configuration:
        submission
            .termExamClassConfiguration,
    section:
        submission.section,
    stream:
        submission.stream,
    effectiveStreamSlug:
        submission.streamSlug,
    classSubject:
        submission.classSubject,
    topics:
        submission.classSubject
            .subjectTopics ||
        [],
    scopeKey:
        submission.scopeKey,
});

const buildAudit = ({
    context,
    actor,
    requestMetadata,
    submissionSlug = null,
    studentGradeSlug = null,
    studentTopicGradeSlug = null,
    academicMapping = null,
    topic = null,
    action,
    oldData = null,
    newData = null,
    requestBody = null,
    remarks = null,
}) => ({
    slug:
        randomUUID(),

    schoolSlug:
        context.school.slug,

    submissionSlug,
    studentGradeSlug,
    studentTopicGradeSlug,

    termExamSlug:
        context.termExam.slug,

    classSlug:
        context.classData.slug,

    classSubjectSlug:
        context.classSubject.slug,

    subjectTopicSlug:
        topic?.subjectTopicSlug ||
        topic?.slug ||
        null,

    sectionSlug:
        context.section?.slug ||
        null,

    streamSlug:
        context.effectiveStreamSlug ||
        null,

    studentSlug:
        academicMapping
            ?.studentSlug ||
        null,

    performedBySlug:
        actor?.performedBySlug ||
        null,

    action,
    result:
        "SUCCESS",

    actorName:
        actor?.actorName ||
        null,

    actorEmail:
        actor?.actorEmail ||
        null,

    actorRole:
        actor?.actorRole ||
        null,

    termExamTitle:
        context.termExam
            .examTitle,

    academicYear:
        context.session.name,

    boardTitle:
        context.board.title,

    classTitle:
        context.classData
            .classTitle,

    subjectTitle:
        context.classSubject
            .subject
            .subjectTitle,

    studyMode:
        context.classSubject
            .studyType,

    sectionTitle:
        context.section
            ?.sectionTitle ||
        null,

    streamTitle:
        context.stream
            ?.streamTitle ||
        context.classSubject
            .stream
            ?.streamTitle ||
        null,

    topicTitle:
        topic?.topicTitle ||
        null,

    topicGroup:
        topic?.topicGroup ||
        null,

    studentName:
        academicMapping
            ?.student
            ?.studentName ||
        null,

    admissionNumber:
        academicMapping
            ?.student
            ?.admissionNumber ||
        null,

    rollNumber:
        academicMapping
            ?.rollNumber ??
        null,

    oldData,
    newData,

    changedFields:
        buildTopicWiseGradeChangedFields({
            oldData,
            newData,
        }),

    requestBody,
    remarks,

    ipAddress:
        requestMetadata
            ?.ipAddress ||
        null,

    forwardedFor:
        requestMetadata
            ?.forwardedFor ||
        null,

    userAgent:
        requestMetadata
            ?.userAgent ||
        null,

    requestMethod:
        requestMetadata
            ?.requestMethod ||
        null,

    requestUrl:
        requestMetadata
            ?.requestUrl ||
        null,

    requestId:
        requestMetadata
            ?.requestId ||
        null,

    deviceIdentifier:
        requestMetadata
            ?.deviceIdentifier ||
        null,
});

export const getTopicWiseGradeStudentsService =
    async ({
        user,
        query,
        actor,
        requestMetadata,
    }) => {
        const context =
            await resolveContext({
                user,
                payload:
                    query,
            });

        const academicStudents =
            await findTopicGradeAcademicStudentsRepo({
                schoolSlug:
                    context.school.slug,
                sessionSlug:
                    context.session.slug,
                boardSlug:
                    context.board.slug,
                classSlug:
                    context.classData.slug,
                sectionSlug:
                    context.section
                        ?.slug ||
                    null,
                streamSlug:
                    context.effectiveStreamSlug,
            });

        const existingSubmission =
            await findTopicGradeSubmissionByScopeRepo({
                schoolSlug:
                    context.school.slug,
                termExamSlug:
                    context.termExam.slug,
                classSubjectSlug:
                    context.classSubject.slug,
                scopeKey:
                    context.scopeKey,
            });

        const existingStudentMap =
            new Map(
                (
                    existingSubmission
                        ?.studentGrades ||
                    []
                ).map((item) => [
                    item.studentSlug,
                    item,
                ]),
            );

        const topics =
            context.topics.map(
                (topic, index) => ({
                    subjectTopicSlug:
                        topic.slug,
                    topicTitle:
                        topic.topicTitle,
                    topicGroup:
                        topic.topicGroup,
                    topicOrder:
                        index,
                }),
            );

        const students =
            academicStudents.map(
                (mapping, index) => {
                    const savedStudent =
                        existingStudentMap.get(
                            mapping.studentSlug,
                        );

                    const topicGrades = {};

                    for (const topic of topics) {
                        const savedTopic =
                            savedStudent
                                ?.topicGrades
                                ?.find(
                                    (item) =>
                                        item.subjectTopicSlug ===
                                        topic.subjectTopicSlug,
                                );

                        topicGrades[
                            topic.subjectTopicSlug
                        ] = {
                            studentTopicGradeSlug:
                                savedTopic
                                    ?.slug ||
                                null,
                            grade:
                                savedTopic
                                    ?.grade ||
                                null,
                            assessmentStatus:
                                savedTopic
                                    ?.assessmentStatus ||
                                "ASSESSED",
                            remarks:
                                savedTopic
                                    ?.remarks ||
                                "",
                        };
                    }

                    return {
                        sn:
                            index + 1,
                        studentSlug:
                            mapping.studentSlug,
                        academicMappingSlug:
                            mapping.slug,
                        admissionNumber:
                            mapping.student
                                .admissionNumber,
                        studentName:
                            mapping.student
                                .studentName,
                        profileImage:
                            mapping.student
                                .profileImage,
                        rollNumberPrefix:
                            mapping.rollNumberPrefix,
                        rollNumber:
                            mapping.rollNumber,
                        sectionSlug:
                            mapping.sectionSlug,
                        sectionTitle:
                            mapping.section
                                ?.sectionTitle ||
                            null,
                        streamSlug:
                            mapping.streamSlug,
                        streamTitle:
                            mapping.stream
                                ?.streamTitle ||
                            null,
                        studentGradeSlug:
                            savedStudent
                                ?.slug ||
                            null,
                        overallStatus:
                            savedStudent
                                ?.overallStatus ||
                            "ASSESSED",
                        remarks:
                            savedStudent
                                ?.remarks ||
                            "",
                        topicGrades,
                    };
                },
            );

        try {
            await createTopicWiseGradeAuditLogRepo({
                data: buildAudit({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug:
                        existingSubmission
                            ?.slug ||
                        null,
                    action:
                        "VIEW_GRADES",
                    requestBody:
                        query,
                }),
            });
        } catch (auditError) {
            console.error(
                "Topic wise grade view audit error:",
                auditError,
            );
        }

        return {
            filters: {
                academicYear:
                    context.session.name,
                board:
                    context.board.title,
                termExamTitle:
                    context.termExam
                        .examTitle,
                classTitle:
                    context.classData
                        .classTitle,
                subjectTitle:
                    context.classSubject
                        .subject
                        .subjectTitle,
                studyMode:
                    context.classSubject
                        .studyType,
                section:
                    context.section
                        ?.sectionTitle ||
                    null,
                stream:
                    context.stream
                        ?.streamTitle ||
                    context.classSubject
                        .stream
                        ?.streamTitle ||
                    null,
            },

            configuration: {
                termExamSlug:
                    context.termExam.slug,
                termExamClassConfigurationSlug:
                    context.configuration.slug,
                classSlug:
                    context.classData.slug,
                classSubjectSlug:
                    context.classSubject.slug,
                sectionSlug:
                    context.section
                        ?.slug ||
                    null,
                streamSlug:
                    context.effectiveStreamSlug,
                scopeKey:
                    context.scopeKey,
                topics,
            },

            submission:
                existingSubmission
                    ? {
                        slug:
                            existingSubmission.slug,
                        isLocked:
                            existingSubmission.isLocked,
                        lockedAt:
                            existingSubmission.lockedAt,
                        submittedAt:
                            existingSubmission.submittedAt,
                        status:
                            existingSubmission.status,
                        isActive:
                            existingSubmission.isActive,
                    }
                    : null,

            students,
        };
    };

export const saveTopicWiseGradesService =
    async ({
        user,
        payload,
        actor,
        requestMetadata,
    }) => {
        const context =
            await resolveContext({
                user,
                payload,
            });

        const academicStudents =
            await findTopicGradeAcademicStudentsRepo({
                schoolSlug:
                    context.school.slug,
                sessionSlug:
                    context.session.slug,
                boardSlug:
                    context.board.slug,
                classSlug:
                    context.classData.slug,
                sectionSlug:
                    context.section
                        ?.slug ||
                    null,
                streamSlug:
                    context.effectiveStreamSlug,
            });

        if (!academicStudents.length) {
            throw createError(
                "No active students found for selected filters",
                404,
            );
        }

        const academicMap =
            new Map(
                academicStudents.map(
                    (item) => [
                        item.slug,
                        item,
                    ],
                ),
            );

        const topicMap =
            new Map(
                context.topics.map(
                    (topic, index) => [
                        topic.slug,
                        {
                            ...topic,
                            topicOrder:
                                index,
                        },
                    ],
                ),
            );

        const existingSubmission =
            await findTopicGradeSubmissionByScopeRepo({
                schoolSlug:
                    context.school.slug,
                termExamSlug:
                    context.termExam.slug,
                classSubjectSlug:
                    context.classSubject.slug,
                scopeKey:
                    context.scopeKey,
            });

        if (
            existingSubmission
                ?.isLocked
        ) {
            throw createError(
                "Grades are locked and cannot be edited",
            );
        }

        const normalizedStudents =
            payload.students.map(
                (student) => {
                    const academicMapping =
                        academicMap.get(
                            student.academicMappingSlug,
                        );

                    if (!academicMapping) {
                        throw createError(
                            "Invalid student academic mapping found",
                        );
                    }

                    if (
                        academicMapping.studentSlug !==
                        student.studentSlug
                    ) {
                        throw createError(
                            "Student and academic mapping do not match",
                        );
                    }

                    if (
                        student.topicGrades
                            .length !==
                        context.topics.length
                    ) {
                        throw createError(
                            `All topic grades are required for ${academicMapping.student.studentName}`,
                        );
                    }

                    const seen =
                        new Set();

                    const topicGrades =
                        student.topicGrades.map(
                            (input) => {
                                if (
                                    seen.has(
                                        input.subjectTopicSlug,
                                    )
                                ) {
                                    throw createError(
                                        "Duplicate subject topic found",
                                    );
                                }

                                seen.add(
                                    input.subjectTopicSlug,
                                );

                                const topic =
                                    topicMap.get(
                                        input.subjectTopicSlug,
                                    );

                                if (!topic) {
                                    throw createError(
                                        "Invalid subject topic found",
                                    );
                                }

                                let assessmentStatus =
                                    input.assessmentStatus ||
                                    "ASSESSED";

                                let grade =
                                    input.grade ??
                                    null;

                                if (
                                    student.overallStatus !==
                                    "ASSESSED"
                                ) {
                                    assessmentStatus =
                                        student.overallStatus;
                                    grade = null;
                                } else if (
                                    assessmentStatus !==
                                    "ASSESSED"
                                ) {
                                    grade = null;
                                }

                                if (
                                    !VALID_STATUSES.has(
                                        assessmentStatus,
                                    )
                                ) {
                                    throw createError(
                                        "Invalid assessment status found",
                                    );
                                }

                                if (
                                    assessmentStatus ===
                                    "ASSESSED"
                                ) {
                                    if (
                                        !grade ||
                                        !VALID_GRADES.has(
                                            grade,
                                        )
                                    ) {
                                        throw createError(
                                            `Valid grade is required for ${topic.topicTitle} - ${academicMapping.student.studentName}`,
                                        );
                                    }
                                }

                                return {
                                    slug:
                                        randomUUID(),
                                    subjectTopicSlug:
                                        topic.slug,
                                    topicTitle:
                                        topic.topicTitle,
                                    topicGroup:
                                        topic.topicGroup,
                                    topicOrder:
                                        topic.topicOrder,
                                    grade,
                                    assessmentStatus,
                                    remarks:
                                        input.remarks ||
                                        null,
                                };
                            },
                        );

                    return {
                        slug:
                            randomUUID(),
                        studentSlug:
                            student.studentSlug,
                        academicMappingSlug:
                            student.academicMappingSlug,
                        rollNumber:
                            academicMapping.rollNumber,
                        overallStatus:
                            student.overallStatus ||
                            "ASSESSED",
                        remarks:
                            student.remarks ||
                            null,
                        topicGrades,
                        academicMapping,
                    };
                },
            );

        const result =
            await saveTopicWiseGradesTransactionRepo({
                submissionData: {
                    slug:
                        existingSubmission
                            ?.slug ||
                        randomUUID(),
                    schoolSlug:
                        context.school.slug,
                    termExamSlug:
                        context.termExam.slug,
                    termExamClassConfigurationSlug:
                        context.configuration.slug,
                    classSubjectSlug:
                        context.classSubject.slug,
                    sectionSlug:
                        context.section
                            ?.slug ||
                        null,
                    streamSlug:
                        context.effectiveStreamSlug,
                    scopeKey:
                        context.scopeKey,
                    submittedBySlug:
                        user?.slug ||
                        null,
                    submittedAt:
                        new Date(),
                    isLocked:
                        false,
                },

                students:
                    normalizedStudents,
            });

        const logs = [];

        if (
            result.isNewSubmission
        ) {
            logs.push(
                buildAudit({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug:
                        result.submission
                            .slug,
                    action:
                        "CREATE_SUBMISSION",
                    requestBody:
                        payload,
                    newData: {
                        slug:
                            result.submission
                                .slug,
                        scopeKey:
                            result.submission
                                .scopeKey,
                    },
                }),
            );
        }

        for (
            const savedStudent
            of result.savedStudents
        ) {
            const normalized =
                normalizedStudents.find(
                    (item) =>
                        item.studentSlug ===
                        savedStudent
                            .newStudentGrade
                            .studentSlug,
                );

            for (
                const savedTopic
                of savedStudent.savedTopicGrades
            ) {
                const oldData =
                    savedTopic.oldTopicGrade
                        ? {
                            grade:
                                savedTopic
                                    .oldTopicGrade
                                    .grade,
                            assessmentStatus:
                                savedTopic
                                    .oldTopicGrade
                                    .assessmentStatus,
                            remarks:
                                savedTopic
                                    .oldTopicGrade
                                    .remarks,
                        }
                        : null;

                const newData = {
                    grade:
                        savedTopic
                            .newTopicGrade
                            .grade,
                    assessmentStatus:
                        savedTopic
                            .newTopicGrade
                            .assessmentStatus,
                    remarks:
                        savedTopic
                            .newTopicGrade
                            .remarks,
                };

                logs.push({
                    ...buildAudit({
                        context,
                        actor,
                        requestMetadata,
                        submissionSlug:
                            result.submission
                                .slug,
                        studentGradeSlug:
                            savedStudent
                                .newStudentGrade
                                .slug,
                        studentTopicGradeSlug:
                            savedTopic
                                .newTopicGrade
                                .slug,
                        academicMapping:
                            normalized
                                ?.academicMapping,
                        topic:
                            savedTopic
                                .newTopicGrade,
                        action:
                            savedTopic.oldTopicGrade
                                ? "UPDATE_TOPIC_GRADE"
                                : "SAVE_TOPIC_GRADE",
                        oldData,
                        newData,
                        requestBody:
                            payload,
                    }),

                    previousGrade:
                        savedTopic
                            .oldTopicGrade
                            ?.grade ||
                        null,
                    newGrade:
                        savedTopic
                            .newTopicGrade
                            .grade,
                    previousAssessmentStatus:
                        savedTopic
                            .oldTopicGrade
                            ?.assessmentStatus ||
                        null,
                    newAssessmentStatus:
                        savedTopic
                            .newTopicGrade
                            .assessmentStatus,
                });
            }
        }

        await createTopicWiseGradeAuditLogsRepo({
            logs,
        });

        return findTopicGradeSubmissionBySlugRepo({
            schoolSlug:
                context.school.slug,
            submissionSlug:
                result.submission.slug,
        });
    };

export const bulkUpdateTopicWiseGradesService =
    async ({
        user,
        submissionSlug,
        payload,
        actor,
        requestMetadata,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const submission =
            await findTopicGradeSubmissionBySlugRepo({
                schoolSlug:
                    school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw createError(
                "Topic wise grade submission not found",
                404,
            );
        }

        if (
            submission.isLocked
        ) {
            throw createError(
                "Grades are locked and cannot be edited",
            );
        }

        const normalizedStudents =
            payload.students.map(
                (student) => ({
                    studentGradeSlug:
                        student.studentGradeSlug,
                    overallStatus:
                        student.overallStatus ||
                        "ASSESSED",
                    remarks:
                        student.remarks ||
                        null,
                    topicGrades:
                        student.topicGrades.map(
                            (topic) => {
                                let grade =
                                    topic.grade ??
                                    null;

                                let assessmentStatus =
                                    topic.assessmentStatus ||
                                    "ASSESSED";

                                if (
                                    student.overallStatus !==
                                    "ASSESSED"
                                ) {
                                    assessmentStatus =
                                        student.overallStatus;
                                    grade = null;
                                } else if (
                                    assessmentStatus !==
                                    "ASSESSED"
                                ) {
                                    grade = null;
                                }

                                if (
                                    assessmentStatus ===
                                    "ASSESSED" &&
                                    (
                                        !grade ||
                                        !VALID_GRADES.has(
                                            grade,
                                        )
                                    )
                                ) {
                                    throw createError(
                                        "Valid grade is required for assessed topic",
                                    );
                                }

                                return {
                                    studentTopicGradeSlug:
                                        topic.studentTopicGradeSlug,
                                    grade,
                                    assessmentStatus,
                                    remarks:
                                        topic.remarks ||
                                        null,
                                };
                            },
                        ),
                }),
            );

        const updatedStudents =
            await bulkUpdateTopicWiseGradesTransactionRepo({
                schoolSlug:
                    school.slug,
                students:
                    normalizedStudents,
            });

        const context =
            contextFromSubmission({
                school,
                submission,
            });

        const logs = [];

        for (
            const student
            of updatedStudents
        ) {
            for (
                const topic
                of student.updatedTopicGrades
            ) {
                const oldData = {
                    grade:
                        topic.oldTopicGrade
                            .grade,
                    assessmentStatus:
                        topic.oldTopicGrade
                            .assessmentStatus,
                    remarks:
                        topic.oldTopicGrade
                            .remarks,
                };

                const newData = {
                    grade:
                        topic.newTopicGrade
                            .grade,
                    assessmentStatus:
                        topic.newTopicGrade
                            .assessmentStatus,
                    remarks:
                        topic.newTopicGrade
                            .remarks,
                };

                logs.push({
                    ...buildAudit({
                        context,
                        actor,
                        requestMetadata,
                        submissionSlug:
                            submission.slug,
                        studentGradeSlug:
                            student.newStudentGrade
                                .slug,
                        studentTopicGradeSlug:
                            topic.newTopicGrade
                                .slug,
                        academicMapping: {
                            studentSlug:
                                student.oldStudentGrade
                                    .studentSlug,
                            rollNumber:
                                student.oldStudentGrade
                                    .rollNumber,
                            student:
                                student.oldStudentGrade
                                    .student,
                        },
                        topic:
                            topic.newTopicGrade,
                        action:
                            "BULK_UPDATE_GRADES",
                        oldData,
                        newData,
                        requestBody:
                            payload,
                    }),

                    previousGrade:
                        topic.oldTopicGrade
                            .grade,
                    newGrade:
                        topic.newTopicGrade
                            .grade,
                    previousAssessmentStatus:
                        topic.oldTopicGrade
                            .assessmentStatus,
                    newAssessmentStatus:
                        topic.newTopicGrade
                            .assessmentStatus,
                });
            }
        }

        await createTopicWiseGradeAuditLogsRepo({
            logs,
        });

        return findTopicGradeSubmissionBySlugRepo({
            schoolSlug:
                school.slug,
            submissionSlug,
        });
    };

export const getTopicWiseGradeSubmissionService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const submission =
            await findTopicGradeSubmissionBySlugRepo({
                schoolSlug:
                    school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw createError(
                "Topic wise grade submission not found",
                404,
            );
        }

        const context =
            contextFromSubmission({
                school,
                submission,
            });

        try {
            await createTopicWiseGradeAuditLogRepo({
                data: buildAudit({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug:
                        submission.slug,
                    action:
                        "VIEW_GRADES",
                }),
            });
        } catch (auditError) {
            console.error(
                "Topic wise grade submission audit error:",
                auditError,
            );
        }

        return submission;
    };

export const lockTopicWiseGradesService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const submission =
            await findTopicGradeSubmissionBySlugRepo({
                schoolSlug:
                    school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw createError(
                "Topic wise grade submission not found",
                404,
            );
        }

        if (
            submission.isLocked
        ) {
            throw createError(
                "Grades are already locked",
            );
        }

        if (
            !submission.studentGrades
                .length
        ) {
            throw createError(
                "Cannot lock empty grade submission",
            );
        }

        const updated =
            await lockTopicWiseGradeSubmissionRepo({
                submissionSlug,
                userSlug:
                    user?.slug,
            });

        const context =
            contextFromSubmission({
                school,
                submission,
            });

        await createTopicWiseGradeAuditLogRepo({
            data: {
                ...buildAudit({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug:
                        submission.slug,
                    action:
                        "LOCK_GRADES",
                    oldData: {
                        isLocked:
                            false,
                    },
                    newData: {
                        isLocked:
                            true,
                        lockedAt:
                            updated.lockedAt,
                        lockedBySlug:
                            updated.lockedBySlug,
                    },
                }),

                previousIsLocked:
                    false,
                newIsLocked:
                    true,
            },
        });

        return updated;
    };

export const unlockTopicWiseGradesService =
    async ({
        user,
        submissionSlug,
        remarks,
        actor,
        requestMetadata,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const submission =
            await findTopicGradeSubmissionBySlugRepo({
                schoolSlug:
                    school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw createError(
                "Topic wise grade submission not found",
                404,
            );
        }

        if (
            !submission.isLocked
        ) {
            throw createError(
                "Grades are already unlocked",
            );
        }

        const updated =
            await unlockTopicWiseGradeSubmissionRepo({
                submissionSlug,
            });

        const context =
            contextFromSubmission({
                school,
                submission,
            });

        await createTopicWiseGradeAuditLogRepo({
            data: {
                ...buildAudit({
                    context,
                    actor,
                    requestMetadata,
                    submissionSlug:
                        submission.slug,
                    action:
                        "UNLOCK_GRADES",
                    remarks,
                    oldData: {
                        isLocked:
                            true,
                        lockedAt:
                            submission.lockedAt,
                        lockedBySlug:
                            submission.lockedBySlug,
                    },
                    newData: {
                        isLocked:
                            false,
                        lockedAt:
                            null,
                        lockedBySlug:
                            null,
                    },
                }),

                previousIsLocked:
                    true,
                newIsLocked:
                    false,
            },
        });

        return updated;
    };

export const deleteTopicWiseGradesService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const submission =
            await findTopicGradeSubmissionBySlugRepo({
                schoolSlug:
                    school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw createError(
                "Topic wise grade submission not found",
                404,
            );
        }

        if (
            submission.isLocked
        ) {
            throw createError(
                "Locked grades cannot be deleted",
            );
        }

        const deleted =
            await softDeleteTopicWiseGradeSubmissionRepo({
                submissionSlug,
            });

        const context =
            contextFromSubmission({
                school,
                submission,
            });

        await createTopicWiseGradeAuditLogRepo({
            data: buildAudit({
                context,
                actor,
                requestMetadata,
                submissionSlug:
                    submission.slug,
                action:
                    "DELETE_GRADES",
                oldData: {
                    status:
                        submission.status,
                    isActive:
                        submission.isActive,
                    deletedAt:
                        submission.deletedAt,
                },
                newData: {
                    status:
                        deleted.status,
                    isActive:
                        deleted.isActive,
                    deletedAt:
                        deleted.deletedAt,
                },
            }),
        });

        return deleted;
    };

export const restoreTopicWiseGradesService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const submission =
            await findTopicGradeSubmissionBySlugRepo({
                schoolSlug:
                    school.slug,
                submissionSlug,
                includeInactive:
                    true,
            });

        if (!submission) {
            throw createError(
                "Topic wise grade submission not found",
                404,
            );
        }

        if (
            submission.isActive
        ) {
            throw createError(
                "Topic wise grade submission is already active",
            );
        }

        const restored =
            await restoreTopicWiseGradeSubmissionRepo({
                submissionSlug,
            });

        const context =
            contextFromSubmission({
                school,
                submission,
            });

        await createTopicWiseGradeAuditLogRepo({
            data: buildAudit({
                context,
                actor,
                requestMetadata,
                submissionSlug:
                    submission.slug,
                action:
                    "RESTORE_GRADES",
                oldData: {
                    status:
                        submission.status,
                    isActive:
                        submission.isActive,
                    deletedAt:
                        submission.deletedAt,
                },
                newData: {
                    status:
                        restored.status,
                    isActive:
                        restored.isActive,
                    deletedAt:
                        restored.deletedAt,
                },
            }),
        });

        return restored;
    };

export const getTopicWiseGradeAuditLogsService =
    async ({
        user,
        query,
    }) => {
        const school =
            await resolveSchool({
                user,
            });

        const page =
            Number(
                query.page ||
                1,
            );

        const limit =
            Math.min(
                Number(
                    query.limit ||
                    20,
                ),
                100,
            );

        const result =
            await getTopicWiseGradeAuditLogsRepo({
                schoolSlug:
                    school.slug,
                submissionSlug:
                    query.submissionSlug,
                studentSlug:
                    query.studentSlug,
                action:
                    query.action,
                result:
                    query.result,
                skip:
                    (page - 1) *
                    limit,
                take:
                    limit,
            });

        return {
            data:
                result.logs,

            pagination: {
                page,
                limit,
                total:
                    result.total,
                totalPages:
                    Math.ceil(
                        result.total /
                        limit,
                    ),
            },
        };
    };
