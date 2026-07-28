import crypto from "crypto";

import {
    findOtherInfoStudentBySlugRepo,
    findOtherInformationDuplicateRepo,
    createOtherInformationRepo,
    findOtherInformationBySlugRepo,
    findOtherInformationByStudentRepo,
    updateOtherInformationRepo,
    deleteOtherInformationRepo,
    restoreOtherInformationRepo,
} from "../../../repositories/academic/studentHealthManagement/studentOtherInformation.repository.js";

export const createStudentOtherInformationService = async (
    payload,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const { studentSlug, ...otherInformationData } = payload;

    const student =
        await findOtherInfoStudentBySlugRepo(
            schoolSlug,
            studentSlug,
        );

    if (!student) {
        throw new Error("Student not found");
    }

    const existingInformation =
        await findOtherInformationDuplicateRepo({
            schoolSlug,
            studentSlug,
        });

    if (existingInformation) {
        throw new Error(
            "Other information already exists for this student",
        );
    }

    return createOtherInformationRepo({
        slug: crypto.randomUUID(),
        schoolSlug,
        studentSlug,
        ...otherInformationData,
    });
};

export const getStudentOtherInformationBySlugService = async (
    slug,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School information not found");
    }

    const information =
        await findOtherInformationBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!information) {
        throw new Error("Student other information not found");
    }

    return information;
};

export const getStudentOtherInformationByStudentService =
    async (studentSlug, authUser) => {
        const schoolSlug = authUser?.schoolSlug;

        if (!schoolSlug) {
            throw new Error("School information not found");
        }

        if (!studentSlug) {
            throw new Error("Student is required");
        }

        return findOtherInformationByStudentRepo({
            schoolSlug,
            studentSlug,
        });
    };

export const updateStudentOtherInformationService = async (
    slug,
    payload,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    const existingInformation =
        await findOtherInformationBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!existingInformation) {
        throw new Error("Student other information not found");
    }

    return updateOtherInformationRepo(slug, payload);
};

export const deleteStudentOtherInformationService = async (
    slug,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    const existingInformation =
        await findOtherInformationBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!existingInformation) {
        throw new Error("Student other information not found");
    }

    if (!existingInformation.isActive) {
        throw new Error(
            "Student other information is already inactive",
        );
    }

    return deleteOtherInformationRepo(slug);
};

export const restoreStudentOtherInformationService = async (
    slug,
    authUser,
) => {
    const schoolSlug = authUser?.schoolSlug;

    const existingInformation =
        await findOtherInformationBySlugRepo(
            slug,
            schoolSlug,
        );

    if (!existingInformation) {
        throw new Error("Student other information not found");
    }

    if (existingInformation.isActive) {
        throw new Error(
            "Student other information is already active",
        );
    }

    return restoreOtherInformationRepo(slug);
};