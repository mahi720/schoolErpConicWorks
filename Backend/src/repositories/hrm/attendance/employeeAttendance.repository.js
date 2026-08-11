import prisma from "../../../config/prisma.js";

export const runEmployeeAttendanceTransactionRepo =
    async (callback) => {
        return prisma.$transaction(
            callback,
        );
    };

export const getAttendanceEmployeesRepo =
    async ({
        schoolSlug,
        attendanceDate,
        db = prisma,
    }) => {
        return db.hrmEmployee.findMany({
            where: {
                schoolSlug,

                isActive:
                    true,

                isTransferred:
                    false,

                joiningDate: {
                    lte:
                        attendanceDate,
                },
            },

            include: {
                department:
                    true,

                designation:
                    true,
            },

            orderBy: [
                {
                    employeeSerial:
                        "asc",
                },
                {
                    fullName:
                        "asc",
                },
            ],
        });
    };

export const findAttendanceEmployeeBySlugRepo =
    async ({
        schoolSlug,
        employeeSlug,
        db = prisma,
    }) => {
        return db.hrmEmployee.findFirst({
            where: {
                schoolSlug,

                slug:
                    employeeSlug,

                isActive:
                    true,

                isTransferred:
                    false,
            },

            include: {
                department:
                    true,

                designation:
                    true,
            },
        });
    };

export const findEmployeeAttendanceRepo =
    async ({
        schoolSlug,
        employeeSlug,
        attendanceDate,
        db = prisma,
    }) => {
        return db.hrmEmployeeAttendance.findFirst({
            where: {
                schoolSlug,
                employeeSlug,
                attendanceDate,
                isActive:
                    true,
            },

            include: {
                shift:
                    true,
            },
        });
    };

export const findEmployeeAttendanceBySlugRepo =
    async ({
        schoolSlug,
        attendanceSlug,
        db = prisma,
    }) => {
        return db.hrmEmployeeAttendance.findFirst({
            where: {
                schoolSlug,

                slug:
                    attendanceSlug,

                isActive:
                    true,
            },

            include: {
                employee: {
                    include: {
                        department:
                            true,

                        designation:
                            true,
                    },
                },

                shift:
                    true,
            },
        });
    };

export const getEmployeeAttendancesForDateRepo =
    async ({
        schoolSlug,
        attendanceDate,
        db = prisma,
    }) => {
        return db.hrmEmployeeAttendance.findMany({
            where: {
                schoolSlug,
                attendanceDate,
                isActive:
                    true,
            },

            include: {
                shift:
                    true,
            },
        });
    };

export const findEmployeeBasicSettingRepo =
    async ({
        schoolSlug,
        departmentSlug,
        weekDays,
        db = prisma,
    }) => {
        return db.hrmBasicSetting.findFirst({
            where: {
                schoolSlug,

                departmentSlug,

                weekDay: {
                    in:
                        weekDays,
                },

                isActive:
                    true,
            },

            include: {
                shift:
                    true,
            },

            orderBy: {
                createdAt:
                    "desc",
            },
        });
    };

export const findSpecificSaturdayBasicSettingRepo =
    async ({
        schoolSlug,
        departmentSlug,
        specificWeekDay,
        db = prisma,
    }) => {
        return db.hrmBasicSetting.findFirst({
            where: {
                schoolSlug,
                departmentSlug,

                weekDay:
                    specificWeekDay,

                isActive:
                    true,
            },

            include: {
                shift:
                    true,
            },
        });
    };

export const findAttendanceEmployeeByEmployeeIdRepo =
    async ({
        schoolSlug,
        employeeId,
        db = prisma,
    }) => {
        const value =
            String(
                employeeId,
            ).trim();

        return db.hrmEmployee.findFirst({
            where: {
                schoolSlug,

                isActive:
                    true,

                isTransferred:
                    false,

                OR: [
                    {
                        employeeId:
                            value,
                    },
                    {
                        employeeCode:
                            value,
                    },
                ],
            },

            include: {
                department:
                    true,

                designation:
                    true,
            },
        });
    };

export const findNormalSaturdayBasicSettingRepo =
    async ({
        schoolSlug,
        departmentSlug,
        db = prisma,
    }) => {
        return db.hrmBasicSetting.findFirst({
            where: {
                schoolSlug,
                departmentSlug,

                weekDay:
                    "SATURDAY",

                isActive:
                    true,
            },

            include: {
                shift:
                    true,
            },
        });
    };

export const findEmployeeHolidayRepo =
    async ({
        schoolSlug,
        employeeId,
        departmentId,
        attendanceDate,
        db = prisma,
    }) => {
        return db.hrmHoliday.findFirst({
            where: {
                schoolSlug,

                holidayDate:
                    attendanceDate,

                isActive:
                    true,

                OR: [
                    {
                        hrmEmployeeId:
                            employeeId,
                    },
                    {
                        hrmDepartmentId:
                            departmentId,
                    },
                ],
            },

            include: {
                holidayGroup:
                    true,

                hrmEmployee:
                    true,

                hrmDepartment:
                    true,
            },
        });
    };

