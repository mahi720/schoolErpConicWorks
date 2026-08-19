import prisma from "../../../config/prisma.js";

const payrollDetailInclude = {
    items: {
        orderBy: [
            {
                componentType: "asc",
            },
            {
                displayOrder: "asc",
            },
        ],
    },

    attendance: true,

    leaves: {
        include: {
            leaveType: true,
        },

        orderBy: {
            fromDate: "asc",
        },
    },

    overtimeRequests: {
        orderBy: {
            overtimeDate: "asc",
        },
    },

    advanceInstallments: {
        include: {
            advance: true,
        },

        orderBy: {
            dueMonth: "asc",
        },
    },

    loanInstallments: {
        include: {
            loan: true,
        },

        orderBy: {
            dueMonth: "asc",
        },
    },
};

export const runEmployeePayrollTransactionRepo = async (callback) => {
    return prisma.$transaction(callback);
};

export const getPayrollEmployeesRepo = async ({
    schoolSlug,
    periodEnd,
    departmentSlug,
    designationSlug,
    employeeSlug,
    payrollYear,
    payrollMonth,
    db = prisma,
}) => {
    return db.hrmEmployee.findMany({
        where: {
            schoolSlug,

            isActive: true,

            isTransferred: false,

            joiningDate: {
                lte: periodEnd,
            },

            employmentStatus: {
                in: ["ACTIVE", "PROBATION", "NOTICE_PERIOD"],
            },

            ...(departmentSlug
                ? {
                    departmentSlug,
                }
                : {}),

            ...(designationSlug
                ? {
                    designationSlug,
                }
                : {}),

            ...(employeeSlug
                ? {
                    slug: employeeSlug,
                }
                : {}),
        },

        include: {
            department: true,

            designation: true,

            payBand: true,

            bankDetail: true,

            hrmEmployeeSalaryStructure: {
                include: {
                    items: {
                        where: {
                            isActive: true,
                        },

                        include: {
                            earningType: true,

                            deductionType: true,
                        },

                        orderBy: {
                            displayOrder: "asc",
                        },
                    },

                    hrmEmployeeSalaryIncrements: {
                        where: {
                            isActive: true,
                        },

                        orderBy: [
                            {
                                effectiveFrom: "asc",
                            },
                            {
                                createdAt: "asc",
                            },
                        ],
                    },

                    payBand: true,
                },
            },

            hrmEmployeePayrolls: {
                where: {
                    payrollYear,
                    payrollMonth,
                    isActive: true,
                },

                include: payrollDetailInclude,

                take: 1,
            },
        },

        orderBy: [
            {
                employeeSerial: "asc",
            },
            {
                fullName: "asc",
            },
        ],
    });
};

export const findPayrollEmployeeSourceRepo = async ({
    schoolSlug,
    employeeSlug,
    periodEnd,
    payrollYear,
    payrollMonth,
    db = prisma,
}) => {
    return db.hrmEmployee.findFirst({
        where: {
            schoolSlug,

            slug: employeeSlug,

            isActive: true,

            isTransferred: false,

            joiningDate: {
                lte: periodEnd,
            },
        },

        include: {
            department: true,

            designation: true,

            payBand: true,

            bankDetail: true,

            hrmEmployeeSalaryStructure: {
                include: {
                    items: {
                        where: {
                            isActive: true,
                        },

                        include: {
                            earningType: true,

                            deductionType: true,
                        },

                        orderBy: {
                            displayOrder: "asc",
                        },
                    },

                    hrmEmployeeSalaryIncrements: {
                        where: {
                            isActive: true,
                        },

                        orderBy: [
                            {
                                effectiveFrom: "asc",
                            },
                            {
                                createdAt: "asc",
                            },
                        ],
                    },

                    payBand: true,
                },
            },

            hrmEmployeePayrolls: {
                where: {
                    payrollYear,
                    payrollMonth,
                    isActive: true,
                },

                include: payrollDetailInclude,

                take: 1,
            },
        },
    });
};

