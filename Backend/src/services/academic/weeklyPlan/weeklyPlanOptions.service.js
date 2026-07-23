import {
    findWeeklyPlanBoardByTitleRepo,
    findWeeklyPlanClassBySlugRepo,
    findWeeklyPlanSchoolByCodeRepo,
    findWeeklyPlanSessionByNameRepo,
    getWeeklyPlanMappedClassesRepo,
    getWeeklyPlanSectionsByClassRepo,
    getWeeklyPlanSubjectsByClassRepo,
} from "../../../repositories/academic/weeklyPlan/weeklyPlanOptions.repository.js";

const normalizeRequiredValue = (value, fieldName) => {
    const normalizedValue =
        typeof value === "string" ? value.trim() : "";

    if (!normalizedValue) {
        throw new Error(`${fieldName} is required`);
    }

    return normalizedValue;
};

const resolveWeeklyPlanSchoolSlug = async ({
    authSchoolSlug,
    schoolCode,
}) => {
    const normalizedSchoolSlug =
        typeof authSchoolSlug === "string"
            ? authSchoolSlug.trim()
            : "";

    if (normalizedSchoolSlug) {
        return normalizedSchoolSlug;
    }

    const normalizedSchoolCode = normalizeRequiredValue(
        schoolCode,
        "School code",
    );

    const school = await findWeeklyPlanSchoolByCodeRepo(
        normalizedSchoolCode,
    );

    if (!school) {
        throw new Error("School not found");
    }

    return school.slug;
};

/* -------------------------------------------------------------------------- */
/*                                GET CLASSES                                 */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanClassesService = async ({
    authSchoolSlug,
    schoolCode,
    session,
    board,
}) => {
    const schoolSlug = await resolveWeeklyPlanSchoolSlug({
        authSchoolSlug,
        schoolCode,
    });

    const normalizedSession = normalizeRequiredValue(
        session,
        "Session",
    );

    const normalizedBoard = normalizeRequiredValue(
        board,
        "Board",
    );

    const sessionData =
        await findWeeklyPlanSessionByNameRepo({
            schoolSlug,
            sessionName: normalizedSession,
        });

    if (!sessionData) {
        throw new Error("Selected session not found");
    }

    const boardData =
        await findWeeklyPlanBoardByTitleRepo({
            schoolSlug,
            boardTitle: normalizedBoard,
        });

    if (!boardData) {
        throw new Error("Selected board not found");
    }

    const mappings =
        await getWeeklyPlanMappedClassesRepo({
            schoolSlug,
            sessionSlug: sessionData.slug,
            boardSlug: boardData.slug,
        });

    const uniqueClasses = new Map();

    mappings.forEach((mapping) => {
        const classData = mapping.class;

        if (!classData?.slug || !classData?.classTitle) {
            return;
        }

        if (!uniqueClasses.has(classData.slug)) {
            uniqueClasses.set(classData.slug, {
                slug: classData.slug,
                classSlug: classData.slug,
                classTitle: classData.classTitle,
                classType: classData.classType || null,
                status: classData.status,
                isActive: classData.isActive,
            });
        }
    });

    return Array.from(uniqueClasses.values());
};

/* -------------------------------------------------------------------------- */
/*                               GET SECTIONS                                 */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanSectionsService = async ({
    authSchoolSlug,
    schoolCode,
    classSlug,
}) => {
    const schoolSlug = await resolveWeeklyPlanSchoolSlug({
        authSchoolSlug,
        schoolCode,
    });

    const normalizedClassSlug = normalizeRequiredValue(
        classSlug,
        "Class slug",
    );

    const classData =
        await findWeeklyPlanClassBySlugRepo({
            schoolSlug,
            classSlug: normalizedClassSlug,
        });

    if (!classData) {
        throw new Error("Selected class not found");
    }

    const mappings =
        await getWeeklyPlanSectionsByClassRepo({
            schoolSlug,
            classSlug: normalizedClassSlug,
        });

    const uniqueSections = new Map();

    mappings.forEach((mapping) => {
        const sectionData = mapping.section;

        if (
            !sectionData?.slug ||
            !sectionData?.sectionTitle
        ) {
            return;
        }

        if (!uniqueSections.has(sectionData.slug)) {
            uniqueSections.set(sectionData.slug, {
                slug: sectionData.slug,
                sectionSlug: sectionData.slug,
                sectionTitle: sectionData.sectionTitle,
                status: sectionData.status,
                isActive: sectionData.isActive,
            });
        }
    });

    return Array.from(uniqueSections.values());
};

/* -------------------------------------------------------------------------- */
/*                               GET SUBJECTS                                 */
/* -------------------------------------------------------------------------- */

export const getWeeklyPlanSubjectsService = async ({
    authSchoolSlug,
    schoolCode,
    classSlug,
}) => {
    const schoolSlug = await resolveWeeklyPlanSchoolSlug({
        authSchoolSlug,
        schoolCode,
    });

    const normalizedClassSlug = normalizeRequiredValue(
        classSlug,
        "Class slug",
    );

    const classData =
        await findWeeklyPlanClassBySlugRepo({
            schoolSlug,
            classSlug: normalizedClassSlug,
        });

    if (!classData) {
        throw new Error("Selected class not found");
    }

    const classSubjects =
        await getWeeklyPlanSubjectsByClassRepo({
            schoolSlug,
            classSlug: normalizedClassSlug,
        });

    return classSubjects.map((item) => ({
        slug: item.slug,
        classSubjectSlug: item.slug,

        classSlug: item.classSlug,

        subjectSlug: item.subjectSlug,

        subjectTitle:
            item.subject?.subjectTitle || null,

        subject:
            item.subject?.subjectTitle || null,

        status: item.status,
        isActive: item.isActive,
    }));
};