import crypto from "crypto";

import {
    findStudentBySlugRepo,
    findHealthSessionByNameRepo,
    findStudentAcademicMappingRepo,
    findHealthAssessmentDuplicateRepo,
    createHealthAssessmentRepo,
    findHealthAssessmentBySlugRepo,
    findHealthAssessmentByStudentRepo,
    updateHealthAssessmentRepo,
    deleteHealthAssessmentRepo,
    restoreHealthAssessmentRepo,
} from "../../../repositories/academic/studentHealthManagement/studentHealthAssessment.repository.js";

export const createStudentHealthAssessmentService = async (
    payload,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const { studentSlug, academicYear, ...assessmentData } =
        payload;

    const student = await findStudentBySlugRepo(
        schoolSlug,
        studentSlug,
    );

    if (!student) {
        throw new Error("Student not found");
    }

    const session = await findHealthSessionByNameRepo(
        schoolSlug,
        academicYear,
    );

    if (!session) {
        throw new Error("Academic year not found");
    }

    const academicMapping =
        await findStudentAcademicMappingRepo({
            schoolSlug,
            studentSlug,
            sessionSlug: session.slug,
        });

    if (!academicMapping) {
        throw new Error(
            "Student is not mapped in this academic year",
        );
    }

    const existingAssessment =
        await findHealthAssessmentDuplicateRepo({
            schoolSlug,
            studentSlug,
            sessionSlug: session.slug,
        });

    if (existingAssessment) {
        throw new Error(
            "Health assessment already exists for this academic year",
        );
    }

    return createHealthAssessmentRepo({
        slug: crypto.randomUUID(),
        schoolSlug,
        studentSlug,
        sessionSlug: session.slug,
        ...assessmentData,
    });
};

export const getStudentHealthAssessmentBySlugService = async (
    slug,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const assessment =
        await findHealthAssessmentBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!assessment) {
        throw new Error("Health assessment not found");
    }

    return assessment;
};

export const getStudentHealthAssessmentByStudentService =
    async (query, authUser) => {
        const schoolSlug = authUser?.schoolSlug;
        const { studentSlug, academicYear } = query;

        if (!schoolSlug) {
            throw new Error("School information not found");
        }

        if (!studentSlug) {
            throw new Error("Student is required");
        }

        if (!academicYear) {
            throw new Error("Academic year is required");
        }

        const session = await findHealthSessionByNameRepo(
            schoolSlug,
            academicYear,
        );

        if (!session) {
            throw new Error("Academic year not found");
        }

        return findHealthAssessmentByStudentRepo({
            schoolSlug,
            studentSlug,
            sessionSlug: session.slug,
        });
    };

export const updateStudentHealthAssessmentService = async (
    slug,
    payload,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const existingAssessment =
        await findHealthAssessmentBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!existingAssessment) {
        throw new Error("Health assessment not found");
    }

    return updateHealthAssessmentRepo(slug, payload);
};

export const deleteStudentHealthAssessmentService = async (
    slug,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    const existingAssessment =
        await findHealthAssessmentBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!existingAssessment) {
        throw new Error("Health assessment not found");
    }

    if (!existingAssessment.isActive) {
        throw new Error("Health assessment is already inactive");
    }

    return deleteHealthAssessmentRepo(slug);
};

export const restoreStudentHealthAssessmentService = async (
    slug,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    const existingAssessment =
        await findHealthAssessmentBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!existingAssessment) {
        throw new Error("Health assessment not found");
    }

    if (existingAssessment.isActive) {
        throw new Error("Health assessment is already active");
    }

    return restoreHealthAssessmentRepo(slug);
};