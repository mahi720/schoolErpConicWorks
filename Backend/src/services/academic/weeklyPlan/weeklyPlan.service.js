import { randomUUID } from "crypto";

import {
    findWeeklyPlanSessionRepo,
    findWeeklyPlanClassRepo,
    findWeeklyPlanClassSubjectRepo,
    findWeeklyPlanSectionRepo,
    findWeeklyPlanTeacherRepo,
    findDuplicateWeeklyPlanRepo,
    createWeeklyPlanRepo,
    getWeeklyPlansRepo,
    getWeeklyPlanBySlugRepo,
    updateWeeklyPlanRepo,
    deleteWeeklyPlanRepo,
    restoreWeeklyPlanRepo,
} from "../../../repositories/academic/weeklyPlan/weeklyPlan.repository.js";

const formatWeeklyPlan = (plan) => {
    if (!plan) return null;

    return {
        id: plan.id,
        slug: plan.slug,
        schoolSlug: plan.schoolSlug,

        sessionSlug: plan.sessionSlug,
        session: plan.session?.name || null,

        classSubjectSlug: plan.classSubjectSlug,
        classSlug: plan.classSubject?.class?.slug || null,
        classTitle: plan.classSubject?.class?.classTitle || null,

        subjectSlug: plan.classSubject?.subject?.slug || null,
        subject: plan.classSubject?.subject?.subjectName || null,

        sectionSlug: plan.sectionSlug,
        section: plan.section?.sectionTitle || null,

        userSlug: plan.userSlug,
        createdBy: plan.user?.name || null,

        teacherSlug: plan.teacherSlug,

        fromDate: plan.fromDate,
        toDate: plan.toDate,

        topic: plan.topic,
        subTopic: plan.subTopic,
        introductionAids: plan.introductionAids,
        introductionActivity: plan.introductionActivity,
        learningObjective: plan.learningObjective,
        numberOfPeriods: plan.numberOfPeriods,

        lessons:
            plan.lessons?.map((lesson) => ({
                id: lesson.id,
                slug: lesson.slug,
                lessonOrder: lesson.lessonOrder,
                day: lesson.day,
                teachingMethodology: lesson.teachingMethodology,
                studentActivities: lesson.studentActivities,
                assessment: lesson.assessment,
                status: lesson.status,
                isActive: lesson.isActive,
                deletedAt: lesson.deletedAt,
                createdAt: lesson.createdAt,
                updatedAt: lesson.updatedAt,
            })) || [],

        status: plan.status,
        isActive: plan.isActive,
        deletedAt: plan.deletedAt,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    };
};

const resolveWeeklyPlanRelations = async ({
    schoolSlug,
    sessionName,
    classTitle,
    subjectName,
    sectionTitle,
    teacherSlug,
}) => {
    const session = await findWeeklyPlanSessionRepo(
        schoolSlug,
        sessionName,
    );

    if (!session) {
        throw new Error("Selected session not found");
    }

    const classData = await findWeeklyPlanClassRepo({
        schoolSlug,
        sessionSlug: session.slug,
        classTitle,
    });

    if (!classData) {
        throw new Error("Selected class not found");
    }

    const classSubject = await findWeeklyPlanClassSubjectRepo({
        schoolSlug,
        classSlug: classData.slug,
        subjectName,
    });

    if (!classSubject) {
        throw new Error("Selected subject is not assigned to this class");
    }

    const section = await findWeeklyPlanSectionRepo({
        schoolSlug,
        sectionTitle,
    });

    if (!section) {
        throw new Error("Selected section not found");
    }

    let teacher = null;

    if (teacherSlug) {
        teacher = await findWeeklyPlanTeacherRepo({
            schoolSlug,
            teacherSlug,
        });

        if (!teacher) {
            throw new Error("Selected teacher not found");
        }
    }

    return {
        session,
        classData,
        classSubject,
        section,
        teacher,
    };
};

