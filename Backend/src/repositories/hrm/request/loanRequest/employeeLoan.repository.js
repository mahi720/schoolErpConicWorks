import prisma from "../../../../config/prisma.js";

const employeeLoanInclude = {
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

    loanInterest: {
        select: {
            slug: true,
            durationMonths: true,
            annualInterest: true,
            isActive: true,
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

export const runEmployeeLoanTransactionRepo = async (callback) => {
    return prisma.$transaction(async (tx) => {
        return callback(tx);
    });
};

export const findCurrentLoanEmployeeRepo = async ({
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

export const findLoanEmployeeBySlugRepo = async ({
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

export const getActiveLoanSettingRepo = async ({ schoolSlug, db = prisma }) => {
    return db.hrmLoanSetting.findFirst({
        where: {
            schoolSlug,
            isActive: true,
            status: "active",
        },
    });
};

export const getActiveLoanInterestPlansRepo = async ({
    schoolSlug,
    db = prisma,
}) => {
    return db.hrmLoanInterest.findMany({
        where: {
            schoolSlug,
            isActive: true,
            status: "active",
        },

        orderBy: {
            durationMonths: "asc",
        },
    });
};

export const findActiveLoanInterestPlanRepo = async ({
    schoolSlug,
    loanInterestSlug,
    db = prisma,
}) => {
    return db.hrmLoanInterest.findFirst({
        where: {
            schoolSlug,
            slug: loanInterestSlug,
            isActive: true,
            status: "active",
        },
    });
};

export const findOpenEmployeeLoanRepo = async ({
    schoolSlug,
    employeeSlug,
    excludeSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoan.findFirst({
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
                        in: ["NOT_STARTED", "RUNNING"],
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
            outstandingPrincipal: true,
            createdAt: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const createEmployeeLoanRepo = async (data, db = prisma) => {
    return db.hrmEmployeeLoan.create({
        data,

        include: employeeLoanInclude,
    });
};

export const findEmployeeLoanBySlugRepo = async ({
    schoolSlug,
    loanSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoan.findFirst({
        where: {
            schoolSlug,
            slug: loanSlug,
        },

        include: {
            ...employeeLoanInclude,

            installments: {
                orderBy: {
                    installmentNo: "asc",
                },
            },
        },
    });
};

export const getMyEmployeeLoansRepo = async ({
    schoolSlug,
    employeeSlug,
    requestStatus,
    recoveryStatus,
    isActive,
    search,
    db = prisma,
}) => {
    return db.hrmEmployeeLoan.findMany({
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
                            loanInterest: {
                                durationMonths: Number.isFinite(Number(search))
                                    ? Number(search)
                                    : undefined,
                            },
                        },
                    ],
                }
                : {}),
        },

        include: employeeLoanInclude,

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getAllEmployeeLoansRepo = async ({
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
    return db.hrmEmployeeLoan.findMany({
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

        include: employeeLoanInclude,

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const updateEmployeeLoanRepo = async ({
    loanSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeeLoan.update({
        where: {
            slug: loanSlug,
        },

        data,

        include: employeeLoanInclude,
    });
};

export const createEmployeeLoanInstallmentsRepo = async (rows, db = prisma) => {
    return db.hrmEmployeeLoanInstallment.createMany({
        data: rows,
    });
};

export const deleteEmployeeLoanInstallmentsRepo = async ({
    loanSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.deleteMany({
        where: {
            loanSlug,
        },
    });
};

export const getEmployeeLoanInstallmentsRepo = async ({
    schoolSlug,
    loanSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.findMany({
        where: {
            schoolSlug,
            loanSlug,
        },

        orderBy: {
            installmentNo: "asc",
        },
    });
};

export const findEmployeeLoanInstallmentBySlugRepo = async ({
    schoolSlug,
    loanSlug,
    installmentSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.findFirst({
        where: {
            schoolSlug,
            loanSlug,
            slug: installmentSlug,
        },
    });
};

export const updateEmployeeLoanInstallmentRepo = async ({
    installmentSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.update({
        where: {
            slug: installmentSlug,
        },

        data,
    });
};

export const getEmployeeLoanRecoveryTotalsRepo = async ({
    loanSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.aggregate({
        where: {
            loanSlug,
        },

        _sum: {
            recoveredAmount: true,

            recoveredPrincipal: true,

            recoveredInterest: true,
        },
    });
};

export const getPendingEmployeeLoanInstallmentsRepo = async ({
    loanSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.findMany({
        where: {
            loanSlug,

            status: {
                in: ["PENDING", "PARTIALLY_RECOVERED"],
            },
        },

        orderBy: {
            installmentNo: "asc",
        },
    });
};
