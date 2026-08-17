import { z } from "zod";

export const advancePolicyInitialValues = {
    policyName: "",
    department: "ALL",
    eligibilityAfterMonths: "6",
    calculationBasis: "BASIC",
    maximumSalaryMonths: "2",
    maximumAmount: "",
    minimumAmount: "",
    maximumInstallments: "6",
    interestType: "NONE",
    interestRate: "0",
    flatInterestAmount: "",
    allowMultipleAdvance: false,
    approvalRequired: true,
};

const optionalPositiveNumber = z
    .union([
        z.coerce.number().positive("Value must be greater than 0"),
        z.literal(""),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        return Number(value);
    });

const advancePolicyBaseSchema = z.object({
    policyName: z
        .string()
        .trim()
        .min(1, "Policy name is required")
        .max(150, "Policy name cannot exceed 150 characters"),

    department: z.string().trim().optional().nullable(),

    eligibilityAfterMonths: z.coerce
        .number()
        .int("Eligibility months must be a whole number")
        .min(0, "Eligibility months cannot be negative"),

    calculationBasis: z.enum(["BASIC", "GROSS", "FIXED"]),

    maximumSalaryMonths: z
        .union([
            z.coerce
                .number()
                .positive("Maximum salary months must be greater than 0"),
            z.literal(""),
            z.null(),
            z.undefined(),
        ])
        .transform((value) => {
            if (value === "" || value === null || value === undefined) {
                return null;
            }

            return Number(value);
        }),

    maximumAmount: optionalPositiveNumber,

    minimumAmount: optionalPositiveNumber,

    maximumInstallments: z.coerce
        .number()
        .int("Maximum installments must be a whole number")
        .min(1, "Maximum installments must be at least 1")
        .max(120, "Maximum installments cannot exceed 120"),

    interestType: z.enum(["NONE", "FLAT", "PERCENTAGE"]),

    interestRate: z
        .union([
            z.coerce
                .number()
                .min(0, "Interest rate cannot be negative")
                .max(100, "Interest rate cannot exceed 100%"),
            z.literal(""),
            z.null(),
            z.undefined(),
        ])
        .transform((value) => {
            if (value === "" || value === null || value === undefined) {
                return 0;
            }

            return Number(value);
        }),

    flatInterestAmount: optionalPositiveNumber,

    allowMultipleAdvance: z.boolean(),

    approvalRequired: z.boolean(),
});

const validateAdvancePolicyRules = (data, context) => {
    if (
        ["BASIC", "GROSS"].includes(data.calculationBasis) &&
        !data.maximumSalaryMonths
    ) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["maximumSalaryMonths"],

            message: "Maximum salary months is required",
        });
    }

    if (data.calculationBasis === "FIXED" && !data.maximumAmount) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["maximumAmount"],

            message: "Maximum amount is required for fixed calculation",
        });
    }

    if (
        data.minimumAmount &&
        data.maximumAmount &&
        data.minimumAmount > data.maximumAmount
    ) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["minimumAmount"],

            message: "Minimum amount cannot be greater than maximum amount",
        });
    }

    if (data.interestType === "NONE") {
        if (Number(data.interestRate) !== 0) {
            context.addIssue({
                code: z.ZodIssueCode.custom,

                path: ["interestRate"],

                message: "Interest rate must be 0",
            });
        }

        if (data.flatInterestAmount) {
            context.addIssue({
                code: z.ZodIssueCode.custom,

                path: ["flatInterestAmount"],

                message: "Flat interest amount is not allowed",
            });
        }
    }

    if (data.interestType === "FLAT") {
        if (!data.flatInterestAmount) {
            context.addIssue({
                code: z.ZodIssueCode.custom,

                path: ["flatInterestAmount"],

                message: "Flat interest amount is required",
            });
        }

        if (Number(data.interestRate) !== 0) {
            context.addIssue({
                code: z.ZodIssueCode.custom,

                path: ["interestRate"],

                message: "Interest rate must be 0 for flat interest",
            });
        }
    }

    if (data.interestType === "PERCENTAGE" && Number(data.interestRate) <= 0) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["interestRate"],

            message: "Interest rate is required for percentage interest",
        });
    }

    if (data.interestType === "PERCENTAGE" && data.flatInterestAmount) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["flatInterestAmount"],

            message: "Flat interest amount is not allowed",
        });
    }
};