// Create weekly plan
export const createWeeklyPlanService = async ({
    schoolSlug,
    userSlug,
    payload,
}) => {
    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    if (!userSlug) {
        throw new Error("Logged-in user information not found");
    }

    const relations = await resolveWeeklyPlanRelations({
        schoolSlug,
        sessionName: payload.session,
        classTitle: payload.classTitle,
        subjectName: payload.subject,
        sectionTitle: payload.section,
        teacherSlug: payload.teacherSlug,
    });

    const fromDate = new Date(payload.fromDate);
    const toDate = new Date(payload.toDate);

    if (toDate < fromDate) {
        throw new Error("To date cannot be before from date");
    }

    const finalTeacherSlug = relations.teacher?.slug || null;

    const duplicate = await findDuplicateWeeklyPlanRepo({
        teacherSlug: finalTeacherSlug,
        classSubjectSlug: relations.classSubject.slug,
        sectionSlug: relations.section.slug,
        fromDate,
        toDate,
    });

    if (duplicate) {
        throw new Error(
            "Weekly plan already exists for this teacher, subject, section and date range",
        );
    }

    const lessons = payload.lessons.map((lesson, index) => ({
        slug: randomUUID(),
        schoolSlug,
        lessonOrder: lesson.lessonOrder ?? index + 1,
        day: lesson.day,
        teachingMethodology: lesson.teachingMethodology,
        studentActivities: lesson.studentActivities,
        assessment: lesson.assessment,
    }));

    const createdPlan = await createWeeklyPlanRepo({
        weeklyPlanData: {
            slug: randomUUID(),
            schoolSlug,
            sessionSlug: relations.session.slug,
            classSubjectSlug: relations.classSubject.slug,
            sectionSlug: relations.section.slug,
            userSlug,
            teacherSlug: finalTeacherSlug,
            fromDate,
            toDate,
            topic: payload.topic,
            subTopic: payload.subTopic || null,
            introductionAids: payload.introductionAids || null,
            introductionActivity: payload.introductionActivity || null,
            learningObjective: payload.learningObjective || null,
            numberOfPeriods: payload.numberOfPeriods,
        },

        lessons,
    });

    return formatWeeklyPlan(createdPlan);
};

// Get weekly plans
export const getWeeklyPlansService = async ({
    schoolSlug,
    query,
}) => {
    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    let sessionSlug;
    let classSubjectSlug;
    let sectionSlug;

    if (query.session) {
        const session = await findWeeklyPlanSessionRepo(
            schoolSlug,
            query.session,
        );

        if (!session) {
            return [];
        }

        sessionSlug = session.slug;
    }

    if (query.classTitle && query.subject) {
        if (!sessionSlug) {
            throw new Error("Session is required with class and subject filters");
        }

        const classData = await findWeeklyPlanClassRepo({
            schoolSlug,
            sessionSlug,
            classTitle: query.classTitle,
        });

        if (!classData) {
            return [];
        }

        const classSubject = await findWeeklyPlanClassSubjectRepo({
            schoolSlug,
            classSlug: classData.slug,
            subjectName: query.subject,
        });

        if (!classSubject) {
            return [];
        }

        classSubjectSlug = classSubject.slug;
    }

    if (query.section) {
        const section = await findWeeklyPlanSectionRepo({
            schoolSlug,
            sectionTitle: query.section,
        });

        if (!section) {
            return [];
        }

        sectionSlug = section.slug;
    }

    const plans = await getWeeklyPlansRepo({
        schoolSlug,
        sessionSlug,
        classSubjectSlug,
        sectionSlug,
        teacherSlug: query.teacherSlug,
        status: query.status || "active",
        fromDate: query.fromDate,
        toDate: query.toDate,
    });

    return plans.map(formatWeeklyPlan);
};

// Get weekly plan by slug
export const getWeeklyPlanBySlugService = async ({
    slug,
    schoolSlug,
}) => {
    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const plan = await getWeeklyPlanBySlugRepo(slug, schoolSlug);

    if (!plan) {
        throw new Error("Weekly plan not found");
    }

    return formatWeeklyPlan(plan);
};

