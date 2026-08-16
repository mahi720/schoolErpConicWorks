import { z } from "zod";

const calculationBasisEnum = z.enum(["BASIC", "GROSS", "FIXED"]);

const interestTypeEnum = z.enum(["NONE", "FLAT", "PERCENTAGE"]);

const optionalAmountSchema = z
    .union([z.coerce.number().positive(), z.literal(""), z.null(), z.undefined()])
    .transform((value) => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        return Number(value);
    });

const baseAdvancePolicySchema = z.object({
    policyName: z
        .string()
        .trim()
        .min(1, "Policy name is required")
        .max(150, "Policy name cannot exceed 150 characters"),

    department: z
        .string()
        .trim()
        .optional()
        .nullable()
        .transform((value) => {
            if (!value || value.toUpperCase() === "ALL") {
                return null;
            }

            return value;
        }),

    eligibilityAfterMonths: z.coerce
        .number()
        .int("Eligibility months must be a whole number")
        .min(0, "Eligibility months cannot be negative")
        .max(600, "Eligibility months is too large"),

    calculationBasis: calculationBasisEnum,

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

    maximumAmount: optionalAmountSchema,

    minimumAmount: optionalAmountSchema,

    maximumInstallments: z.coerce
        .number()
        .int("Maximum installments must be a whole number")
        .min(1, "Maximum installments must be at least 1")
        .max(120, "Maximum installments cannot exceed 120"),

    interestType: interestTypeEnum,

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

    flatInterestAmount: optionalAmountSchema,

    allowMultipleAdvance: z.boolean().default(false),

    approvalRequired: z.boolean().default(true),
});

const validateAdvancePolicyRules = (data, context) => {
    if (
        ["BASIC", "GROSS"].includes(data.calculationBasis) &&
        !data.maximumSalaryMonths
    ) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["maximumSalaryMonths"],

            message:
                "Maximum salary months is required for Basic or Gross calculation",
        });
    }

    if (data.calculationBasis === "FIXED" && !data.maximumAmount) {
        context.addIssue({
            code: z.ZodIssueCode.custom,

            path: ["maximumAmount"],

            message: "Maximum amount is required for Fixed calculation",
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

                message: "Interest rate must be 0 when interest type is None",
            });
        }

        if (data.flatInterestAmount) {
            context.addIssue({
                code: z.ZodIssueCode.custom,

                path: ["flatInterestAmount"],

                message:
                    "Flat interest amount is not allowed when interest type is None",
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

            message: "Flat interest amount is not allowed for percentage interest",
        });
    }
};

export const createAdvancePolicySchema = baseAdvancePolicySchema.superRefine(
    validateAdvancePolicyRules,
);

export const updateAdvancePolicySchema = baseAdvancePolicySchema
    .partial()
    .superRefine(validateAdvancePolicyRules);
