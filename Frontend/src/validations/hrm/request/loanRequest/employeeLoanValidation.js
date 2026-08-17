import { z } from "zod";

export const employeeLoanInitialValues = {
    loanAmount: "",
    loanInterestSlug: "",
    reason: "",
};

export const employeeLoanApprovalInitialValues = {
    approvedAmount: "",
    loanInterestSlug: "",
    remark: "",
};

export const employeeLoanActionInitialValues = {
    remark: "",
};

export const employeeLoanDisbursementInitialValues = {
    disbursedAmount: "",
    paymentMode: "",
    paymentReference: "",
    remark: "",
};

export const employeeLoanRecoveryInitialValues = {
    recoveredAmount: "",
    payrollSlug: "",
    remark: "",
};

export const employeeLoanForeclosureInitialValues = {
    settlementAmount: "",
    remark: "",
};

export const createEmployeeLoanSchema = z.object({
    loanAmount: z.coerce
        .number({
            invalid_type_error: "Loan amount is required",
        })
        .positive("Loan amount must be greater than 0"),

    loanInterestSlug: z.string().trim().min(1, "Loan repayment plan is required"),

    reason: z
        .string()
        .trim()
        .min(3, "Reason must be at least 3 characters")
        .max(500, "Reason cannot exceed 500 characters"),
});

