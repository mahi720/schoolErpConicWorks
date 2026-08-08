import { z } from "zod";

export const employeePayBandPreviewSchema =
    z.object({
        payBand: z
            .string()
            .trim()
            .min(
                1,
                "Pay band is required",
            ),
    });

export const employeeSalaryIncrementSchema =
    z.object({
        type: z.enum([
            "PERCENT",
            "FIXED",
        ]),

        value: z.coerce
            .number()
            .positive(
                "Increment value must be greater than 0",
            ),
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
            .min(0),

        earnings:
            z.array(
                z.object({
                    componentType:
                        z.literal(
                            "EARNING",
                        ),

                    componentName:
                        z.string(),

                    calculationType:
                        z.enum([
                            "FIXED",
                            "PERCENT",
                        ]),

                    value:
                        z.coerce.number(),

                    calculationBase:
                        z.enum([
                            "BASIC_PAY",
                            "GROSS_EARNINGS",
                        ]),
                }),
            ),

        deductions:
            z.array(
                z.object({
                    componentType:
                        z.literal(
                            "DEDUCTION",
                        ),

                    componentName:
                        z.string(),

                    calculationType:
                        z.enum([
                            "FIXED",
                            "PERCENT",
                        ]),

                    value:
                        z.coerce.number(),

                    calculationBase:
                        z.enum([
                            "BASIC_PAY",
                            "GROSS_EARNINGS",
                        ]),
                }),
            ),
    });