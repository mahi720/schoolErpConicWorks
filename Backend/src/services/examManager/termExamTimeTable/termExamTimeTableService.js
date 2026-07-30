import { randomUUID } from "crypto";

import {
    findSchoolByCodeRepo,
    findSessionByNameRepo,
    findBoardByTitleRepo,
    findExamTypeByTitleRepo,
    findDuplicateTermExamRepo,
    createTermExamRepo,
    getTermExamsRepo,
    findTermExamBySlugRepo,
    updateTermExamRepo,
    deleteTermExamRepo,
    restoreTermExamRepo,
    findClassBySlugRepo,
    findClassSubjectBySlugRepo,
    findStreamBySlugRepo,
    getTermExamClassConfigurationRepo,
    saveTermExamTimeTableRepo,
    deleteTermExamTimeTableRepo,
    restoreTermExamTimeTableRepo,
} from "../../../repositories/examManager/termExamTimeTable/termExamTimeTableRepository.js";

const getSchoolSlug = async (
    user,
) => {
    if (user?.schoolSlug) {
        return user.schoolSlug;
    }

    if (!user?.schoolCode) {
        throw new Error(
            "School information not found",
        );
    }

    const school =
        await findSchoolByCodeRepo(
            user.schoolCode,
        );

    if (!school) {
        throw new Error(
            "School not found",
        );
    }

    return school.slug;
};

const resolveTermExamRelations =
    async ({
        schoolSlug,
        session,
        board,
        examType,
    }) => {
        const sessionData =
            await findSessionByNameRepo({
                schoolSlug,
                session,
            });

        if (!sessionData) {
            throw new Error(
                "Academic session not found",
            );
        }

        const boardData =
            await findBoardByTitleRepo({
                schoolSlug,
                board,
            });

        if (!boardData) {
            throw new Error(
                "Board not found",
            );
        }

        const examTypeData =
            await findExamTypeByTitleRepo({
                schoolSlug,
                examType,
            });

        if (!examTypeData) {
            throw new Error(
                "Exam type not found",
            );
        }

        return {
            sessionData,
            boardData,
            examTypeData,
        };
    };

const formatTermExam = (
    item,
) => {
    if (!item) {
        return null;
    }

    const activeConfigurations =
        Array.isArray(
            item.termExamClassConfigurations,
        )
            ? item.termExamClassConfigurations.filter(
                (configuration) =>
                    configuration.isActive !==
                    false,
            )
            : [];

    const publishResult =
        activeConfigurations.length >
        0 &&
        activeConfigurations.every(
            (configuration) =>
                configuration.publishResult ===
                true,
        );

    return {
        ...item,
        sessionName:
            item.session?.name || "",
        boardTitle:
            item.board?.title || "",
        examTypeTitle:
            item.examType?.examType ||
            "",
        publishResult,
        termExamClassConfigurations:
            undefined,
    };
};

const formatConfiguration = (
    configuration,
) => {
    if (!configuration) {
        return null;
    }

    const subjects = Array.isArray(
        configuration.timeTables,
    )
        ? configuration.timeTables.map(
            (item) => ({
                slug:
                    item.slug,

                classSubjectSlug:
                    item.classSubjectSlug,

                subjectSlug:
                    item.classSubject
                        ?.subject?.slug ||
                    null,

                subjectTitle:
                    item.classSubject
                        ?.subject
                        ?.subjectTitle ||
                    "-",

                subjectType:
                    item.classSubject
                        ?.subject
                        ?.subjectType ||
                    null,

                subjectOrder:
                    item.classSubject
                        ?.subject
                        ?.subjectOrder ||
                    0,

                studyType:
                    item.classSubject
                        ?.studyType ||
                    item.studyMode ||
                    null,

                studyMode:
                    item.studyMode ||
                    item.classSubject
                        ?.studyType ||
                    null,

                streamSlug:
                    item.streamSlug ||
                    item.classSubject
                        ?.stream?.slug ||
                    null,

                streamTitle:
                    item.stream?.StreamTitle ||
                    item.classSubject
                        ?.stream?.streamTitle ||
                    null,

                maxMarks:
                    item.maxMarks,

                minMarks:
                    item.minMarks,

                examDate:
                    item.examDate,

                examTime:
                    item.examTime,

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
            }),
        )
        : [];

    return {
        ...configuration,
        subjects,
        timeTables: undefined,
    };
};

