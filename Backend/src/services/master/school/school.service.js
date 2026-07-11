import crypto from "crypto";

import {
    createSchoolRepo,
    getSchoolsRepo,
    getSchoolBySlugRepo,
    getSchoolByCodeRepo,
    findSchoolCodeForUpdateRepo,
    updateSchoolRepo,
    deleteSchoolRepo,
    restoreSchoolRepo,
} from "../../../repositories/master/school/school.repository.js";

import { deleteFile } from "../../../utils/deleteFile.js";

const normalizeSchoolData = (data) => {
    const normalizedData = {
        ...data,
    };

    if (normalizedData.schoolCode) {
        normalizedData.schoolCode = normalizedData.schoolCode
            .trim()
            .toUpperCase();
    }

    if (normalizedData.contactEmail) {
        normalizedData.contactEmail = normalizedData.contactEmail
            .trim()
            .toLowerCase();
    }

    if (normalizedData.website === "") {
        normalizedData.website = null;
    }

    return normalizedData;
};

export const createSchoolService = async (payload, file) => {
    const data = normalizeSchoolData(payload);

    const existingSchool = await getSchoolByCodeRepo(data.schoolCode);

    if (existingSchool) {
        if (file) {
            deleteFile(`/uploads/schoolLogo/${file.filename}`);
        }

        throw new Error("School code already exists");
    }

    const logo = file
        ? `/uploads/schoolLogo/${file.filename}`
        : null;

    return createSchoolRepo({
        slug: crypto.randomUUID(),
        ...data,
        logo,
        status: "active",
        isActive: true,
        deletedAt: null,
    });
};

export const getSchoolsService = async () => {
    return getSchoolsRepo();
};

export const getSchoolBySlugService = async (slug) => {
    const school = await getSchoolBySlugRepo(slug);

    if (!school) {
        throw new Error("School not found");
    }

    return school;
};

export const getMySchoolService = async (user) => {
    if (!user?.schoolSlug) {
        throw new Error("School is not assigned to this user");
    }

    const school = await getSchoolBySlugRepo(user.schoolSlug);

    if (!school) {
        throw new Error("School not found");
    }

    return school;
};

export const updateSchoolService = async (
    slug,
    payload,
    file,
) => {
    const existingSchool = await getSchoolBySlugRepo(slug);

    if (!existingSchool) {
        if (file) {
            deleteFile(`/uploads/schoolLogo/${file.filename}`);
        }

        throw new Error("School not found");
    }

    const data = normalizeSchoolData(payload);

    if (data.schoolCode) {
        const duplicateSchool = await findSchoolCodeForUpdateRepo(
            data.schoolCode,
            slug,
        );

        if (duplicateSchool) {
            if (file) {
                deleteFile(`/uploads/schoolLogo/${file.filename}`);
            }

            throw new Error("School code already exists");
        }
    }

    if (file) {
        data.logo = `/uploads/schoolLogo/${file.filename}`;
    }

    const updatedSchool = await updateSchoolRepo(slug, data);

    if (file && existingSchool.logo) {
        deleteFile(existingSchool.logo);
    }

    return updatedSchool;
};

export const updateMySchoolService = async (
    payload,
    file,
    user,
) => {
    if (!user?.schoolSlug) {
        if (file) {
            deleteFile(`/uploads/schoolLogo/${file.filename}`);
        }

        throw new Error("School is not assigned to this user");
    }

    return updateSchoolService(
        user.schoolSlug,
        payload,
        file,
    );
};

export const deleteSchoolService = async (slug) => {
    const school = await getSchoolBySlugRepo(slug);

    if (!school) {
        throw new Error("School not found");
    }

    if (!school.isActive) {
        throw new Error("School is already inactive");
    }

    return deleteSchoolRepo(slug);
};

export const restoreSchoolService = async (slug) => {
    const school = await getSchoolBySlugRepo(slug);

    if (!school) {
        throw new Error("School not found");
    }

    if (school.isActive) {
        throw new Error("School is already active");
    }

    return restoreSchoolRepo(slug);
};