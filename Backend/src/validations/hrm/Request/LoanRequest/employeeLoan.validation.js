import { z } from "zod";

export const createEmployeeLoanSchema = z.object({
    loanAmount: z.coerce.number().positive("Loan amount must be greater than 0"),

    loanInterestSlug: z.string().trim().min(1, "Loan repayment plan is required"),

    reason: z
        .string()
        .trim()
        .min(3, "Reason must be at least 3 characters")
        .max(500, "Reason cannot exceed 500 characters"),
});

export const approveEmployeeLoanSchema = z.object({
    approvedAmount: z.coerce
        .number()
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
        .number()
        .positive("Disbursed amount must be greater than 0"),

    paymentMode: z.enum(["CASH", "BANK_TRANSFER", "UPI", "CHEQUE", "OTHER"]),

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
        .number()
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
        .number()
        .positive("Settlement amount must be greater than 0"),

    remark: z
        .string()
        .trim()
        .min(1, "Foreclosure remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});
