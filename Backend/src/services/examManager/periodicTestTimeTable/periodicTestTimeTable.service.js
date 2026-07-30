import { randomUUID } from "crypto";

import {
    findPeriodicTestSchoolByCodeRepo,
    findPeriodicTestSessionByNameRepo,
    findPeriodicTestBoardByTitleRepo,
    findPeriodicTestBySlugRepo,
    findDuplicatePeriodicTestRepo,
    createPeriodicTestRepo,
    getPeriodicTestsRepo,
    updatePeriodicTestRepo,
    deletePeriodicTestRepo,
    restorePeriodicTestRepo,
    findPeriodicTestClassBySlugRepo,
    findPeriodicTestClassMappingRepo,
    findPeriodicTestClassSubjectBySlugRepo,
    findPeriodicTestStreamBySlugRepo,
    getPeriodicTestClassConfigurationRepo,
    savePeriodicTestTimeTableRepo,
    deletePeriodicTestTimeTableRepo,
    restorePeriodicTestTimeTableRepo,
} from "../../../repositories/examManager/periodicTestTimeTable/periodicTestTimeTable.repository.js";

const resolvePeriodicTestSchool = async (user) => {
    if (user?.schoolSlug) {
        return {
            slug: user.schoolSlug,
            schoolCode: user.schoolCode || null,
        };
    }

    if (!user?.schoolCode) {
        throw new Error("School information not found");
    }

    const school =
        await findPeriodicTestSchoolByCodeRepo(
            user.schoolCode,
        );

    if (!school) {
        throw new Error("School not found");
    }

    return school;
};

const formatPeriodicTest = (item) => {
    if (!item) {
        return null;
    }

    return {
        ...item,
        sessionName:
            item.session?.name || "",
        boardTitle:
            item.board?.title || "",
    };
};

const formatPeriodicTimeTableRow = (item) => {
    return {
        slug: item.slug,
        classSubjectSlug:
            item.classSubjectSlug,
        subjectSlug:
            item.classSubject?.subject?.slug || "",
        subjectTitle:
            item.classSubject?.subject
                ?.subjectTitle || "",
        subjectType:
            item.classSubject?.subject
                ?.subjectType || "",
        subjectOrder:
            item.classSubject?.subject
                ?.subjectOrder ?? 0,
        streamSlug:
            item.streamSlug ||
            item.classSubject?.stream?.slug ||
            null,
        streamTitle:
            item.stream?.streamTitle ||
            item.classSubject?.stream
                ?.streamTitle ||
            "NA",
        studyMode:
            item.studyMode ||
            item.classSubject?.studyType ||
            "",
        maxMarks:
            Number(item.maxMarks),
        minMarks:
            Number(item.minMarks),
        testDate:
            item.testDate,
        testTime:
            item.testTime,
        duration:
            item.duration,
        questionPaper:
            item.questionPaper,
        status:
            item.status,
        isActive:
            item.isActive,
        deletedAt:
            item.deletedAt,
        createdAt:
            item.createdAt,
        updatedAt:
            item.updatedAt,
    };
};

const formatPeriodicTestConfiguration = (configuration) => {
    if (!configuration) {
        return null;
    }

    return {
        slug: configuration.slug,
        schoolSlug:
            configuration.schoolSlug,
        periodicTestSlug:
            configuration.periodicTestSlug,
        classSlug:
            configuration.classSlug,
        publishResult:
            configuration.publishResult,
        status:
            configuration.status,
        isActive:
            configuration.isActive,
        deletedAt:
            configuration.deletedAt,
        createdAt:
            configuration.createdAt,
        updatedAt:
            configuration.updatedAt,
        periodicTest:
            formatPeriodicTest(
                configuration.periodicTest,
            ),
        class:
            configuration.class || null,
        subjects:
            (
                configuration.periodicTestTimeTables ||
                []
            ).map(formatPeriodicTimeTableRow),
    };
};

export const createPeriodicTestService = async (
    payload,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const session =
        await findPeriodicTestSessionByNameRepo({
            schoolSlug: school.slug,
            session: payload.session,
        });

    if (!session) {
        throw new Error(
            "Selected academic session not found",
        );
    }

    const board =
        await findPeriodicTestBoardByTitleRepo({
            schoolSlug: school.slug,
            board: payload.board,
        });

    if (!board) {
        throw new Error(
            "Selected board not found",
        );
    }

    const startDate =
        new Date(payload.startDate);

    const endDate =
        new Date(payload.endDate);

    if (startDate > endDate) {
        throw new Error(
            "Start date cannot be after end date",
        );
    }

    const duplicate =
        await findDuplicatePeriodicTestRepo({
            schoolSlug: school.slug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            testTitle:
                payload.testTitle.trim(),
        });

    if (duplicate) {
        throw new Error(
            "Periodic test already exists for selected session and board",
        );
    }

    const created =
        await createPeriodicTestRepo({
            slug: randomUUID(),
            schoolSlug: school.slug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            testTitle:
                payload.testTitle.trim(),
            startDate,
            endDate,
            testStatus:
                payload.testStatus ||
                "scheduled",
            status: "active",
            isActive: true,
            deletedAt: null,
        });

    return formatPeriodicTest(created);
};