export const createTermExamService =
    async (payload, user) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const {
            session,
            board,
            examType,
            examTitle,
            startDate,
            endDate,
        } = payload;

        const start =
            new Date(startDate);

        const end =
            new Date(endDate);

        if (start >= end) {
            throw new Error(
                "End date must be after start date",
            );
        }

        const {
            sessionData,
            boardData,
            examTypeData,
        } =
            await resolveTermExamRelations({
                schoolSlug,
                session,
                board,
                examType,
            });

        const duplicate =
            await findDuplicateTermExamRepo({
                schoolSlug,
                sessionSlug:
                    sessionData.slug,
                boardSlug:
                    boardData.slug,
                examTypeSlug:
                    examTypeData.slug,
                examTitle:
                    examTitle.trim(),
            });

        if (duplicate) {
            throw new Error(
                "Term exam already exists",
            );
        }

        const created =
            await createTermExamRepo({
                slug: randomUUID(),
                schoolSlug,
                sessionSlug:
                    sessionData.slug,
                boardSlug:
                    boardData.slug,
                examTypeSlug:
                    examTypeData.slug,
                examTitle:
                    examTitle.trim(),
                startDate: start,
                endDate: end,
                status: "active",
                isActive: true,
                deletedAt: null,
            });

        return formatTermExam(
            created,
        );
    };

export const getTermExamsService =
    async (query, user) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        let sessionSlug;
        let boardSlug;
        let examTypeSlug;

        if (query.session) {
            const session =
                await findSessionByNameRepo({
                    schoolSlug,
                    session:
                        query.session,
                });

            if (!session) {
                return [];
            }

            sessionSlug =
                session.slug;
        }

        if (query.board) {
            const board =
                await findBoardByTitleRepo({
                    schoolSlug,
                    board:
                        query.board,
                });

            if (!board) {
                return [];
            }

            boardSlug =
                board.slug;
        }

        if (query.examType) {
            const examType =
                await findExamTypeByTitleRepo({
                    schoolSlug,
                    examType:
                        query.examType,
                });

            if (!examType) {
                return [];
            }

            examTypeSlug =
                examType.slug;
        }

        const termExams =
            await getTermExamsRepo({
                schoolSlug,
                sessionSlug,
                boardSlug,
                examTypeSlug,
                status:
                    query.status,
            });

        return termExams.map(
            formatTermExam,
        );
    };

export const getTermExamBySlugService =
    async (slug, user) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const termExam =
            await findTermExamBySlugRepo({
                schoolSlug,
                termExamSlug:
                    slug,
            });

        if (!termExam) {
            throw new Error(
                "Term exam not found",
            );
        }

        return formatTermExam(
            termExam,
        );
    };

export const updateTermExamService =
    async (
        slug,
        payload,
        user,
    ) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const existing =
            await findTermExamBySlugRepo({
                schoolSlug,
                termExamSlug:
                    slug,
            });

        if (!existing) {
            throw new Error(
                "Term exam not found",
            );
        }

        const session =
            payload.session ||
            existing.session?.name;

        const board =
            payload.board ||
            existing.board?.title;

        const examType =
            payload.examType ||
            existing.examType
                ?.examType;

        const examTitle =
            payload.examTitle?.trim() ||
            existing.examTitle;

        const startDate =
            payload.startDate
                ? new Date(
                    payload.startDate,
                )
                : existing.startDate;

        const endDate =
            payload.endDate
                ? new Date(
                    payload.endDate,
                )
                : existing.endDate;

        if (
            startDate >= endDate
        ) {
            throw new Error(
                "End date must be after start date",
            );
        }

        const {
            sessionData,
            boardData,
            examTypeData,
        } =
            await resolveTermExamRelations({
                schoolSlug,
                session,
                board,
                examType,
            });

        const duplicate =
            await findDuplicateTermExamRepo({
                schoolSlug,
                sessionSlug:
                    sessionData.slug,
                boardSlug:
                    boardData.slug,
                examTypeSlug:
                    examTypeData.slug,
                examTitle,
                excludeSlug:
                    slug,
            });

        if (duplicate) {
            throw new Error(
                "Term exam already exists",
            );
        }

        const updated =
            await updateTermExamRepo({
                slug,
                data: {
                    sessionSlug:
                        sessionData.slug,
                    boardSlug:
                        boardData.slug,
                    examTypeSlug:
                        examTypeData.slug,
                    examTitle,
                    startDate,
                    endDate,
                },
            });

        return formatTermExam(
            updated,
        );
    };

