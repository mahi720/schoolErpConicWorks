import prisma from "../../../../config/prisma.js";

const employeeAdvanceInclude = {
    employee: {
        select: {
            slug: true,
            employeeId: true,
            employeeCode: true,
            fullName: true,
            joiningDate: true,

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

    advancePolicy: {
        select: {
            slug: true,
            policyName: true,

            departmentSlug: true,

            calculationBasis: true,

            eligibilityAfterMonths: true,

            maximumSalaryMonths: true,

            maximumAmount: true,

            minimumAmount: true,

            maximumInstallments: true,

            interestType: true,

            interestRate: true,

            flatInterestAmount: true,

            allowMultipleAdvance: true,

            approvalRequired: true,
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

    foreclosedBy: {
        select: {
            slug: true,
            name: true,
            email: true,
        },
    },
};

export const runEmployeeAdvanceTransactionRepo = async (callback) => {
    return prisma.$transaction(async (tx) => {
        return callback(tx);
    });
};

export const findCurrentAdvanceEmployeeRepo = async ({
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

            payBand: true,
        },
    });
};

export const findAdvanceEmployeeBySlugRepo = async ({
    schoolSlug,
    employeeSlug,
    db = prisma,
}) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,

            slug: employeeSlug,

            isActive: true,

            isTransferred: false,
        },

        include: {
            department: true,

            designation: true,

            payBand: true,
        },
    });
};

export const findActiveEmployeeAdvanceRepo = async ({
    schoolSlug,
    employeeSlug,
    excludeSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvance.findFirst({
        where: {
            schoolSlug,

            employeeSlug,

            isActive: true,

            ...(excludeSlug
                ? {
                    slug: {
                        not: excludeSlug,
                    },
                }
                : {}),

            OR: [
                {
                    requestStatus: "PENDING",
                },

                {
                    requestStatus: "APPROVED",

                    recoveryStatus: {
                        in: [
                            "NOT_STARTED",
                            "RUNNING",
                        ],
                    },
                },
            ],
        },

        select: {
            slug: true,

            requestStatus: true,

            disbursementStatus: true,

            recoveryStatus: true,

            outstandingAmount: true,

            isForeclosed: true,

            createdAt: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const createEmployeeAdvanceRepo = async (data, db = prisma) => {
    return db.hrmEmployeeAdvance.create({
        data,

        include: employeeAdvanceInclude,
    });
};

export const findEmployeeAdvanceBySlugRepo = async ({
    schoolSlug,
    advanceSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvance.findFirst({
        where: {
            schoolSlug,

            slug: advanceSlug,
        },

        include: {
            ...employeeAdvanceInclude,

            installments: {
                orderBy: {
                    installmentNo: "asc",
                },
            },
        },
    });
};

export const getMyEmployeeAdvancesRepo = async ({
    schoolSlug,
    employeeSlug,
    requestStatus,
    isActive,
    search,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvance.findMany({
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
                            reason: {
                                contains: search,
                            },
                        },

                        {
                            advancePolicy: {
                                policyName: {
                                    contains: search,
                                },
                            },
                        },
                    ],
                }
                : {}),
        },

        include: employeeAdvanceInclude,

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getAllEmployeeAdvancesRepo = async ({
    schoolSlug,
    employeeSlug,
    departmentSlug,
    requestStatus,
    disbursementStatus,
    recoveryStatus,
    isActive,
    search,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvance.findMany({
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

            ...(departmentSlug
                ? {
                    employee: {
                        departmentSlug,
                    },
                }
                : {}),

            ...(requestStatus
                ? {
                    requestStatus,
                }
                : {}),

            ...(disbursementStatus
                ? {
                    disbursementStatus,
                }
                : {}),

            ...(recoveryStatus
                ? {
                    recoveryStatus,
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            reason: {
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
                    ],
                }
                : {}),
        },

        include: employeeAdvanceInclude,

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const updateEmployeeAdvanceRepo = async ({
    advanceSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvance.update({
        where: {
            slug: advanceSlug,
        },

        data,

        include: employeeAdvanceInclude,
    });
};

export const createAdvanceInstallmentsRepo = async (rows, db = prisma) => {
    return db.hrmEmployeeAdvanceInstallment.createMany({
        data: rows,
    });
};

export const getAdvanceInstallmentsRepo = async ({
    schoolSlug,
    advanceSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.findMany({
        where: {
            schoolSlug,

            advanceSlug,
        },

        orderBy: {
            installmentNo: "asc",
        },
    });
};

export const findAdvanceInstallmentBySlugRepo = async ({
    schoolSlug,
    advanceSlug,
    installmentSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.findFirst({
        where: {
            schoolSlug,

            advanceSlug,

            slug: installmentSlug,
        },
    });
};

export const updateAdvanceInstallmentRepo = async ({
    installmentSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.update({
        where: {
            slug: installmentSlug,
        },

        data,
    });
};

export const getAdvanceRecoveredTotalRepo = async ({
    advanceSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.aggregate({
        where: {
            advanceSlug,
        },

        _sum: {
            recoveredAmount: true,
        },
    });
};

export const deleteAdvanceInstallmentsRepo = async ({
    advanceSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.deleteMany({
        where: {
            advanceSlug,
        },
    });
};

export const getPendingAdvanceInstallmentsRepo = async ({
    advanceSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.findMany({
        where: {
            advanceSlug,

            status: {
                in: ["PENDING", "PARTIALLY_RECOVERED"],
            },
        },

        orderBy: {
            installmentNo: "asc",
        },
    });
};

export const updateManyAdvanceInstallmentsRepo = async ({
    advanceSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.updateMany({
        where: {
            advanceSlug,

            status: {
                in: ["PENDING", "PARTIALLY_RECOVERED"],
            },
        },

        data,
    });
};
