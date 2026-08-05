import { randomUUID } from "crypto";

import {
    createDesignationRepo,
    findDesignationDepartmentRepo,
    findDuplicateDesignationRepo,
    getDesignationsRepo,
    getDesignationBySlugRepo,
    updateDesignationRepo,
    deleteDesignationRepo,
    restoreDesignationRepo,
} from "../../../../repositories/hrm/settings/designation/designation.repository.js";

export const createDesignationService = async ({
    schoolSlug,
    payload,
}) => {
    const department =
        await findDesignationDepartmentRepo({
            schoolSlug,
            departmentSlug: payload.departmentSlug,
        });

    if (!department) {
        throw new Error("Active department not found");
    }

    const designationName = payload.designationName
        .trim()
        .toUpperCase();

    const duplicate = await findDuplicateDesignationRepo({
        schoolSlug,
        departmentSlug: payload.departmentSlug,
        designationName,
        designationLevel: payload.designationLevel,
    });

    if (duplicate) {
        throw new Error(
            "Designation name or level already exists in this department",
        );
    }

    return createDesignationRepo({
        slug: randomUUID(),
        schoolSlug,
        departmentSlug: payload.departmentSlug,
        designationName,
        designationLevel: payload.designationLevel,
    });
};

export const getDesignationsService = async ({
    schoolSlug,
    query,
}) => {
    return getDesignationsRepo({
        schoolSlug,
        departmentSlug: query.departmentSlug,
        status: query.status,
        search: query.search?.trim(),
    });
};

export const getDesignationBySlugService = async ({
    schoolSlug,
    slug,
}) => {
    const designation = await getDesignationBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!designation) {
        throw new Error("Designation not found");
    }

    return designation;
};

export const updateDesignationService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const designation = await getDesignationBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!designation) {
        throw new Error("Designation not found");
    }

    const departmentSlug =
        payload.departmentSlug || designation.departmentSlug;

    const department =
        await findDesignationDepartmentRepo({
            schoolSlug,
            departmentSlug,
        });

    if (!department) {
        throw new Error("Active department not found");
    }

    const designationName = payload.designationName
        ? payload.designationName.trim().toUpperCase()
        : designation.designationName;

    const designationLevel =
        payload.designationLevel ?? designation.designationLevel;

    const duplicate = await findDuplicateDesignationRepo({
        schoolSlug,
        departmentSlug,
        designationName,
        designationLevel,
        excludeSlug: slug,
    });

    if (duplicate) {
        throw new Error(
            "Designation name or level already exists in this department",
        );
    }

    return updateDesignationRepo({
        slug,
        data: {
            departmentSlug,
            designationName,
            designationLevel,
        },
    });
};

export const deleteDesignationService = async ({
    schoolSlug,
    slug,
}) => {
    const designation = await getDesignationBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!designation) {
        throw new Error("Designation not found");
    }

    return deleteDesignationRepo({
        slug,
    });
};

export const restoreDesignationService = async ({
    schoolSlug,
    slug,
}) => {
    const designation = await getDesignationBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!designation) {
        throw new Error("Designation not found");
    }

    return restoreDesignationRepo({
        slug,
    });
};