export const getPeriodicTestsService = async (
    query,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    let sessionSlug;
    let boardSlug;

    if (query.session) {
        const session =
            await findPeriodicTestSessionByNameRepo({
                schoolSlug: school.slug,
                session: query.session,
            });

        if (!session) {
            return [];
        }

        sessionSlug = session.slug;
    }

    if (query.board) {
        const board =
            await findPeriodicTestBoardByTitleRepo({
                schoolSlug: school.slug,
                board: query.board,
            });

        if (!board) {
            return [];
        }

        boardSlug = board.slug;
    }

    const periodicTests =
        await getPeriodicTestsRepo({
            schoolSlug: school.slug,
            sessionSlug,
            boardSlug,
            testStatus:
                query.testStatus,
            status:
                query.status,
        });

    return periodicTests.map(
        formatPeriodicTest,
    );
};

export const getPeriodicTestBySlugService = async (
    periodicTestSlug,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const periodicTest =
        await findPeriodicTestBySlugRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
        });

    if (!periodicTest) {
        throw new Error(
            "Periodic test not found",
        );
    }

    return formatPeriodicTest(periodicTest);
};

export const updatePeriodicTestService = async (
    periodicTestSlug,
    payload,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const existing =
        await findPeriodicTestBySlugRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
        });

    if (!existing) {
        throw new Error(
            "Periodic test not found",
        );
    }

    let sessionSlug =
        existing.sessionSlug;

    let boardSlug =
        existing.boardSlug;

    if (payload.session) {
        const session =
            await findPeriodicTestSessionByNameRepo({
                schoolSlug: school.slug,
                session: payload.session,
            });

        if (!session) {
            throw new Error(
                "Selected academic session not found",
            );
        }

        sessionSlug = session.slug;
    }

    if (payload.board) {
        const board =
            await findPeriodicTestBoardByTitleRepo({
                schoolSlug: school.slug,
                board: payload.board,
            });

        if (!board) {
            throw new Error(
                "Selected board not found",
            );
        }

        boardSlug = board.slug;
    }

    const testTitle =
        payload.testTitle?.trim() ||
        existing.testTitle;

    const duplicate =
        await findDuplicatePeriodicTestRepo({
            schoolSlug: school.slug,
            sessionSlug,
            boardSlug,
            testTitle,
            excludeSlug:
                periodicTestSlug,
        });

    if (duplicate) {
        throw new Error(
            "Periodic test already exists for selected session and board",
        );
    }

    const startDate =
        payload.startDate
            ? new Date(payload.startDate)
            : existing.startDate;

    const endDate =
        payload.endDate
            ? new Date(payload.endDate)
            : existing.endDate;

    if (startDate > endDate) {
        throw new Error(
            "Start date cannot be after end date",
        );
    }

    const updated =
        await updatePeriodicTestRepo({
            slug: periodicTestSlug,
            data: {
                sessionSlug,
                boardSlug,
                testTitle,
                startDate,
                endDate,
                testStatus:
                    payload.testStatus ||
                    existing.testStatus,
            },
        });

    return formatPeriodicTest(updated);
};

export const deletePeriodicTestService = async (
    periodicTestSlug,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const deleted =
        await deletePeriodicTestRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
        });

    if (!deleted) {
        throw new Error(
            "Periodic test not found",
        );
    }

    return formatPeriodicTest(deleted);
};

export const restorePeriodicTestService = async (
    periodicTestSlug,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const restored =
        await restorePeriodicTestRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
        });

    if (!restored) {
        throw new Error(
            "Periodic test not found",
        );
    }

    return formatPeriodicTest(restored);
};

export const getPeriodicTestTimeTableService = async (
    periodicTestSlug,
    classSlug,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const periodicTest =
        await findPeriodicTestBySlugRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
        });

    if (!periodicTest) {
        throw new Error(
            "Periodic test not found",
        );
    }

    const classData =
        await findPeriodicTestClassBySlugRepo({
            schoolSlug: school.slug,
            sessionSlug: periodicTest.sessionSlug,
            boardSlug: periodicTest.boardSlug,
            classSlug,
        });;

    if (!classData) {
        throw new Error(
            "Class not found for the periodic test session and board",
        );
    }

    const configuration =
        await getPeriodicTestClassConfigurationRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
            classSlug,
        });

    return {
        periodicTest:
            formatPeriodicTest(periodicTest),
        class: classData,
        configuration:
            formatPeriodicTestConfiguration(
                configuration,
            ),
    };
};

