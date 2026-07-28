import { randomUUID } from "node:crypto";

import {
    findWeeklyPlanSessionByNameRepo,
    findWeeklyPlanBoardByTitleRepo,
    findWeeklyPlanClassByTitleRepo,
    findWeeklyPlanClassMappingRepo,
    findWeeklyPlanSectionByTitleRepo,
    findWeeklyPlanUserByIdRepo,
    findDuplicateWeeklyPlanRepo,
    createWeeklyPlanRepo,
    getWeeklyPlansRepo,
    getWeeklyPlanBySlugRepo,
    getWeeklyPlanForUpdateRepo,
    updateWeeklyPlanRepo,
    deleteWeeklyPlanRepo,
    restoreWeeklyPlanRepo,
    getWeeklyPlanLessonBySlugRepo,
    deleteWeeklyPlanLessonRepo,
} from "../../../repositories/academic/weeklyPlan/weeklyPlan.repository.js";

const getSchoolSlug = (user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    return schoolSlug;
};

const normalizeSectionSlugs = (sectionSlugs) => {
    if (Array.isArray(sectionSlugs)) {
        return sectionSlugs;
    }

    if (typeof sectionSlugs === "string") {
        try {
            const parsedValue = JSON.parse(sectionSlugs);

            return Array.isArray(parsedValue)
                ? parsedValue
                : [];
        } catch {
            return [];
        }
    }

    return [];
};

const resolveWeeklyPlanRelations = async ({
    schoolSlug,
    sessionName,
    boardTitle,
    classTitle,
    sectionTitle,
}) => {
    const session =
        await findWeeklyPlanSessionByNameRepo(
            schoolSlug,
            sessionName,
        );

    if (!session) {
        throw new Error("Selected session not found");
    }

    const board =
        await findWeeklyPlanBoardByTitleRepo(
            schoolSlug,
            boardTitle,
        );

    if (!board) {
        throw new Error("Selected board not found");
    }

    const classData =
        await findWeeklyPlanClassByTitleRepo({
            schoolSlug,
            // sessionSlug: session.slug,
            boardSlug: board.slug,
            classTitle,
        });

    if (!classData) {
        throw new Error(
            "Selected class not found for this session and board",
        );
    }

    const classMapping =
        await findWeeklyPlanClassMappingRepo({
            schoolSlug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            classSlug: classData.slug,
        });

    if (!classMapping) {
        throw new Error(
            "Class section mapping not found",
        );
    }

    const sectionSlugs =
        normalizeSectionSlugs(
            classMapping.sectionSlugs,
        );

    if (sectionSlugs.length === 0) {
        throw new Error(
            "No sections are mapped with selected class",
        );
    }

    const section =
        await findWeeklyPlanSectionByTitleRepo({
            schoolSlug,
            sectionTitle,
            sectionSlugs,
        });

    if (!section) {
        throw new Error(
            "Selected section is not mapped with selected class",
        );
    }

    return {
        session,
        board,
        classData,
        section,
    };
};

export const createWeeklyPlanService = async (
    payload,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    const creator =
        await findWeeklyPlanUserByIdRepo(
            user.id,
        );

    if (!creator) {
        throw new Error("User not found");
    }

    const {
        session,
        board,
        classData,
        section,
    } = await resolveWeeklyPlanRelations({
        schoolSlug,
        sessionName: payload.session,
        boardTitle: payload.board,
        classTitle: payload.classTitle,
        sectionTitle:
            payload.sectionTitle,
    });

    const duplicate =
        await findDuplicateWeeklyPlanRepo({
            schoolSlug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            classSlug: classData.slug,
            sectionSlug: section.slug,
            fromDate: payload.fromDate,
            toDate: payload.toDate,
        });

    if (duplicate) {
        throw new Error(
            "Weekly plan already exists for selected class, section and date range",
        );
    }

    const weeklyPlanSlug =
        randomUUID();

    const lessons =
        payload.lessons.map(
            (lesson, index) => ({
                slug: randomUUID(),
                lessonOrder:
                    lesson.lessonOrder ||
                    index + 1,
                day: lesson.day,
                teachingMethodology:
                    lesson.teachingMethodology,
                studentActivities:
                    lesson.studentActivities,
                assessment:
                    lesson.assessment,
            }),
        );

    return createWeeklyPlanRepo({
        weeklyPlanData: {
            slug: weeklyPlanSlug,
            schoolSlug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            classSlug: classData.slug,
            sectionSlug: section.slug,
            userSlug: creator.slug,
            fromDate: payload.fromDate,
            toDate: payload.toDate,
            topic: payload.topic,
            subTopic:
                payload.subTopic || null,
            introductionAids:
                payload.introductionAids ||
                null,
            introductionActivity:
                payload.introductionActivity ||
                null,
            learningObjective:
                payload.learningObjective ||
                null,
            numberOfPeriods:
                lessons.length,
        },

        lessons,
    });
};

