import { randomUUID } from "crypto";

import {
    createBasicSettingsRepo,
    findBasicSettingDepartmentRepo,
    findBasicSettingShiftRepo,
    getBasicSettingsRepo,
    getBasicSettingBySlugRepo,
    updateBasicSettingRepo,
} from "../../../../repositories/hrm/settings/basicSetting/basicSetting.repository.js";

const normalizeWeekDay = (weekDay) => {
    return weekDay
        .trim()
        .toUpperCase()
        .replaceAll(" ", "_");
};

const verifyShift = async ({
    schoolSlug,
    departmentSlug,
    dayType,
    shiftSlug,
}) => {
    if (dayType === "HOLIDAY") {
        return null;
    }

    if (!shiftSlug) {
        throw new Error("Shift is required for working day");
    }

    const shift = await findBasicSettingShiftRepo({
        schoolSlug,
        departmentSlug,
        shiftSlug,
    });

    if (!shift) {
        throw new Error(
            "Active shift not found for selected department",
        );
    }

    return shift.slug;
};

export const createBasicSettingsService = async ({
    schoolSlug,
    payload,
}) => {
    const department =
        await findBasicSettingDepartmentRepo({
            schoolSlug,
            departmentSlug: payload.departmentSlug,
        });

    if (!department) {
        throw new Error("Active department not found");
    }

    const shiftSlug = await verifyShift({
        schoolSlug,
        departmentSlug: payload.departmentSlug,
        dayType: payload.dayType,
        shiftSlug: payload.shiftSlug,
    });

    const uniqueDays = [
        ...new Set(payload.weekDays.map(normalizeWeekDay)),
    ];

    const rows = uniqueDays.map((weekDay) => ({
        slug: randomUUID(),
        schoolSlug,
        departmentSlug: payload.departmentSlug,
        weekDay,
        dayType: payload.dayType,
        shiftSlug,
    }));

    return createBasicSettingsRepo({
        rows,
    });
};

export const getBasicSettingsService = async ({
    schoolSlug,
    query,
}) => {
    return getBasicSettingsRepo({
        schoolSlug,
        departmentSlug: query.departmentSlug,
        status: query.status,
    });
};

export const getBasicSettingBySlugService = async ({
    schoolSlug,
    slug,
}) => {
    const setting = await getBasicSettingBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!setting) {
        throw new Error("Basic setting not found");
    }

    return setting;
};

export const updateBasicSettingService = async ({
    schoolSlug,
    slug,
    payload,
}) => {
    const setting = await getBasicSettingBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!setting) {
        throw new Error("Basic setting not found");
    }

    const dayType = payload.dayType ?? setting.dayType;

    const shiftSlug = await verifyShift({
        schoolSlug,
        departmentSlug: setting.departmentSlug,
        dayType,
        shiftSlug:
            payload.shiftSlug !== undefined
                ? payload.shiftSlug
                : setting.shiftSlug,
    });

    return updateBasicSettingRepo({
        slug,
        data: {
            dayType,
            shiftSlug,
        },
    });
};

export const deleteBasicSettingService = async ({
    schoolSlug,
    slug,
}) => {
    const setting = await getBasicSettingBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!setting) {
        throw new Error("Basic setting not found");
    }

    return updateBasicSettingRepo({
        slug,
        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreBasicSettingService = async ({
    schoolSlug,
    slug,
}) => {
    const setting = await getBasicSettingBySlugRepo({
        schoolSlug,
        slug,
    });

    if (!setting) {
        throw new Error("Basic setting not found");
    }

    return updateBasicSettingRepo({
        slug,
        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};