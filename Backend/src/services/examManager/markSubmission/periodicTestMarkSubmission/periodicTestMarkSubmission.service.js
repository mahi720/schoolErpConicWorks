import { randomUUID } from "crypto";

import {
    findMarkSchoolRepo,
    findMarkSessionByNameRepo,
    findMarkBoardByTitleRepo,
    findPeriodicTestByTitleRepo,
    findMarkClassByTitleRepo,
    findPeriodicTestClassConfigurationRepo,
    findMarkSectionByTitleRepo,
    findMarkStreamByTitleRepo,
    findClassSubjectRepo,
    findPeriodicTestTimeTableRepo,
    findAcademicStudentsRepo,
    findSubmissionByScopeRepo,
    findSubmissionBySlugRepo,
    findStudentMarksBySlugsRepo,
    savePeriodicTestMarksTransactionRepo,
    updatePeriodicStudentMarksTransactionRepo,
    lockPeriodicTestSubmissionRepo,
    unlockPeriodicTestSubmissionRepo,
    softDeletePeriodicTestSubmissionRepo,
    restorePeriodicTestSubmissionRepo,
    createPeriodicTestAuditLogsRepo,
    createPeriodicTestAuditLogRepo,
    getPeriodicTestAuditLogsRepo,
    findClassSubjectBySlugRepo,
} from "../../../../repositories/examManager/marksSubmission/periodicTestMarkSubmission/periodicTestMarkSubmission.repository.js";

import {
    buildPeriodicTestScopeKey,
    buildChangedFields,
    buildBasePeriodicTestAuditData,
} from "../../../../utils/periodicTestMarkAuditHelper.js";

const normalizeDecimal = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    return Number(value);
};

const resolveSchool = async ({
    user,
}) => {
    const school = await findMarkSchoolRepo({
        schoolSlug: user?.schoolSlug,
        schoolCode: user?.schoolCode,
    });

    if (!school) {
        throw new Error("School not found");
    }

    return school;
};

