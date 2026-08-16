import { randomUUID } from "crypto";

import {
    runEmployeeAdvanceTransactionRepo,
    findCurrentAdvanceEmployeeRepo,
    findActiveEmployeeAdvanceRepo,
    createEmployeeAdvanceRepo,
    findEmployeeAdvanceBySlugRepo,
    getMyEmployeeAdvancesRepo,
    getAllEmployeeAdvancesRepo,
    updateEmployeeAdvanceRepo,
    createAdvanceInstallmentsRepo,
    getAdvanceInstallmentsRepo,
    findAdvanceInstallmentBySlugRepo,
    updateAdvanceInstallmentRepo,
    getAdvanceRecoveredTotalRepo,
    deleteAdvanceInstallmentsRepo,
    getPendingAdvanceInstallmentsRepo,
    updateManyAdvanceInstallmentsRepo,
} from "../../../../repositories/HRM/request/employeeAdvance/employeeAdvance.repository.js";

import { findApplicableAdvancePolicyRepo } from "../../../../repositories/HRM/settings/advancePolicy/advancePolicy.repository.js";

import { getEmployeeSalaryStructureService } from "../../../hrm/employee/employeeSalaryStructure.service.js";

const roundMoney = (value) => {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
};

const toNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
};

const resolveActiveStatus = (value) => {
    if (value === "inactive") {
        return false;
    }

    if (value === "all") {
        return undefined;
    }

    return true;
};

const calculateCompletedMonths = (joiningDate, currentDate = new Date()) => {
    if (!joiningDate) {
        return 0;
    }

    const start = new Date(joiningDate);

    const end = new Date(currentDate);

    let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    if (end.getDate() < start.getDate()) {
        months -= 1;
    }

    return Math.max(0, months);
};

const calculateEligibleAmount = ({ policy, basicSalary, grossSalary }) => {
    let salaryBasisAmount = 0;

    let calculatedLimit = 0;

    if (policy.calculationBasis === "FIXED") {
        calculatedLimit = toNumber(policy.maximumAmount);

        return {
            salaryBasisAmount: 0,

            eligibleAmount: roundMoney(calculatedLimit),
        };
    }

    salaryBasisAmount =
        policy.calculationBasis === "GROSS"
            ? toNumber(grossSalary)
            : toNumber(basicSalary);

    calculatedLimit = salaryBasisAmount * toNumber(policy.maximumSalaryMonths);

    if (
        policy.maximumAmount !== null &&
        policy.maximumAmount !== undefined &&
        toNumber(policy.maximumAmount) > 0
    ) {
        calculatedLimit = Math.min(calculatedLimit, toNumber(policy.maximumAmount));
    }

    return {
        salaryBasisAmount: roundMoney(salaryBasisAmount),

        eligibleAmount: roundMoney(calculatedLimit),
    };
};

const calculateInterestAmount = ({
    amount,
    interestType,
    interestRate,
    flatInterestAmount,
}) => {
    if (interestType === "NONE") {
        return 0;
    }

    if (interestType === "FLAT") {
        return roundMoney(flatInterestAmount || 0);
    }

    if (interestType === "PERCENTAGE") {
        return roundMoney((toNumber(amount) * toNumber(interestRate)) / 100);
    }

    return 0;
};

const canManageAdvance = (user) => {
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "HR"].includes(user?.role);
};

const formatUser = (user) => {
    if (!user) {
        return null;
    }

    return {
        slug: user.slug,

        name: user.name,

        email: user.email,
    };
};