export const createAdvancePolicySchema = advancePolicyBaseSchema.superRefine(
    validateAdvancePolicyRules,
);

export const updateAdvancePolicySchema = advancePolicyBaseSchema.superRefine(
    validateAdvancePolicyRules,
);

export const buildAdvancePolicyPayload = (form) => {
    const calculationBasis = form?.calculationBasis || "BASIC";

    const interestType = form?.interestType || "NONE";

    return {
        policyName: form?.policyName?.trim() || "",

        department: form?.department || "ALL",

        eligibilityAfterMonths:
            form?.eligibilityAfterMonths === "" ||
                form?.eligibilityAfterMonths === null ||
                form?.eligibilityAfterMonths === undefined
                ? 0
                : Number(form.eligibilityAfterMonths),

        calculationBasis,

        maximumSalaryMonths:
            calculationBasis === "FIXED"
                ? null
                : form?.maximumSalaryMonths === "" ||
                    form?.maximumSalaryMonths === null ||
                    form?.maximumSalaryMonths === undefined
                    ? null
                    : Number(form.maximumSalaryMonths),

        maximumAmount:
            form?.maximumAmount === "" ||
                form?.maximumAmount === null ||
                form?.maximumAmount === undefined
                ? null
                : Number(form.maximumAmount),

        minimumAmount:
            form?.minimumAmount === "" ||
                form?.minimumAmount === null ||
                form?.minimumAmount === undefined
                ? null
                : Number(form.minimumAmount),

        maximumInstallments:
            form?.maximumInstallments === "" ||
                form?.maximumInstallments === null ||
                form?.maximumInstallments === undefined
                ? 1
                : Number(form.maximumInstallments),

        interestType,

        interestRate:
            interestType === "PERCENTAGE" ? Number(form?.interestRate || 0) : 0,

        flatInterestAmount:
            interestType === "FLAT"
                ? form?.flatInterestAmount === "" ||
                    form?.flatInterestAmount === null ||
                    form?.flatInterestAmount === undefined
                    ? null
                    : Number(form.flatInterestAmount)
                : null,

        allowMultipleAdvance: Boolean(form?.allowMultipleAdvance),

        approvalRequired: form?.approvalRequired !== false,
    };
};

export const buildAdvancePolicyFormData = (data) => ({
    policyName: data?.policyName || "",

    department:
        data?.departmentSlug ||
        "ALL",

    eligibilityAfterMonths: String(data?.eligibilityAfterMonths ?? 6),

    calculationBasis: data?.calculationBasis || "BASIC",

    maximumSalaryMonths:
        data?.maximumSalaryMonths !== null &&
            data?.maximumSalaryMonths !== undefined
            ? String(data.maximumSalaryMonths)
            : "",

    maximumAmount:
        data?.maximumAmount !== null && data?.maximumAmount !== undefined
            ? String(data.maximumAmount)
            : "",

    minimumAmount:
        data?.minimumAmount !== null && data?.minimumAmount !== undefined
            ? String(data.minimumAmount)
            : "",

    maximumInstallments: String(data?.maximumInstallments ?? 6),

    interestType: data?.interestType || "NONE",

    interestRate: String(data?.interestRate ?? 0),

    flatInterestAmount:
        data?.flatInterestAmount !== null && data?.flatInterestAmount !== undefined
            ? String(data.flatInterestAmount)
            : "",

    allowMultipleAdvance: Boolean(data?.allowMultipleAdvance),

    approvalRequired: data?.approvalRequired !== false,
});
