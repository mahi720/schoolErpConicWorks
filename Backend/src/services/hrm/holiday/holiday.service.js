import { randomUUID } from "crypto";

import {
    runHolidayTransactionRepo,
    findHolidayDepartmentsRepo,
    findHolidayEmployeesRepo,
    createHolidayGroupRepo,
    createHolidayAssignmentsRepo,
    createHolidayRowsRepo,
    getHolidaysRepo,
    findHolidayBySlugRepo,
    findHolidayDateConflictRepo,
    updateHolidayRepo,
    deleteHolidayRepo,
    restoreHolidayRepo,
} from "../../../repositories/HRM/holiday/holiday.repository.js";

const parseDate = (value) => {
    return new Date(`${value}T00:00:00.000Z`);
};

const formatDate = (value) => {
    if (!value) {
        return null;
    }

    return new Date(value)
        .toISOString()
        .slice(0, 10);
};

const buildDateList = (
    startDate,
    endDate,
) => {
    const dates = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));

        currentDate.setUTCDate(
            currentDate.getUTCDate() + 1,
        );
    }

    return dates;
};

const resolveHolidayTargets = async ({
    schoolSlug,
    payload,
}) => {
    if (payload.type === "DEPARTMENT") {
        const departmentSlugs = [
            ...new Set(payload.departmentSlugs),
        ];

        const departments =
            await findHolidayDepartmentsRepo({
                schoolSlug,
                departmentSlugs,
            });

        if (
            departments.length !==
            departmentSlugs.length
        ) {
            throw new Error(
                "One or more selected departments were not found",
            );
        }

        return {
            departments,
            employees: [],
        };
    }

    const employeeSlugs = [
        ...new Set(payload.employeeSlugs),
    ];

    const employees =
        await findHolidayEmployeesRepo({
            schoolSlug,
            employeeSlugs,
        });

    if (
        employees.length !==
        employeeSlugs.length
    ) {
        throw new Error(
            "One or more selected employees were not found",
        );
    }

    return {
        departments: [],
        employees,
    };
};

export const createHolidayService = async ({
    schoolSlug,
    payload,
}) => {
    const startDate =
        parseDate(payload.startDate);

    const endDate =
        parseDate(payload.endDate);

    const holidayGroupSlug =
        randomUUID();

    const {
        departments,
        employees,
    } =
        await resolveHolidayTargets({
            schoolSlug,
            payload,
        });

    const dates =
        buildDateList(
            startDate,
            endDate,
        );

    const assignmentRows = [];

    const holidayRows = [];

    if (
        payload.type ===
        "DEPARTMENT"
    ) {
        for (const department of departments) {
            assignmentRows.push({
                slug:
                    randomUUID(),

                schoolSlug,

                holidayGroupSlug,

                departmentSlug:
                    department.slug,

                employeeSlug:
                    null,

                status:
                    "active",

                isActive:
                    true,

                deletedAt:
                    null,
            });

            for (const date of dates) {
                const scopeKey =
                    `DEPARTMENT:${department.slug}`;

                const conflict =
                    await findHolidayDateConflictRepo({
                        schoolSlug,

                        scopeKey,

                        holidayDate:
                            date,
                    });

                if (conflict) {
                    throw new Error(
                        `${department.departmentName} already has a holiday on ${formatDate(date)}`,
                    );
                }

                holidayRows.push({
                    slug:
                        randomUUID(),

                    schoolSlug,

                    holidayGroupSlug,

                    title:
                        payload.title.trim(),

                    holidayDate:
                        date,

                    scopeKey,

                    hrmDepartmentId:
                        department.id,

                    hrmEmployeeId:
                        null,

                    status:
                        "active",

                    isActive:
                        true,

                    deletedAt:
                        null,
                });
            }
        }
    }

    if (
        payload.type ===
        "EMPLOYEE"
    ) {
        for (const employee of employees) {
            assignmentRows.push({
                slug:
                    randomUUID(),

                schoolSlug,

                holidayGroupSlug,

                departmentSlug:
                    null,

                employeeSlug:
                    employee.slug,

                status:
                    "active",

                isActive:
                    true,

                deletedAt:
                    null,
            });

            for (const date of dates) {
                const scopeKey =
                    `EMPLOYEE:${employee.slug}`;

                const conflict =
                    await findHolidayDateConflictRepo({
                        schoolSlug,

                        scopeKey,

                        holidayDate:
                            date,
                    });

                if (conflict) {
                    throw new Error(
                        `${employee.fullName} already has a holiday on ${formatDate(date)}`,
                    );
                }

                holidayRows.push({
                    slug:
                        randomUUID(),

                    schoolSlug,

                    holidayGroupSlug,

                    title:
                        payload.title.trim(),

                    holidayDate:
                        date,

                    scopeKey,

                    hrmDepartmentId:
                        null,

                    hrmEmployeeId:
                        employee.id,

                    status:
                        "active",

                    isActive:
                        true,

                    deletedAt:
                        null,
                });
            }
        }
    }

    await runHolidayTransactionRepo(
        async (tx) => {
            await createHolidayGroupRepo(
                {
                    slug:
                        holidayGroupSlug,

                    schoolSlug,

                    title:
                        payload.title.trim(),

                    scopeType:
                        payload.type,

                    startDate,

                    endDate,

                    status:
                        "active",

                    isActive:
                        true,

                    deletedAt:
                        null,
                },
                tx,
            );

            await createHolidayAssignmentsRepo(
                assignmentRows,
                tx,
            );

            await createHolidayRowsRepo(
                holidayRows,
                tx,
            );
        },
    );

    return {
        holidayGroupSlug,
        createdRows:
            holidayRows.length,
    };
};

