import { randomUUID } from "crypto";

import {
    runEmployeeLoanTransactionRepo,
    findCurrentLoanEmployeeRepo,
    getActiveLoanSettingRepo,
    getActiveLoanInterestPlansRepo,
    findActiveLoanInterestPlanRepo,
    findOpenEmployeeLoanRepo,
    createEmployeeLoanRepo,
    findEmployeeLoanBySlugRepo,
    getMyEmployeeLoansRepo,
    getAllEmployeeLoansRepo,
    updateEmployeeLoanRepo,
    createEmployeeLoanInstallmentsRepo,
    deleteEmployeeLoanInstallmentsRepo,
    getEmployeeLoanInstallmentsRepo,
    findEmployeeLoanInstallmentBySlugRepo,
    updateEmployeeLoanInstallmentRepo,
    getEmployeeLoanRecoveryTotalsRepo,
    getPendingEmployeeLoanInstallmentsRepo,
} from "../../../../repositories/hrm/request/loanRequest/employeeLoan.repository.js";

import { getEmployeeSalaryStructureService } from "../../../hrm/employee/employeeSalaryStructure.service.js";

const toNumber = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
};

const roundMoney = (value) => {
    return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
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

const canManageLoan = (user) => {
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "HR"].includes(user?.role);
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

const calculateEmi = ({ principal, annualInterest, durationMonths }) => {
    const P = toNumber(principal);

    const n = Number(durationMonths);

    const annualRate = toNumber(annualInterest);

    if (P <= 0 || n <= 0) {
        return 0;
    }

    if (annualRate === 0) {
        return roundMoney(P / n);
    }

    const monthlyRate = annualRate / 12 / 100;

    const factor = Math.pow(1 + monthlyRate, n);

    const emi = (P * monthlyRate * factor) / (factor - 1);

    return roundMoney(emi);
};

const calculateEligibleLoanAmount = ({ setting, basicSalary, grossSalary }) => {
    const salaryBasisAmount =
        setting.salaryBasis === "BASIC"
            ? toNumber(basicSalary)
            : toNumber(grossSalary);

    let eligibleAmount =
        salaryBasisAmount * toNumber(setting.maximumSalaryMultiple);

    const maximumLoanAmount =
        setting.maximumLoanAmount !== null &&
            setting.maximumLoanAmount !== undefined
            ? toNumber(setting.maximumLoanAmount)
            : null;

    if (maximumLoanAmount !== null && maximumLoanAmount > 0) {
        eligibleAmount = Math.min(eligibleAmount, maximumLoanAmount);
    }

    return {
        salaryBasisAmount: roundMoney(salaryBasisAmount),

        eligibleAmount: roundMoney(eligibleAmount),
    };
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

const formatLoan = (item) => {
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

        loanPlan: item.loanInterest
            ? {
                slug: item.loanInterest.slug,

                durationMonths: item.loanInterest.durationMonths,

                annualInterest: toNumber(item.loanInterest.annualInterest),
            }
            : null,

        requestDate: item.requestDate,

        reason: item.reason,

        requestedAmount: toNumber(item.requestedAmount),

        eligibleAmount: toNumber(item.eligibleAmount),

        requestStatus: item.requestStatus,

        requestedDurationMonths: item.requestedDurationMonths,

        requestedAnnualInterest: toNumber(item.requestedAnnualInterest),

        requestedEmi: toNumber(item.requestedEmi),

        approvedAmount:
            item.approvedAmount !== null && item.approvedAmount !== undefined
                ? toNumber(item.approvedAmount)
                : null,

        approvedDurationMonths: item.approvedDurationMonths,

        approvedAnnualInterest:
            item.approvedAnnualInterest !== null &&
                item.approvedAnnualInterest !== undefined
                ? toNumber(item.approvedAnnualInterest)
                : null,

        approvedEmi:
            item.approvedEmi !== null && item.approvedEmi !== undefined
                ? toNumber(item.approvedEmi)
                : null,

        approvedBy: formatUser(item.approvedBy),

        approvedAt: item.approvedAt,

        rejectedBy: formatUser(item.rejectedBy),

        rejectedAt: item.rejectedAt,

        approvalRemark: item.approvalRemark,

        disbursementStatus: item.disbursementStatus,

        disbursedAmount: toNumber(item.disbursedAmount),

        disbursedAt: item.disbursedAt,

        paymentMode: item.paymentMode,

        paymentReference: item.paymentReference,

        disbursementRemark: item.disbursementRemark,

        totalPrincipal: toNumber(item.totalPrincipal),

        totalInterest: toNumber(item.totalInterest),

        totalRecoverableAmount: toNumber(item.totalRecoverableAmount),

        totalRecoveredAmount: toNumber(item.totalRecoveredAmount),

        outstandingAmount: toNumber(item.outstandingAmount),

        outstandingPrincipal: toNumber(item.outstandingPrincipal),

        recoveryStatus: item.recoveryStatus,

        isForeclosed: item.isForeclosed,

        foreclosedAt: item.foreclosedAt,

        foreclosedBy: formatUser(item.foreclosedBy),

        foreclosurePrincipal:
            item.foreclosurePrincipal !== null &&
                item.foreclosurePrincipal !== undefined
                ? toNumber(item.foreclosurePrincipal)
                : null,

        foreclosureCharge:
            item.foreclosureCharge !== null && item.foreclosureCharge !== undefined
                ? toNumber(item.foreclosureCharge)
                : null,

        foreclosureAmount:
            item.foreclosureAmount !== null && item.foreclosureAmount !== undefined
                ? toNumber(item.foreclosureAmount)
                : null,

        foreclosureInterestRate:
            item.foreclosureInterestRate !== null &&
                item.foreclosureInterestRate !== undefined
                ? toNumber(item.foreclosureInterestRate)
                : null,

        foreclosureRemark: item.foreclosureRemark,

        installments: item.installments || undefined,

        status: item.status,

        isActive: item.isActive,

        deletedAt: item.deletedAt,

        createdAt: item.createdAt,

        updatedAt: item.updatedAt,
    };
};

const resolveLoanEligibility = async ({ schoolSlug, employee }) => {
    const setting = await getActiveLoanSettingRepo({
        schoolSlug,
    });

    if (!setting) {
        throw new Error("Loan settings are not configured");
    }

    const completedMonths = calculateCompletedMonths(employee.joiningDate);

    const requiredMonths = Number(setting.eligibilityAfterMonths || 0);

    if (completedMonths < requiredMonths) {
        throw new Error(
            `Employee is eligible for loan after ${requiredMonths} months of service`,
        );
    }

    const salary = await getEmployeeSalaryStructureService({
        schoolSlug,

        employeeSlug: employee.slug,
    });

    const basicSalary = toNumber(salary.basicSalary);

    const grossSalary = toNumber(salary.grossEarnings);

    if (setting.salaryBasis === "BASIC" && basicSalary <= 0) {
        throw new Error("Employee basic salary is not configured");
    }

    if (setting.salaryBasis === "GROSS" && grossSalary <= 0) {
        throw new Error("Employee gross salary is not configured");
    }

    const { salaryBasisAmount, eligibleAmount } = calculateEligibleLoanAmount({
        setting,
        basicSalary,
        grossSalary,
    });

    if (eligibleAmount <= 0) {
        throw new Error("Employee is not eligible for loan");
    }

    const loanPlans = await getActiveLoanInterestPlansRepo({
        schoolSlug,
    });

    if (!loanPlans.length) {
        throw new Error("No active loan repayment plans are configured");
    }

    return {
        setting,
        salary,
        completedMonths,
        salaryBasisAmount,
        eligibleAmount,
        loanPlans,
    };
};

export const getMyLoanEligibilityService = async ({ schoolSlug, userSlug }) => {
    const employee = await findCurrentLoanEmployeeRepo({
        schoolSlug,
        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const result = await resolveLoanEligibility({
        schoolSlug,
        employee,
    });

    const openLoan = await findOpenEmployeeLoanRepo({
        schoolSlug,

        employeeSlug: employee.slug,
    });

    const blockedByExistingLoan =
        !result.setting.allowMultipleLoan && Boolean(openLoan);

    return {
        employee: {
            slug: employee.slug,

            employeeId: employee.employeeId || employee.employeeCode,

            fullName: employee.fullName,

            joiningDate: employee.joiningDate,

            department: employee.department?.departmentName || "-",

            designation: employee.designation?.designationName || "-",
        },

        setting: {
            eligibilityAfterMonths: result.setting.eligibilityAfterMonths,

            salaryBasis: result.setting.salaryBasis,

            maximumSalaryMultiple: toNumber(result.setting.maximumSalaryMultiple),

            minimumLoanAmount:
                result.setting.minimumLoanAmount !== null
                    ? toNumber(result.setting.minimumLoanAmount)
                    : null,

            maximumLoanAmount:
                result.setting.maximumLoanAmount !== null
                    ? toNumber(result.setting.maximumLoanAmount)
                    : null,

            allowMultipleLoan: result.setting.allowMultipleLoan,

            approvalRequired: result.setting.approvalRequired,

            forecloseInterest: toNumber(result.setting.forecloseInterest),
        },

        completedServiceMonths: result.completedMonths,

        basicSalary: toNumber(result.salary.basicSalary),

        grossSalary: toNumber(result.salary.grossEarnings),

        salaryBasisAmount: result.salaryBasisAmount,

        eligibleAmount: result.eligibleAmount,

        plans: result.loanPlans.map((plan) => ({
            slug: plan.slug,

            durationMonths: plan.durationMonths,

            annualInterest: toNumber(plan.annualInterest),
        })),

        openLoanSlug: openLoan?.slug || null,

        blockedByExistingLoan,

        canApply: !blockedByExistingLoan,
    };
};

export const getLoanPlanPreviewService = async ({
    schoolSlug,
    userSlug,
    loanAmount,
}) => {
    const employee = await findCurrentLoanEmployeeRepo({
        schoolSlug,
        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const eligibility = await resolveLoanEligibility({
        schoolSlug,
        employee,
    });

    const amount = roundMoney(loanAmount);

    if (amount <= 0) {
        throw new Error("Loan amount must be greater than 0");
    }

    if (amount > eligibility.eligibleAmount) {
        throw new Error(
            `Loan amount cannot exceed eligible amount ${eligibility.eligibleAmount}`,
        );
    }

    const minimumLoanAmount =
        eligibility.setting.minimumLoanAmount !== null
            ? toNumber(eligibility.setting.minimumLoanAmount)
            : 0;

    if (minimumLoanAmount > 0 && amount < minimumLoanAmount) {
        throw new Error(`Minimum loan amount is ${minimumLoanAmount}`);
    }

    return eligibility.loanPlans.map((plan) => ({
        slug: plan.slug,

        durationMonths: plan.durationMonths,

        annualInterest: toNumber(plan.annualInterest),

        emi: calculateEmi({
            principal: amount,

            annualInterest: plan.annualInterest,

            durationMonths: plan.durationMonths,
        }),
    }));
};

export const createEmployeeLoanService = async ({
    schoolSlug,
    userSlug,
    payload,
}) => {
    const employee = await findCurrentLoanEmployeeRepo({
        schoolSlug,
        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const eligibility = await resolveLoanEligibility({
        schoolSlug,
        employee,
    });

    const setting = eligibility.setting;

    if (!setting.allowMultipleLoan) {
        const openLoan = await findOpenEmployeeLoanRepo({
            schoolSlug,

            employeeSlug: employee.slug,
        });

        if (openLoan) {
            throw new Error("Employee already has an active loan request");
        }
    }

    const loanPlan = await findActiveLoanInterestPlanRepo({
        schoolSlug,

        loanInterestSlug: payload.loanInterestSlug,
    });

    if (!loanPlan) {
        throw new Error("Selected loan repayment plan is not available");
    }

    const requestedAmount = roundMoney(payload.loanAmount);

    if (requestedAmount > eligibility.eligibleAmount) {
        throw new Error(
            `Loan amount cannot exceed eligible amount ${eligibility.eligibleAmount}`,
        );
    }

    const minimumLoanAmount =
        setting.minimumLoanAmount !== null
            ? toNumber(setting.minimumLoanAmount)
            : 0;

    if (minimumLoanAmount > 0 && requestedAmount < minimumLoanAmount) {
        throw new Error(`Minimum loan amount is ${minimumLoanAmount}`);
    }

    const requestedEmi = calculateEmi({
        principal: requestedAmount,

        annualInterest: loanPlan.annualInterest,

        durationMonths: loanPlan.durationMonths,
    });

    const autoApproved = setting.approvalRequired === false;

    const created = await createEmployeeLoanRepo({
        slug: randomUUID(),

        schoolSlug,

        employeeSlug: employee.slug,

        loanInterestSlug: loanPlan.slug,

        requestDate: new Date(),

        reason: payload.reason.trim(),

        requestedAmount,

        eligibleAmount: eligibility.eligibleAmount,

        requestStatus: autoApproved ? "APPROVED" : "PENDING",

        requestedDurationMonths: loanPlan.durationMonths,

        requestedAnnualInterest: loanPlan.annualInterest,

        requestedEmi,

        approvedAmount: autoApproved ? requestedAmount : null,

        approvedDurationMonths: autoApproved ? loanPlan.durationMonths : null,

        approvedAnnualInterest: autoApproved ? loanPlan.annualInterest : null,

        approvedEmi: autoApproved ? requestedEmi : null,

        approvedAt: autoApproved ? new Date() : null,

        approvalRemark: autoApproved ? "Auto approved as per loan settings" : null,

        disbursementStatus: "NOT_DISBURSED",

        disbursedAmount: 0,

        totalPrincipal: autoApproved ? requestedAmount : 0,

        totalInterest: 0,

        totalRecoverableAmount: 0,

        totalRecoveredAmount: 0,

        outstandingAmount: 0,

        outstandingPrincipal: autoApproved ? requestedAmount : 0,

        recoveryStatus: "NOT_STARTED",

        isForeclosed: false,

        status: "active",

        isActive: true,

        deletedAt: null,
    });

    return formatLoan(created);
};

export const getMyEmployeeLoansService = async ({
    schoolSlug,
    userSlug,
    query = {},
}) => {
    const employee = await findCurrentLoanEmployeeRepo({
        schoolSlug,
        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found for logged in user");
    }

    const rows = await getMyEmployeeLoansRepo({
        schoolSlug,

        employeeSlug: employee.slug,

        requestStatus: query.requestStatus || undefined,

        recoveryStatus: query.recoveryStatus || undefined,

        search: query.search?.trim() || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    return rows.map(formatLoan);
};

export const getAllEmployeeLoansService = async ({
    schoolSlug,
    user,
    query = {},
}) => {
    if (!canManageLoan(user)) {
        throw new Error("You are not authorized to view employee loans");
    }

    if (!schoolSlug) {
        throw new Error("School could not be resolved for logged in user");
    }

    const rows = await getAllEmployeeLoansRepo({
        schoolSlug,

        employeeSlug: query.employeeSlug || undefined,

        departmentSlug: query.departmentSlug || undefined,

        requestStatus: query.requestStatus || undefined,

        disbursementStatus: query.disbursementStatus || undefined,

        recoveryStatus: query.recoveryStatus || undefined,

        search: query.search?.trim() || undefined,

        isActive: resolveActiveStatus(query.status),
    });

    return rows.map(formatLoan);
};

export const getEmployeeLoanBySlugService = async ({
    schoolSlug,
    loanSlug,
    user,
}) => {
    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (canManageLoan(user)) {
        return formatLoan(loan);
    }

    const employee = await findCurrentLoanEmployeeRepo({
        schoolSlug,

        userSlug: user.slug,
    });

    if (!employee || loan.employeeSlug !== employee.slug) {
        throw new Error("You are not authorized to view this loan");
    }

    return formatLoan(loan);
};

export const approveEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    payload,
    user,
}) => {
    if (!canManageLoan(user)) {
        throw new Error("You are not authorized to approve employee loan");
    }

    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (!loan.isActive) {
        throw new Error("Inactive loan cannot be approved");
    }

    if (loan.requestStatus !== "PENDING") {
        throw new Error("Only pending loan can be approved");
    }

    const approvedAmount = roundMoney(payload.approvedAmount);

    if (approvedAmount > toNumber(loan.requestedAmount)) {
        throw new Error("Approved amount cannot exceed requested amount");
    }

    if (approvedAmount > toNumber(loan.eligibleAmount)) {
        throw new Error("Approved amount cannot exceed eligible amount");
    }

    const setting = await getActiveLoanSettingRepo({
        schoolSlug,
    });

    if (!setting) {
        throw new Error("Loan settings are not configured");
    }

    const minimumLoanAmount =
        setting.minimumLoanAmount !== null
            ? toNumber(setting.minimumLoanAmount)
            : 0;

    if (minimumLoanAmount > 0 && approvedAmount < minimumLoanAmount) {
        throw new Error(`Approved amount cannot be less than ${minimumLoanAmount}`);
    }

    const loanPlan = await findActiveLoanInterestPlanRepo({
        schoolSlug,

        loanInterestSlug: payload.loanInterestSlug,
    });

    if (!loanPlan) {
        throw new Error("Selected repayment plan is not available");
    }

    const approvedEmi = calculateEmi({
        principal: approvedAmount,

        annualInterest: loanPlan.annualInterest,

        durationMonths: loanPlan.durationMonths,
    });

    const updated = await updateEmployeeLoanRepo({
        loanSlug,

        data: {
            loanInterest: {
                connect: {
                    slug: loanPlan.slug,
                },
            },

            requestStatus: "APPROVED",

            approvedAmount,

            approvedDurationMonths: loanPlan.durationMonths,

            approvedAnnualInterest: loanPlan.annualInterest,

            approvedEmi,

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

            totalPrincipal: approvedAmount,

            outstandingPrincipal: approvedAmount,

            recoveryStatus: "NOT_STARTED",
        },
    });

    return formatLoan(updated);
};

export const rejectEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    payload,
    user,
}) => {
    if (!canManageLoan(user)) {
        throw new Error("You are not authorized to reject employee loan");
    }

    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (loan.requestStatus !== "PENDING") {
        throw new Error("Only pending loan can be rejected");
    }

    const updated = await updateEmployeeLoanRepo({
        loanSlug,

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

    return formatLoan(updated);
};

export const cancelEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    payload,
    userSlug,
}) => {
    const employee = await findCurrentLoanEmployeeRepo({
        schoolSlug,
        userSlug,
    });

    if (!employee) {
        throw new Error("Employee profile not found");
    }

    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (loan.employeeSlug !== employee.slug) {
        throw new Error("You cannot cancel another employee's loan request");
    }

    if (loan.requestStatus !== "PENDING") {
        throw new Error("Only pending loan request can be cancelled");
    }

    const updated = await updateEmployeeLoanRepo({
        loanSlug,

        data: {
            requestStatus: "CANCELLED",

            approvalRemark: payload.remark.trim(),
        },
    });

    return formatLoan(updated);
};

const buildLoanInstallmentSchedule = ({
    schoolSlug,
    loanSlug,
    employeeSlug,
    principal,
    annualInterest,
    durationMonths,
    startDate,
}) => {
    const P = roundMoney(principal);

    const rate = toNumber(annualInterest);

    const months = Number(durationMonths);

    const monthlyRate = rate / 12 / 100;

    const emi = calculateEmi({
        principal: P,
        annualInterest: rate,
        durationMonths: months,
    });

    let openingPrincipal = P;

    const rows = [];

    for (let index = 0; index < months; index += 1) {
        const installmentNo = index + 1;

        const interestAmount =
            rate === 0 ? 0 : roundMoney(openingPrincipal * monthlyRate);

        let principalAmount = roundMoney(emi - interestAmount);

        let installmentAmount = emi;

        if (installmentNo === months) {
            principalAmount = roundMoney(openingPrincipal);

            installmentAmount = roundMoney(principalAmount + interestAmount);
        }

        const closingPrincipal = Math.max(
            0,
            roundMoney(openingPrincipal - principalAmount),
        );

        const dueMonth = new Date(startDate);

        dueMonth.setDate(1);

        dueMonth.setMonth(dueMonth.getMonth() + installmentNo);

        dueMonth.setHours(0, 0, 0, 0);

        rows.push({
            slug: randomUUID(),

            schoolSlug,

            loanSlug,

            employeeSlug,

            installmentNo,

            dueMonth,

            openingPrincipal: roundMoney(openingPrincipal),

            installmentAmount,

            principalAmount,

            interestAmount,

            closingPrincipal,

            recoveredAmount: 0,

            recoveredPrincipal: 0,

            recoveredInterest: 0,

            recoveredAt: null,

            payrollSlug: null,

            status: "PENDING",

            remark: null,
        });

        openingPrincipal = closingPrincipal;
    }

    return rows;
};

export const disburseEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    payload,
    user,
}) => {
    if (!canManageLoan(user)) {
        throw new Error("You are not authorized to disburse employee loan");
    }

    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (loan.requestStatus !== "APPROVED") {
        throw new Error("Only approved loan can be disbursed");
    }

    if (loan.disbursementStatus === "DISBURSED") {
        throw new Error("Loan is already disbursed");
    }

    const approvedAmount = roundMoney(loan.approvedAmount);

    const disbursedAmount = roundMoney(payload.disbursedAmount);

    if (disbursedAmount !== approvedAmount) {
        throw new Error(
            `Disbursed amount must be equal to approved amount ${approvedAmount}`,
        );
    }

    const schedule = buildLoanInstallmentSchedule({
        schoolSlug,

        loanSlug: loan.slug,

        employeeSlug: loan.employeeSlug,

        principal: approvedAmount,

        annualInterest: loan.approvedAnnualInterest,

        durationMonths: loan.approvedDurationMonths,

        startDate: new Date(),
    });

    const totalInterest = roundMoney(
        schedule.reduce(
            (total, installment) => total + toNumber(installment.interestAmount),
            0,
        ),
    );

    const totalRecoverableAmount = roundMoney(
        schedule.reduce(
            (total, installment) => total + toNumber(installment.installmentAmount),
            0,
        ),
    );

    await runEmployeeLoanTransactionRepo(async (tx) => {
        await deleteEmployeeLoanInstallmentsRepo({
            loanSlug: loan.slug,

            db: tx,
        });

        await createEmployeeLoanInstallmentsRepo(schedule, tx);

        await updateEmployeeLoanRepo({
            loanSlug: loan.slug,

            db: tx,

            data: {
                disbursementStatus: "DISBURSED",

                disbursedAmount,

                disbursedAt: new Date(),

                paymentMode: payload.paymentMode,

                paymentReference: payload.paymentReference?.trim() || null,

                disbursementRemark: payload.remark?.trim() || null,

                totalPrincipal: approvedAmount,

                totalInterest,

                totalRecoverableAmount,

                totalRecoveredAmount: 0,

                outstandingAmount: totalRecoverableAmount,

                outstandingPrincipal: approvedAmount,

                recoveryStatus: "RUNNING",
            },
        });
    });

    const updated = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    return formatLoan(updated);
};

export const getEmployeeLoanInstallmentsService = async ({
    schoolSlug,
    loanSlug,
    user,
}) => {
    await getEmployeeLoanBySlugService({
        schoolSlug,
        loanSlug,
        user,
    });

    const rows = await getEmployeeLoanInstallmentsRepo({
        schoolSlug,
        loanSlug,
    });

    return rows.map((item) => ({
        slug: item.slug,

        installmentNo: item.installmentNo,

        dueMonth: item.dueMonth,

        openingPrincipal: toNumber(item.openingPrincipal),

        installmentAmount: toNumber(item.installmentAmount),

        principalAmount: toNumber(item.principalAmount),

        interestAmount: toNumber(item.interestAmount),

        closingPrincipal: toNumber(item.closingPrincipal),

        recoveredAmount: toNumber(item.recoveredAmount),

        recoveredPrincipal: toNumber(item.recoveredPrincipal),

        recoveredInterest: toNumber(item.recoveredInterest),

        remainingAmount: roundMoney(
            toNumber(item.installmentAmount) - toNumber(item.recoveredAmount),
        ),

        recoveredAt: item.recoveredAt,

        payrollSlug: item.payrollSlug,

        status: item.status,

        remark: item.remark,
    }));
};

export const recoverEmployeeLoanInstallmentService = async ({
    schoolSlug,
    loanSlug,
    installmentSlug,
    payload,
    user,
}) => {
    if (!canManageLoan(user)) {
        throw new Error("You are not authorized to recover loan installment");
    }

    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (loan.disbursementStatus !== "DISBURSED") {
        throw new Error("Loan has not been disbursed");
    }

    if (loan.recoveryStatus === "COMPLETED") {
        throw new Error("Loan recovery is already completed");
    }

    const installment = await findEmployeeLoanInstallmentBySlugRepo({
        schoolSlug,
        loanSlug,
        installmentSlug,
    });

    if (!installment) {
        throw new Error("Loan installment not found");
    }

    const installmentAmount = toNumber(installment.installmentAmount);

    const alreadyRecovered = toNumber(installment.recoveredAmount);

    const remainingAmount = roundMoney(installmentAmount - alreadyRecovered);

    const recoveryAmount = roundMoney(payload.recoveredAmount);

    if (recoveryAmount > remainingAmount) {
        throw new Error(
            `Recovered amount cannot exceed remaining installment amount ${remainingAmount}`,
        );
    }

    const interestRemaining = Math.max(
        0,
        roundMoney(
            toNumber(installment.interestAmount) -
            toNumber(installment.recoveredInterest),
        ),
    );

    const interestRecoveredNow = Math.min(recoveryAmount, interestRemaining);

    const principalRecoveredNow = roundMoney(
        recoveryAmount - interestRecoveredNow,
    );

    const newRecoveredInterest = roundMoney(
        toNumber(installment.recoveredInterest) + interestRecoveredNow,
    );

    const newRecoveredPrincipal = roundMoney(
        toNumber(installment.recoveredPrincipal) + principalRecoveredNow,
    );

    const newRecoveredAmount = roundMoney(alreadyRecovered + recoveryAmount);

    const installmentStatus =
        newRecoveredAmount >= installmentAmount
            ? "RECOVERED"
            : "PARTIALLY_RECOVERED";

    await runEmployeeLoanTransactionRepo(async (tx) => {
        await updateEmployeeLoanInstallmentRepo({
            installmentSlug,

            db: tx,

            data: {
                recoveredAmount: newRecoveredAmount,

                recoveredPrincipal: newRecoveredPrincipal,

                recoveredInterest: newRecoveredInterest,

                recoveredAt: installmentStatus === "RECOVERED" ? new Date() : null,

                payrollSlug: payload.payrollSlug || installment.payrollSlug || null,

                status: installmentStatus,

                remark: payload.remark?.trim() || installment.remark || null,
            },
        });

        const totals = await getEmployeeLoanRecoveryTotalsRepo({
            loanSlug,
            db: tx,
        });

        const totalRecoveredAmount = roundMoney(totals._sum.recoveredAmount || 0);

        const totalRecoveredPrincipal = roundMoney(
            totals._sum.recoveredPrincipal || 0,
        );

        const totalRecoverableAmount = toNumber(loan.totalRecoverableAmount);

        const totalPrincipal = toNumber(loan.totalPrincipal);

        const outstandingAmount = Math.max(
            0,
            roundMoney(totalRecoverableAmount - totalRecoveredAmount),
        );

        const outstandingPrincipal = Math.max(
            0,
            roundMoney(totalPrincipal - totalRecoveredPrincipal),
        );

        await updateEmployeeLoanRepo({
            loanSlug,
            db: tx,

            data: {
                totalRecoveredAmount,

                outstandingAmount,

                outstandingPrincipal,

                recoveryStatus: outstandingAmount <= 0 ? "COMPLETED" : "RUNNING",
            },
        });
    });

    const updated = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    return formatLoan(updated);
};

export const getEmployeeLoanForeclosurePreviewService = async ({
    schoolSlug,
    loanSlug,
    user,
}) => {
    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (!canManageLoan(user)) {
        const employee = await findCurrentLoanEmployeeRepo({
            schoolSlug,

            userSlug: user.slug,
        });

        if (!employee || employee.slug !== loan.employeeSlug) {
            throw new Error("You are not authorized to view loan foreclosure");
        }
    }

    if (loan.disbursementStatus !== "DISBURSED") {
        throw new Error("Loan must be disbursed before foreclosure");
    }

    if (loan.recoveryStatus === "COMPLETED") {
        throw new Error("Loan recovery is already completed");
    }

    const setting = await getActiveLoanSettingRepo({
        schoolSlug,
    });

    if (!setting) {
        throw new Error("Loan settings are not configured");
    }

    const outstandingPrincipal = roundMoney(loan.outstandingPrincipal);

    const foreclosureInterestRate = toNumber(setting.forecloseInterest);

    const foreclosureCharge = roundMoney(
        (outstandingPrincipal * foreclosureInterestRate) / 100,
    );

    const settlementAmount = roundMoney(outstandingPrincipal + foreclosureCharge);

    return {
        loanSlug: loan.slug,

        outstandingPrincipal,

        foreclosureInterestRate,

        foreclosureCharge,

        settlementAmount,
    };
};

export const forecloseEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    payload,
    user,
}) => {
    if (!canManageLoan(user)) {
        throw new Error("You are not authorized to foreclose employee loan");
    }

    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (loan.disbursementStatus !== "DISBURSED") {
        throw new Error("Loan must be disbursed before foreclosure");
    }

    if (loan.recoveryStatus === "COMPLETED") {
        throw new Error("Loan recovery is already completed");
    }

    const setting = await getActiveLoanSettingRepo({
        schoolSlug,
    });

    if (!setting) {
        throw new Error("Loan settings are not configured");
    }

    const outstandingPrincipal = roundMoney(loan.outstandingPrincipal);

    const foreclosureInterestRate = toNumber(setting.forecloseInterest);

    const foreclosureCharge = roundMoney(
        (outstandingPrincipal * foreclosureInterestRate) / 100,
    );

    const settlementAmount = roundMoney(outstandingPrincipal + foreclosureCharge);

    const submittedSettlementAmount = roundMoney(payload.settlementAmount);

    if (submittedSettlementAmount !== settlementAmount) {
        throw new Error(
            `Foreclosure settlement amount must be ${settlementAmount}`,
        );
    }

    const pendingInstallments = await getPendingEmployeeLoanInstallmentsRepo({
        loanSlug,
    });

    await runEmployeeLoanTransactionRepo(async (tx) => {
        for (const installment of pendingInstallments) {
            await updateEmployeeLoanInstallmentRepo({
                installmentSlug: installment.slug,

                db: tx,

                data: {
                    status: "SETTLED",

                    recoveredAt: new Date(),

                    remark: payload.remark.trim(),
                },
            });
        }

        const previousRecovered = toNumber(loan.totalRecoveredAmount);

        const finalRecoveredAmount = roundMoney(
            previousRecovered + settlementAmount,
        );

        await updateEmployeeLoanRepo({
            loanSlug,
            db: tx,

            data: {
                isForeclosed: true,

                foreclosedAt: new Date(),

                foreclosedBy: {
                    connect: {
                        slug: user.slug,
                    },
                },

                foreclosurePrincipal: outstandingPrincipal,

                foreclosureCharge,

                foreclosureAmount: settlementAmount,

                foreclosureInterestRate,

                foreclosureRemark: payload.remark.trim(),

                totalRecoveredAmount: finalRecoveredAmount,

                totalRecoverableAmount: finalRecoveredAmount,

                outstandingAmount: 0,

                outstandingPrincipal: 0,

                recoveryStatus: "COMPLETED",
            },
        });
    });

    const updated = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    return formatLoan(updated);
};

export const deleteEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    user,
}) => {
    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (!loan.isActive) {
        throw new Error("Loan request is already deleted");
    }

    if (!["PENDING", "REJECTED", "CANCELLED"].includes(loan.requestStatus)) {
        throw new Error("Approved or disbursed loan cannot be deleted");
    }

    if (!canManageLoan(user)) {
        const employee = await findCurrentLoanEmployeeRepo({
            schoolSlug,

            userSlug: user.slug,
        });

        if (!employee || employee.slug !== loan.employeeSlug) {
            throw new Error("You cannot delete this loan request");
        }
    }

    const updated = await updateEmployeeLoanRepo({
        loanSlug,

        data: {
            status: "inactive",

            isActive: false,

            deletedAt: new Date(),
        },
    });

    return formatLoan(updated);
};

export const restoreEmployeeLoanService = async ({
    schoolSlug,
    loanSlug,
    user,
}) => {
    const loan = await findEmployeeLoanBySlugRepo({
        schoolSlug,
        loanSlug,
    });

    if (!loan) {
        throw new Error("Employee loan not found");
    }

    if (loan.isActive) {
        throw new Error("Loan request is already active");
    }

    if (!canManageLoan(user)) {
        const employee = await findCurrentLoanEmployeeRepo({
            schoolSlug,

            userSlug: user.slug,
        });

        if (!employee || employee.slug !== loan.employeeSlug) {
            throw new Error("You cannot restore this loan request");
        }
    }

    const updated = await updateEmployeeLoanRepo({
        loanSlug,

        data: {
            status: "active",

            isActive: true,

            deletedAt: null,
        },
    });

    return formatLoan(updated);
};