export const getWeeklyPlansService = async (
    query,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    let sessionSlug;
    let boardSlug;
    let classSlug;
    let sectionSlug;

    if (query.session) {
        const session =
            await findWeeklyPlanSessionByNameRepo(
                schoolSlug,
                query.session,
            );

        if (!session) {
            return [];
        }

        sessionSlug = session.slug;
    }

    if (query.board) {
        const board =
            await findWeeklyPlanBoardByTitleRepo(
                schoolSlug,
                query.board,
            );

        if (!board) {
            return [];
        }

        boardSlug = board.slug;
    }

    if (
        query.classTitle &&
        sessionSlug &&
        boardSlug
    ) {
        const classData =
            await findWeeklyPlanClassByTitleRepo({
                schoolSlug,
                sessionSlug,
                boardSlug,
                classTitle:
                    query.classTitle,
            });

        if (!classData) {
            return [];
        }

        classSlug = classData.slug;
    }

    if (
        query.sectionTitle &&
        sessionSlug &&
        boardSlug &&
        classSlug
    ) {
        const classMapping =
            await findWeeklyPlanClassMappingRepo({
                schoolSlug,
                sessionSlug,
                boardSlug,
                classSlug,
            });

        if (!classMapping) {
            return [];
        }

        const sectionSlugs =
            normalizeSectionSlugs(
                classMapping.sectionSlugs,
            );

        const section =
            await findWeeklyPlanSectionByTitleRepo({
                schoolSlug,
                sectionTitle:
                    query.sectionTitle,
                sectionSlugs,
            });

        if (!section) {
            return [];
        }

        sectionSlug = section.slug;
    }

    let fromDate;
    let toDate;

    if (query.fromDate) {
        fromDate = new Date(
            `${query.fromDate}T00:00:00.000Z`,
        );

        if (
            Number.isNaN(
                fromDate.getTime(),
            )
        ) {
            throw new Error(
                "Invalid from date",
            );
        }
    }

    if (query.toDate) {
        toDate = new Date(
            `${query.toDate}T23:59:59.999Z`,
        );

        if (
            Number.isNaN(
                toDate.getTime(),
            )
        ) {
            throw new Error(
                "Invalid to date",
            );
        }
    }

    return getWeeklyPlansRepo({
        schoolSlug,
        sessionSlug,
        boardSlug,
        classSlug,
        sectionSlug,
        status:
            query.status || "active",
        fromDate,
        toDate,
        search:
            query.search?.trim() ||
            undefined,
    });
};

export const getWeeklyPlanBySlugService = async (
    slug,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    const weeklyPlan =
        await getWeeklyPlanBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!weeklyPlan) {
        throw new Error(
            "Weekly plan not found",
        );
    }

    return weeklyPlan;
};

