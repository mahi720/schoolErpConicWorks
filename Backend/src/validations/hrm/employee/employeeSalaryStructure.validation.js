import { z } from "zod";

export const previewEmployeePayBandSchema = z.object({
    payBand: z
        .string()
        .trim()
        .min(1, "Pay band is required"),
});

const salaryItemSchema = z.object({
    componentType: z.enum([
        "EARNING",
        "DEDUCTION",
    ]),

    componentName: z
        .string()
        .trim()
        .min(
            1,
            "Component name is required",
        ),

    earningTypeSlug: z
        .string()
        .nullable()
        .optional(),

    deductionTypeSlug: z
        .string()
        .nullable()
        .optional(),

    calculationType: z.enum([
        "FIXED",
        "PERCENT",
    ]),

    value: z.coerce
        .number()
        .min(
            0,
            "Value cannot be negative",
        ),

    calculationBase: z.enum([
        "BASIC_PAY",
        "GROSS_EARNINGS",
    ]),

    amount: z.coerce
        .number()
        .min(0)
        .optional(),

    displayOrder: z.coerce
        .number()
        .int()
        .min(0),

    isBasicPay: z
        .boolean()
        .optional()
        .default(false),
});

export const saveEmployeeSalaryStructureSchema =
    z.object({
        payBand: z
            .string()
            .trim()
            .min(
                1,
                "Pay band is required",
            ),

        basicSalary: z.coerce
            .number()
            .min(
                0,
                "Basic salary cannot be negative",
            ),

        earnings: z
            .array(
                salaryItemSchema,
            )
            .min(
                1,
                "At least one earning component is required",
            ),

        deductions: z
            .array(
                salaryItemSchema,
            )
            .default([]),

        increment: z
            .object({
                type: z.enum([
                    "FIXED",
                    "PERCENT",
                ]),

                value: z.coerce
                    .number()
                    .positive(),

                previousBasicSalary:
                    z.coerce
                        .number()
                        .min(0),

                incrementAmount:
                    z.coerce
                        .number()
                        .positive(),

                newBasicSalary:
                    z.coerce
                        .number()
                        .positive(),
            })
            .nullable()
            .optional(),
    });

export const updateSalaryGenerationStatusSchema =
    z.object({
        stopped: z.boolean(),
    });