export const getEmployeeAttendanceForPayrollRepo = async ({
    schoolSlug,
    employeeSlug,
    startDate,
    endDate,
    db = prisma,
}) => {
    return db.hrmEmployeeAttendance.findMany({
        where: {
            schoolSlug,

            employeeSlug,

            attendanceDate: {
                gte: startDate,
                lte: endDate,
            },

            isActive: true,
        },

        include: {
            leaveRequest: {
                include: {
                    leaveType: true,
                },
            },

            holiday: true,

            basicSetting: {
                include: {
                    shift: true,
                },
            },

            shift: true,
        },

        orderBy: {
            attendanceDate: "asc",
        },
    });
};

export const getEmployeeLeaveRequestsForPayrollRepo = async ({
    schoolSlug,
    employeeSlug,
    startDate,
    endDate,
    db = prisma,
}) => {
    return db.hrmEmployeeLeaveRequest.findMany({
        where: {
            schoolSlug,

            employeeSlug,

            isActive: true,

            OR: [
                {
                    leaveCategory: {
                        in: ["FULL_DAY", "HALF_DAY"],
                    },

                    fromDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                {
                    leaveCategory: "MULTI_DAY",

                    fromDate: {
                        lte: endDate,
                    },

                    toDate: {
                        gte: startDate,
                    },
                },
            ],
        },

        include: {
            leaveType: true,
        },

        orderBy: {
            fromDate: "asc",
        },
    });
};

export const getEmployeeOvertimeForPayrollRepo = async ({
    schoolSlug,
    employeeSlug,
    startDate,
    endDate,
    payrollSlug,
    db = prisma,
}) => {
    return db.hrmOvertimeRequest.findMany({
        where: {
            schoolSlug,

            employeeSlug,

            overtimeDate: {
                gte: startDate,
                lte: endDate,
            },

            requestStatus: "APPROVED",

            isActive: true,

            OR: [
                {
                    payrollSlug: null,
                },
                ...(payrollSlug
                    ? [
                        {
                            payrollSlug,
                        },
                    ]
                    : []),
            ],
        },

        orderBy: {
            overtimeDate: "asc",
        },
    });
};

export const getEmployeeAdvanceInstallmentsForPayrollRepo = async ({
    schoolSlug,
    employeeSlug,
    startDate,
    endDate,
    payrollSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeAdvanceInstallment.findMany({
        where: {
            schoolSlug,

            employeeSlug,

            dueMonth: {
                gte: startDate,
                lte: endDate,
            },

            status: {
                in: ["PENDING", "PARTIALLY_RECOVERED"],
            },

            OR: [
                {
                    payrollSlug: null,
                },
                ...(payrollSlug
                    ? [
                        {
                            payrollSlug,
                        },
                    ]
                    : []),
            ],

            advance: {
                requestStatus: "APPROVED",

                disbursementStatus: "DISBURSED",

                isActive: true,

                isForeclosed: false,
            },
        },

        include: {
            advance: true,
        },

        orderBy: {
            dueMonth: "asc",
        },
    });
};

export const getEmployeeLoanInstallmentsForPayrollRepo = async ({
    schoolSlug,
    employeeSlug,
    startDate,
    endDate,
    payrollSlug,
    db = prisma,
}) => {
    return db.hrmEmployeeLoanInstallment.findMany({
        where: {
            schoolSlug,

            employeeSlug,

            dueMonth: {
                gte: startDate,
                lte: endDate,
            },

            status: {
                in: ["PENDING", "PARTIALLY_RECOVERED"],
            },

            OR: [
                {
                    payrollSlug: null,
                },
                ...(payrollSlug
                    ? [
                        {
                            payrollSlug,
                        },
                    ]
                    : []),
            ],

            loan: {
                requestStatus: "APPROVED",

                disbursementStatus: "DISBURSED",

                isActive: true,

                isForeclosed: false,
            },
        },

        include: {
            loan: true,
        },

        orderBy: {
            dueMonth: "asc",
        },
    });
};

export const getEmployeeBasicSettingsForPayrollRepo = async ({
    schoolSlug,
    departmentSlug,
    db = prisma,
}) => {
    return db.hrmBasicSetting.findMany({
        where: {
            schoolSlug,

            departmentSlug,

            isActive: true,
        },

        include: {
            shift: true,
        },
    });
};

export const getEmployeeHolidaysForPayrollRepo = async ({
    schoolSlug,
    employeeSlug,
    departmentSlug,
    startDate,
    endDate,
    db = prisma,
}) => {
    return db.hrmHoliday.findMany({
        where: {
            schoolSlug,

            holidayDate: {
                gte: startDate,
                lte: endDate,
            },

            isActive: true,

            holidayGroup: {
                isActive: true,

                assignments: {
                    some: {
                        isActive: true,

                        OR: [
                            {
                                employeeSlug,
                            },
                            {
                                departmentSlug,
                            },
                        ],
                    },
                },
            },
        },

        include: {
            holidayGroup: true,
        },

        orderBy: {
            holidayDate: "asc",
        },
    });
};

export const findPayrollRunRepo = async ({
    schoolSlug,
    payrollYear,
    payrollMonth,
    db = prisma,
}) => {
    return db.hrmPayrollRun.findFirst({
        where: {
            schoolSlug,

            payrollYear,

            payrollMonth,

            isActive: true,
        },
    });
};

export const createPayrollRunRepo = async ({ data, db = prisma }) => {
    return db.hrmPayrollRun.create({
        data,
    });
};

export const updatePayrollRunRepo = async ({
    payrollRunSlug,
    data,
    db = prisma,
}) => {
    return db.hrmPayrollRun.update({
        where: {
            slug: payrollRunSlug,
        },

        data,
    });
};

export const findEmployeePayrollByPeriodRepo = async ({
    schoolSlug,
    employeeSlug,
    payrollYear,
    payrollMonth,
    db = prisma,
}) => {
    return db.hrmEmployeePayroll.findFirst({
        where: {
            schoolSlug,

            employeeSlug,

            payrollYear,

            payrollMonth,

            isActive: true,
        },

        include: payrollDetailInclude,
    });
};

export const findEmployeePayrollBySlugRepo = async ({
    schoolSlug,
    payrollSlug,
    db = prisma,
}) => {
    return db.hrmEmployeePayroll.findFirst({
        where: {
            schoolSlug,

            slug: payrollSlug,

            isActive: true,
        },

        include: {
            ...payrollDetailInclude,

            payrollRun: true,

            employee: {
                include: {
                    department: true,

                    designation: true,
                },
            },
        },
    });
};

export const createEmployeePayrollRepo = async ({ data, db = prisma }) => {
    return db.hrmEmployeePayroll.create({
        data,
    });
};

export const updateEmployeePayrollRepo = async ({
    payrollSlug,
    data,
    db = prisma,
}) => {
    return db.hrmEmployeePayroll.update({
        where: {
            slug: payrollSlug,
        },

        data,
    });
};

export const deleteEmployeePayrollItemsRepo = async ({
    employeePayrollSlug,
    db = prisma,
}) => {
    return db.hrmEmployeePayrollItem.deleteMany({
        where: {
            employeePayrollSlug,
        },
    });
};

export const createEmployeePayrollItemsRepo = async ({ data, db = prisma }) => {
    if (!data.length) {
        return {
            count: 0,
        };
    }

    return db.hrmEmployeePayrollItem.createMany({
        data,
    });
};

export const upsertEmployeePayrollAttendanceRepo = async ({
    employeePayrollSlug,
    createData,
    updateData,
    db = prisma,
}) => {
    return db.hrmEmployeePayrollAttendance.upsert({
        where: {
            employeePayrollSlug,
        },

        create: createData,

        update: updateData,
    });
};

export const deleteEmployeePayrollLeavesRepo = async ({
    employeePayrollSlug,
    db = prisma,
}) => {
    return db.hrmEmployeePayrollLeave.deleteMany({
        where: {
            employeePayrollSlug,
        },
    });
};

export const createEmployeePayrollLeavesRepo = async ({
    data,
    db = prisma,
}) => {
    if (!data.length) {
        return {
            count: 0,
        };
    }

    return db.hrmEmployeePayrollLeave.createMany({
        data,
    });
};

export const createEmployeePayrollLogRepo = async ({ data, db = prisma }) => {
    return db.hrmEmployeePayrollLog.create({
        data,
    });
};

export const getEmployeePayrollLogsRepo = async ({
    schoolSlug,
    payrollSlug,
    db = prisma,
}) => {
    return db.hrmEmployeePayrollLog.findMany({
        where: {
            schoolSlug,

            employeePayrollSlug: payrollSlug,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const unlinkPayrollSourcesRepo = async ({
    payrollSlug,
    db = prisma,
}) => {
    await Promise.all([
        db.hrmOvertimeRequest.updateMany({
            where: {
                payrollSlug,
            },

            data: {
                payrollSlug: null,
            },
        }),

        db.hrmEmployeeAdvanceInstallment.updateMany({
            where: {
                payrollSlug,
            },

            data: {
                payrollSlug: null,
            },
        }),

        db.hrmEmployeeLoanInstallment.updateMany({
            where: {
                payrollSlug,
            },

            data: {
                payrollSlug: null,
            },
        }),
    ]);
};

export const linkPayrollSourcesRepo = async ({
    payrollSlug,
    overtimeSlugs = [],
    advanceInstallmentSlugs = [],
    loanInstallmentSlugs = [],
    db = prisma,
}) => {
    await Promise.all([
        overtimeSlugs.length
            ? db.hrmOvertimeRequest.updateMany({
                where: {
                    slug: {
                        in: overtimeSlugs,
                    },
                },

                data: {
                    payrollSlug,
                },
            })
            : Promise.resolve(),

        advanceInstallmentSlugs.length
            ? db.hrmEmployeeAdvanceInstallment.updateMany({
                where: {
                    slug: {
                        in: advanceInstallmentSlugs,
                    },
                },

                data: {
                    payrollSlug,
                },
            })
            : Promise.resolve(),

        loanInstallmentSlugs.length
            ? db.hrmEmployeeLoanInstallment.updateMany({
                where: {
                    slug: {
                        in: loanInstallmentSlugs,
                    },
                },

                data: {
                    payrollSlug,
                },
            })
            : Promise.resolve(),
    ]);
};

export const getPayrollRunEmployeePayrollsRepo = async ({
    payrollRunSlug,
    db = prisma,
}) => {
    return db.hrmEmployeePayroll.findMany({
        where: {
            payrollRunSlug,

            isActive: true,
        },

        select: {
            slug: true,

            grossEarnings: true,

            totalDeductions: true,

            netSalary: true,

            isSaved: true,

            isLocked: true,

            isPaid: true,
        },
    });
};

export const getSalaryStatementRepo = async ({
    schoolSlug,
    payrollYear,
    payrollMonth,
    departmentSlug,
    designationSlug,
    db = prisma,
}) => {
    return db.hrmEmployeePayroll.findMany({
        where: {
            schoolSlug,

            payrollYear,

            payrollMonth,

            isSaved: true,

            isActive: true,

            ...(departmentSlug
                ? {
                    employee: {
                        departmentSlug,
                    },
                }
                : {}),

            ...(designationSlug
                ? {
                    employee: {
                        designationSlug,
                    },
                }
                : {}),
        },

        include: {
            items: {
                orderBy: {
                    displayOrder: "asc",
                },
            },

            attendance: true,
        },

        orderBy: {
            employeeNameSnapshot: "asc",
        },
    });
};

export const getBankStatementRepo = async ({
    schoolSlug,
    payrollYear,
    payrollMonth,
    db = prisma,
}) => {
    return db.hrmEmployeePayroll.findMany({
        where: {
            schoolSlug,

            payrollYear,

            payrollMonth,

            isSaved: true,

            isActive: true,
        },

        orderBy: {
            employeeNameSnapshot: "asc",
        },
    });
};

export const recoverPayrollAdvanceInstallmentsRepo = async ({
    payrollSlug,
    db = prisma,
}) => {
    const installments = await db.hrmEmployeeAdvanceInstallment.findMany({
        where: {
            payrollSlug,
        },
    });

    const advanceSlugs = new Set();

    for (const installment of installments) {
        advanceSlugs.add(installment.advanceSlug);

        await db.hrmEmployeeAdvanceInstallment.update({
            where: {
                slug: installment.slug,
            },

            data: {
                recoveredAmount: installment.dueAmount,

                recoveredAt: new Date(),

                status: "RECOVERED",
            },
        });
    }

    for (const advanceSlug of advanceSlugs) {
        const advance = await db.hrmEmployeeAdvance.findUnique({
            where: {
                slug: advanceSlug,
            },

            include: {
                installments: true,
            },
        });

        if (!advance) {
            continue;
        }

        const totalRecovered = advance.installments.reduce(
            (total, installment) => total + Number(installment.recoveredAmount),
            0,
        );

        const totalRecoverable = Number(advance.totalRecoverableAmount);

        const outstanding = Math.max(0, totalRecoverable - totalRecovered);

        await db.hrmEmployeeAdvance.update({
            where: {
                slug: advanceSlug,
            },

            data: {
                totalRecoveredAmount: totalRecovered,

                outstandingAmount: outstanding,

                recoveryStatus:
                    outstanding <= 0
                        ? "COMPLETED"
                        : totalRecovered > 0
                            ? "RUNNING"
                            : "NOT_STARTED",
            },
        });
    }
};

export const recoverPayrollLoanInstallmentsRepo = async ({
    payrollSlug,
    db = prisma,
}) => {
    const installments = await db.hrmEmployeeLoanInstallment.findMany({
        where: {
            payrollSlug,
        },
    });

    const loanSlugs = new Set();

    for (const installment of installments) {
        loanSlugs.add(installment.loanSlug);

        await db.hrmEmployeeLoanInstallment.update({
            where: {
                slug: installment.slug,
            },

            data: {
                recoveredAmount: installment.installmentAmount,

                recoveredPrincipal: installment.principalAmount,

                recoveredInterest: installment.interestAmount,

                recoveredAt: new Date(),

                status: "RECOVERED",
            },
        });
    }

    for (const loanSlug of loanSlugs) {
        const loan = await db.hrmEmployeeLoan.findUnique({
            where: {
                slug: loanSlug,
            },

            include: {
                installments: true,
            },
        });

        if (!loan) {
            continue;
        }

        const totalRecovered = loan.installments.reduce(
            (total, installment) => total + Number(installment.recoveredAmount),
            0,
        );

        const recoveredPrincipal = loan.installments.reduce(
            (total, installment) => total + Number(installment.recoveredPrincipal),
            0,
        );

        const totalRecoverable = Number(loan.totalRecoverableAmount);

        const totalPrincipal = Number(loan.totalPrincipal);

        const outstanding = Math.max(0, totalRecoverable - totalRecovered);

        const outstandingPrincipal = Math.max(
            0,
            totalPrincipal - recoveredPrincipal,
        );

        await db.hrmEmployeeLoan.update({
            where: {
                slug: loanSlug,
            },

            data: {
                totalRecoveredAmount: totalRecovered,

                outstandingAmount: outstanding,

                outstandingPrincipal,

                recoveryStatus:
                    outstanding <= 0
                        ? "COMPLETED"
                        : totalRecovered > 0
                            ? "RUNNING"
                            : "NOT_STARTED",
            },
        });
    }
};