const resolvePeriodicTestMarkContext = async ({
    user,
    payload,
}) => {
    const school = await resolveSchool({
        user,
    });

    const session =
        await findMarkSessionByNameRepo({
            schoolSlug: school.slug,
            academicYear: payload.academicYear,
        });

    if (!session) {
        throw new Error("Academic year not found");
    }

    const board = await findMarkBoardByTitleRepo({
        schoolSlug: school.slug,
        boardTitle: payload.board,
    });

    if (!board) {
        throw new Error("Board not found");
    }

    const periodicTest =
        await findPeriodicTestByTitleRepo({
            schoolSlug: school.slug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            periodicTestTitle:
                payload.periodicTestTitle,
        });

    if (!periodicTest) {
        throw new Error("Periodic test not found");
    }

    const classData =
        await findMarkClassByTitleRepo({
            schoolSlug: school.slug,
            boardSlug: board.slug,
            classTitle: payload.classTitle,
        });

    if (!classData) {
        throw new Error("Class not found");
    }

    const configuration =
        await findPeriodicTestClassConfigurationRepo({
            schoolSlug: school.slug,
            periodicTestSlug: periodicTest.slug,
            classSlug: classData.slug,
        });

    if (!configuration) {
        throw new Error(
            "Periodic test class configuration not found",
        );
    }

    let section = null;

    if (payload.section) {
        section = await findMarkSectionByTitleRepo({
            schoolSlug: school.slug,
            boardSlug: board.slug,
            sectionTitle: payload.section,
        });

        if (!section) {
            throw new Error("Section not found");
        }
    }

    let stream = null;

    if (payload.stream) {
        stream = await findMarkStreamByTitleRepo({
            schoolSlug: school.slug,
            boardSlug: board.slug,
            streamTitle: payload.stream,
        });

        if (!stream) {
            throw new Error("Stream not found");
        }
    }

    let classSubject = null;

    if (payload.classSubjectSlug) {
        console.log(
            "FETCHING SUBJECT BY SLUG:",
            payload.classSubjectSlug,
        );

        classSubject =
            await findClassSubjectBySlugRepo({
                schoolSlug: school.slug,
                classSubjectSlug:
                    payload.classSubjectSlug,
            });
    } else {
        console.log(
            "CLASS SUBJECT SLUG MISSING, USING FALLBACK",
        );

        classSubject =
            await findClassSubjectRepo({
                schoolSlug: school.slug,
                sessionSlug: session.slug,
                boardSlug: board.slug,
                classSlug: classData.slug,
                subjectTitle:
                    payload.subjectTitle,
                studyMode:
                    payload.studyMode,
                streamSlug:
                    stream?.slug || null,
            });
    }

    if (!classSubject) {
        throw new Error(
            "Subject is not assigned to selected class",
        );
    }

    if (
        !stream &&
        classSubject.streamSlug
    ) {
        stream =
            classSubject.stream || null;
    }

    const effectiveStreamSlug =
        stream?.slug ||
        classSubject.streamSlug ||
        null;


    if (
        classSubject.classSlug !==
        classData.slug
    ) {
        throw new Error(
            "Selected subject does not belong to selected class",
        );
    }

    if (
        classSubject.sessionSlug !==
        session.slug
    ) {
        throw new Error(
            "Selected subject does not belong to selected academic year",
        );
    }

    if (
        classSubject.boardSlug !==
        board.slug
    ) {
        throw new Error(
            "Selected subject does not belong to selected board",
        );
    }

    const timeTable =
        await findPeriodicTestTimeTableRepo({
            schoolSlug: school.slug,
            periodicTestClassConfigurationSlug:
                configuration.slug,
            classSubjectSlug:
                classSubject.slug,
            streamSlug:
                effectiveStreamSlug,
        });

    if (!timeTable) {
        throw new Error(
            "Periodic test timetable or marks configuration not found",
        );
    }

    const scopeKey = buildPeriodicTestScopeKey({
        sectionSlug: section?.slug || null,
        streamSlug: stream?.slug || null,
    });

    return {
        school,
        session,
        board,
        periodicTest,
        classData,
        configuration,
        section,
        stream,
        classSubject,
        timeTable,
        scopeKey,
    };
};

const createAuditContext = ({
    context,
    submissionSlug,
    studentMark,
    academicMapping,
}) => {
    return {
        schoolSlug: context.school.slug,
        submissionSlug: submissionSlug || null,
        studentMarkSlug:
            studentMark?.slug || null,
        periodicTestSlug:
            context.periodicTest.slug,
        classSlug: context.classData.slug,
        classSubjectSlug:
            context.classSubject.slug,
        sectionSlug:
            context.section?.slug || null,
        streamSlug:
            context.stream?.slug || null,
        studentSlug:
            studentMark?.studentSlug || null,

        periodicTestTitle:
            context.periodicTest.testTitle,
        academicYear: context.session.name,
        boardTitle: context.board.title,
        classTitle:
            context.classData.classTitle,
        subjectTitle:
            context.classSubject.subject
                .subjectTitle,
        studyMode:
            context.classSubject.studyType,
        sectionTitle:
            context.section?.sectionTitle || null,
        streamTitle:
            context.stream?.streamTitle || null,

        studentName:
            academicMapping?.student
                ?.studentName || null,
        admissionNumber:
            academicMapping?.student
                ?.admissionNumber || null,
        rollNo:
            academicMapping?.rollNumber ??
            studentMark?.rollNo ??
            null,
    };
};