const formatEmployeeAdvance = (item) => {
    if (!item) {
        return null;
    }

    return {
        slug: item.slug,

        employee: item.employee
            ? {
                slug: item.employee.slug,

                employeeId: item.employee.employeeId || item.employee.employeeCode,

                employeeCode: item.employee.employeeCode,

                fullName: item.employee.fullName,

                joiningDate: item.employee.joiningDate,

                department: item.employee.department
                    ? {
                        slug: item.employee.department.slug,

                        name: item.employee.department.departmentName,
                    }
                    : null,

                designation: item.employee.designation
                    ? {
                        slug: item.employee.designation.slug,

                        name: item.employee.designation.designationName,
                    }
                    : null,
            }
            : null,

        policy: item.advancePolicy
            ? {
                slug: item.advancePolicy.slug,

                policyName: item.advancePolicy.policyName,
            }
            : null,

        requestDate: item.requestDate,

        requestedAmount: toNumber(item.requestedAmount),

        eligibleAmount: toNumber(item.eligibleAmount),

        requestedInstallments: item.requestedInstallments,

        reason: item.reason,

        requestStatus: item.requestStatus,

        approvedAmount:
            item.approvedAmount !== null ? toNumber(item.approvedAmount) : null,

        approvedInstallments: item.approvedInstallments,

        approvedBy: formatUser(item.approvedBy),

        approvedAt: item.approvedAt,

        rejectedBy: formatUser(item.rejectedBy),

        rejectedAt: item.rejectedAt,

        approvalRemark: item.approvalRemark,

        calculationBasisSnapshot: item.calculationBasisSnapshot,

        salaryBasisAmount: toNumber(item.salaryBasisAmount),

        maximumSalaryMonthsSnapshot:
            item.maximumSalaryMonthsSnapshot !== null
                ? toNumber(item.maximumSalaryMonthsSnapshot)
                : null,

        maximumAmountSnapshot:
            item.maximumAmountSnapshot !== null
                ? toNumber(item.maximumAmountSnapshot)
                : null,

        minimumAmountSnapshot:
            item.minimumAmountSnapshot !== null
                ? toNumber(item.minimumAmountSnapshot)
                : null,

        maximumInstallmentsSnapshot: item.maximumInstallmentsSnapshot,

        interestTypeSnapshot: item.interestTypeSnapshot,

        interestRateSnapshot: toNumber(item.interestRateSnapshot),

        flatInterestAmountSnapshot:
            item.flatInterestAmountSnapshot !== null
                ? toNumber(item.flatInterestAmountSnapshot)
                : null,

        interestAmount: toNumber(item.interestAmount),

        disbursementStatus: item.disbursementStatus,

        disbursedAmount: toNumber(item.disbursedAmount),

        disbursedAt: item.disbursedAt,

        paymentMode: item.paymentMode,

        paymentReference: item.paymentReference,

        disbursementRemark: item.disbursementRemark,

        recoveryStatus: item.recoveryStatus,

        totalRecoverableAmount: toNumber(item.totalRecoverableAmount),

        totalRecoveredAmount: toNumber(item.totalRecoveredAmount),

        outstandingAmount: toNumber(item.outstandingAmount),

        installments: item.installments || undefined,

        isForeclosed:
            item.isForeclosed,

        foreclosedAt:
            item.foreclosedAt,

        foreclosedBy:
            formatUser(
                item.foreclosedBy,
            ),

        foreclosureAmount:
            item.foreclosureAmount !==
                null
                ? toNumber(
                    item.foreclosureAmount,
                )
                : null,

        foreclosureRemark:
            item.foreclosureRemark,

        status: item.status,

        isActive: item.isActive,

        deletedAt: item.deletedAt,

        createdAt: item.createdAt,

        updatedAt: item.updatedAt,
    };
};

const resolveAdvanceEligibility = async ({ schoolSlug, employee }) => {
    if (!employee.departmentSlug) {
        throw new Error("Employee department is not assigned");
    }

    const policy = await findApplicableAdvancePolicyRepo({
        schoolSlug,

        departmentSlug: employee.departmentSlug,
    });

    if (!policy) {
        throw new Error("No active advance policy is configured for this employee");
    }

    const completedMonths = calculateCompletedMonths(employee.joiningDate);

    const eligibleAfterMonths = Number(policy.eligibilityAfterMonths || 0);

    if (completedMonths < eligibleAfterMonths) {
        throw new Error(
            `Employee is eligible after ${eligibleAfterMonths} months of service`,
        );
    }

    const salary = await getEmployeeSalaryStructureService({
        schoolSlug,

        employeeSlug: employee.slug,
    });

    const basicSalary = toNumber(salary.basicSalary);

    const grossSalary = toNumber(salary.grossEarnings);

    if (policy.calculationBasis === "BASIC" && basicSalary <= 0) {
        throw new Error("Employee basic salary is not configured");
    }

    if (policy.calculationBasis === "GROSS" && grossSalary <= 0) {
        throw new Error("Employee gross salary is not configured");
    }

    const { salaryBasisAmount, eligibleAmount } = calculateEligibleAmount({
        policy,

        basicSalary,

        grossSalary,
    });

    if (eligibleAmount <= 0) {
        throw new Error("Employee is not eligible for advance amount");
    }

    return {
        policy,

        salary,

        completedMonths,

        salaryBasisAmount,

        eligibleAmount,
    };
};

