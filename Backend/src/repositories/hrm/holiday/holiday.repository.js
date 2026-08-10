import prisma from "../../../config/prisma.js";

export const runHolidayTransactionRepo = async (callback) => {
    return prisma.$transaction(callback);
};

export const findHolidayDepartmentsRepo = async ({
    schoolSlug,
    departmentSlugs,
    db = prisma,
}) => {
    return db.hrmDepartment.findMany({
        where: {
            schoolSlug,

            slug: {
                in: departmentSlugs,
            },

            isActive: true,
        },

        select: {
            id: true,
            slug: true,
            departmentName: true,
        },
    });
};

export const findHolidayEmployeesRepo = async ({
    schoolSlug,
    employeeSlugs,
    db = prisma,
}) => {
    return db.hrmEmployee.findMany({
        where: {
            schoolSlug,

            slug: {
                in: employeeSlugs,
            },

            isActive: true,
        },

        select: {
            id: true,
            slug: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,
        },
    });
};

export const createHolidayGroupRepo = async (
    data,
    db = prisma,
) => {
    return db.hrmHolidayGroup.create({
        data,
    });
};

export const createHolidayAssignmentsRepo = async (
    rows,
    db = prisma,
) => {
    if (!rows.length) {
        return null;
    }

    return db.hrmHolidayAssignment.createMany({
        data: rows,
    });
};

export const createHolidayRowsRepo = async (
    rows,
    db = prisma,
) => {
    if (!rows.length) {
        return null;
    }

    return db.hrmHoliday.createMany({
        data: rows,
    });
};

export const getHolidaysRepo = async ({
    schoolSlug,
    startDate = null,
    endDate = null,
    db = prisma,
}) => {
    const where = {
        schoolSlug,
    };

    if (startDate && endDate) {
        where.holidayDate = {
            gte: startDate,
            lte: endDate,
        };
    }

    return db.hrmHoliday.findMany({
        where,

        include: {
            holidayGroup: true,
            hrmDepartment: true,
            hrmEmployee: true,
        },

        orderBy: [
            {
                holidayDate: "asc",
            },
            {
                createdAt: "asc",
            },
        ],
    });
};

export const findHolidayBySlugRepo = async ({
    schoolSlug,
    holidaySlug,
    db = prisma,
}) => {
    return db.hrmHoliday.findFirst({
        where: {
            schoolSlug,
            slug: holidaySlug,
        },

        include: {
            holidayGroup: true,
            hrmDepartment: true,
            hrmEmployee: true,
        },
    });
};

export const findHolidayDateConflictRepo = async ({
    schoolSlug,
    scopeKey,
    holidayDate,
    excludeHolidaySlug = null,
    db = prisma,
}) => {
    return db.hrmHoliday.findFirst({
        where: {
            schoolSlug,
            scopeKey,
            holidayDate,
            isActive: true,

            ...(excludeHolidaySlug
                ? {
                    slug: {
                        not: excludeHolidaySlug,
                    },
                }
                : {}),
        },

        select: {
            slug: true,
        },
    });
};

export const updateHolidayRepo = async ({
    holidaySlug,
    data,
    db = prisma,
}) => {
    return db.hrmHoliday.update({
        where: {
            slug: holidaySlug,
        },

        data,
    });
};

export const deleteHolidayRepo = async ({
    holidaySlug,
    db = prisma,
}) => {
    return db.hrmHoliday.update({
        where: {
            slug: holidaySlug,
        },

        data: {
            status: "inactive",
            isActive: false,
            deletedAt: new Date(),
        },
    });
};

export const restoreHolidayRepo = async ({
    holidaySlug,
    db = prisma,
}) => {
    return db.hrmHoliday.update({
        where: {
            slug: holidaySlug,
        },

        data: {
            status: "active",
            isActive: true,
            deletedAt: null,
        },
    });
};