export const getPeriodicTestMarkStudentsService =
    async ({
        user,
        query,
        actor,
        requestMetadata,
    }) => {
        const context =
            await resolvePeriodicTestMarkContext({
                user,
                payload: query,
            });

        const academicStudents =
            await findAcademicStudentsRepo({
                schoolSlug: context.school.slug,
                sessionSlug: context.session.slug,
                boardSlug: context.board.slug,
                classSlug: context.classData.slug,
                sectionSlug:
                    context.section?.slug || null,
                streamSlug:
                    context.stream?.slug || null,
            });

        const existingSubmission =
            await findSubmissionByScopeRepo({
                schoolSlug: context.school.slug,
                periodicTestClassConfigurationSlug:
                    context.configuration.slug,
                classSubjectSlug:
                    context.classSubject.slug,
                scopeKey: context.scopeKey,
            });

        const existingMarkMap = new Map(
            (
                existingSubmission?.studentMarks || []
            ).map((item) => [
                item.studentSlug,
                item,
            ]),
        );

        const students = academicStudents.map(
            (mapping, index) => {
                const savedMark = existingMarkMap.get(
                    mapping.studentSlug,
                );

                return {
                    sn: index + 1,
                    studentSlug: mapping.studentSlug,
                    academicMappingSlug: mapping.slug,
                    admissionNumber:
                        mapping.student.admissionNumber,
                    studentName:
                        mapping.student.studentName,
                    profileImage:
                        mapping.student.profileImage,
                    rollNumberPrefix:
                        mapping.rollNumberPrefix,
                    rollNumber: mapping.rollNumber,
                    sectionSlug:
                        mapping.sectionSlug,
                    sectionTitle:
                        mapping.section?.sectionTitle ||
                        null,
                    streamSlug:
                        mapping.streamSlug,
                    streamTitle:
                        mapping.stream?.streamTitle ||
                        null,
                    studentMarkSlug:
                        savedMark?.slug || null,
                    obtainedMarks:
                        normalizeDecimal(
                            savedMark?.obtainedMarks,
                        ),
                    markStatus:
                        savedMark?.markStatus ||
                        "PRESENT",
                    remarks:
                        savedMark?.remarks || "",
                };
            },
        );

        await createPeriodicTestAuditLogRepo({
            data: buildBasePeriodicTestAuditData({
                context: createAuditContext({
                    context,
                    submissionSlug:
                        existingSubmission?.slug,
                }),
                actor,
                requestMetadata,
                action: "VIEW_MARKS",
                requestBody: query,
            }),
        });

        return {
            filters: {
                academicYear:
                    context.session.name,
                board: context.board.title,
                periodicTestTitle:
                    context.periodicTest.testTitle,
                classTitle:
                    context.classData.classTitle,
                subjectTitle:
                    context.classSubject.subject
                        .subjectTitle,
                studyMode:
                    context.classSubject.studyType,
                section:
                    context.section?.sectionTitle ||
                    null,
                stream:
                    context.stream?.streamTitle ||
                    null,
            },

            configuration: {
                periodicTestSlug:
                    context.periodicTest.slug,
                periodicTestClassConfigurationSlug:
                    context.configuration.slug,
                classSlug: context.classData.slug,
                classSubjectSlug:
                    context.classSubject.slug,
                sectionSlug:
                    context.section?.slug || null,
                streamSlug:
                    context.stream?.slug || null,
                scopeKey: context.scopeKey,
                maxMarks: normalizeDecimal(
                    context.timeTable.maxMarks,
                ),
                minMarks: normalizeDecimal(
                    context.timeTable.minMarks,
                ),
            },

            submission: existingSubmission
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

export const savePeriodicTestMarksService =
    async ({
        user,
        payload,
        actor,
        requestMetadata,
    }) => {
        const context =
            await resolvePeriodicTestMarkContext({
                user,
                payload,
            });

        console.log("PERIODIC MARK PAYLOAD:", {
            classSubjectSlug:
                payload.classSubjectSlug,
            subjectTitle:
                payload.subjectTitle,
            studyMode:
                payload.studyMode,
            stream:
                payload.stream,
        });

        const academicStudents =
            await findAcademicStudentsRepo({
                schoolSlug: context.school.slug,
                sessionSlug: context.session.slug,
                boardSlug: context.board.slug,
                classSlug: context.classData.slug,
                sectionSlug:
                    context.section?.slug || null,
                streamSlug:
                    context.stream?.slug || null,
            });

        if (!academicStudents.length) {
            throw new Error(
                "No active students found for selected filters",
            );
        }

        const academicMappingMap = new Map(
            academicStudents.map((item) => [
                item.slug,
                item,
            ]),
        );

        const existingSubmission =
            await findSubmissionByScopeRepo({
                schoolSlug: context.school.slug,
                periodicTestClassConfigurationSlug:
                    context.configuration.slug,
                classSubjectSlug:
                    context.classSubject.slug,
                scopeKey: context.scopeKey,
            });

        if (existingSubmission?.isLocked) {
            throw new Error(
                "Marks are locked and cannot be edited",
            );
        }

        const maxMarks = normalizeDecimal(
            context.timeTable.maxMarks,
        );

        const normalizedStudents =
            payload.students.map((item) => {
                const academicMapping =
                    academicMappingMap.get(
                        item.academicMappingSlug,
                    );

                if (!academicMapping) {
                    throw new Error(
                        "Invalid student academic mapping found",
                    );
                }

                if (
                    academicMapping.studentSlug !==
                    item.studentSlug
                ) {
                    throw new Error(
                        "Student and academic mapping do not match",
                    );
                }

                let obtainedMarks =
                    item.obtainedMarks ?? null;

                if (
                    item.markStatus !== "PRESENT"
                ) {
                    obtainedMarks = null;
                }

                if (
                    item.markStatus === "PRESENT" &&
                    obtainedMarks === null
                ) {
                    throw new Error(
                        `Marks are required for ${academicMapping.student.studentName}`,
                    );
                }

                if (
                    obtainedMarks !== null &&
                    Number(obtainedMarks) > maxMarks
                ) {
                    throw new Error(
                        `Marks for ${academicMapping.student.studentName} cannot exceed ${maxMarks}`,
                    );
                }

                return {
                    slug: randomUUID(),
                    studentSlug: item.studentSlug,
                    academicMappingSlug:
                        item.academicMappingSlug,
                    rollNo:
                        academicMapping.rollNumber,
                    obtainedMarks,
                    markStatus: item.markStatus,
                    remarks: item.remarks || null,
                };
            });

        const result =
            await savePeriodicTestMarksTransactionRepo({
                submissionData: {
                    slug:
                        existingSubmission?.slug ||
                        randomUUID(),
                    schoolSlug: context.school.slug,
                    periodicTestClassConfigurationSlug:
                        context.configuration.slug,
                    classSubjectSlug:
                        context.classSubject.slug,
                    sectionSlug:
                        context.section?.slug || null,
                    streamSlug:
                        context.stream?.slug || null,
                    scopeKey: context.scopeKey,
                    submittedBySlug:
                        user?.slug || null,
                    maxMarks:
                        context.timeTable.maxMarks,
                    minMarks:
                        context.timeTable.minMarks,
                    isLocked: false,
                    submittedAt: new Date(),
                },
                students: normalizedStudents,
            });

        const auditLogs = [];

        if (result.isNewSubmission) {
            auditLogs.push(
                buildBasePeriodicTestAuditData({
                    context: createAuditContext({
                        context,
                        submissionSlug:
                            result.submission.slug,
                    }),
                    actor,
                    requestMetadata,
                    action: "CREATE_SUBMISSION",
                    requestBody: payload,
                    newData: result.submission,
                }),
            );
        }

        for (const savedItem of result.savedStudentMarks) {
            const academicMapping =
                academicMappingMap.get(
                    savedItem.newMark
                        .academicMappingSlug,
                );

            const oldData = savedItem.oldMark
                ? {
                    obtainedMarks:
                        normalizeDecimal(
                            savedItem.oldMark
                                .obtainedMarks,
                        ),
                    markStatus:
                        savedItem.oldMark
                            .markStatus,
                    remarks:
                        savedItem.oldMark.remarks,
                }
                : null;

            const newData = {
                obtainedMarks:
                    normalizeDecimal(
                        savedItem.newMark
                            .obtainedMarks,
                    ),
                markStatus:
                    savedItem.newMark.markStatus,
                remarks:
                    savedItem.newMark.remarks,
            };

            auditLogs.push({
                ...buildBasePeriodicTestAuditData({
                    context: createAuditContext({
                        context,
                        submissionSlug:
                            result.submission.slug,
                        studentMark:
                            savedItem.newMark,
                        academicMapping,
                    }),
                    actor,
                    requestMetadata,
                    action: savedItem.oldMark
                        ? "UPDATE_MARKS"
                        : "SAVE_MARKS",
                    requestBody: payload,
                }),

                previousMarks:
                    normalizeDecimal(
                        savedItem.oldMark
                            ?.obtainedMarks,
                    ),
                newMarks:
                    normalizeDecimal(
                        savedItem.newMark
                            .obtainedMarks,
                    ),

                previousMarkStatus:
                    savedItem.oldMark
                        ?.markStatus || null,
                newMarkStatus:
                    savedItem.newMark
                        .markStatus,

                oldData,
                newData,
                changedFields:
                    buildChangedFields({
                        oldData,
                        newData,
                    }),
            });
        }

        await createPeriodicTestAuditLogsRepo({
            logs: auditLogs,
        });

        return findSubmissionBySlugRepo({
            schoolSlug: context.school.slug,
            submissionSlug:
                result.submission.slug,
        });
    };

export const bulkUpdatePeriodicTestMarksService =
    async ({
        user,
        submissionSlug,
        payload,
        actor,
        requestMetadata,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const submission =
            await findSubmissionBySlugRepo({
                schoolSlug: school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw new Error(
                "Mark submission not found",
            );
        }

        if (submission.isLocked) {
            throw new Error(
                "Marks are locked and cannot be edited",
            );
        }

        const existingMarks =
            await findStudentMarksBySlugsRepo({
                schoolSlug: school.slug,
                studentMarkSlugs:
                    payload.students.map(
                        (item) =>
                            item.studentMarkSlug,
                    ),
            });

        if (
            existingMarks.length !==
            payload.students.length
        ) {
            throw new Error(
                "One or more student marks were not found",
            );
        }

        const maxMarks = normalizeDecimal(
            submission.maxMarks,
        );

        const normalizedStudents =
            payload.students.map((item) => {
                let obtainedMarks =
                    item.obtainedMarks ?? null;

                if (
                    item.markStatus !== "PRESENT"
                ) {
                    obtainedMarks = null;
                }

                if (
                    item.markStatus === "PRESENT" &&
                    obtainedMarks === null
                ) {
                    throw new Error(
                        "Marks are required for present student",
                    );
                }

                if (
                    obtainedMarks !== null &&
                    Number(obtainedMarks) > maxMarks
                ) {
                    throw new Error(
                        `Obtained marks cannot exceed ${maxMarks}`,
                    );
                }

                return {
                    ...item,
                    obtainedMarks,
                    remarks: item.remarks || null,
                };
            });

        const updatedMarks =
            await updatePeriodicStudentMarksTransactionRepo({
                schoolSlug: school.slug,
                students: normalizedStudents,
            });

        const periodicTest =
            submission
                .periodicTestClassConfiguration
                .periodicTest;

        const context = {
            school: {
                slug: school.slug,
            },
            session: periodicTest.session,
            board: periodicTest.board,
            periodicTest,
            classData:
                submission
                    .periodicTestClassConfiguration
                    .class,
            classSubject:
                submission.classSubject,
            section: submission.section,
            stream: submission.stream,
        };

        const auditLogs =
            updatedMarks.map(
                ({ oldMark, newMark }) => {
                    const existing =
                        existingMarks.find(
                            (item) =>
                                item.slug ===
                                newMark.slug,
                        );

                    const oldData = {
                        obtainedMarks:
                            normalizeDecimal(
                                oldMark.obtainedMarks,
                            ),
                        markStatus:
                            oldMark.markStatus,
                        remarks: oldMark.remarks,
                    };

                    const newData = {
                        obtainedMarks:
                            normalizeDecimal(
                                newMark.obtainedMarks,
                            ),
                        markStatus:
                            newMark.markStatus,
                        remarks: newMark.remarks,
                    };

                    return {
                        ...buildBasePeriodicTestAuditData({
                            context:
                                createAuditContext({
                                    context,
                                    submissionSlug:
                                        submission.slug,
                                    studentMark:
                                        newMark,
                                    academicMapping: {
                                        rollNumber:
                                            newMark.rollNo,
                                        student:
                                            existing?.student,
                                    },
                                }),
                            actor,
                            requestMetadata,
                            action:
                                "BULK_UPDATE_MARKS",
                            requestBody: payload,
                        }),

                        previousMarks:
                            normalizeDecimal(
                                oldMark.obtainedMarks,
                            ),
                        newMarks:
                            normalizeDecimal(
                                newMark.obtainedMarks,
                            ),
                        previousMarkStatus:
                            oldMark.markStatus,
                        newMarkStatus:
                            newMark.markStatus,
                        oldData,
                        newData,
                        changedFields:
                            buildChangedFields({
                                oldData,
                                newData,
                            }),
                    };
                },
            );

        await createPeriodicTestAuditLogsRepo({
            logs: auditLogs,
        });

        return findSubmissionBySlugRepo({
            schoolSlug: school.slug,
            submissionSlug,
        });
    };

export const getPeriodicTestSubmissionService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const submission =
            await findSubmissionBySlugRepo({
                schoolSlug: school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw new Error(
                "Mark submission not found",
            );
        }

        const periodicTest =
            submission
                .periodicTestClassConfiguration
                .periodicTest;

        await createPeriodicTestAuditLogRepo({
            data: buildBasePeriodicTestAuditData({
                context: {
                    schoolSlug: school.slug,
                    submissionSlug:
                        submission.slug,
                    periodicTestSlug:
                        periodicTest.slug,
                    classSlug:
                        submission
                            .periodicTestClassConfiguration
                            .class.slug,
                    classSubjectSlug:
                        submission.classSubject.slug,
                    sectionSlug:
                        submission.sectionSlug,
                    streamSlug:
                        submission.streamSlug,
                    periodicTestTitle:
                        periodicTest.testTitle,
                    academicYear:
                        periodicTest.session.name,
                    boardTitle:
                        periodicTest.board.title,
                    classTitle:
                        submission
                            .periodicTestClassConfiguration
                            .class.classTitle,
                    subjectTitle:
                        submission.classSubject
                            .subject.subjectTitle,
                    studyMode:
                        submission.classSubject
                            .studyType,
                    sectionTitle:
                        submission.section
                            ?.sectionTitle || null,
                    streamTitle:
                        submission.stream
                            ?.streamTitle || null,
                },
                actor,
                requestMetadata,
                action: "VIEW_MARKS",
            }),
        });

        return submission;
    };

export const lockPeriodicTestMarksService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const submission =
            await findSubmissionBySlugRepo({
                schoolSlug: school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw new Error(
                "Mark submission not found",
            );
        }

        if (submission.isLocked) {
            throw new Error(
                "Marks are already locked",
            );
        }

        if (!submission.studentMarks.length) {
            throw new Error(
                "Cannot lock empty marks submission",
            );
        }

        const updatedSubmission =
            await lockPeriodicTestSubmissionRepo({
                submissionSlug,
                userSlug: user?.slug,
            });

        const periodicTest =
            submission
                .periodicTestClassConfiguration
                .periodicTest;

        await createPeriodicTestAuditLogRepo({
            data: {
                ...buildBasePeriodicTestAuditData({
                    context: {
                        schoolSlug: school.slug,
                        submissionSlug,
                        periodicTestSlug:
                            periodicTest.slug,
                        classSlug:
                            submission
                                .periodicTestClassConfiguration
                                .class.slug,
                        classSubjectSlug:
                            submission.classSubject.slug,
                        sectionSlug:
                            submission.sectionSlug,
                        streamSlug:
                            submission.streamSlug,
                        periodicTestTitle:
                            periodicTest.testTitle,
                        academicYear:
                            periodicTest.session.name,
                        boardTitle:
                            periodicTest.board.title,
                        classTitle:
                            submission
                                .periodicTestClassConfiguration
                                .class.classTitle,
                        subjectTitle:
                            submission.classSubject
                                .subject.subjectTitle,
                        studyMode:
                            submission.classSubject
                                .studyType,
                        sectionTitle:
                            submission.section
                                ?.sectionTitle || null,
                        streamTitle:
                            submission.stream
                                ?.streamTitle || null,
                    },
                    actor,
                    requestMetadata,
                    action: "LOCK_MARKS",
                }),
                previousIsLocked: false,
                newIsLocked: true,
                oldData: {
                    isLocked: false,
                    lockedAt: null,
                },
                newData: {
                    isLocked: true,
                    lockedAt:
                        updatedSubmission.lockedAt,
                    lockedBySlug:
                        updatedSubmission.lockedBySlug,
                },
            },
        });

        return updatedSubmission;
    };

export const unlockPeriodicTestMarksService =
    async ({
        user,
        submissionSlug,
        remarks,
        actor,
        requestMetadata,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const submission =
            await findSubmissionBySlugRepo({
                schoolSlug: school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw new Error(
                "Mark submission not found",
            );
        }

        if (!submission.isLocked) {
            throw new Error(
                "Marks are already unlocked",
            );
        }

        const updatedSubmission =
            await unlockPeriodicTestSubmissionRepo({
                submissionSlug,
            });

        const periodicTest =
            submission
                .periodicTestClassConfiguration
                .periodicTest;

        await createPeriodicTestAuditLogRepo({
            data: {
                ...buildBasePeriodicTestAuditData({
                    context: {
                        schoolSlug: school.slug,
                        submissionSlug,
                        periodicTestSlug:
                            periodicTest.slug,
                        classSlug:
                            submission
                                .periodicTestClassConfiguration
                                .class.slug,
                        classSubjectSlug:
                            submission.classSubject.slug,
                        sectionSlug:
                            submission.sectionSlug,
                        streamSlug:
                            submission.streamSlug,
                        periodicTestTitle:
                            periodicTest.testTitle,
                        academicYear:
                            periodicTest.session.name,
                        boardTitle:
                            periodicTest.board.title,
                        classTitle:
                            submission
                                .periodicTestClassConfiguration
                                .class.classTitle,
                        subjectTitle:
                            submission.classSubject
                                .subject.subjectTitle,
                        studyMode:
                            submission.classSubject
                                .studyType,
                        sectionTitle:
                            submission.section
                                ?.sectionTitle || null,
                        streamTitle:
                            submission.stream
                                ?.streamTitle || null,
                    },
                    actor,
                    requestMetadata,
                    action: "UNLOCK_MARKS",
                    remarks,
                }),
                previousIsLocked: true,
                newIsLocked: false,
                oldData: {
                    isLocked: true,
                    lockedAt:
                        submission.lockedAt,
                    lockedBySlug:
                        submission.lockedBySlug,
                },
                newData: {
                    isLocked: false,
                    lockedAt: null,
                    lockedBySlug: null,
                },
            },
        });

        return updatedSubmission;
    };

export const deletePeriodicTestMarksService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const submission =
            await findSubmissionBySlugRepo({
                schoolSlug: school.slug,
                submissionSlug,
            });

        if (!submission) {
            throw new Error(
                "Mark submission not found",
            );
        }

        if (submission.isLocked) {
            throw new Error(
                "Locked marks cannot be deleted",
            );
        }

        const deletedSubmission =
            await softDeletePeriodicTestSubmissionRepo({
                submissionSlug,
            });

        const periodicTest =
            submission
                .periodicTestClassConfiguration
                .periodicTest;

        await createPeriodicTestAuditLogRepo({
            data: buildBasePeriodicTestAuditData({
                context: {
                    schoolSlug: school.slug,
                    submissionSlug,
                    periodicTestSlug:
                        periodicTest.slug,
                    classSlug:
                        submission
                            .periodicTestClassConfiguration
                            .class.slug,
                    classSubjectSlug:
                        submission.classSubject.slug,
                    sectionSlug:
                        submission.sectionSlug,
                    streamSlug:
                        submission.streamSlug,
                    periodicTestTitle:
                        periodicTest.testTitle,
                    academicYear:
                        periodicTest.session.name,
                    boardTitle:
                        periodicTest.board.title,
                    classTitle:
                        submission
                            .periodicTestClassConfiguration
                            .class.classTitle,
                    subjectTitle:
                        submission.classSubject
                            .subject.subjectTitle,
                    studyMode:
                        submission.classSubject
                            .studyType,
                    sectionTitle:
                        submission.section
                            ?.sectionTitle || null,
                    streamTitle:
                        submission.stream
                            ?.streamTitle || null,
                },
                actor,
                requestMetadata,
                action: "DELETE_MARKS",
                oldData: submission,
                newData: deletedSubmission,
            }),
        });

        return deletedSubmission;
    };

export const restorePeriodicTestMarksService =
    async ({
        user,
        submissionSlug,
        actor,
        requestMetadata,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const submission =
            await findSubmissionBySlugRepo({
                schoolSlug: school.slug,
                submissionSlug,
                includeInactive: true,
            });

        if (!submission) {
            throw new Error(
                "Mark submission not found",
            );
        }

        if (submission.isActive) {
            throw new Error(
                "Mark submission is already active",
            );
        }

        const restoredSubmission =
            await restorePeriodicTestSubmissionRepo({
                submissionSlug,
            });

        const periodicTest =
            submission
                .periodicTestClassConfiguration
                .periodicTest;

        await createPeriodicTestAuditLogRepo({
            data: buildBasePeriodicTestAuditData({
                context: {
                    schoolSlug: school.slug,
                    submissionSlug,
                    periodicTestSlug:
                        periodicTest.slug,
                    classSlug:
                        submission
                            .periodicTestClassConfiguration
                            .class.slug,
                    classSubjectSlug:
                        submission.classSubject.slug,
                    sectionSlug:
                        submission.sectionSlug,
                    streamSlug:
                        submission.streamSlug,
                    periodicTestTitle:
                        periodicTest.testTitle,
                    academicYear:
                        periodicTest.session.name,
                    boardTitle:
                        periodicTest.board.title,
                    classTitle:
                        submission
                            .periodicTestClassConfiguration
                            .class.classTitle,
                    subjectTitle:
                        submission.classSubject
                            .subject.subjectTitle,
                    studyMode:
                        submission.classSubject
                            .studyType,
                    sectionTitle:
                        submission.section
                            ?.sectionTitle || null,
                    streamTitle:
                        submission.stream
                            ?.streamTitle || null,
                },
                actor,
                requestMetadata,
                action: "RESTORE_MARKS",
                oldData: submission,
                newData: restoredSubmission,
            }),
        });

        return restoredSubmission;
    };

export const getPeriodicTestMarkAuditLogsService =
    async ({
        user,
        query,
    }) => {
        const school = await resolveSchool({
            user,
        });

        const page = Number(query.page || 1);
        const limit = Number(query.limit || 20);
        const skip = (page - 1) * limit;

        const result =
            await getPeriodicTestAuditLogsRepo({
                schoolSlug: school.slug,
                submissionSlug:
                    query.submissionSlug,
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
                totalPages: Math.ceil(
                    result.total / limit,
                ),
            },
        };
    };