export const updateWeeklyPlanService = async (
    slug,
    payload,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    const existingWeeklyPlan =
        await getWeeklyPlanForUpdateRepo(
            slug,
            schoolSlug,
        );

    if (!existingWeeklyPlan) {
        throw new Error(
            "Weekly plan not found",
        );
    }

    if (!existingWeeklyPlan.isActive) {
        throw new Error(
            "Inactive weekly plan cannot be updated",
        );
    }

    const {
        session,
        board,
        classData,
        section,
    } = await resolveWeeklyPlanRelations({
        schoolSlug,
        sessionName: payload.session,
        boardTitle: payload.board,
        classTitle: payload.classTitle,
        sectionTitle:
            payload.sectionTitle,
    });

    const duplicate =
        await findDuplicateWeeklyPlanRepo({
            schoolSlug,
            sessionSlug: session.slug,
            boardSlug: board.slug,
            classSlug: classData.slug,
            sectionSlug: section.slug,
            fromDate: payload.fromDate,
            toDate: payload.toDate,
            excludeSlug: slug,
        });

    if (duplicate) {
        throw new Error(
            "Weekly plan already exists for selected class, section and date range",
        );
    }

    const existingLessonSlugs =
        new Set(
            existingWeeklyPlan.lessons.map(
                (lesson) => lesson.slug,
            ),
        );

    const duplicateLessonSlugs =
        payload.lessons
            .filter(
                (lesson) => lesson.slug,
            )
            .map(
                (lesson) => lesson.slug,
            );

    if (
        new Set(duplicateLessonSlugs)
            .size !==
        duplicateLessonSlugs.length
    ) {
        throw new Error(
            "Duplicate lesson found in request",
        );
    }

    for (const lesson of payload.lessons) {
        if (
            lesson.slug &&
            !existingLessonSlugs.has(
                lesson.slug,
            )
        ) {
            throw new Error(
                "Invalid lesson selected",
            );
        }
    }

    const lessons =
        payload.lessons.map(
            (lesson, index) => ({
                slug: lesson.slug,
                generatedSlug:
                    lesson.slug
                        ? undefined
                        : randomUUID(),
                lessonOrder:
                    lesson.lessonOrder ||
                    index + 1,
                day: lesson.day,
                teachingMethodology:
                    lesson.teachingMethodology,
                studentActivities:
                    lesson.studentActivities,
                assessment:
                    lesson.assessment,
            }),
        );

    return updateWeeklyPlanRepo({
        slug,
        schoolSlug,

        weeklyPlanData: {
            sessionSlug: session.slug,
            boardSlug: board.slug,
            classSlug: classData.slug,
            sectionSlug: section.slug,
            fromDate: payload.fromDate,
            toDate: payload.toDate,
            topic: payload.topic,
            subTopic:
                payload.subTopic || null,
            introductionAids:
                payload.introductionAids ||
                null,
            introductionActivity:
                payload.introductionActivity ||
                null,
            learningObjective:
                payload.learningObjective ||
                null,
            numberOfPeriods:
                lessons.length,
        },

        lessons,
    });
};

export const deleteWeeklyPlanService = async (
    slug,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    const weeklyPlan =
        await getWeeklyPlanBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!weeklyPlan) {
        throw new Error(
            "Weekly plan not found",
        );
    }

    if (!weeklyPlan.isActive) {
        throw new Error(
            "Weekly plan is already deleted",
        );
    }

    return deleteWeeklyPlanRepo({
        slug,
        schoolSlug,
    });
};

export const restoreWeeklyPlanService = async (
    slug,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    const weeklyPlan =
        await getWeeklyPlanBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!weeklyPlan) {
        throw new Error(
            "Weekly plan not found",
        );
    }

    if (weeklyPlan.isActive) {
        throw new Error(
            "Weekly plan is already active",
        );
    }

    return restoreWeeklyPlanRepo({
        slug,
        schoolSlug,
    });
};

export const deleteWeeklyPlanLessonService = async (
    weeklyPlanSlug,
    lessonSlug,
    user,
) => {
    const schoolSlug =
        getSchoolSlug(user);

    const weeklyPlan =
        await getWeeklyPlanBySlugRepo(
            weeklyPlanSlug,
            schoolSlug,
        );

    if (!weeklyPlan) {
        throw new Error(
            "Weekly plan not found",
        );
    }

    if (!weeklyPlan.isActive) {
        throw new Error(
            "Lesson cannot be deleted from inactive weekly plan",
        );
    }

    const lesson =
        await getWeeklyPlanLessonBySlugRepo({
            weeklyPlanSlug,
            lessonSlug,
            schoolSlug,
        });

    if (!lesson) {
        throw new Error(
            "Weekly plan lesson not found",
        );
    }

    if (!lesson.isActive) {
        throw new Error(
            "Weekly plan lesson is already deleted",
        );
    }

    const activeLessons =
        weeklyPlan.lessons?.filter(
            (item) =>
                item.isActive !== false,
        ) || [];

    if (activeLessons.length <= 1) {
        throw new Error(
            "Weekly plan must contain at least one active lesson",
        );
    }

    return deleteWeeklyPlanLessonRepo({
        weeklyPlanSlug,
        lessonSlug,
        schoolSlug,
    });
};