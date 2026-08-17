import { z } from "zod";

const optionalMoneySchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  },

  z.coerce.number().nonnegative("Amount cannot be negative").nullable(),
);

export const saveLoanSettingSchema = z
  .object({
    eligibilityAfterMonths: z.coerce
      .number()
      .int("Eligibility months must be a whole number")
      .nonnegative("Eligibility months cannot be negative")
      .max(600, "Eligibility months is too large"),

    salaryBasis: z.enum(["BASIC", "GROSS"]),

    maximumSalaryMultiple: z.coerce
      .number()
      .positive("Maximum salary multiple must be greater than 0")
      .max(100, "Maximum salary multiple cannot exceed 100"),

    minimumLoanAmount: optionalMoneySchema,

    maximumLoanAmount: optionalMoneySchema,

    allowMultipleLoan: z.boolean(),

    approvalRequired: z.boolean(),

    forecloseInterest: z.coerce
      .number()
      .nonnegative("Foreclose interest cannot be negative")
      .max(100, "Foreclose interest cannot exceed 100%"),
  })
  .superRefine((data, ctx) => {
    if (
      data.minimumLoanAmount !== null &&
      data.maximumLoanAmount !== null &&
      data.minimumLoanAmount > data.maximumLoanAmount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["minimumLoanAmount"],

        message:
          "Minimum loan amount cannot be greater than maximum loan amount",
      });
    }
  });
