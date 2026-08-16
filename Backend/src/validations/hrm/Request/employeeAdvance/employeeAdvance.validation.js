import { z } from "zod";

export const createEmployeeAdvanceSchema = z.object({
    requestedAmount: z.coerce
        .number()
        .positive("Requested amount must be greater than 0"),

    requestedInstallments: z.coerce
        .number()
        .int("Installments must be a whole number")
        .min(1, "At least 1 installment is required"),

    reason: z
        .string()
        .trim()
        .min(3, "Reason must be at least 3 characters")
        .max(500, "Reason cannot exceed 500 characters"),
});

export const approveEmployeeAdvanceSchema = z.object({
    approvedAmount: z.coerce
        .number()
        .positive("Approved amount must be greater than 0"),

    approvedInstallments: z.coerce
        .number()
        .int("Approved installments must be a whole number")
        .min(1, "At least 1 installment is required"),

    remark: z
        .string()
        .trim()
        .min(1, "Approval remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const forecloseEmployeeAdvanceSchema =
    z.object({
        amount: z.coerce
            .number()
            .positive(
                "Settlement amount must be greater than 0",
            ),

        remark: z
            .string()
            .trim()
            .min(
                1,
                "Settlement remark is required",
            )
            .max(
                500,
                "Remark cannot exceed 500 characters",
            ),
    });

export const rejectEmployeeAdvanceSchema = z.object({
    remark: z
        .string()
        .trim()
        .min(1, "Rejection remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const cancelEmployeeAdvanceSchema = z.object({
    remark: z
        .string()
        .trim()
        .min(1, "Cancellation remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const disburseEmployeeAdvanceSchema = z.object({
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

export const recoverAdvanceInstallmentSchema = z.object({
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
