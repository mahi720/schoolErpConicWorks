import prisma from "../../../../config/prisma.js";

export const createBasicSettingsRepo = async ({ rows }) => {
    return prisma.$transaction(
        rows.map((row) =>
            prisma.hrmBasicSetting.upsert({
                where: {
                    schoolSlug_departmentSlug_weekDay: {
                        schoolSlug: row.schoolSlug,
                        departmentSlug: row.departmentSlug,
                        weekDay: row.weekDay,
                    },
                },
                update: {
                    dayType: row.dayType,
                    shiftSlug: row.shiftSlug,
                    status: "active",
                    isActive: true,
                    deletedAt: null,
                },
                create: row,
            }),
        ),
    );
};

export const findBasicSettingDepartmentRepo = async ({
    schoolSlug,
    departmentSlug,
}) => {
    return prisma.hrmDepartment.findFirst({
        where: {
            schoolSlug,
            slug: departmentSlug,
            isActive: true,
        },
    });
};

export const findBasicSettingShiftRepo = async ({
    schoolSlug,
    departmentSlug,
    shiftSlug,
}) => {
    return prisma.hrmShift.findFirst({
        where: {
            schoolSlug,
            departmentSlug,
            slug: shiftSlug,
            isActive: true,
        },
    });
};

export const getBasicSettingsRepo = async ({
    schoolSlug,
    departmentSlug,
    status,
}) => {
    return prisma.hrmBasicSetting.findMany({
        where: {
            schoolSlug,
            ...(departmentSlug ? { departmentSlug } : {}),
            ...(status ? { status } : {}),
        },
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },
            shift: {
                select: {
                    slug: true,
                    shiftName: true,
                    shiftCode: true,
                    loginTime: true,
                    logoutTime: true,
                    // loginBufferMinutes: true,
                    // logoutBufferMinutes: true,
                },
            },
        },
        orderBy: [
            {
                department: {
                    departmentName: "asc",
                },
            },
            {
                weekDay: "asc",
            },
        ],
    });
};

export const getBasicSettingBySlugRepo = async ({
    schoolSlug,
    slug,
}) => {
    return prisma.hrmBasicSetting.findFirst({
        where: {
            schoolSlug,
            slug,
        },
        include: {
            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },
            shift: {
                select: {
                    slug: true,
                    shiftName: true,
                    shiftCode: true,
                },
            },
        },
    });
};

export const updateBasicSettingRepo = async ({
    slug,
    data,
}) => {
    return prisma.hrmBasicSetting.update({
        where: {
            slug,
        },
        data,
    });
};