export const approveEmployeeLoanSchema = z.object({
    approvedAmount: z.coerce
        .number({
            invalid_type_error: "Approved amount is required",
        })
        .positive("Approved amount must be greater than 0"),

    loanInterestSlug: z
        .string()
        .trim()
        .min(1, "Approved repayment plan is required"),

    remark: z
        .string()
        .trim()
        .min(1, "Approval remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const rejectEmployeeLoanSchema = z.object({
    remark: z
        .string()
        .trim()
        .min(1, "Rejection remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const cancelEmployeeLoanSchema = z.object({
    remark: z
        .string()
        .trim()
        .min(1, "Cancellation remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const disburseEmployeeLoanSchema = z.object({
    disbursedAmount: z.coerce
        .number({
            invalid_type_error: "Disbursed amount is required",
        })
        .positive("Disbursed amount must be greater than 0"),

    paymentMode: z.enum(["CASH", "BANK_TRANSFER", "UPI", "CHEQUE", "OTHER"], {
        errorMap: () => ({
            message: "Payment mode is required",
        }),
    }),

    paymentReference: z
        .string()
        .trim()
        .max(150, "Payment reference cannot exceed 150 characters")
        .optional()
        .nullable(),

    remark: z
        .string()
        .trim()
        .max(500, "Remark cannot exceed 500 characters")
        .optional()
        .nullable(),
});

export const recoverEmployeeLoanInstallmentSchema = z.object({
    recoveredAmount: z.coerce
        .number({
            invalid_type_error: "Recovered amount is required",
        })
        .positive("Recovered amount must be greater than 0"),

    payrollSlug: z.string().trim().optional().nullable(),

    remark: z
        .string()
        .trim()
        .max(500, "Remark cannot exceed 500 characters")
        .optional()
        .nullable(),
});

export const forecloseEmployeeLoanSchema = z.object({
    settlementAmount: z.coerce
        .number({
            invalid_type_error: "Settlement amount is required",
        })
        .positive("Settlement amount must be greater than 0"),

    remark: z
        .string()
        .trim()
        .min(1, "Foreclosure remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const buildEmployeeLoanPayload = (form) => ({
    loanAmount:
        form?.loanAmount === "" ||
            form?.loanAmount === null ||
            form?.loanAmount === undefined
            ? ""
            : Number(form.loanAmount),

    loanInterestSlug: form?.loanInterestSlug?.trim() || "",

    reason: form?.reason?.trim() || "",
});

export const buildApproveEmployeeLoanPayload = (form) => ({
    approvedAmount:
        form?.approvedAmount === "" ||
            form?.approvedAmount === null ||
            form?.approvedAmount === undefined
            ? ""
            : Number(form.approvedAmount),

    loanInterestSlug: form?.loanInterestSlug?.trim() || "",

    remark: form?.remark?.trim() || "",
});

export const buildRejectEmployeeLoanPayload = (remark) => ({
    remark: typeof remark === "string" ? remark.trim() : "",
});

export const buildCancelEmployeeLoanPayload = (remark) => ({
    remark: typeof remark === "string" ? remark.trim() : "",
});

export const buildDisburseEmployeeLoanPayload = (form) => ({
    disbursedAmount:
        form?.disbursedAmount === "" ||
            form?.disbursedAmount === null ||
            form?.disbursedAmount === undefined
            ? ""
            : Number(form.disbursedAmount),

    paymentMode: form?.paymentMode || "",

    paymentReference: form?.paymentReference?.trim() || null,

    remark: form?.remark?.trim() || null,
});

export const buildRecoverEmployeeLoanInstallmentPayload = (form) => ({
    recoveredAmount:
        form?.recoveredAmount === "" ||
            form?.recoveredAmount === null ||
            form?.recoveredAmount === undefined
            ? ""
            : Number(form.recoveredAmount),

    payrollSlug: form?.payrollSlug?.trim() || null,

    remark: form?.remark?.trim() || null,
});

export const buildForecloseEmployeeLoanPayload = (form) => ({
    settlementAmount:
        form?.settlementAmount === "" ||
            form?.settlementAmount === null ||
            form?.settlementAmount === undefined
            ? ""
            : Number(form.settlementAmount),

    remark: form?.remark?.trim() || "",
});

export const validateEmployeeLoanRequest = (form) => {
    const payload = buildEmployeeLoanPayload(form);

    return createEmployeeLoanSchema.safeParse(payload);
};

export const validateEmployeeLoanApproval = (form) => {
    const payload = buildApproveEmployeeLoanPayload(form);

    return approveEmployeeLoanSchema.safeParse(payload);
};

export const validateEmployeeLoanRejection = (remark) => {
    const payload = buildRejectEmployeeLoanPayload(remark);

    return rejectEmployeeLoanSchema.safeParse(payload);
};

export const validateEmployeeLoanCancellation = (remark) => {
    const payload = buildCancelEmployeeLoanPayload(remark);

    return cancelEmployeeLoanSchema.safeParse(payload);
};

export const validateEmployeeLoanDisbursement = (form) => {
    const payload = buildDisburseEmployeeLoanPayload(form);

    return disburseEmployeeLoanSchema.safeParse(payload);
};

export const validateEmployeeLoanInstallmentRecovery = (form) => {
    const payload = buildRecoverEmployeeLoanInstallmentPayload(form);

    return recoverEmployeeLoanInstallmentSchema.safeParse(payload);
};

export const validateEmployeeLoanForeclosure = (form) => {
    const payload = buildForecloseEmployeeLoanPayload(form);

    return forecloseEmployeeLoanSchema.safeParse(payload);
};

export const buildEmployeeLoanApprovalForm = (loan) => ({
    approvedAmount:
        loan?.requestedAmount !== null && loan?.requestedAmount !== undefined
            ? String(loan.requestedAmount)
            : "",

    loanInterestSlug: loan?.loanPlan?.slug || "",

    remark: "",
});

export const buildEmployeeLoanDisbursementForm = (loan) => ({
    disbursedAmount:
        loan?.approvedAmount !== null && loan?.approvedAmount !== undefined
            ? String(loan.approvedAmount)
            : "",

    paymentMode: "",
    paymentReference: "",
    remark: "",
});

export const buildEmployeeLoanRecoveryForm = (installment) => {
    const installmentAmount = Number(installment?.installmentAmount || 0);

    const recoveredAmount = Number(installment?.recoveredAmount || 0);

    const remainingAmount = Math.max(0, installmentAmount - recoveredAmount);

    return {
        recoveredAmount: remainingAmount > 0 ? String(remainingAmount) : "",

        payrollSlug: "",
        remark: "",
    };
};

export const buildEmployeeLoanForeclosureForm = (preview) => ({
    settlementAmount:
        preview?.settlementAmount !== null &&
            preview?.settlementAmount !== undefined
            ? String(preview.settlementAmount)
            : "",

    remark: "",
});

export const calculateLoanEmiPreview = ({
    principal,
    annualInterest,
    durationMonths,
}) => {
    const loanAmount = Number(principal);

    const rate = Number(annualInterest);

    const months = Number(durationMonths);

    if (
        !Number.isFinite(loanAmount) ||
        loanAmount <= 0 ||
        !Number.isFinite(months) ||
        months <= 0
    ) {
        return 0;
    }

    if (!Number.isFinite(rate) || rate === 0) {
        return Math.round((loanAmount / months) * 100) / 100;
    }

    const monthlyRate = rate / 12 / 100;

    const factor = Math.pow(1 + monthlyRate, months);

    const emi = (loanAmount * monthlyRate * factor) / (factor - 1);

    return Math.round((emi + Number.EPSILON) * 100) / 100;
};
