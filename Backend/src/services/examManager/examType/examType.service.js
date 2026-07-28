import { randomUUID } from "crypto";

import {
    findSchoolByCodeRepo,
    findExamTypeByNameRepo,
    createExamTypeRepo,
    getExamTypesRepo,
    getExamTypeBySlugRepo,
    updateExamTypeRepo,
    deleteExamTypeRepo,
    restoreExamTypeRepo,
} from "../../../repositories/examManager/examType/examType.repository.js";

const resolveSchool = async (user) => {
    if (!user?.schoolCode) {
        throw new Error("School code not found in authenticated user");
    }

    const school = await findSchoolByCodeRepo(user.schoolCode);

    if (!school) {
        throw new Error("School not found");
    }

    return school;
};

export const createExamTypeService = async (payload, user) => {
    const school = await resolveSchool(user);

    const examType = payload.examType.trim();

    const existingExamType = await findExamTypeByNameRepo({
        schoolSlug: school.slug,
        examType,
    });

    if (existingExamType) {
        if (!existingExamType.isActive) {
            throw new Error(
                "This exam type already exists but is inactive. Please restore it.",
            );
        }

        throw new Error("Exam type already exists");
    }

    return createExamTypeRepo({
        slug: randomUUID(),
        schoolSlug: school.slug,
        examType,
        description: payload.description?.trim() || null,
        status: "active",
        isActive: true,
        deletedAt: null,
    });
};

export const getExamTypesService = async (
    query,
    user,
) => {
    const school = await resolveSchool(user);

    return getExamTypesRepo({
        schoolSlug: school.slug,
        status: query.status || "all",
        search: query.search?.trim() || "",
    });
};

export const getExamTypeBySlugService = async (
    slug,
    user,
) => {
    const school = await resolveSchool(user);

    const examType = await getExamTypeBySlugRepo({
        slug,
        schoolSlug: school.slug,
    });

    if (!examType) {
        throw new Error("Exam type not found");
    }

    return examType;
};

export const updateExamTypeService = async (
    slug,
    payload,
    user,
) => {
    const school = await resolveSchool(user);

    const existingExamType =
        await getExamTypeBySlugRepo({
            slug,
            schoolSlug: school.slug,
        });

    if (!existingExamType) {
        throw new Error("Exam type not found");
    }

    if (!existingExamType.isActive) {
        throw new Error(
            "Inactive exam type cannot be updated. Please restore it first.",
        );
    }

    if (payload.examType !== undefined) {
        const examTypeName = payload.examType.trim();

        const duplicateExamType =
            await findExamTypeByNameRepo({
                schoolSlug: school.slug,
                examType: examTypeName,
                excludeSlug: slug,
            });

        if (duplicateExamType) {
            throw new Error("Exam type already exists");
        }
    }

    const updateData = {};

    if (payload.examType !== undefined) {
        updateData.examType = payload.examType.trim();
    }

    if (payload.description !== undefined) {
        updateData.description =
            payload.description?.trim() || null;
    }

    return updateExamTypeRepo({
        slug,
        data: updateData,
    });
};

export const deleteExamTypeService = async (
    slug,
    user,
) => {
    const school = await resolveSchool(user);

    const existingExamType =
        await getExamTypeBySlugRepo({
            slug,
            schoolSlug: school.slug,
        });

    if (!existingExamType) {
        throw new Error("Exam type not found");
    }

    if (!existingExamType.isActive) {
        throw new Error("Exam type is already inactive");
    }

    return deleteExamTypeRepo({
        slug,
    });
};

export const restoreExamTypeService = async (
    slug,
    user,
) => {
    const school = await resolveSchool(user);

    const existingExamType =
        await getExamTypeBySlugRepo({
            slug,
            schoolSlug: school.slug,
        });

    if (!existingExamType) {
        throw new Error("Exam type not found");
    }

    if (existingExamType.isActive) {
        throw new Error("Exam type is already active");
    }

    const duplicateExamType =
        await findExamTypeByNameRepo({
            schoolSlug: school.slug,
            examType: existingExamType.examType,
            excludeSlug: slug,
        });

    if (duplicateExamType) {
        throw new Error(
            "Another active exam type with this name already exists",
        );
    }

    return restoreExamTypeRepo({
        slug,
    });
};