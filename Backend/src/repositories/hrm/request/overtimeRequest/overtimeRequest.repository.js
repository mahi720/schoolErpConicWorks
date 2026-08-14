import prisma from "../../../../config/prisma.js";

const overtimeRequestInclude = {
    employee: {
        select: {
            slug: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,

            department: {
                select: {
                    slug: true,
                    departmentName: true,
                },
            },

            designation: {
                select: {
                    slug: true,
                    designationName: true,
                },
            },
        },
    },

    appointedBy: {
        select: {
            slug: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,
        },
    },

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

export const getAssignedOvertimeRequestsRepo = async ({
    schoolSlug,
    appointedBySlug,
    search,
    requestStatus,
    isActive,
    db = prisma,
}) => {
    return db.hrmOvertimeRequest.findMany({
        where: {
            schoolSlug,

            appointedBySlug,

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

            ...(search
                ? {
                    OR: [
                        {
                            description: {
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
                    ],
                }
                : {}),
        },

        include: overtimeRequestInclude,

        orderBy: [
            {
                overtimeDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const findCurrentOvertimeEmployeeRepo = async ({
    schoolSlug,
    userSlug,
    db = prisma,
}) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,

            userSlug,

            isActive: true,

            isTransferred: false,
        },

        include: {
            department: true,

            designation: true,
        },
    });
};

export const findOvertimeEmployeeRepo = async ({
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

export const createOvertimeRequestRepo = async (data, db = prisma) => {
    return db.hrmOvertimeRequest.create({
        data,

        include: overtimeRequestInclude,
    });
};

export const getMyOvertimeRequestsRepo = async ({
    schoolSlug,
    employeeSlug,
    search,
    requestStatus,
    isActive,
    db = prisma,
}) => {
    return db.hrmOvertimeRequest.findMany({
        where: {
            schoolSlug,

            employeeSlug,

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

            ...(search
                ? {
                    OR: [
                        {
                            description: {
                                contains: search,
                            },
                        },
                        {
                            appointedBy: {
                                fullName: {
                                    contains: search,
                                },
                            },
                        },
                    ],
                }
                : {}),
        },

        include: overtimeRequestInclude,

        orderBy: [
            {
                overtimeDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const getAllOvertimeRequestsRepo = async ({
    schoolSlug,
    search,
    employeeSlug,
    requestStatus,
    isActive,
    fromDate,
    toDate,
    db = prisma,
}) => {
    return db.hrmOvertimeRequest.findMany({
        where: {
            schoolSlug,

            ...(typeof isActive === "boolean"
                ? {
                    isActive,
                }
                : {}),

            ...(employeeSlug
                ? {
                    employeeSlug,
                }
                : {}),

            ...(requestStatus
                ? {
                    requestStatus,
                }
                : {}),

            ...(fromDate || toDate
                ? {
                    overtimeDate: {
                        ...(fromDate
                            ? {
                                gte: fromDate,
                            }
                            : {}),

                        ...(toDate
                            ? {
                                lte: toDate,
                            }
                            : {}),
                    },
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            description: {
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
                            appointedBy: {
                                fullName: {
                                    contains: search,
                                },
                            },
                        },
                    ],
                }
                : {}),
        },

        include: overtimeRequestInclude,

        orderBy: [
            {
                overtimeDate: "desc",
            },
            {
                createdAt: "desc",
            },
        ],
    });
};

export const findOvertimeRequestBySlugRepo = async ({
    schoolSlug,
    overtimeSlug,
    db = prisma,
}) => {
    return db.hrmOvertimeRequest.findFirst({
        where: {
            schoolSlug,

            slug: overtimeSlug,
        },

        include: overtimeRequestInclude,
    });
};

export const updateOvertimeRequestRepo = async ({
    overtimeSlug,
    data,
    db = prisma,
}) => {
    return db.hrmOvertimeRequest.update({
        where: {
            slug: overtimeSlug,
        },

        data,

        include: overtimeRequestInclude,
    });
};

export const findOvertimeEmployeesByUserSlugsRepo = async ({
    schoolSlug,
    userSlugs = [],
    db = prisma,
}) => {
    if (!userSlugs.length) {
        return [];
    }

    return db.hrmEmployee.findMany({
        where: {
            schoolSlug,

            userSlug: {
                in: userSlugs,
            },
        },

        select: {
            slug: true,
            userSlug: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,
        },
    });
};