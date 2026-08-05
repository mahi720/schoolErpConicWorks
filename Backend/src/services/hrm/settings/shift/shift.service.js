import { randomUUID } from "crypto";

import {
    createShiftRepo,
    findShiftDepartmentRepo,
    findDuplicateShiftRepo,
    getShiftsRepo,
    getShiftBySlugRepo,
    updateShiftRepo,
    deleteShiftRepo,
    restoreShiftRepo,
} from "../../../../repositories/hrm/settings/shift/shift.repository.js";

const convertTimeToDate = (time) => {
    return new Date(`1970-01-01T${time}:00.000Z`);
};

export const createShiftService = async ({
    schoolSlug,
    payload,
}) => {
    const department = await findShiftDepartmentRepo({
        schoolSlug,
        departmentSlug: payload.departmentSlug,
    });

    if (!department) {
        throw new Error("Active department not found");
    }

    const shiftName = payload.shiftName
        .trim()
        .toUpperCase();

    const shiftCode = payload.shiftCode
        .trim()
        .toUpperCase();

    const duplicate = await findDuplicateShiftRepo({
        schoolSlug,
        departmentSlug: payload.departmentSlug,
        shiftName,
        shiftCode,
    });

    if (duplicate) {
        throw new Error(
            "Shift name or code already exists in this department",
        );
    }

    return createShiftRepo({
        slug: randomUUID(),
        schoolSlug,
        departmentSlug: payload.departmentSlug,
        shiftName,
        shiftCode,
        loginTime: convertTimeToDate(payload.loginTime),
        loginBufferMinutes: payload.loginBufferMinutes,
        logoutTime: convertTimeToDate(payload.logoutTime),
        logoutBufferMinutes: payload.logoutBufferMinutes,
    });
};

export const getShiftsService = async ({
    schoolSlug,
    query,
}) => {
    return getShiftsRepo({
        schoolSlug,
        departmentSlug: query.departmentSlug,
        status: query.status,
    });
};

export const getShiftBySlugService = async ({
    schoolSlug,
    slug,
}) => {
    const shift = await getShiftBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!shift) {
        throw new Error("Shift not found");
    }

    return shift;
};

export const updateShiftService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const shift = await getShiftBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!shift) {
        throw new Error("Shift not found");
    }

    const departmentSlug =
        payload.departmentSlug || shift.departmentSlug;

    const department = await findShiftDepartmentRepo({
        schoolSlug,
        departmentSlug,
    });

    if (!department) {
        throw new Error("Active department not found");
    }

    const shiftName = payload.shiftName
        ? payload.shiftName.trim().toUpperCase()
        : shift.shiftName;

    const shiftCode = payload.shiftCode
        ? payload.shiftCode.trim().toUpperCase()
        : shift.shiftCode;

    const duplicate = await findDuplicateShiftRepo({
        schoolSlug,
        departmentSlug,
        shiftName,
        shiftCode,
        excludeSlug: slug,
    });

    if (duplicate) {
        throw new Error(
            "Shift name or code already exists in this department",
        );
    }

    return updateShiftRepo({
        slug,
        data: {
            departmentSlug,
            shiftName,
            shiftCode,
            ...(payload.loginTime !== undefined
                ? {
                    loginTime: convertTimeToDate(payload.loginTime),
                }
                : {}),
            ...(payload.loginBufferMinutes !== undefined
                ? {
                    loginBufferMinutes:
                        payload.loginBufferMinutes,
                }
                : {}),
            ...(payload.logoutTime !== undefined
                ? {
                    logoutTime: convertTimeToDate(payload.logoutTime),
                }
                : {}),
            ...(payload.logoutBufferMinutes !== undefined
                ? {
                    logoutBufferMinutes:
                        payload.logoutBufferMinutes,
                }
                : {}),
        },
    });
};

export const deleteShiftService = async ({
    schoolSlug,
    slug,
}) => {
    const shift = await getShiftBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!shift) {
        throw new Error("Shift not found");
    }

    return deleteShiftRepo({
        slug,
    });
};

export const restoreShiftService = async ({
    schoolSlug,
    slug,
}) => {
    const shift = await getShiftBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!shift) {
        throw new Error("Shift not found");
    }

    return restoreShiftRepo({
        slug,
    });
};