// export const getMyAdvanceEligibilityService = async ({
//     schoolSlug,
//     userSlug,
// }) => {
//     const employee = await findCurrentAdvanceEmployeeRepo({
//         schoolSlug,

//         userSlug,
//     });

//     if (!employee) {
//         throw new Error("Employee profile not found for logged in user");
//     }

//     const result = await resolveAdvanceEligibility({
//         schoolSlug,

//         employee,
//     });

//     const activeAdvance = await findActiveEmployeeAdvanceRepo({
//         schoolSlug,

//         employeeSlug: employee.slug,
//     });

//     const blockedByActiveAdvance =
//         !result.policy.allowMultipleAdvance && Boolean(activeAdvance);

//     return {
//         employee: {
//             slug: employee.slug,

//             employeeId: employee.employeeId || employee.employeeCode,

//             fullName: employee.fullName,

//             joiningDate: employee.joiningDate,

//             department: employee.department?.departmentName || "-",
//         },

//         policy: {
//             slug: result.policy.slug,

//             policyName: result.policy.policyName,

//             calculationBasis: result.policy.calculationBasis,

//             eligibilityAfterMonths: result.policy.eligibilityAfterMonths,

//             maximumSalaryMonths:
//                 result.policy.maximumSalaryMonths !== null
//                     ? toNumber(result.policy.maximumSalaryMonths)
//                     : null,

//             maximumAmount:
//                 result.policy.maximumAmount !== null
//                     ? toNumber(result.policy.maximumAmount)
//                     : null,

//             minimumAmount:
//                 result.policy.minimumAmount !== null
//                     ? toNumber(result.policy.minimumAmount)
//                     : null,

//             maximumInstallments: result.policy.maximumInstallments,

//             interestType: result.policy.interestType,

//             interestRate: toNumber(result.policy.interestRate),

//             flatInterestAmount:
//                 result.policy.flatInterestAmount !== null
//                     ? toNumber(result.policy.flatInterestAmount)
//                     : null,

//             allowMultipleAdvance: result.policy.allowMultipleAdvance,

//             approvalRequired: result.policy.approvalRequired,
//         },

//         completedServiceMonths: result.completedMonths,

//         basicSalary: toNumber(result.salary.basicSalary),

//         grossSalary: toNumber(result.salary.grossEarnings),

//         salaryBasisAmount: result.salaryBasisAmount,

//         eligibleAmount: result.eligibleAmount,

//         blockedByActiveAdvance,

//         activeAdvanceSlug: activeAdvance?.slug || null,

//         canApply: !blockedByActiveAdvance,
//     };
// };

