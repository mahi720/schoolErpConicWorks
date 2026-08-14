import prisma from "../../../../config/prisma.js";

const leaveRequestInclude = {
    employee: {
        include: {
            department: true,

            designation: true,
        },
    },

    leaveType: true,

    approvedBy: {
        select: {
            slug: true,
            name: true,
            email: true,
        },
    },

    rejectedBy: {
        select: {
            slug: true,
            name: true,
            email: true,
        },
    },
};

export const findLeaveEmployeeRepo = async ({
    schoolSlug,
    value,
    db = prisma,
}) => {
    const searchValue = String(value).trim();

    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,

            isActive: true,

            isTransferred: false,

            OR: [
                {
                    slug: searchValue,
                },
                {
                    employeeId: searchValue,
                },
                {
                    employeeCode: searchValue,
                },
                {
                    fullName: searchValue,
                },
            ],
        },

        include: {
            department: true,

            designation: true,
        },
    });
};

export const findLeaveTypeRepo = async ({ schoolSlug, value, db = prisma }) => {
    const searchValue = String(value).trim();

    return db.hrmLeaveType.findFirst({
        where: {
            schoolSlug,

            isActive: true,

            OR: [
                {
                    slug: searchValue,
                },
                {
                    leaveType: searchValue,
                },
            ],
        },
    });
};

export const findEmployeeLeaveOverlapRepo = async ({
    schoolSlug,
    employeeSlug,
    fromDate,
    toDate,
    excludeSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLeaveRequest.findFirst({
        where: {
            schoolSlug,

            employeeSlug,

            isActive: true,

            requestStatus: {
                in: ["PENDING", "APPROVED"],
            },

            ...(excludeSlug
                ? {
                    slug: {
                        not: excludeSlug,
                    },
                }
                : {}),

            fromDate: {
                lte: toDate,
            },

            toDate: {
                gte: fromDate,
            },
        },
    });
};

export const createEmployeeLeaveRequestRepo = async (data, db = prisma) => {
    return db.hrmEmployeeLeaveRequest.create({
        data,

        include: leaveRequestInclude,
    });
};

export const getEmployeeLeaveRequestsRepo = async ({
    schoolSlug,
    search,
    requestStatus,
    employeeSlug,
    isActive,
    db = prisma,
}) => {
    return db.hrmEmployeeLeaveRequest.findMany({
        where: {
            schoolSlug,

            ...(typeof isActive === "boolean"
                ? {
                    isActive,
                }
                : {}),

            ...(requestStatus
                ? {
                    requestStatus,
                }
                : {}),

            ...(employeeSlug
                ? {
                    employeeSlug,
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            subject: {
                                contains: search,
                            },
                        },
                        {
                            employee: {
                                fullName: {
                                    contains: search,
                                },
                            },
                        },
                        {
                            employee: {
                                employeeId: {
                                    contains: search,
                                },
                            },
                        },
                        {
                            employee: {
                                employeeCode: {
                                    contains: search,
                                },
                            },
                        },
                        {
                            leaveType: {
                                leaveType: {
                                    contains: search,
                                },
                            },
                        },
                    ],
                }
                : {}),
        },

        include: leaveRequestInclude,

        orderBy: [
            {
                createdAt: "desc",
            },
            {
                fromDate: "desc",
            },
        ],
    });
};

export const findEmployeeLeaveRequestBySlugRepo = async ({
    schoolSlug,
    leaveSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLeaveRequest.findFirst({
        where: {
            schoolSlug,

            slug: leaveSlug,
        },

        include: leaveRequestInclude,
    });
};

export const updateEmployeeLeaveRequestRepo = async ({
    leaveSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeeLeaveRequest.update({
        where: {
            slug: leaveSlug,
        },

        data,

        include: leaveRequestInclude,
    });
};

export const createEmployeeLeaveRequestLogRepo = async (data, db = prisma) => {
    return db.hrmEmployeeLeaveRequestLog.create({
        data,
    });
};

export const getEmployeeLeaveRequestLogsRepo = async ({
    schoolSlug,
    leaveRequestSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLeaveRequestLog.findMany({
        where: {
            schoolSlug,

            leaveRequestSlug,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const runEmployeeLeaveTransactionRepo = async (callback) => {
    return prisma.$transaction(callback);
};