export const getHolidaysService = async ({
    schoolSlug,
    year,
}) => {
    let startDate = null;
    let endDate = null;

    if (year) {
        const numericYear =
            Number(year);

        if (
            !Number.isInteger(
                numericYear,
            )
        ) {
            throw new Error(
                "Invalid year",
            );
        }

        startDate =
            new Date(
                Date.UTC(
                    numericYear,
                    0,
                    1,
                ),
            );

        endDate =
            new Date(
                Date.UTC(
                    numericYear,
                    11,
                    31,
                    23,
                    59,
                    59,
                    999,
                ),
            );
    }

    const holidays =
        await getHolidaysRepo({
            schoolSlug,
            startDate,
            endDate,
        });

    return holidays.map(
        (item) => ({
            slug:
                item.slug,

            holidaySlug:
                item.slug,

            holidayGroupSlug:
                item.holidayGroupSlug,

            date:
                formatDate(
                    item.holidayDate,
                ),

            title:
                item.title,

            type:
                item.holidayGroup
                    .scopeType,

            targetSlug:
                item.holidayGroup
                    .scopeType ===
                    "DEPARTMENT"
                    ? item.hrmDepartment
                        ?.slug ||
                    null
                    : item.hrmEmployee
                        ?.slug ||
                    null,

            targetName:
                item.holidayGroup
                    .scopeType ===
                    "DEPARTMENT"
                    ? item.hrmDepartment
                        ?.departmentName ||
                    "-"
                    : item.hrmEmployee
                        ?.fullName ||
                    "-",

            status:
                item.status,

            isActive:
                item.isActive,

            deletedAt:
                item.deletedAt,
        }),
    );
};

export const getHolidayBySlugService = async ({
    schoolSlug,
    holidaySlug,
}) => {
    const holiday =
        await findHolidayBySlugRepo({
            schoolSlug,
            holidaySlug,
        });

    if (!holiday) {
        throw new Error(
            "Holiday not found",
        );
    }

    return {
        slug:
            holiday.slug,

        holidaySlug:
            holiday.slug,

        date:
            formatDate(
                holiday.holidayDate,
            ),

        title:
            holiday.title,

        type:
            holiday.holidayGroup
                .scopeType,

        targetName:
            holiday.holidayGroup
                .scopeType ===
                "DEPARTMENT"
                ? holiday
                    .hrmDepartment
                    ?.departmentName ||
                "-"
                : holiday
                    .hrmEmployee
                    ?.fullName ||
                "-",

        isActive:
            holiday.isActive,
    };
};

export const updateHolidayService = async ({
    schoolSlug,
    holidaySlug,
    payload,
}) => {
    const holiday =
        await findHolidayBySlugRepo({
            schoolSlug,
            holidaySlug,
        });

    if (!holiday) {
        throw new Error(
            "Holiday not found",
        );
    }

    if (!holiday.isActive) {
        throw new Error(
            "Inactive holiday cannot be edited",
        );
    }

    const holidayDate =
        parseDate(
            payload.date,
        );

    const conflict =
        await findHolidayDateConflictRepo({
            schoolSlug,

            scopeKey:
                holiday.scopeKey,

            holidayDate,

            excludeHolidaySlug:
                holidaySlug,
        });

    if (conflict) {
        throw new Error(
            "Holiday already exists for selected date",
        );
    }

    return updateHolidayRepo({
        holidaySlug,

        data: {
            title:
                payload.title.trim(),

            holidayDate,
        },
    });
};

export const deleteHolidayService = async ({
    schoolSlug,
    holidaySlug,
}) => {
    const holiday =
        await findHolidayBySlugRepo({
            schoolSlug,
            holidaySlug,
        });

    if (!holiday) {
        throw new Error(
            "Holiday not found",
        );
    }

    if (!holiday.isActive) {
        throw new Error(
            "Holiday is already inactive",
        );
    }

    return deleteHolidayRepo({
        holidaySlug,
    });
};

export const restoreHolidayService = async ({
    schoolSlug,
    holidaySlug,
}) => {
    const holiday =
        await findHolidayBySlugRepo({
            schoolSlug,
            holidaySlug,
        });

    if (!holiday) {
        throw new Error(
            "Holiday not found",
        );
    }

    if (holiday.isActive) {
        throw new Error(
            "Holiday is already active",
        );
    }

    const conflict =
        await findHolidayDateConflictRepo({
            schoolSlug,

            scopeKey:
                holiday.scopeKey,

            holidayDate:
                holiday.holidayDate,

            excludeHolidaySlug:
                holidaySlug,
        });

    if (conflict) {
        throw new Error(
            "Cannot restore because active holiday already exists on this date",
        );
    }

    return restoreHolidayRepo({
        holidaySlug,
    });
};