export const getMyAdvanceEligibilityService = async ({ schoolSlug, user }) => {
    if (user?.role === "SUPER_ADMIN" || user?.role === "SCHOOL_ADMIN") {
        return null;
    }

    const employee = await findCurrentAdvanceEmployeeRepo({
        schoolSlug,

        userSlug: user.slug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const result = await resolveAdvanceEligibility({
        schoolSlug,
        employee,
    });

    const activeAdvance = await findActiveEmployeeAdvanceRepo({
        schoolSlug,

        employeeSlug: employee.slug,
    });

    const blockedByActiveAdvance =
        !result.policy.allowMultipleAdvance && Boolean(activeAdvance);

    return {
        employee: {
            slug: employee.slug,

            employeeId: employee.employeeId || employee.employeeCode,

            fullName: employee.fullName,

            joiningDate: employee.joiningDate,

            department: employee.department?.departmentName || "-",
        },

        policy: {
            slug: result.policy.slug,

            policyName: result.policy.policyName,

            calculationBasis: result.policy.calculationBasis,

            eligibilityAfterMonths: result.policy.eligibilityAfterMonths,

            maximumSalaryMonths:
                result.policy.maximumSalaryMonths !== null
                    ? toNumber(result.policy.maximumSalaryMonths)
                    : null,

            maximumAmount:
                result.policy.maximumAmount !== null
                    ? toNumber(result.policy.maximumAmount)
                    : null,

            minimumAmount:
                result.policy.minimumAmount !== null
                    ? toNumber(result.policy.minimumAmount)
                    : null,

            maximumInstallments: result.policy.maximumInstallments,

            interestType: result.policy.interestType,

            interestRate: toNumber(result.policy.interestRate),

            flatInterestAmount:
                result.policy.flatInterestAmount !== null
                    ? toNumber(result.policy.flatInterestAmount)
                    : null,

            allowMultipleAdvance: result.policy.allowMultipleAdvance,

            approvalRequired: result.policy.approvalRequired,
        },

        completedServiceMonths: result.completedMonths,

        basicSalary: toNumber(result.salary.basicSalary),

        grossSalary: toNumber(result.salary.grossEarnings),

        salaryBasisAmount: result.salaryBasisAmount,

        eligibleAmount: result.eligibleAmount,

        blockedByActiveAdvance,

        activeAdvanceSlug: activeAdvance?.slug || null,

        canApply: !blockedByActiveAdvance,
    };
};

export const createEmployeeAdvanceService = async ({
    schoolSlug,
    userSlug,
    payload,
}) => {
    const employee = await findCurrentAdvanceEmployeeRepo({
        schoolSlug,

        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const eligibility = await resolveAdvanceEligibility({
        schoolSlug,

        employee,
    });

    const policy = eligibility.policy;

    if (!policy.allowMultipleAdvance) {
        const activeAdvance = await findActiveEmployeeAdvanceRepo({
            schoolSlug,

            employeeSlug: employee.slug,
        });

        if (activeAdvance) {
            throw new Error("Employee already has an active advance request");
        }
    }

    const requestedAmount = roundMoney(payload.requestedAmount);

    const requestedInstallments = Number(payload.requestedInstallments);

    const minimumAmount = toNumber(policy.minimumAmount);

    if (minimumAmount > 0 && requestedAmount < minimumAmount) {
        throw new Error(`Minimum advance amount is ${minimumAmount}`);
    }

    if (requestedAmount > eligibility.eligibleAmount) {
        throw new Error(
            `Requested amount cannot exceed eligible amount ${eligibility.eligibleAmount}`,
        );
    }

    if (requestedInstallments > Number(policy.maximumInstallments)) {
        throw new Error(
            `Maximum ${policy.maximumInstallments} installments are allowed`,
        );
    }

    const autoApproved = policy.approvalRequired === false;

    let interestAmount = 0;

    let totalRecoverableAmount = 0;

    if (autoApproved) {
        interestAmount = calculateInterestAmount({
            amount: requestedAmount,

            interestType: policy.interestType,

            interestRate: policy.interestRate,

            flatInterestAmount: policy.flatInterestAmount,
        });

        totalRecoverableAmount = roundMoney(requestedAmount + interestAmount);
    }

    const created = await createEmployeeAdvanceRepo({
        slug: randomUUID(),

        schoolSlug,

        employeeSlug: employee.slug,

        advancePolicySlug: policy.slug,

        requestDate: new Date(),

        requestedAmount,

        eligibleAmount: eligibility.eligibleAmount,

        requestedInstallments,

        reason: payload.reason.trim(),

        requestStatus: autoApproved ? "APPROVED" : "PENDING",

        approvedAmount: autoApproved ? requestedAmount : null,

        approvedInstallments: autoApproved ? requestedInstallments : null,

        approvedBySlug: null,

        approvedAt: autoApproved ? new Date() : null,

        rejectedBySlug: null,

        rejectedAt: null,

        approvalRemark: autoApproved ? "Auto approved as per advance policy" : null,

        calculationBasisSnapshot: policy.calculationBasis,

        salaryBasisAmount: eligibility.salaryBasisAmount,

        maximumSalaryMonthsSnapshot: policy.maximumSalaryMonths,

        maximumAmountSnapshot: policy.maximumAmount,

        minimumAmountSnapshot: policy.minimumAmount,

        maximumInstallmentsSnapshot: policy.maximumInstallments,

        interestTypeSnapshot: policy.interestType,

        interestRateSnapshot: policy.interestRate,

        flatInterestAmountSnapshot: policy.flatInterestAmount,

        interestAmount,

        disbursementStatus: "NOT_DISBURSED",

        disbursedAmount: 0,

        recoveryStatus: "NOT_STARTED",

        totalRecoverableAmount,

        totalRecoveredAmount: 0,

        outstandingAmount: totalRecoverableAmount,

        status: "active",

        isActive: true,

        deletedAt: null,
    });

    return formatEmployeeAdvance(created);
};

// export const getMyEmployeeAdvancesService = async ({
//     schoolSlug,
//     userSlug,
//     query = {},
// }) => {
//     const employee = await findCurrentAdvanceEmployeeRepo({
//         schoolSlug,

//         userSlug,
//     });

//     if (!employee) {
//         throw new Error("Employee profile not found for logged in user");
//     }

//     const rows = await getMyEmployeeAdvancesRepo({
//         schoolSlug,

//         employeeSlug: employee.slug,

//         requestStatus: query.requestStatus || undefined,

//         search: query.search?.trim() || undefined,

//         isActive: resolveActiveStatus(query.status),
//     });

//     return rows.map(formatEmployeeAdvance);
// };

export const getMyEmployeeAdvancesService = async ({
    schoolSlug,
    user,
    query = {},
}) => {
    if (user?.role === "SUPER_ADMIN" || user?.role === "SCHOOL_ADMIN") {
        return [];
    }

    const employee = await findCurrentAdvanceEmployeeRepo({
        schoolSlug,

        userSlug: user.slug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const rows = await getMyEmployeeAdvancesRepo({
        schoolSlug,

        employeeSlug: employee.slug,

        requestStatus: query.requestStatus || undefined,

        search: query.search?.trim() || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    return rows.map(formatEmployeeAdvance);
};

export const getAllEmployeeAdvancesService = async ({
    schoolSlug,
    user,
    query = {},
}) => {
    if (!canManageAdvance(user)) {
        throw new Error("You are not authorized to view all employee advances");
    }

    const rows = await getAllEmployeeAdvancesRepo({
        schoolSlug,

        employeeSlug: query.employeeSlug || undefined,

        departmentSlug: query.departmentSlug || undefined,

        requestStatus: query.requestStatus || undefined,

        disbursementStatus: query.disbursementStatus || undefined,

        recoveryStatus: query.recoveryStatus || undefined,

        search: query.search?.trim() || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    return rows.map(formatEmployeeAdvance);
};

export const getEmployeeAdvanceBySlugService = async ({
    schoolSlug,
    advanceSlug,
    user,
}) => {
    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (canManageAdvance(user)) {
        return formatEmployeeAdvance(advance);
    }

    const employee = await findCurrentAdvanceEmployeeRepo({
        schoolSlug,

        userSlug: user.slug,
    });

    if (!employee || advance.employeeSlug !== employee.slug) {
        throw new Error("You are not authorized to view this advance");
    }

    return formatEmployeeAdvance(advance);
};

export const approveEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    payload,
    user,
}) => {
    if (!canManageAdvance(user)) {
        throw new Error("You are not authorized to approve employee advance");
    }

    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (!advance.isActive) {
        throw new Error("Inactive advance cannot be approved");
    }

    if (advance.requestStatus !== "PENDING") {
        throw new Error("Only pending advance can be approved");
    }

    const approvedAmount = roundMoney(payload.approvedAmount);

    const approvedInstallments = Number(payload.approvedInstallments);

    if (approvedAmount > toNumber(advance.requestedAmount)) {
        throw new Error("Approved amount cannot exceed requested amount");
    }

    if (approvedAmount > toNumber(advance.eligibleAmount)) {
        throw new Error("Approved amount cannot exceed eligible amount");
    }

    const minimumAmount = toNumber(advance.minimumAmountSnapshot);

    if (minimumAmount > 0 && approvedAmount < minimumAmount) {
        throw new Error(`Approved amount cannot be less than ${minimumAmount}`);
    }

    if (approvedInstallments > Number(advance.maximumInstallmentsSnapshot)) {
        throw new Error(
            `Maximum ${advance.maximumInstallmentsSnapshot} installments are allowed`,
        );
    }

    const interestAmount = calculateInterestAmount({
        amount: approvedAmount,

        interestType: advance.interestTypeSnapshot,

        interestRate: advance.interestRateSnapshot,

        flatInterestAmount: advance.flatInterestAmountSnapshot,
    });

    const totalRecoverableAmount = roundMoney(approvedAmount + interestAmount);

    const updated = await updateEmployeeAdvanceRepo({
        advanceSlug,

        data: {
            requestStatus: "APPROVED",

            approvedAmount,

            approvedInstallments,

            approvedBy: {
                connect: {
                    slug: user.slug,
                },
            },

            approvedAt: new Date(),

            rejectedBy: {
                disconnect: true,
            },

            rejectedAt: null,

            approvalRemark: payload.remark.trim(),

            interestAmount,

            totalRecoverableAmount,

            totalRecoveredAmount: 0,

            outstandingAmount: totalRecoverableAmount,

            recoveryStatus: "NOT_STARTED",
        },
    });

    return formatEmployeeAdvance(updated);
};

export const rejectEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    payload,
    user,
}) => {
    if (!canManageAdvance(user)) {
        throw new Error("You are not authorized to reject employee advance");
    }

    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (advance.requestStatus !== "PENDING") {
        throw new Error("Only pending advance can be rejected");
    }

    const updated = await updateEmployeeAdvanceRepo({
        advanceSlug,

        data: {
            requestStatus: "REJECTED",

            rejectedBy: {
                connect: {
                    slug: user.slug,
                },
            },

            rejectedAt: new Date(),

            approvedBy: {
                disconnect: true,
            },

            approvedAt: null,

            approvalRemark: payload.remark.trim(),
        },
    });

    return formatEmployeeAdvance(updated);
};

export const cancelEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    payload,
    userSlug,
}) => {
    const employee = await findCurrentAdvanceEmployeeRepo({
        schoolSlug,

        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found");
    }

    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (advance.employeeSlug !== employee.slug) {
        throw new Error("You cannot cancel another employee's advance");
    }

    if (advance.requestStatus !== "PENDING") {
        throw new Error("Only pending advance request can be cancelled");
    }

    const updated = await updateEmployeeAdvanceRepo({
        advanceSlug,

        data: {
            requestStatus: "CANCELLED",

            approvalRemark: payload.remark.trim(),
        },
    });

    return formatEmployeeAdvance(updated);
};

const buildInstallmentSchedule = ({
    schoolSlug,
    advanceSlug,
    employeeSlug,
    totalAmount,
    installments,
    startDate,
}) => {
    const count = Number(installments);

    const roundedTotal = roundMoney(totalAmount);

    const normalAmount = Math.floor((roundedTotal / count) * 100) / 100;

    let allocated = 0;

    return Array.from(
        {
            length: count,
        },
        (_, index) => {
            const installmentNo = index + 1;

            const dueAmount =
                installmentNo === count
                    ? roundMoney(roundedTotal - allocated)
                    : normalAmount;

            allocated = roundMoney(allocated + dueAmount);

            const dueMonth = new Date(startDate);

            dueMonth.setDate(1);

            dueMonth.setMonth(dueMonth.getMonth() + installmentNo);

            dueMonth.setHours(0, 0, 0, 0);

            return {
                slug: randomUUID(),

                schoolSlug,

                advanceSlug,

                employeeSlug,

                installmentNo,

                dueMonth,

                dueAmount,

                recoveredAmount: 0,

                recoveredAt: null,

                payrollSlug: null,

                status: "PENDING",

                remark: null,
            };
        },
    );
};

export const disburseEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    payload,
    user,
}) => {
    if (!canManageAdvance(user)) {
        throw new Error("You are not authorized to disburse employee advance");
    }

    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (advance.requestStatus !== "APPROVED") {
        throw new Error("Only approved advance can be disbursed");
    }

    if (advance.disbursementStatus === "DISBURSED") {
        throw new Error("Advance is already disbursed");
    }

    const approvedAmount = toNumber(advance.approvedAmount);

    const disbursedAmount = roundMoney(payload.disbursedAmount);

    // Current model supports one-time full disbursement.
    if (disbursedAmount !== approvedAmount) {
        throw new Error(
            `Disbursed amount must be equal to approved amount ${approvedAmount}`,
        );
    }

    const totalRecoverableAmount = toNumber(advance.totalRecoverableAmount);

    const installmentRows = buildInstallmentSchedule({
        schoolSlug,

        advanceSlug: advance.slug,

        employeeSlug: advance.employeeSlug,

        totalAmount: totalRecoverableAmount,

        installments: advance.approvedInstallments,

        startDate: new Date(),
    });

    await runEmployeeAdvanceTransactionRepo(async (tx) => {
        await deleteAdvanceInstallmentsRepo({
            advanceSlug: advance.slug,

            db: tx,
        });

        await createAdvanceInstallmentsRepo(installmentRows, tx);

        await updateEmployeeAdvanceRepo({
            advanceSlug: advance.slug,

            db: tx,

            data: {
                disbursementStatus: "DISBURSED",

                disbursedAmount,

                disbursedAt: new Date(),

                paymentMode: payload.paymentMode,

                paymentReference: payload.paymentReference?.trim() || null,

                disbursementRemark: payload.remark?.trim() || null,

                recoveryStatus: "RUNNING",

                outstandingAmount: totalRecoverableAmount,

                totalRecoveredAmount: 0,
            },
        });
    });

    return findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug: advance.slug,
    }).then(formatEmployeeAdvance);
};

export const getAdvanceInstallmentsService = async ({
    schoolSlug,
    advanceSlug,
    user,
}) => {
    await getEmployeeAdvanceBySlugService({
        schoolSlug,

        advanceSlug,

        user,
    });

    const rows = await getAdvanceInstallmentsRepo({
        schoolSlug,

        advanceSlug,
    });

    return rows.map((item) => ({
        slug: item.slug,

        installmentNo: item.installmentNo,

        dueMonth: item.dueMonth,

        dueAmount: toNumber(item.dueAmount),

        recoveredAmount: toNumber(item.recoveredAmount),

        remainingAmount: roundMoney(
            toNumber(item.dueAmount) - toNumber(item.recoveredAmount),
        ),

        recoveredAt: item.recoveredAt,

        payrollSlug: item.payrollSlug,

        status: item.status,

        remark: item.remark,
    }));
};

export const recoverAdvanceInstallmentService = async ({
    schoolSlug,
    advanceSlug,
    installmentSlug,
    payload,
    user,
}) => {
    if (!canManageAdvance(user)) {
        throw new Error("You are not authorized to recover advance installment");
    }

    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (advance.disbursementStatus !== "DISBURSED") {
        throw new Error("Advance has not been disbursed");
    }

    if (advance.recoveryStatus === "COMPLETED") {
        throw new Error("Advance recovery is already completed");
    }

    const installment = await findAdvanceInstallmentBySlugRepo({
        schoolSlug,

        advanceSlug,

        installmentSlug,
    });

    if (!installment) {
        throw new Error("Advance installment not found");
    }

    const dueAmount = toNumber(installment.dueAmount);

    const alreadyRecovered = toNumber(installment.recoveredAmount);

    const remaining = roundMoney(dueAmount - alreadyRecovered);

    const recoveryAmount = roundMoney(payload.recoveredAmount);

    if (recoveryAmount > remaining) {
        throw new Error(
            `Recovered amount cannot exceed remaining installment amount ${remaining}`,
        );
    }

    const newRecovered = roundMoney(alreadyRecovered + recoveryAmount);

    const installmentStatus =
        newRecovered >= dueAmount ? "RECOVERED" : "PARTIALLY_RECOVERED";

    await runEmployeeAdvanceTransactionRepo(async (tx) => {
        await updateAdvanceInstallmentRepo({
            installmentSlug,

            db: tx,

            data: {
                recoveredAmount: newRecovered,

                recoveredAt: installmentStatus === "RECOVERED" ? new Date() : null,

                payrollSlug: payload.payrollSlug || installment.payrollSlug || null,

                status: installmentStatus,

                remark: payload.remark?.trim() || installment.remark || null,
            },
        });

        const aggregate = await getAdvanceRecoveredTotalRepo({
            advanceSlug,

            db: tx,
        });

        const totalRecovered = roundMoney(aggregate._sum.recoveredAmount || 0);

        const totalRecoverable = toNumber(advance.totalRecoverableAmount);

        const outstanding = Math.max(
            0,
            roundMoney(totalRecoverable - totalRecovered),
        );

        await updateEmployeeAdvanceRepo({
            advanceSlug,

            db: tx,

            data: {
                totalRecoveredAmount: totalRecovered,

                outstandingAmount: outstanding,

                recoveryStatus: outstanding <= 0 ? "COMPLETED" : "RUNNING",
            },
        });
    });

    const updated = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    return formatEmployeeAdvance(updated);
};

export const deleteEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    user,
}) => {
    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (!advance.isActive) {
        throw new Error("Advance is already deleted");
    }

    if (!["PENDING", "REJECTED", "CANCELLED"].includes(advance.requestStatus)) {
        throw new Error("Approved or disbursed advance cannot be deleted");
    }

    if (!canManageAdvance(user)) {
        const employee = await findCurrentAdvanceEmployeeRepo({
            schoolSlug,

            userSlug: user.slug,
        });

        if (!employee || employee.slug !== advance.employeeSlug) {
            throw new Error("You cannot delete this advance request");
        }
    }

    const updated = await updateEmployeeAdvanceRepo({
        advanceSlug,

        data: {
            status: "inactive",

            isActive: false,

            deletedAt: new Date(),
        },
    });

    return formatEmployeeAdvance(updated);
};

