import { z } from "zod";

export const employeeAdvanceInitialValues = {
    requestedAmount: "",
    requestedInstallments: "",
    reason: "",
};

export const employeeAdvanceForeclosureInitialValues = {
    amount: "",
    remark: "",
};

export const employeeAdvanceApprovalInitialValues = {
    approvedAmount: "",
    approvedInstallments: "",
    remark: "",
};

export const employeeAdvanceActionInitialValues = {
    remark: "",
};

export const employeeAdvanceDisbursementInitialValues = {
    disbursedAmount: "",
    paymentMode: "",
    paymentReference: "",
    remark: "",
};

export const employeeAdvanceRecoveryInitialValues = {
    recoveredAmount: "",
    payrollSlug: "",
    remark: "",
};

export const forecloseEmployeeAdvanceSchema = z.object({
    amount: z.coerce
        .number({
            invalid_type_error: "Settlement amount is required",
        })
        .positive("Settlement amount must be greater than 0"),

    remark: z
        .string()
        .trim()
        .min(1, "Settlement remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
});

export const createEmployeeAdvanceSchema = z.object({
    requestedAmount: z.coerce
        .number({
            invalid_type_error: "Requested amount is required",
        })
        .positive("Requested amount must be greater than 0"),

    requestedInstallments: z.coerce
        .number({
            invalid_type_error: "Installments are required",
        })
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
        .number({
            invalid_type_error: "Approved amount is required",
        })
        .positive("Approved amount must be greater than 0"),

    approvedInstallments: z.coerce
        .number({
            invalid_type_error: "Approved installments are required",
        })
        .int("Approved installments must be a whole number")
        .min(1, "At least 1 installment is required"),

    remark: z
        .string()
        .trim()
        .min(1, "Approval remark is required")
        .max(500, "Remark cannot exceed 500 characters"),
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

export const recoverAdvanceInstallmentSchema = z.object({
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

export const buildEmployeeAdvancePayload = (form) => ({
    requestedAmount:
        form?.requestedAmount === "" ||
            form?.requestedAmount === null ||
            form?.requestedAmount === undefined
            ? ""
            : Number(form.requestedAmount),

    requestedInstallments:
        form?.requestedInstallments === "" ||
            form?.requestedInstallments === null ||
            form?.requestedInstallments === undefined
            ? ""
            : Number(form.requestedInstallments),

    reason: form?.reason?.trim() || "",
});

export const buildApproveEmployeeAdvancePayload = (form) => ({
    approvedAmount:
        form?.approvedAmount === "" ||
            form?.approvedAmount === null ||
            form?.approvedAmount === undefined
            ? ""
            : Number(form.approvedAmount),

    approvedInstallments:
        form?.approvedInstallments === "" ||
            form?.approvedInstallments === null ||
            form?.approvedInstallments === undefined
            ? ""
            : Number(form.approvedInstallments),

    remark: form?.remark?.trim() || "",
});

export const buildRejectEmployeeAdvancePayload = (remark) => ({
    remark: typeof remark === "string" ? remark.trim() : "",
});

export const buildCancelEmployeeAdvancePayload = (remark) => ({
    remark: typeof remark === "string" ? remark.trim() : "",
});

export const buildDisburseEmployeeAdvancePayload = (form) => ({
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

export const buildRecoverAdvanceInstallmentPayload = (form) => ({
    recoveredAmount:
        form?.recoveredAmount === "" ||
            form?.recoveredAmount === null ||
            form?.recoveredAmount === undefined
            ? ""
            : Number(form.recoveredAmount),

    payrollSlug: form?.payrollSlug?.trim() || null,

    remark: form?.remark?.trim() || null,
});

export const validateEmployeeAdvanceRequest = (form) => {
    const payload = buildEmployeeAdvancePayload(form);

    return createEmployeeAdvanceSchema.safeParse(payload);
};

export const validateEmployeeAdvanceApproval = (form) => {
    const payload = buildApproveEmployeeAdvancePayload(form);

    return approveEmployeeAdvanceSchema.safeParse(payload);
};

export const validateEmployeeAdvanceRejection = (remark) => {
    const payload = buildRejectEmployeeAdvancePayload(remark);

    return rejectEmployeeAdvanceSchema.safeParse(payload);
};

export const validateEmployeeAdvanceCancellation = (remark) => {
    const payload = buildCancelEmployeeAdvancePayload(remark);

    return cancelEmployeeAdvanceSchema.safeParse(payload);
};

export const validateEmployeeAdvanceDisbursement = (form) => {
    const payload = buildDisburseEmployeeAdvancePayload(form);

    return disburseEmployeeAdvanceSchema.safeParse(payload);
};

export const validateAdvanceInstallmentRecovery = (form) => {
    const payload = buildRecoverAdvanceInstallmentPayload(form);

    return recoverAdvanceInstallmentSchema.safeParse(payload);
};

export const buildApprovalFormFromAdvance = (advance) => ({
    approvedAmount:
        advance?.requestedAmount !== null && advance?.requestedAmount !== undefined
            ? String(advance.requestedAmount)
            : "",

    approvedInstallments:
        advance?.requestedInstallments !== null &&
            advance?.requestedInstallments !== undefined
            ? String(advance.requestedInstallments)
            : "",

    remark: "",
});

export const buildForecloseEmployeeAdvancePayload = (
    form,
) => ({
    amount:
        form?.amount === "" ||
            form?.amount === null ||
            form?.amount === undefined
            ? ""
            : Number(
                form.amount,
            ),

    remark:
        form?.remark?.trim() ||
        "",
});

export const buildDisbursementFormFromAdvance = (advance) => ({
    disbursedAmount:
        advance?.approvedAmount !== null && advance?.approvedAmount !== undefined
            ? String(advance.approvedAmount)
            : "",

    paymentMode: "",
    paymentReference: "",
    remark: "",
});

export const buildRecoveryFormFromInstallment = (installment) => {
    const dueAmount = Number(installment?.dueAmount || 0);

    const recoveredAmount = Number(installment?.recoveredAmount || 0);

    const remainingAmount = Math.max(0, dueAmount - recoveredAmount);

    return {
        recoveredAmount: remainingAmount ? String(remainingAmount) : "",

        payrollSlug: "",
        remark: "",
    };
};

export const validateEmployeeAdvanceForeclosure = (
    form,
) => {
    const payload =
        buildForecloseEmployeeAdvancePayload(
            form,
        );

    return forecloseEmployeeAdvanceSchema.safeParse(
        payload,
    );
};

export const buildForeclosureFormFromAdvance = (
    advance,
) => ({
    amount:
        advance?.outstandingAmount !==
            null &&
            advance?.outstandingAmount !==
            undefined
            ? String(
                advance.outstandingAmount,
            )
            : "",

    remark: "",
});