export const savePeriodicTestTimeTableService = async (
    payload,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const periodicTest =
        await findPeriodicTestBySlugRepo({
            schoolSlug: school.slug,
            periodicTestSlug:
                payload.periodicTestSlug,
        });

    if (!periodicTest) {
        throw new Error(
            "Periodic test not found",
        );
    }

    if (!periodicTest.isActive) {
        throw new Error(
            "Periodic test is inactive",
        );
    }

    const classData =
        await findPeriodicTestClassBySlugRepo({
            schoolSlug: school.slug,
            sessionSlug: periodicTest.sessionSlug,
            boardSlug: periodicTest.boardSlug,
            classSlug: payload.classSlug,
        });

    if (!classData) {
        throw new Error(
            "Class not found for the periodic test session and board",
        );
    }

    if (!classData.isActive) {
        throw new Error(
            "Selected class is inactive",
        );
    }

    const preparedSubjects = [];

    for (const subject of payload.subjects) {
        const classSubject =
            await findPeriodicTestClassSubjectBySlugRepo({
                schoolSlug: school.slug,
                sessionSlug:
                    periodicTest.sessionSlug,
                boardSlug:
                    periodicTest.boardSlug,
                classSlug:
                    payload.classSlug,
                classSubjectSlug:
                    subject.classSubjectSlug,
            });

        if (!classSubject) {
            throw new Error(
                "One or more selected class subjects were not found",
            );
        }

        let streamSlug =
            subject.streamSlug ||
            classSubject.streamSlug ||
            null;

        if (streamSlug) {
            const stream =
                await findPeriodicTestStreamBySlugRepo({
                    schoolSlug: school.slug,
                    streamSlug,
                });

            if (!stream) {
                throw new Error(
                    `Stream not found for ${classSubject.subject.subjectTitle}`,
                );
            }

            if (
                classSubject.streamSlug &&
                classSubject.streamSlug !==
                stream.slug
            ) {
                throw new Error(
                    `Invalid stream selected for ${classSubject.subject.subjectTitle}`,
                );
            }

            streamSlug = stream.slug;
        }

        const testDate =
            new Date(subject.testDate);

        if (
            testDate <
            new Date(
                periodicTest.startDate,
            ) ||
            testDate >
            new Date(
                periodicTest.endDate,
            )
        ) {
            throw new Error(
                `Test date for ${classSubject.subject.subjectTitle} must be between periodic test start and end date`,
            );
        }

        if (
            Number(subject.minMarks) >
            Number(subject.maxMarks)
        ) {
            throw new Error(
                `Minimum marks cannot exceed maximum marks for ${classSubject.subject.subjectTitle}`,
            );
        }

        preparedSubjects.push({
            slug: randomUUID(),
            classSubjectSlug:
                classSubject.slug,
            streamSlug,
            studyMode:
                subject.studyMode ||
                classSubject.studyType ||
                null,
            maxMarks:
                subject.maxMarks,
            minMarks:
                subject.minMarks,
            testDate,
            testTime:
                subject.testTime,
            duration:
                subject.duration,
            questionPaper:
                subject.questionPaper ||
                null,
        });
    }

    const existingConfiguration =
        await getPeriodicTestClassConfigurationRepo({
            schoolSlug: school.slug,
            periodicTestSlug:
                payload.periodicTestSlug,
            classSlug:
                payload.classSlug,
        });

    const saved =
        await savePeriodicTestTimeTableRepo({
            schoolSlug: school.slug,
            periodicTestSlug:
                payload.periodicTestSlug,
            classSlug:
                payload.classSlug,
            configurationSlug:
                existingConfiguration?.slug ||
                randomUUID(),
            publishResult:
                payload.publishResult,
            subjects:
                preparedSubjects,
        });

    return formatPeriodicTestConfiguration(
        saved,
    );
};

export const deletePeriodicTestTimeTableService = async (
    periodicTestSlug,
    classSlug,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const deleted =
        await deletePeriodicTestTimeTableRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
            classSlug,
        });

    if (!deleted) {
        throw new Error(
            "Periodic test timetable configuration not found",
        );
    }

    return deleted;
};

export const restorePeriodicTestTimeTableService = async (
    periodicTestSlug,
    classSlug,
    user,
) => {
    const school =
        await resolvePeriodicTestSchool(user);

    const restored =
        await restorePeriodicTestTimeTableRepo({
            schoolSlug: school.slug,
            periodicTestSlug,
            classSlug,
        });

    if (!restored) {
        throw new Error(
            "Periodic test timetable configuration not found",
        );
    }

    return restored;
};