export const deleteTermExamService =
    async (slug, user) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const deleted =
            await deleteTermExamRepo({
                schoolSlug,
                termExamSlug:
                    slug,
            });

        if (!deleted) {
            throw new Error(
                "Term exam not found",
            );
        }

        return formatTermExam(
            deleted,
        );
    };

export const restoreTermExamService =
    async (slug, user) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const restored =
            await restoreTermExamRepo({
                schoolSlug,
                termExamSlug:
                    slug,
            });

        if (!restored) {
            throw new Error(
                "Term exam not found",
            );
        }

        return formatTermExam(
            restored,
        );
    };

export const getTermExamTimeTableService =
    async ({
        termExamSlug,
        classSlug,
        user,
    }) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const termExam =
            await findTermExamBySlugRepo({
                schoolSlug,
                termExamSlug,
            });

        if (!termExam) {
            throw new Error(
                "Term exam not found",
            );
        }

        const classData =
            await findClassBySlugRepo({
                schoolSlug,
                classSlug,
            });

        if (!classData) {
            throw new Error(
                "Class not found",
            );
        }

        const configuration =
            await getTermExamClassConfigurationRepo({
                schoolSlug,
                termExamSlug,
                classSlug,
            });

        return {
            configuration:
                formatConfiguration(
                    configuration,
                ),
            termExam,
            class: classData,
        };
    };

export const saveTermExamTimeTableService =
    async (payload, user) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const {
            termExamSlug,
            classSlug,
            publishResult,
            subjects,
        } = payload;

        const termExam =
            await findTermExamBySlugRepo({
                schoolSlug,
                termExamSlug,
            });

        if (!termExam) {
            throw new Error(
                "Term exam not found",
            );
        }

        const classData =
            await findClassBySlugRepo({
                schoolSlug,
                classSlug,
            });

        if (
            !classData ||
            !classData.isActive
        ) {
            throw new Error(
                "Active class not found",
            );
        }

        const preparedSubjects =
            [];

        for (
            const subject of subjects
        ) {
            const classSubject =
                await findClassSubjectBySlugRepo({
                    schoolSlug,
                    sessionSlug:
                        classData.sessionSlug,
                    boardSlug:
                        classData.boardSlug,
                    classSlug,
                    classSubjectSlug:
                        subject.classSubjectSlug,
                });

            if (!classSubject) {
                throw new Error(
                    "Class subject not found",
                );
            }

            const streamSlug =
                subject.streamSlug ||
                classSubject.stream
                    ?.slug ||
                null;

            if (streamSlug) {
                const stream =
                    await findStreamBySlugRepo({
                        schoolSlug,
                        streamSlug,
                    });

                if (!stream) {
                    throw new Error(
                        "Stream not found",
                    );
                }
            }

            if (
                Number(
                    subject.minMarks,
                ) >
                Number(
                    subject.maxMarks,
                )
            ) {
                throw new Error(
                    "Minimum marks cannot exceed maximum marks",
                );
            }

            preparedSubjects.push({
                slug: randomUUID(),

                classSubjectSlug:
                    classSubject.slug,

                streamSlug,

                studyMode:
                    classSubject.studyType,

                maxMarks:
                    Number(
                        subject.maxMarks,
                    ),

                minMarks:
                    Number(
                        subject.minMarks,
                    ),

                examDate:
                    new Date(
                        subject.examDate,
                    ),

                examTime:
                    subject.examTime,

                duration:
                    Number(
                        subject.duration,
                    ),

                questionPaper:
                    subject.questionPaper ||
                    null,
            });
        }

        const saved =
            await saveTermExamTimeTableRepo({
                schoolSlug,
                termExamSlug,
                classSlug,
                configurationSlug:
                    randomUUID(),
                publishResult,
                subjects:
                    preparedSubjects,
            });

        return formatConfiguration(
            saved,
        );
    };

export const deleteTermExamTimeTableService =
    async ({
        termExamSlug,
        classSlug,
        user,
    }) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const deleted =
            await deleteTermExamTimeTableRepo({
                schoolSlug,
                termExamSlug,
                classSlug,
            });

        if (!deleted) {
            throw new Error(
                "Term exam timetable not found",
            );
        }

        return deleted;
    };

export const restoreTermExamTimeTableService =
    async ({
        termExamSlug,
        classSlug,
        user,
    }) => {
        const schoolSlug =
            await getSchoolSlug(
                user,
            );

        const restored =
            await restoreTermExamTimeTableRepo({
                schoolSlug,
                termExamSlug,
                classSlug,
            });

        if (!restored) {
            throw new Error(
                "Term exam timetable not found",
            );
        }

        return restored;
    };