export const upsertEmployeeAttendanceRepo =
    async ({
        schoolSlug,
        employeeSlug,
        attendanceDate,
        createData,
        updateData,
        db = prisma,
    }) => {
        return db.hrmEmployeeAttendance.upsert({
            where: {
                schoolSlug_employeeSlug_attendanceDate:
                {
                    schoolSlug,
                    employeeSlug,
                    attendanceDate,
                },
            },

            create:
                createData,

            update:
                updateData,

            include: {
                shift:
                    true,
            },
        });
    };

export const createEmployeeAttendanceRepo =
    async (
        data,
        db = prisma,
    ) => {
        return db.hrmEmployeeAttendance.create({
            data,

            include: {
                shift:
                    true,
            },
        });
    };

export const updateEmployeeAttendanceRepo =
    async ({
        attendanceSlug,
        data,
        db = prisma,
    }) => {
        return db.hrmEmployeeAttendance.update({
            where: {
                slug:
                    attendanceSlug,
            },

            data,

            include: {
                shift:
                    true,
            },
        });
    };

export const createEmployeeAttendanceLogRepo =
    async (
        data,
        db = prisma,
    ) => {
        return db.hrmEmployeeAttendanceLog.create({
            data,
        });
    };

export const getEmployeeAttendanceLogsRepo =
    async ({
        schoolSlug,
        employeeSlug,
        attendanceDate,
        db = prisma,
    }) => {
        return db.hrmEmployeeAttendanceLog.findMany({
            where: {
                schoolSlug,

                ...(employeeSlug
                    ? {
                        employeeSlug,
                    }
                    : {}),

                ...(attendanceDate
                    ? {
                        attendanceDate,
                    }
                    : {}),
            },

            include: {
                employee: {
                    select: {
                        slug:
                            true,

                        employeeId:
                            true,

                        employeeCode:
                            true,

                        fullName:
                            true,
                    },
                },
            },

            orderBy: {
                createdAt:
                    "desc",
            },
        });
    };

// export const getYearlyEmployeeAttendanceRepo =
//     async ({
//         schoolSlug,
//         startDate,
//         endDate,
//         db = prisma,
//     }) => {
//         return db.hrmEmployeeAttendance.findMany({
//             where: {
//                 schoolSlug,

//                 attendanceDate: {
//                     gte:
//                         startDate,

//                     lte:
//                         endDate,
//                 },

//                 isActive:
//                     true,
//             },

//             include: {
//                 employee: {
//                     include: {
//                         department:
//                             true,

//                         designation:
//                             true,
//                     },
//                 },
//             },

//             orderBy: [
//                 {
//                     employeeSlug:
//                         "asc",
//                 },
//                 {
//                     attendanceDate:
//                         "asc",
//                 },
//             ],
//         });
//     };

export const findAttendanceSessionBySlugRepo =
    async ({
        schoolSlug,
        sessionSlug,
        db = prisma,
    }) => {
        return db.session.findFirst({
            where: {
                schoolSlug,
                slug:
                    sessionSlug,
            },
        });
    };

export const getAcademicYearReportEmployeesRepo =
    async ({
        schoolSlug,
        startDate,
        endDate,
        db = prisma,
    }) => {
        return db.hrmEmployee.findMany({
            where: {
                schoolSlug,

                isTransferred:
                    false,

                joiningDate: {
                    lte:
                        endDate,
                },
            },

            include: {
                department:
                    true,

                designation:
                    true,

                hrmEmployeeAttendances: {
                    where: {
                        attendanceDate: {
                            gte: startDate,
                            lte: endDate,
                        },

                        isActive: true,
                    },

                    select: {
                        attendanceDate: true,
                        attendanceStatus: true,
                        isLate: true,
                        isEarly: true,
                    },
                },
            },

            orderBy: [
                {
                    department: {
                        departmentName:
                            "asc",
                    },
                },
                {
                    fullName:
                        "asc",
                },
            ],
        });
    };

export const getAcademicYearHolidaysRepo =
    async ({
        schoolSlug,
        startDate,
        endDate,
        db = prisma,
    }) => {
        return db.hrmHoliday.findMany({
            where: {
                schoolSlug,

                holidayDate: {
                    gte:
                        startDate,

                    lte:
                        endDate,
                },

                isActive:
                    true,
            },

            include: {
                holidayGroup:
                    true,

                hrmEmployee:
                    true,

                hrmDepartment:
                    true,
            },

            orderBy: {
                holidayDate:
                    "asc",
            },
        });
    };

export const getAcademicYearBasicSettingsRepo =
    async ({
        schoolSlug,
        db = prisma,
    }) => {
        return db.hrmBasicSetting.findMany({
            where: {
                schoolSlug,

                isActive:
                    true,
            },

            include: {
                department:
                    true,

                shift:
                    true,
            },
        });
    };