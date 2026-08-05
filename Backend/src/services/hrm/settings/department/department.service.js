import { randomUUID } from "crypto";

import {
    createDepartmentRepo,
    findDepartmentByNameRepo,
    getDepartmentsRepo,
    getDepartmentBySlugRepo,
    updateDepartmentRepo,
    deleteDepartmentRepo,
    restoreDepartmentRepo,
} from "../../../../repositories/hrm/settings/department/department.repository.js";

export const createDepartmentService = async ({
    schoolSlug,
    payload,
}) => {
    const departmentName = payload.departmentName
        .trim()
        .toUpperCase();

    const existingDepartment = await findDepartmentByNameRepo({
        schoolSlug,
        departmentName,
    });

    if (existingDepartment) {
        throw new Error("Department already exists");
    }

    return createDepartmentRepo({
        slug: randomUUID(),
        schoolSlug,
        departmentName,
    });
};

export const getDepartmentsService = async ({
    schoolSlug,
    query,
}) => {
    return getDepartmentsRepo({
        schoolSlug,
        status: query.status,
        search: query.search?.trim(),
    });
};

export const getDepartmentBySlugService = async ({
    schoolSlug,
    slug,
}) => {
    const department = await getDepartmentBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!department) {
        throw new Error("Department not found");
    }

    return department;
};

export const updateDepartmentService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const department = await getDepartmentBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!department) {
        throw new Error("Department not found");
    }

    const departmentName = payload.departmentName
        .trim()
        .toUpperCase();

    const duplicateDepartment =
        await findDepartmentByNameRepo({
            schoolSlug,
            departmentName,
            excludeSlug: slug,
        });

    if (duplicateDepartment) {
        throw new Error("Department already exists");
    }

    return updateDepartmentRepo({
        slug,
        data: {
            departmentName,
        },
    });
};

export const deleteDepartmentService = async ({
    schoolSlug,
    slug,
}) => {
    const department = await getDepartmentBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!department) {
        throw new Error("Department not found");
    }

    if (!department.isActive) {
        throw new Error("Department is already inactive");
    }

    return deleteDepartmentRepo({
        slug,
    });
};

export const restoreDepartmentService = async ({
    schoolSlug,
    slug,
}) => {
    const department = await getDepartmentBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!department) {
        throw new Error("Department not found");
    }

    if (department.isActive) {
        throw new Error("Department is already active");
    }

    return restoreDepartmentRepo({
        slug,
    });
};