export const restoreEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    user,
}) => {
    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,

        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (advance.isActive) {
        throw new Error("Advance is already active");
    }

    if (!canManageAdvance(user)) {
        const employee = await findCurrentAdvanceEmployeeRepo({
            schoolSlug,

            userSlug: user.slug,
        });

        if (!employee || employee.slug !== advance.employeeSlug) {
            throw new Error("You cannot restore this advance request");
        }
    }

    const updated = await updateEmployeeAdvanceRepo({
        advanceSlug,

        data: {
            status: "active",

            isActive: true,

            deletedAt: null,
        },
    });

    return formatEmployeeAdvance(updated);
};

export const forecloseEmployeeAdvanceService = async ({
    schoolSlug,
    advanceSlug,
    payload,
    user,
}) => {
    if (!canManageAdvance(user)) {
        throw new Error("You are not authorized to settle employee advance");
    }

    const advance = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,
        advanceSlug,
    });

    if (!advance) {
        throw new Error("Employee advance not found");
    }

    if (advance.disbursementStatus !== "DISBURSED") {
        throw new Error("Advance must be disbursed before settlement");
    }

    if (advance.recoveryStatus === "COMPLETED") {
        throw new Error("Advance recovery is already completed");
    }

    const outstandingAmount = roundMoney(advance.outstandingAmount);

    const settlementAmount = roundMoney(payload.amount);

    if (settlementAmount !== outstandingAmount) {
        throw new Error(`Full settlement amount must be ${outstandingAmount}`);
    }

    const installments = await getPendingAdvanceInstallmentsRepo({
        advanceSlug,
    });

    await runEmployeeAdvanceTransactionRepo(async (tx) => {
        let remaining = settlementAmount;

        for (const installment of installments) {
            if (remaining <= 0) {
                break;
            }

            const dueAmount = toNumber(installment.dueAmount);

            const alreadyRecovered = toNumber(installment.recoveredAmount);

            const installmentRemaining = roundMoney(dueAmount - alreadyRecovered);

            const recoverNow = Math.min(installmentRemaining, remaining);

            const newRecovered = roundMoney(alreadyRecovered + recoverNow);

            remaining = roundMoney(remaining - recoverNow);

            await updateAdvanceInstallmentRepo({
                installmentSlug: installment.slug,

                db: tx,

                data: {
                    recoveredAmount: newRecovered,

                    recoveredAt: new Date(),

                    status: "SETTLED",

                    remark: payload.remark.trim(),
                },
            });
        }

        await updateEmployeeAdvanceRepo({
            advanceSlug,

            db: tx,

            data: {
                totalRecoveredAmount: toNumber(advance.totalRecoverableAmount),

                outstandingAmount: 0,

                recoveryStatus: "COMPLETED",

                isForeclosed: true,

                foreclosedAt: new Date(),

                foreclosedBy: {
                    connect: {
                        slug: user.slug,
                    },
                },

                foreclosureAmount: settlementAmount,

                foreclosureRemark: payload.remark.trim(),
            },
        });
    });

    const updated = await findEmployeeAdvanceBySlugRepo({
        schoolSlug,
        advanceSlug,
    });

    return formatEmployeeAdvance(updated);
};