// Update weekly plan
export const updateWeeklyPlanService = async ({
    slug,
    schoolSlug,
    userSlug,
    payload,
}) => {
    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const existingPlan = await getWeeklyPlanBySlugRepo(slug, schoolSlug);

    if (!existingPlan) {
        throw new Error("Weekly plan not found");
    }

    const sessionName = payload.session || existingPlan.session?.name;
    const classTitle =
        payload.classTitle ||
        existingPlan.classSubject?.class?.classTitle;
    const subjectName =
        payload.subject ||
        existingPlan.classSubject?.subject?.subjectName;
    const sectionTitle = payload.section || existingPlan.section?.sectionTitle;

    const relations = await resolveWeeklyPlanRelations({
        schoolSlug,
        sessionName,
        classTitle,
        subjectName,
        sectionTitle,
        teacherSlug:
            payload.teacherSlug !== undefined
                ? payload.teacherSlug
                : existingPlan.teacherSlug,
    });

    const fromDate = payload.fromDate
        ? new Date(payload.fromDate)
        : existingPlan.fromDate;

    const toDate = payload.toDate
        ? new Date(payload.toDate)
        : existingPlan.toDate;

    if (toDate < fromDate) {
        throw new Error("To date cannot be before from date");
    }

    const finalTeacherSlug = relations.teacher?.slug || null;

    const duplicate = await findDuplicateWeeklyPlanRepo({
        teacherSlug: finalTeacherSlug,
        classSubjectSlug: relations.classSubject.slug,
        sectionSlug: relations.section.slug,
        fromDate,
        toDate,
        excludeSlug: slug,
    });

    if (duplicate) {
        throw new Error(
            "Weekly plan already exists for this teacher, subject, section and date range",
        );
    }

    const weeklyPlanData = {
        sessionSlug: relations.session.slug,
        classSubjectSlug: relations.classSubject.slug,
        sectionSlug: relations.section.slug,
        teacherSlug: finalTeacherSlug,
        userSlug: userSlug || existingPlan.userSlug,
        fromDate,
        toDate,
        topic: payload.topic ?? existingPlan.topic,
        subTopic:
            payload.subTopic !== undefined
                ? payload.subTopic || null
                : existingPlan.subTopic,
        introductionAids:
            payload.introductionAids !== undefined
                ? payload.introductionAids || null
                : existingPlan.introductionAids,
        introductionActivity:
            payload.introductionActivity !== undefined
                ? payload.introductionActivity || null
                : existingPlan.introductionActivity,
        learningObjective:
            payload.learningObjective !== undefined
                ? payload.learningObjective || null
                : existingPlan.learningObjective,
        numberOfPeriods:
            payload.numberOfPeriods ?? existingPlan.numberOfPeriods,
    };

    const lessons = payload.lessons
        ? payload.lessons.map((lesson, index) => ({
            slug: randomUUID(),
            schoolSlug,
            lessonOrder: lesson.lessonOrder ?? index + 1,
            day: lesson.day,
            teachingMethodology: lesson.teachingMethodology,
            studentActivities: lesson.studentActivities,
            assessment: lesson.assessment,
        }))
        : undefined;

    const updatedPlan = await updateWeeklyPlanRepo({
        slug,
        schoolSlug,
        weeklyPlanData,
        lessons,
    });

    return formatWeeklyPlan(updatedPlan);
};

// Delete weekly plan
export const deleteWeeklyPlanService = async ({
    slug,
    schoolSlug,
}) => {
    const existingPlan = await getWeeklyPlanBySlugRepo(slug, schoolSlug);

    if (!existingPlan) {
        throw new Error("Weekly plan not found");
    }

    if (!existingPlan.isActive) {
        throw new Error("Weekly plan is already inactive");
    }

    const deletedPlan = await deleteWeeklyPlanRepo(slug, schoolSlug);

    return formatWeeklyPlan(deletedPlan);
};

// Restore weekly plan
export const restoreWeeklyPlanService = async ({
    slug,
    schoolSlug,
}) => {
    const existingPlan = await getWeeklyPlanBySlugRepo(slug, schoolSlug);

    if (!existingPlan) {
        throw new Error("Weekly plan not found");
    }

    if (existingPlan.isActive) {
        throw new Error("Weekly plan is already active");
    }

    const restoredPlan = await restoreWeeklyPlanRepo(slug, schoolSlug);

    return formatWeeklyPlan(restoredPlan);
};